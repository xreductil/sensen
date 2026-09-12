(() => {
  const root = document.querySelector('[data-storefront-catalog]');
  if (!root) return;

  const content = root.querySelector('[data-storefront-catalog-content]');
  const status = root.querySelector('[data-storefront-catalog-status]');
  const view = root.dataset.storefrontView || 'overview';
  const categoryRoutes = {
    '造型蛋糕': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e7%94%9f%e6%97%a5%e8%9b%8b%e7%b3%95-%e4%b8%8b%e6%96%b9%e6%9c%89dm%e4%be%9b%e4%b8%8b%e8%bc%89-264/',
    '冰淇淋蛋糕': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e7%94%9f%e6%97%a5%e8%9b%8b%e7%b3%95-%e4%b8%8b%e6%96%b9%e6%9c%89dm%e4%be%9b%e4%b8%8b%e8%bc%89-264/',
    '伴手禮': '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e4%bc%b4%e6%89%8b%e7%a6%ae/'
  };
  const categoryMeta = {
    '造型蛋糕': { eyebrow: 'CARTOON SHAPE CAKE', icon: '/images/icon-cake.png' },
    '冰淇淋蛋糕': { eyebrow: 'ICE CREAM CAKE', icon: '/images/icon-cake2.png' },
    '伴手禮': { eyebrow: 'SOUVENIR', icon: '/images/icon-cupcake.png' }
  };
  const categoryOrder = ['造型蛋糕', '冰淇淋蛋糕', '伴手禮'];
  const menuSections = [
    {
      title: '伴手禮',
      categories: ['伴手禮'],
      eyebrow: 'SOUVENIR',
      icon: '/images/icon-cupcake.png',
      href: '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e4%bc%b4%e6%89%8b%e7%a6%ae/'
    },
    {
      title: '長條蛋糕',
      categories: ['長條蛋糕', '長條蛋糕(冷凍)'],
      eyebrow: 'LONG CAKE',
      icon: '/images/icon-cake2.png',
      href: '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e9%95%b7%e6%a2%9d%e8%9b%8b%e7%b3%95/'
    },
    {
      title: '點心餐盒',
      categories: ['點心餐盒'],
      eyebrow: 'TEA PARTY BOX',
      icon: '/images/icon-cake2.png',
      href: '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e9%bb%9e%e5%bf%83%e9%a4%90%e7%9b%92/'
    },
    {
      title: '歐式麵包(冷凍)',
      categories: ['歐式麵包(冷凍)'],
      eyebrow: 'EUROPEAN BREAD (FROZEN)',
      icon: '/images/icon-wheat.png',
      href: '/%e7%94%a2%e5%93%81%e4%bb%8b%e7%b4%b9/%e5%86%b7%e5%87%8d%e9%ba%b5%e5%8c%85/'
    }
  ];
  const hotProductFallback = ['oreo-ice-cream', 'colorful-world', 'macaron-forest', 'caramel-party', 'passion-pear', 'berry-melody'];
  const newProductFallback = ['emerald-lysk', 'strawberry-lysk'];
  const birthdayCakeCategories = new Set(['生日蛋糕', '造型蛋糕', '冰淇淋蛋糕']);
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
  const normalizeTitle = value => String(value || '')
    .replace(/<br\s*\/?\s*>/gi, '')
    .replace(/\s+/g, '')
    .replace(/[（(]季節限定[）)]/g, '（季節限定）')
    // The API may include the package count while the legacy route map does not.
    .replace(/[（(]\d+入[）)]$/g, '');
  const pathMap = (() => {
    try { return JSON.parse(root.dataset.productPaths || '{}'); } catch (error) { return {}; }
  })();
  const detailPath = product => product.url || pathMap[product.id] || pathMap[normalizeTitle(product.title)] || '';
  const imagePath = product => product.img || '/images/icon-cake.png';
  const available = product => product.published !== false && Number(product.priceValue || 0) > 0 && Number(product.quantity ?? 1) > 0;

  const productLink = (product, className, body) => {
    const href = detailPath(product);
    return `<a class="${className}" href="${escapeHtml(href || '#')}"${href ? '' : ' data-product-no-detail="true"'}>${body}</a>`;
  };

  const storefrontProductCard = (product, { articleClass, badge = '' } = {}) => {
    const name = String(product.title || '商品');
    const title = escapeHtml(name).replace(/[（(]季節限定[）)]/, '<br>（季節限定）');
    const body = `<span class="cake-product-image"><img src="${escapeHtml(imagePath(product))}" alt="${escapeHtml(name)}" loading="lazy"></span>`;
    const meta = `<span class="cake-product-title">${title}</span>`;
    return `<article class="${articleClass}${badge ? ' product-intro-featured-card' : ''}">${badge ? `<span class="product-intro-featured-badge">${escapeHtml(badge)}</span>` : ''}<div>${productLink(product, 'cake-product-card-link', body)}</div><div class="cake-product-meta">${productLink(product, 'cake-product-title-link', meta)}</div></article>`;
  };

  const productIntroCard = (product, badge = '') => storefrontProductCard(product, { articleClass: 'product-intro-card cake-product-card', badge });

  const cakeCard = product => {
    return storefrontProductCard(product, { articleClass: 'cake-product-card' });
  };

  const souvenirCard = product => storefrontProductCard(product, { articleClass: 'souvenir-card cake-product-card' });

  const heading = (category, icon = true) => {
    const meta = categoryMeta[category] || { eyebrow: category, icon: '/images/icon-cake.png' };
    return `<div class="product-intro-section-heading"><div><p>${escapeHtml(meta.eyebrow)}</p><h2>${icon ? `<img src="${escapeHtml(meta.icon)}" alt="" aria-hidden="true">` : ''}${escapeHtml(category)}</h2></div><div class="product-intro-carousel-controls"><button type="button" data-storefront-previous aria-label="向左滑動">‹</button><button type="button" data-storefront-next aria-label="向右滑動">›</button></div></div>`;
  };

  const selectFeaturedProducts = (products, rankKey, fallbackIds, limit = 6) => {
    const byId = new Map(products.map(product => [product.id, product]));
    const ranked = products
      .filter(product => rankKey === 'newArrivalRank'
        ? product.newArrival === true || Number(product[rankKey]) > 0
        : Number(product[rankKey]) > 0)
      .sort((a, b) => {
        if (rankKey === 'salesCount') return Number(b[rankKey]) - Number(a[rankKey]);
        if (rankKey === 'newArrivalRank') {
          const aRank = Number(a[rankKey]) || Number.MAX_SAFE_INTEGER;
          const bRank = Number(b[rankKey]) || Number.MAX_SAFE_INTEGER;
          return aRank - bRank || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return Number(a[rankKey]) - Number(b[rankKey]);
      });
    const fallback = fallbackIds.map(id => byId.get(id)).filter(Boolean);
    const recent = rankKey === 'newArrivalRank'
      ? products.filter(product => product.createdAt && product.newArrival !== false).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
    return [...new Map([...ranked, ...fallback, ...recent, ...products].map(product => [product.id, product])).values()].slice(0, limit);
  };

  const renderFeaturedSection = (products, { eyebrow, title, icon, badge }) => {
    if (!products.length) return '';
    return `<section class="product-intro-section product-intro-featured-section" data-storefront-section><div class="product-intro-section-heading"><div><p>${escapeHtml(eyebrow)}</p><h2><img src="${escapeHtml(icon)}" alt="" aria-hidden="true">${escapeHtml(title)}</h2></div><div class="product-intro-carousel-controls"><button type="button" data-storefront-previous aria-label="向左滑動">‹</button><button type="button" data-storefront-next aria-label="向右滑動">›</button></div></div><div class="product-intro-carousel"><div class="product-intro-track" data-storefront-track tabindex="0">${products.map((product, index) => productIntroCard(product, typeof badge === 'function' ? badge(product, index) : badge)).join('')}</div></div></section>`;
  };

  const renderOverviewSection = (section, products) => {
    const cards = products.map(productIntroCard).join('');
    const controls = products.length
      ? '<div class="product-intro-carousel-controls"><button type="button" data-storefront-previous aria-label="向左滑動">‹</button><button type="button" data-storefront-next aria-label="向右滑動">›</button></div>'
      : '';
    const productContent = products.length
      ? `<div class="product-intro-carousel"><div class="product-intro-track" data-storefront-track tabindex="0">${cards}</div></div>`
      : '<p class="storefront-catalog-empty storefront-section-empty">商品內容即將上架，敬請期待。</p>';
    return `<section class="product-intro-section" data-storefront-section data-storefront-menu-category="${escapeHtml(section.title)}"><div class="product-intro-section-heading"><div><p>${escapeHtml(section.eyebrow)}</p><h2><img src="${escapeHtml(section.icon)}" alt="" aria-hidden="true">${escapeHtml(section.title)}</h2></div>${controls}</div>${productContent}<a class="product-intro-load-more" href="${escapeHtml(section.href)}">查看全部商品</a></section>`;
  };

  const renderCakes = products => {
    const categories = categoryOrder.filter(category => category !== '伴手禮' && products.some(product => product.cat === category));
    content.innerHTML = categories.map((category, index) => {
      const categoryProducts = products.filter(product => product.cat === category);
      const visible = category === '生日蛋糕' ? categoryProducts.slice(0, 10) : categoryProducts;
      const extra = category === '生日蛋糕' ? categoryProducts.slice(10) : [];
      return `<section class="cake-category ${index === 0 ? 'is-first' : ''}"><div class="cake-category-heading">${index === 0 ? `<img class="cake-section-icon" src="${escapeHtml((categoryMeta[category] || {}).icon || '/images/icon-cake.png')}" alt="" aria-hidden="true">` : ''}<p>${escapeHtml((categoryMeta[category] || {}).eyebrow || category)}</p><h2>${escapeHtml(category)}</h2></div><div class="cake-product-grid">${visible.map(cakeCard).join('')}</div>${extra.length ? `<div class="cake-product-grid cake-product-grid-more" data-cake-load-more-items hidden>${extra.map(cakeCard).join('')}</div><div class="cake-load-more"><button class="cake-load-more-button" type="button" data-cake-load-more aria-expanded="false">▪▪ Load more</button></div>` : ''}</section>`;
    }).join('') || '<p class="storefront-catalog-empty">目前沒有已上架的商品。</p>';
  };

  const renderSouvenirs = products => {
    const items = products.filter(product => product.cat === '伴手禮');
    content.innerHTML = `<section class="souvenir-products"><img class="souvenir-icon" src="/images/icon-cupcake.png" alt="" aria-hidden="true"><div class="souvenir-grid">${items.map(souvenirCard).join('')}</div>${items.length ? '' : '<p class="storefront-catalog-empty">目前沒有已上架的商品。</p>'}</section>`;
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
    content.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      const card = event.target.closest('.cake-product-card');
      const link = card?.querySelector('a[href]:not([href="#"])');
      if (link) link.click();
    });
    content.querySelectorAll('[data-product-no-detail]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  };

  const load = async () => {
    try {
      const response = await fetch('/api/products', { credentials: 'include', headers: { Accept: 'application/json' } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品資料暫時無法載入。');
      const products = orderProducts((data.products || []).filter(product => product.published !== false));
      const storefrontProducts = products.filter(product => !birthdayCakeCategories.has(product.cat));
      if (view === 'overview') {
        const hotProducts = selectFeaturedProducts(storefrontProducts, 'salesCount', hotProductFallback, 5);
        const newProducts = selectFeaturedProducts(storefrontProducts, 'newArrivalRank', newProductFallback);
        content.innerHTML = renderFeaturedSection(hotProducts, {
          eyebrow: 'BEST SELLERS',
          title: '熱銷排行榜',
          icon: '/images/icon-cake.png',
          badge: (_, index) => `TOP ${index + 1}`
        })
          + renderFeaturedSection(newProducts, {
            eyebrow: 'NEW ARRIVALS',
            title: '新品上市',
            icon: '/images/icon-wheat.png',
            badge: 'NEW'
          })
          + menuSections.map(section => renderOverviewSection(
            section,
            storefrontProducts.filter(product => section.categories.includes(product.cat))
          )).join('');
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
