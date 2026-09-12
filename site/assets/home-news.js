(() => {
  const section = document.querySelector('[data-home-news-section]');
  const list = document.querySelector('[data-home-news-list]');
  if (!section || !list) return;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const archivedImageMap = {
    '/wp-content/uploads/2025/07/1-scaled.jpg': '/images/photo-1-8.jpg',
    '/wp-content/uploads/2025/07/2-1528x1080.jpg': '/images/photo-2-3.jpg',
    '/wp-content/uploads/2025/07/3-1528x1080.jpg': '/images/photo-3-3.jpg',
    '/wp-content/uploads/2025/07/4-1528x1080.jpg': '/images/photo-4-2.jpg'
  };
  const imageUrl = value => {
    const image = String(value || '').trim();
    if (!image) return '';
    if (/^\/images\/legacy-news(?:[?#]|$)/i.test(image)) {
      try {
        const legacyUrl = new URL(image, window.location.origin).searchParams.get('url');
        const legacyPath = legacyUrl ? new URL(legacyUrl, window.location.origin).pathname : '';
        if (archivedImageMap[legacyPath]) return archivedImageMap[legacyPath];
      } catch {}
    }
    const localImage = image.match(/^\/?(?:assets\/)?images\/([^?#]+)$/i);
    if (localImage) return '/images/' + localImage[1];
    if (/^(https?:|data:|\/)/i.test(image)) return image;
    return '/images/' + image.replace(/^\.\//, '').replace(/^assets\/images\//, '');
  };
  const formatDate = value => {
    const date = new Date(value || 0);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const render = articles => {
    const visible = Array.isArray(articles) ? articles.slice(0, 3) : [];
    if (!visible.length) {
      section.hidden = true;
      return;
    }
    list.innerHTML = visible.map(article => {
      const image = imageUrl(article.image);
      const imageMarkup = image
        ? `<div class="home-news-card-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(article.title || '最新消息')}" loading="lazy"></div>`
        : '<div class="home-news-card-placeholder" aria-hidden="true">森森點心坊</div>';
      return `<a class="home-news-card" href="/latest-news/article/${escapeHtml(encodeURIComponent(article.slug || article.id || ''))}/">
      ${imageMarkup}<small>${escapeHtml(formatDate(article.publishAt || article.createdAt))}</small><h3>${escapeHtml(article.title || '最新消息')}</h3><span>更多</span>
    </a>`;
    }).join('');
    section.hidden = false;
  };

  fetch('/api/news', { credentials: 'include', headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Unable to load news.')))
    .then(data => render(data.news))
    .catch(() => render([]));
})();
