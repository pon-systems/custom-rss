/**
 * クライアントサイドページングモジュール
 */
class ArticlePaginator {
  constructor(options) {
    this.containerId = options.containerId;
    this.paginationId = options.paginationId;
    this.dataUrl = options.dataUrl;
    this.itemsPerPage = options.itemsPerPage || 20;
    this.currentPage = 1;
    this.articles = [];
    this.totalPages = 0;
  }

  async init() {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.articles = await response.json();
      this.totalPages = Math.ceil(this.articles.length / this.itemsPerPage);
      this.render();
      this.renderPaginationControls();
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  }

  getPageArticles() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.articles.slice(start, end);
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const articles = this.getPageArticles();
    container.innerHTML = articles
      .map(
        (article) => `
      <li class="article-item">
        <div class="article-title">
          <a href="${this.escapeHtml(article.link)}" target="_blank" rel="noopener">
            ${this.escapeHtml(article.title)}
          </a>
        </div>
        <div class="article-meta">
          <span class="article-source">${this.escapeHtml(article.source)}</span>
          <span>${this.formatDate(article.pubDate)}</span>
        </div>
      </li>
    `
      )
      .join('');
  }

  renderPaginationControls() {
    const container = document.getElementById(this.paginationId);
    if (!container) return;

    let html = '<div class="pagination">';

    // 前へボタン
    html += `<button class="pagination-btn"
      ${this.currentPage === 1 ? 'disabled' : ''}
      onclick="paginator.goToPage(${this.currentPage - 1})">
      前へ
    </button>`;

    // ページ番号（最大5ページ表示）
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);

    if (startPage > 1) {
      html += `<button class="pagination-btn" onclick="paginator.goToPage(1)">1</button>`;
      if (startPage > 2) html += '<span class="pagination-ellipsis">...</span>';
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
        onclick="paginator.goToPage(${i})">${i}</button>`;
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) html += '<span class="pagination-ellipsis">...</span>';
      html += `<button class="pagination-btn" onclick="paginator.goToPage(${this.totalPages})">${this.totalPages}</button>`;
    }

    // 次へボタン
    html += `<button class="pagination-btn"
      ${this.currentPage === this.totalPages ? 'disabled' : ''}
      onclick="paginator.goToPage(${this.currentPage + 1})">
      次へ
    </button>`;

    // ページ情報
    html += `<span class="pagination-info">
      ${this.currentPage} / ${this.totalPages} ページ (全${this.articles.length}件)
    </span>`;

    html += '</div>';
    container.innerHTML = html;
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.render();
    this.renderPaginationControls();
    // 記事リストの先頭にスクロール
    document.getElementById(this.containerId)?.scrollIntoView({ behavior: 'smooth' });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// グローバルに公開
window.ArticlePaginator = ArticlePaginator;
