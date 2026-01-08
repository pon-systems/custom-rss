import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchAllFeeds } from '../lib/feed-fetcher.js';
import { generateAllFeed, generateCategoryFeed } from '../lib/feed-generator.js';
import { translateArticles } from '../lib/translator.js';
import { SECURITY_FEED_LIST, CATEGORY_LABELS, type FeedInfo } from '../resources/security-feed-list.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/site/security/feeds');
const DATA_DIR = path.join(PROJECT_ROOT, 'src/site/_data');
const PAGINATION_DATA_DIR = path.join(PROJECT_ROOT, 'src/site/security/data');

async function main() {
  console.log('=== Security RSS Feed Generator ===\n');

  // フィードを取得
  console.log('Fetching feeds...\n');
  const articles = await fetchAllFeeds(SECURITY_FEED_LIST);
  console.log(`\nTotal articles: ${articles.length}\n`);

  // 英語記事を翻訳
  const translatorConfig = {
    apiKey: process.env.LLM_GATEWAY_API_KEY || '',
    baseUrl: process.env.LLM_GATEWAY_BASE_URL || '',
    model: process.env.LLM_GATEWAY_MODEL || 'claude-haiku-4-5',
    maxConcurrent: 5,
  };

  let translatedArticles = articles;
  if (translatorConfig.apiKey && translatorConfig.baseUrl) {
    console.log('Translating English articles...');
    translatedArticles = await translateArticles(articles, translatorConfig);
    console.log('Translation completed.\n');
  } else {
    console.log('LLM_GATEWAY_API_KEY or LLM_GATEWAY_BASE_URL not set, skipping translation.\n');
  }

  // 出力ディレクトリを作成
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // 全体フィードを生成
  console.log('Generating all feed...');
  const allFeed = generateAllFeed(translatedArticles);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'all.xml'), allFeed.rss);
  console.log('  -> all.xml created');

  // カテゴリ別フィードを生成
  const categories: FeedInfo['category'][] = ['official', 'vendor', 'community', 'international', 'media'];
  for (const category of categories) {
    console.log(`Generating ${category} feed...`);
    const categoryFeed = generateCategoryFeed(translatedArticles, category, CATEGORY_LABELS[category]);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${category}.xml`), categoryFeed.rss);
    console.log(`  -> ${category}.xml created`);
  }

  // Eleventy用のデータファイルを生成
  console.log('\nGenerating data files for Eleventy...');

  // カテゴリ別に記事をグループ化
  const articlesByCategory: Record<string, typeof translatedArticles> = {};
  for (const category of categories) {
    articlesByCategory[category] = translatedArticles
      .filter((a) => a.category === category)
      .slice(0, 10);
  }

  const siteData = {
    generatedAt: new Date().toISOString(),
    totalArticles: translatedArticles.length,
    categories: categories.map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat],
      articleCount: translatedArticles.filter((a) => a.category === cat).length,
    })),
    latestArticles: translatedArticles.slice(0, 20).map((a) => ({
      ...a,
      pubDate: a.pubDate.toISOString(),
      categoryLabel: CATEGORY_LABELS[a.category],
    })),
    articlesByCategory: Object.fromEntries(
      Object.entries(articlesByCategory).map(([cat, arts]) => [
        cat,
        arts.map((a) => ({
          ...a,
          pubDate: a.pubDate.toISOString(),
          categoryLabel: CATEGORY_LABELS[a.category as FeedInfo['category']],
        })),
      ])
    ),
    feeds: SECURITY_FEED_LIST.map((f) => ({
      ...f,
      categoryLabel: CATEGORY_LABELS[f.category],
    })),
  };

  fs.writeFileSync(path.join(DATA_DIR, 'feed.json'), JSON.stringify(siteData, null, 2));
  console.log('  -> feed.json created');

  // ページング用JSONファイルを生成
  console.log('\nGenerating pagination data files...');
  fs.mkdirSync(PAGINATION_DATA_DIR, { recursive: true });

  // 全記事JSON
  const allArticlesData = translatedArticles.map((a) => ({
    title: a.title,
    link: a.link,
    pubDate: a.pubDate.toISOString(),
    source: a.source,
    category: a.category,
    categoryLabel: CATEGORY_LABELS[a.category],
  }));
  fs.writeFileSync(
    path.join(PAGINATION_DATA_DIR, 'articles-all.json'),
    JSON.stringify(allArticlesData)
  );
  console.log('  -> articles-all.json created');

  // カテゴリ別JSON
  for (const category of categories) {
    const categoryArticles = allArticlesData.filter((a) => a.category === category);
    fs.writeFileSync(
      path.join(PAGINATION_DATA_DIR, `articles-${category}.json`),
      JSON.stringify(categoryArticles)
    );
    console.log(`  -> articles-${category}.json created`);
  }

  console.log('\n=== Feed generation completed! ===');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
