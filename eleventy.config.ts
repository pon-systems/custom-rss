import type { UserConfig } from '@11ty/eleventy';

export default function (eleventyConfig: UserConfig) {
  // 静的ファイルをコピー
  eleventyConfig.addPassthroughCopy({ 'src/site/security/feeds/*.xml': 'security/feeds' });
  eleventyConfig.addPassthroughCopy({ 'src/site/security/data/*.json': 'security/data' });
  eleventyConfig.addPassthroughCopy({ 'src/site/assets/js/*.js': 'assets/js' });

  // 日付フォーマットフィルター
  eleventyConfig.addFilter('formatDate', (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  // 短い日付フォーマット
  eleventyConfig.addFilter('shortDate', (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
    });
  });

  // テキスト切り詰め
  eleventyConfig.addFilter('truncate', (text: string, length: number) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  });

  return {
    pathPrefix: '/custom-rss/',
    dir: {
      input: 'src/site',
      output: '_site',
      includes: '_includes',
      layouts: '_includes',
      data: '_data',
    },
    templateFormats: ['njk', 'html', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
