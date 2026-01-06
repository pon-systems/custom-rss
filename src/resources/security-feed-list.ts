export interface FeedInfo {
  name: string;
  url: string;
  feedUrl: string;
  category: 'official' | 'vendor' | 'community' | 'international' | 'media';
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
  {
    name: 'Help Net Security',
    url: 'https://www.helpnetsecurity.com/',
    feedUrl: 'https://www.helpnetsecurity.com/feed/',
    category: 'international',
  },
  {
    name: 'BleepingComputer',
    url: 'https://www.bleepingcomputer.com/',
    feedUrl: 'https://www.bleepingcomputer.com/feed/',
    category: 'international',
  },
  {
    name: 'Infosecurity Magazine',
    url: 'https://www.infosecurity-magazine.com/',
    feedUrl: 'https://www.infosecurity-magazine.com/rss/news/',
    category: 'international',
  },
  {
    name: 'Security Boulevard',
    url: 'https://securityboulevard.com/',
    feedUrl: 'https://securityboulevard.com/feed/',
    category: 'international',
  },
  {
    name: 'The Record',
    url: 'https://therecord.media/',
    feedUrl: 'https://therecord.media/feed/',
    category: 'international',
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/',
    feedUrl: 'https://www.darkreading.com/rss.xml',
    category: 'international',
  },
  {
    name: 'The Register - Security',
    url: 'https://www.theregister.com/security/',
    feedUrl: 'https://www.theregister.com/security/headlines.atom',
    category: 'international',
  },
  {
    name: 'Security Affairs',
    url: 'https://securityaffairs.com/',
    feedUrl: 'https://securityaffairs.com/feed',
    category: 'international',
  },

  // 国内メディア
  {
    name: 'ITmedia NEWS - セキュリティ',
    url: 'https://www.itmedia.co.jp/news/subtop/security/',
    feedUrl: 'https://rss.itmedia.co.jp/rss/2.0/news_security.xml',
    category: 'media',
  },
  {
    name: 'ScanNetSecurity',
    url: 'https://scan.netsecurity.ne.jp/',
    feedUrl: 'https://scan.netsecurity.ne.jp/rss/index.rdf',
    category: 'media',
  },
  {
    name: 'Security NEXT',
    url: 'https://www.security-next.com/',
    feedUrl: 'https://www.security-next.com/feed',
    category: 'media',
  },
  {
    name: 'GIGAZINE',
    url: 'https://gigazine.net/',
    feedUrl: 'https://gigazine.net/news/rss_2.0/',
    category: 'media',
  },
];

export const CATEGORY_LABELS: Record<FeedInfo['category'], string> = {
  official: '公的機関',
  vendor: 'ベンダー',
  community: 'コミュニティ',
  international: '海外情報',
  media: '国内メディア',
};
