import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import pLimit from 'p-limit';
import type { Article } from './feed-fetcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const CACHE_FILE = path.join(PROJECT_ROOT, '.cache/translation-cache.json');

export interface TranslatorConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxConcurrent: number;
}

interface CacheEntry {
  title: string;
  content: string;
  translatedAt: string;
}

type TranslationCache = Record<string, CacheEntry>;

/**
 * キャッシュを読み込む
 */
export function loadCache(): TranslationCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load cache:', error instanceof Error ? error.message : error);
  }
  return {};
}

/**
 * キャッシュを保存する
 */
export function saveCache(cache: TranslationCache): void {
  try {
    const cacheDir = path.dirname(CACHE_FILE);
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Failed to save cache:', error instanceof Error ? error.message : error);
  }
}

/**
 * 英語判定: 日本語文字が少なく、ASCII文字が多い場合に英語と判定
 */
export function isEnglishContent(text: string): boolean {
  if (!text || text.length === 0) return false;

  // 日本語文字（ひらがな、カタカナ、漢字）
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g;
  const japaneseMatches = text.match(japaneseRegex);
  const japaneseCount = japaneseMatches ? japaneseMatches.length : 0;

  // 日本語文字が10%以上なら日本語
  if (japaneseCount > text.length * 0.1) return false;

  // ASCII英字
  const asciiAlphaRegex = /[a-zA-Z]/g;
  const asciiMatches = text.match(asciiAlphaRegex);
  const asciiCount = asciiMatches ? asciiMatches.length : 0;

  // 日本語がなく、ASCII文字が50%以上なら英語
  return japaneseCount === 0 && asciiCount > text.length * 0.5;
}

/**
 * 記事を翻訳する（キャッシュ対応）
 */
export async function translateArticles(
  articles: Article[],
  config: TranslatorConfig
): Promise<Article[]> {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
  });

  const cache = loadCache();
  const limit = pLimit(config.maxConcurrent);
  let translatedCount = 0;
  let cacheHitCount = 0;

  const translationPromises = articles.map((article) =>
    limit(async () => {
      const textToCheck = article.title + ' ' + article.content;
      if (!isEnglishContent(textToCheck)) {
        return article; // 日本語記事はそのまま
      }

      // キャッシュをチェック
      const cacheKey = article.link;
      if (cache[cacheKey]) {
        cacheHitCount++;
        return {
          ...article,
          title: cache[cacheKey].title,
          content: cache[cacheKey].content,
        };
      }

      try {
        const response = await client.chat.completions.create({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: `セキュリティ・IT専門の翻訳者として、以下の英語テキストを自然な日本語に翻訳してください。
技術用語（CVE番号、製品名等）は適切に保持してください。
JSON形式で返答: {"title": "翻訳されたタイトル", "content": "翻訳された概要"}`,
            },
            {
              role: 'user',
              content: JSON.stringify({
                title: article.title,
                content: article.content,
              }),
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        });

        let resultText = response.choices[0]?.message?.content || '';
        // Markdownコードブロックを除去
        resultText = resultText.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
        // JSONオブジェクトの部分のみを抽出
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON object found in response');
        }
        const parsed = JSON.parse(jsonMatch[0]);
        translatedCount++;

        // キャッシュに保存
        cache[cacheKey] = {
          title: parsed.title || article.title,
          content: parsed.content || article.content,
          translatedAt: new Date().toISOString(),
        };

        return {
          ...article,
          title: parsed.title || article.title,
          content: parsed.content || article.content,
        };
      } catch (error) {
        console.error(`Translation failed for: ${article.title}`, error instanceof Error ? error.message : error);
        return article; // エラー時は原文のまま
      }
    })
  );

  const result = await Promise.all(translationPromises);

  // キャッシュを保存
  saveCache(cache);

  console.log(`  -> ${translatedCount} articles translated (${cacheHitCount} from cache)`);
  return result;
}
