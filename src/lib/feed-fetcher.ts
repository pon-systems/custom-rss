import Parser from 'rss-parser';
import type { FeedInfo } from '../resources/security-feed-list.js';

export interface Article {
  title: string;
  link: string;
  pubDate: Date;
  content: string;
  source: string;
  category: FeedInfo['category'];
}

const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'SecurityRSSFeed/1.0',
  },
});

export async function fetchFeed(feedInfo: FeedInfo): Promise<Article[]> {
  try {
    console.log(`Fetching: ${feedInfo.name}`);
    const feed = await parser.parseURL(feedInfo.feedUrl);

    const articles: Article[] = feed.items
      .slice(0, 20)
      .map((item) => ({
        title: item.title || 'No Title',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        content: item.contentSnippet || item.content || '',
        source: feedInfo.name,
        category: feedInfo.category,
      }))
      .filter((article) => article.link);

    console.log(`  -> ${articles.length} articles fetched`);
    return articles;
  } catch (error) {
    console.error(`Failed to fetch ${feedInfo.name}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function fetchAllFeeds(feedList: FeedInfo[]): Promise<Article[]> {
  const results = await Promise.all(feedList.map((feed) => fetchFeed(feed)));
  const allArticles = results.flat();

  // 重複除去（リンクベース）
  const seen = new Set<string>();
  const uniqueArticles = allArticles.filter((article) => {
    if (seen.has(article.link)) {
      return false;
    }
    seen.add(article.link);
    return true;
  });

  // 日付順にソート（新しい順）
  uniqueArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return uniqueArticles;
}
