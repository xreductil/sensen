(() => {
  const root = document.querySelector('[data-storefront-catalog]');
  if (!root) return;

  const content = root.querySelector('[data-storefront-catalog-content]');
  const status = root.querySelector('[data-storefront-catalog-status]');
  const view = root.dataset.storefrontView || 'overview';
  const categoryRoutes = {
    '生日蛋糕': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e7%94%9f%e6%97%a5%e8%9b%8b%e7%b3%95-%e4%b8%8b%e6%96%b9%e6%9c%89dm%e4%be%9b%e4%b8%8b%e8%bc%89-264/',
    '造型蛋糕': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e7%94%9f%e6%97%a5%e8%9b%8b%e7%b3%95-%e4%b8%8b%e6%96%b9%e6%9c%89dm%e4%be%9b%e4%b8%8b%e8%bc%89-264/',
    '冰淇淋蛋糕': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e7%94%9f%e6%97%a5%e8%9b%8b%e7%b3%95-%e4%b8%8b%e6%96%b9%e6%9c%89dm%e4%be%9b%e4%b8%8b%e8%bc%89-264/',
    '伴手禮': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e4%bc%b4%e6%89%8b%e7%a6%ae/'
  };
  const categoryMeta = {
    '生日蛋糕': { eyebrow: 'BIRTHDAY CAKE', icon: '/assets/images/icon-cake.png' },
    '造型蛋糕': { eyebrow: 'CARTOON SHAPE CAKE', icon: '/assets/images/icon-cake.png' },
    '冰淇淋蛋糕': { eyebrow: 'ICE CREAM CAKE', icon: '/assets/images/icon-cake2.png' },
    '伴手禮': { eyebrow: 'SOUVENIR', icon: '/assets/images/icon-cupcake.png' }
  };
  const categoryOrder = ['生日蛋糕', '造型蛋糕', '冰淇淋蛋糕', '伴手禮'];
  const birthdayProductOrder = [
    'emerald-lysk', 'strawberry-lysk', 'caramel-party', 'gulava',
    'passion-pear', 'colorful-world', 'mocha', 'hazelnut-crunch',
    'black-forest', 'souffle', 'macaron-forest', 'strawberry-shudo',
    'rose-bouquet', 'bodhi-cake', 'puff-kingdom', 'uji-hayakaze',
    'blueberry-lysk', 'angel-cake'
  ];
  const orderProducts = products => products
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      if (a.product.cat !== '生日蛋糕' || b.product.cat !== '生日蛋糕') return a.index - b.index;
      const aRank = birthdayProductOrder.indexOf(a.product.id);
      const bRank = birthdayProductOrder.indexOf(b.product.id);
      return (aRank < 0 ? Number.MAX_SAFE_INTEGER : aRank) - (bRank < 0 ? Number.MAX_SAFE_INTEGER : bRank) || a.index - b.index;
    })
    .map(({ product }) => product);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalizeTitle = value => String(value || '').replace(/<br\s*\/?\s*>/gi, '').replace(/\s+/g, '').replace(/[（(]季節限定[）)]/g, '（季節限定）');
  const money = value => {
    const amount = Number(value || 0);
    return amount > 0 ? `NT$${amount.toLocaleString('zh-TW')}` : '價格洽詢';
  };
  const pathMap = (() => {
    try { return JSON.parse(root.dataset.productPaths || '{}'); } catch (error) { return {}; }
  })();
  const detailPath = product => product.url || pathMap[normalizeTitle(product.title)] || '';
  const imagePath = product => product.img || '/assets/images/icon-cake.png';
  const available = product => product.published !== false && Number(product.priceValue || 0) > 0 && Number(product.quantity ?? 1) > 0;

  const productLink = (product, className, body) => {
    const href = detailPath(product);
    return `<a class="${className}" href="${escapeHtml(href || '#')}"${href ? '' : ' data-product-no-detail="true"'}>${body}</a>`;
  };

  const productIntroCard = product => {
    const body = `<img src="${escapeHtml(imagePath(product))}" alt="${escapeHtml(product.title)}" loading="lazy"><div class="product-intro-card-meta"><div class="product-intro-card-title"><strong>${escapeHtml(product.title)}</strong><span class="product-intro-card-price">${escapeHtml(money(product.priceValue))}</span></div><span class="product-intro-card-likes" aria-label="收藏"><b aria-hidden="true">♡</b></span></div>`;
    return `<article class="product-intro-card">${productLink(product, 'product-intro-card-link', body)}</article>`;
  };

  const cakeCard = product => {
    const name = String(product.title || '商品');
    const body = `<span class="cake-product-image"><img src="${escapeHtml(imagePath(product))}" alt="${escapeHtml(name)}" loading="lazy"></span>`;
    const addButton = `<button class="cake-add-cart" type="button" data-storefront-add-cart="${escapeHtml(product.id)}"${available(product) ? '' : ' disabled'}>${available(product) ? '加入購物車' : (Number(product.priceValue || 0) > 0 ? '暫停供應' : '價格待設定')}</button>`;
    return `<article class="cake-product-card"><div>${productLink(product, 'cake-product-card-link', body)}</div><div class="cake-product-meta"><div class="cake-product-title-link"><span class="cake-product-title">${escapeHtml(name)}</span><span class="cake-product-price">${escapeHtml(money(product.priceValue))}</span></div><span class="cake-likes" aria-label="收藏"><span class="cake-heart" aria-hidden="true">♡</span></span>${addButton}</div></article>`;
  };

  const souvenirCard = product => {
    const name = String(product.title || '商品');
    const body = `<img src="${escapeHtml(imagePath(product))}" alt="${escapeHtml(name)}" loading="lazy"><div class="souvenir-card-meta"><div class="souvenir-card-title"><h2>${escapeHtml(name)}</h2><span class="souvenir-card-price">${escapeHtml(money(product.priceValue))}</span></div><span class="souvenir-likes" aria-label="收藏"><span aria-hidden="true">♡</span></span></div>`;
    const addButton = `<button class="souvenir-add-cart" type="button" data-storefront-add-cart="${escapeHtml(product.id)}"${available(product) ? '' : ' disabled'}>${available(product) ? '加入購物車' : (Number(product.priceValue || 0) > 0 ? '暫停供應' : '價格待設定')}</button>`;
    return `<article class="souvenir-card">${productLink(product, 'souvenir-card-link', body)}${addButton}</article>`;
  };

  const heading = (category, icon = true) => {
    const meta = categoryMeta[category] || { eyebrow: category, icon: '/assets/images/icon-cake.png' };
    return `<div class="product-intro-section-heading"><div><p>${escapeHtml(meta.eyebrow)}</p><h2>${icon ? `<img src="${escapeHtml(meta.icon)}" alt="" aria-hidden="true">` : ''}${escapeHtml(category)}</h2></div><div class="product-intro-carousel-controls"><button type="button" data-storefront-previous aria-label="向左滑動">‹</button><button type="button" data-storefront-next aria-label="向右滑動">›</button></div></div>`;
  };

  const renderOverviewSection = (category, products) => `<section class="product-intro-section" data-storefront-section><div class="product-intro-section-heading"><div><p>${escapeHtml((categoryMeta[category] || {}).eyebrow || category)}</p><h2><img src="${escapeHtml((categoryMeta[category] || {}).icon || '/assets/images/icon-cake.png')}" alt="" aria-hidden="true">${escapeHtml(category)}</h2></div><div class="product-intro-carousel-controls"><button type="button" data-storefront-previous aria-label="向左滑動">‹</button><button type="button" data-storefront-next aria-label="向右滑動">›</button></div></div><div class="product-intro-carousel"><div class="product-intro-track" data-storefront-track tabindex="0">${products.map(productIntroCard).join('')}</div></div><a class="product-intro-load-more" href="${escapeHtml(categoryRoutes[category] || '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/')}">查看全部商品</a></section>`;

  const renderMenuSection = () => `<section class="product-intro-section" data-storefront-menu-section><div class="product-intro-section-heading"><div><p>DRINK MENU</p><h2><img src="/assets/images/icon-coffee.png" alt="" aria-hidden="true">飲品 MENU</h2></div></div><div class="product-intro-track" tabindex="0"><article class="product-intro-menu-card"><a href="/%e6%a3%ae%e6%a3%ae%e5%92%96%e5%95%a1/"><img src="/assets/images/coffee-menu-1.jpg" alt="咖啡與氣泡飲" loading="lazy"><strong>咖啡與氣泡飲</strong></a></article><article class="product-intro-menu-card"><a href="/%e6%a3%ae%e6%a3%ae%e5%92%96%e5%95%a1/"><img src="/assets/images/coffee-menu-2.jpg" alt="茶飲與奶茶" loading="lazy"><strong>茶飲與奶茶</strong></a></article></div><a class="product-intro-load-more" href="/%e6%a3%ae%e6%a3%ae%e5%92%96%e5%95%a1/">查看飲品 MENU</a></section>`;

  const renderCakes = products => {
    const categories = categoryOrder.filter(category => category !== '伴手禮' && products.some(product => product.cat === category));
    content.innerHTML = categories.map((category, index) => {
      const categoryProducts = products.filter(product => product.cat === category);
      const visible = category === '生日蛋糕' ? categoryProducts.slice(0, 10) : categoryProducts;
      const extra = category === '生日蛋糕' ? categoryProducts.slice(10) : [];
      return `<section class="cake-category ${index === 0 ? 'is-first' : ''}"><div class="cake-category-heading">${index === 0 ? `<img class="cake-section-icon" src="${escapeHtml((categoryMeta[category] || {}).icon || '/assets/images/icon-cake.png')}" alt="" aria-hidden="true">` : ''}<p>${escapeHtml((categoryMeta[category] || {}).eyebrow || category)}</p><h2>${escapeHtml(category)}</h2></div><div class="cake-product-grid">${visible.map(cakeCard).join('')}</div>${extra.length ? `<div class="cake-product-grid cake-product-grid-more" data-cake-load-more-items hidden>${extra.map(cakeCard).join('')}</div><div class="cake-load-more"><button class="cake-load-more-button" type="button" data-cake-load-more aria-expanded="false">▪▪ Load more</button></div>` : ''}</section>`;
    }).join('') || '<p class="storefront-catalog-empty">目前沒有已上架的商品。</p>';
  };

  const renderSouvenirs = products => {
    const items = products.filter(product => product.cat === '伴手禮');
    content.innerHTML = `<section class="souvenir-products"><img class="souvenir-icon" src="/assets/images/icon-cupcake.png" alt="" aria-hidden="true"><div class="souvenir-grid">${items.map(souvenirCard).join('')}</div>${items.length ? '' : '<p class="storefront-catalog-empty">目前沒有已上架的商品。</p>'}</section>`;
  };

  const bindInteractions = () => {
    content.querySelectorAll('[data-storefront-previous], [data-storefront-next]').forEach(button => button.addEventListener('click', () => {
      const track = button.closest('[data-storefront-section]')?.querySelector('[data-storefront-track]');
      if (track) track.scrollBy({ left: (button.hasAttribute('data-storefront-previous') ? -1 : 1) * Math.max(track.clientWidth * .82, 260), behavior: 'smooth' });
    }));
    content.addEventListener('click', event => {
      const button = event.target.closest('[data-cake-load-more]');
      if (!button || !content.contains(button)) return;
      event.preventDefault();
      const items = button.closest('.cake-category')?.querySelector('[data-cake-load-more-items]');
      if (!items) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      items.classList.toggle('is-expanded', !expanded);
      items.hidden = expanded;
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? '▪▪ Load more' : '▪▪ 收起商品';
    });
    content.querySelectorAll('[data-product-no-detail]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
    content.querySelectorAll('[data-storefront-add-cart]').forEach(button => button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      const original = button.textContent;
      button.disabled = true;
      button.textContent = '加入中…';
      try {
        const response = await fetch('/api/cart/add', { method: 'POST', credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: button.dataset.storefrontAddCart, qty: 1 }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || '加入購物車失敗。');
        button.textContent = '已加入購物車';
        document.querySelector('.cart-trigger')?.click();
      } catch (error) {
        button.textContent = error.message;
        window.setTimeout(() => { button.textContent = original; button.disabled = false; }, 1800);
        return;
      }
      button.disabled = false;
    }));
  };

  const load = async () => {
    try {
      const response = await fetch('/api/products', { credentials: 'include', headers: { Accept: 'application/json' } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品資料暫時無法載入。');
      const products = orderProducts((data.products || []).filter(product => product.published !== false));
      if (view === 'overview') {
        const groups = categoryOrder.filter(category => products.some(product => product.cat === category)).map(category => renderOverviewSection(category, products.filter(product => product.cat === category)));
        content.innerHTML = groups.join('') + renderMenuSection();
      } else if (view === 'cakes') {
        renderCakes(products);
      } else {
        renderSouvenirs(products);
      }
      status.hidden = true;
      bindInteractions();
    } catch (error) {
      status.textContent = error.message;
      status.className = 'storefront-catalog-error';
    }
  };

  load();
})();
