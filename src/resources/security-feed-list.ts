export interface FeedInfo {
  name: string;
  url: string;
  feedUrl: string;
  category: 'official' | 'vendor' | 'community' | 'international';
}

export const SECURITY_FEED_LIST: FeedInfo[] = [
  // 公的機関
  {
    name: 'IPA 重要なセキュリティ情報',
    url: 'https://www.ipa.go.jp/security/',
    feedUrl: 'https://www.ipa.go.jp/security/alert-rss.rdf',
    category: 'official',
  },
  {
    name: 'JPCERT/CC',
    url: 'https://www.jpcert.or.jp/',
    feedUrl: 'https://www.jpcert.or.jp/rss/jpcert.rdf',
    category: 'official',
  },

  // コミュニティ
  {
    name: 'Qiita - セキュリティ',
    url: 'https://qiita.com/tags/security',
    feedUrl: 'https://qiita.com/tags/security/feed',
    category: 'community',
  },
  {
    name: 'Zenn - セキュリティ',
    url: 'https://zenn.dev/topics/security',
    feedUrl: 'https://zenn.dev/topics/security/feed',
    category: 'community',
  },
  {
    name: 'はてブ - セキュリティ',
    url: 'https://b.hatena.ne.jp/',
    feedUrl: 'https://b.hatena.ne.jp/search/text?q=%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3&mode=rss',
    category: 'community',
  },

  // ベンダー
  {
    name: 'トレンドマイクロ ウイルス解析ブログ',
    url: 'https://www.trendmicro.com/ja_jp/research.html',
    feedUrl: 'http://feeds.feedburner.com/tm-security-blog',
    category: 'vendor',
  },
  {
    name: 'トレンドマイクロ セキュリティホール情報',
    url: 'https://www.trendmicro.com/ja_jp/download/rss.html',
    feedUrl: 'http://feeds.trendmicro.com/jp/SecurityAdvisories',
    category: 'vendor',
  },

  // 海外
  {
    name: 'The Hacker News',
    url: 'https://thehackernews.com/',
    feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'international',
  },
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/',
    feedUrl: 'https://krebsonsecurity.com/feed/',
    category: 'international',
  },
];

export const CATEGORY_LABELS: Record<FeedInfo['category'], string> = {
  official: '公的機関',
  vendor: 'ベンダー',
  community: 'コミュニティ',
  international: '海外情報',
};
