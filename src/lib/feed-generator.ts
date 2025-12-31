import { Feed } from 'feed';
import type { Article } from './feed-fetcher.js';
import type { FeedInfo } from '../resources/security-feed-list.js';

const SITE_URL = 'https://your-username.github.io/security-rss-feed';
const SITE_TITLE = 'セキュリティ情報フィード';
const SITE_DESCRIPTION = 'セキュリティ関連記事を収集したRSSフィード';

export interface GeneratedFeed {
  rss: string;
  atom: string;
  json: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function generateFeed(
  articles: Article[],
  feedId: string,
  title: string,
  description: string
): GeneratedFeed {
  const feed = new Feed({
    title: title,
    description: description,
    id: `${SITE_URL}/feeds/${feedId}`,
    link: SITE_URL,
    language: 'ja',
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: '',
    updated: articles.length > 0 ? articles[0].pubDate : new Date(),
    generator: 'SecurityRSSFeed',
    feedLinks: {
      rss: `${SITE_URL}/feeds/${feedId}.xml`,
      atom: `${SITE_URL}/feeds/${feedId}.atom`,
      json: `${SITE_URL}/feeds/${feedId}.json`,
    },
  });

  for (const article of articles) {
    const titleWithSource = `[${article.source}] ${article.title}`;
    feed.addItem({
      title: escapeXml(titleWithSource),
      id: article.link,
      link: article.link,
      description: escapeXml(truncateText(article.content, 500)),
      date: article.pubDate,
      author: [{ name: article.source }],
    });
  }

  return {
    rss: feed.rss2(),
    atom: feed.atom1(),
    json: feed.json1(),
  };
}

export function generateAllFeed(articles: Article[]): GeneratedFeed {
  return generateFeed(
    articles.slice(0, 100),
    'all',
    `${SITE_TITLE} - 全体`,
    `${SITE_DESCRIPTION}（全カテゴリ）`
  );
}

export function generateCategoryFeed(
  articles: Article[],
  category: FeedInfo['category'],
  categoryLabel: string
): GeneratedFeed {
  const categoryArticles = articles
    .filter((article) => article.category === category)
    .slice(0, 50);

  return generateFeed(
    categoryArticles,
    category,
    `${SITE_TITLE} - ${categoryLabel}`,
    `${SITE_DESCRIPTION}（${categoryLabel}）`
  );
}
