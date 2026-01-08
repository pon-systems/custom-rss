# カスタムRSSフィード

各種情報を自動収集してカスタムRSSフィードを生成するシステムです。

GitHub ActionsとGitHub Pagesを使用した完全無料のサーバーレス構成で運用できます。

## 公開URL

https://pon-systems.github.io/custom-rss/

## 利用可能なフィード

### セキュリティ情報フィード

セキュリティ関連記事を収集したRSSフィードです。

| フィード | URL |
|---------|-----|
| 全体フィード | `/custom-rss/security/feeds/all.xml` |
| 公的機関 | `/custom-rss/security/feeds/official.xml` |
| ベンダー | `/custom-rss/security/feeds/vendor.xml` |
| コミュニティ | `/custom-rss/security/feeds/community.xml` |
| 海外情報 | `/custom-rss/security/feeds/international.xml` |
| 国内メディア | `/custom-rss/security/feeds/media.xml` |

#### Webページ

記事一覧をブラウザで閲覧できます。ページング機能付きで全件表示可能です。

| ページ | URL |
|--------|-----|
| セキュリティトップ | `/custom-rss/security/` |
| 公的機関 | `/custom-rss/security/category/official/` |
| ベンダー | `/custom-rss/security/category/vendor/` |
| コミュニティ | `/custom-rss/security/category/community/` |
| 海外情報 | `/custom-rss/security/category/international/` |
| 国内メディア | `/custom-rss/security/category/media/` |

#### 情報源

**公的機関**
- IPA 重要なセキュリティ情報
- JPCERT/CC

**コミュニティ**
- Qiita - セキュリティ
- Zenn - セキュリティ
- はてなブックマーク - セキュリティ

**ベンダー**
- トレンドマイクロ ウイルス解析ブログ
- トレンドマイクロ セキュリティホール情報

**海外**
- The Hacker News
- Krebs on Security
- Help Net Security
- BleepingComputer
- Infosecurity Magazine
- Security Boulevard
- The Record
- Dark Reading
- The Register - Security
- Security Affairs

**国内メディア**
- ITmedia NEWS - セキュリティ
- ScanNetSecurity
- Security NEXT
- GIGAZINE

## セットアップ

### 前提条件
- Node.js 20以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/pon-systems/custom-rss.git
cd custom-rss

# 依存関係をインストール
npm install
```

### ローカル開発

```bash
# フィード生成 + 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:8080/custom-rss/ を開くとサイトを確認できます。

### ビルドのみ

```bash
# フィード生成 + サイトビルド
npm run build
```

生成されたサイトは `_site` ディレクトリに出力されます。

## GitHub Pagesへのデプロイ

1. GitHubにリポジトリを作成してpush
2. リポジトリの Settings > Pages で Source を「GitHub Actions」に設定
3. 自動的にワークフローが実行され、GitHub Pagesにデプロイされます

### 更新スケジュール

GitHub Actionsにより自動更新されます：
- 毎日 18:00 (JST) に自動実行

手動で更新する場合は、Actions タブから「Generate Feed and Deploy」を手動実行できます。

## プロジェクト構造

```
custom-rss/
├── .github/
│   └── workflows/
│       └── generate-feed.yml      # 定期実行ワークフロー
├── src/
│   ├── resources/
│   │   └── security-feed-list.ts  # セキュリティフィード情報一覧
│   ├── lib/
│   │   ├── feed-fetcher.ts        # RSS取得処理
│   │   ├── feed-generator.ts      # 統合RSS生成
│   │   └── translator.ts          # 英語記事翻訳処理
│   ├── scripts/
│   │   └── generate-feeds.ts      # メインスクリプト
│   └── site/
│       ├── index.njk              # トップページ
│       ├── assets/
│       │   └── js/
│       │       └── pagination.js  # ページング機能
│       ├── security/              # セキュリティフィード
│       │   ├── index.njk          # セキュリティトップ
│       │   ├── category/
│       │   │   └── category.njk   # カテゴリ別ページ
│       │   ├── data/              # ページング用JSONデータ
│       │   └── feeds/
│       │       └── index.njk      # フィード一覧
│       ├── _includes/
│       │   └── layout.njk         # 共通レイアウト
│       └── _data/
│           └── feed.json          # 生成されたデータ
├── package.json
├── tsconfig.json
├── eleventy.config.ts
└── README.md
```

## カスタマイズ

### フィード情報源の追加・変更

`src/resources/security-feed-list.ts` を編集してフィード情報源を追加・変更できます：

```typescript
export const SECURITY_FEED_LIST: FeedInfo[] = [
  {
    name: 'フィード名',
    url: 'サイトURL',
    feedUrl: 'RSSフィードURL',
    category: 'official' | 'vendor' | 'community' | 'international' | 'media',
  },
  // ...
];
```

### 新しいフィードカテゴリの追加

1. `src/site/` 配下に新しいディレクトリを作成
2. 対応するスクリプトとテンプレートを追加
3. `eleventy.config.ts` の `addPassthroughCopy` を更新

### 更新スケジュールの変更

`.github/workflows/generate-feed.yml` のcron設定を編集してください。

## 技術スタック

- **言語**: TypeScript / Node.js 20
- **静的サイトジェネレータ**: Eleventy (11ty) 3.x
- **RSS処理**: rss-parser, feed
- **自動化**: GitHub Actions
- **ホスティング**: GitHub Pages

## ライセンス

MIT License
