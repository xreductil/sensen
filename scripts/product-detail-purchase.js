(() => {
  const productPage = document.querySelector('.emerald-product-page');
  if (!productPage) return;

  const copy = productPage.querySelector('.emerald-product-copy');
  const titleElement = copy?.querySelector('[data-product-title]');
  if (!copy || !titleElement) return;

  const normalize = value => String(value || '')
    .normalize('NFKC')
    .replace(/<br\s*\/?\s*>/gi, '')
    .replace(/[\s（）()\-]/g, '')
    .replace('季節限定', '')
    .toLowerCase();
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => `NT$${Number(value || 0).toLocaleString('zh-TW')}`;
  const pagePath = decodeURI(window.location.pathname).replace(/\/$/, '');
  const productId = productPage.dataset.productId || '';
  const pathMap = (() => {
    try { return JSON.parse(productPage.dataset.productPaths || '{}'); } catch { return {}; }
  })();

  const setText = (element, value, fallback = '') => {
    if (!element) return;
    const text = String(value ?? '').replace(/<br\s*\/?\s*>/gi, '\n').trim();
    element.textContent = text || fallback;
    element.style.whiteSpace = 'pre-line';
  };
  const setHidden = (element, hidden) => {
    if (element) element.hidden = hidden;
  };
  const imagePath = value => String(value || '').trim();
  const productPath = product => {
    if (product.url) {
      try { return new URL(product.url, window.location.origin).pathname; } catch { /* use the local route map */ }
    }
    return pathMap[product.id] || pathMap[normalize(product.title)] || '';
  };
  const formatDate = value => String(value || '').slice(0, 10);

  const updateMeta = product => {
    const title = String(product.title || '商品');
    document.title = `${title} – 森森點心坊`;
    const description = String(product.desc || '').replace(/\s+/g, ' ').trim().slice(0, 155);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${title} – 森森點心坊`;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) ogDescription.content = description;
  };

  const renderGallery = product => {
    const images = [...new Set((Array.isArray(product.images) ? product.images : [product.img]).map(imagePath).filter(Boolean))];
    const gallery = productPage.querySelector('[data-product-gallery]');
    const mainImage = productPage.querySelector('[data-product-main-image]');
    if (gallery) {
      gallery.innerHTML = images.length
        ? images.map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(product.title || '商品')}${index ? ` 商品圖片 ${index + 1}` : ''}" loading="lazy">`).join('')
        : '<p class="product-detail-empty">尚未提供商品圖片。</p>';
    }
    if (mainImage) {
      if (images[0]) {
        mainImage.src = images[0];
        mainImage.alt = String(product.title || '商品');
        mainImage.hidden = false;
      } else {
        mainImage.removeAttribute('src');
        mainImage.alt = '';
        mainImage.hidden = true;
      }
    }
  };

  const updateSpec = (labels, value) => {
    const item = [...productPage.querySelectorAll('[data-product-specs] > div')]
      .find(entry => labels.includes(entry.querySelector('dt')?.textContent.trim()));
    setText(item?.querySelector('dd'), value, '—');
  };

  const syncProductDetails = product => {
    const title = String(product.title || '商品');
    titleElement.textContent = title;
    setText(productPage.querySelector('[data-product-hero-title]'), title, '商品');
    setText(productPage.querySelector('[data-product-hero-category]'), product.cat ? `▱ ${product.cat}` : '▱ 產品介紹');
    setText(productPage.querySelector('[data-product-description-value]'), product.desc, '尚未提供商品說明。');
    updateSpec(['商品尺寸', '蛋糕吋數', '規格'], product.size);
    updateSpec(['保存方式'], product.storage);
    updateSpec(['其他'], product.other);

    const emphasis = productPage.querySelector('[data-product-emphasis]');
    setText(emphasis, product.emphasis);
    setHidden(emphasis, !String(product.emphasis || '').trim());
    const note = productPage.querySelector('[data-product-note]');
    setText(note, product.note);
    setHidden(note, !String(product.note || '').trim());
    const divider = productPage.querySelector('[data-product-spec-divider]');
    setHidden(divider, false);

    const dietary = productPage.querySelector('[data-product-dietary]');
    const dietaryImage = productPage.querySelector('[data-product-dietary-image]');
    if (dietary && String(product.dietary || '').trim()) {
      dietary.hidden = false;
      dietary.setAttribute('aria-label', product.dietary);
      if (dietaryImage) {
        dietaryImage.src = product.dietaryImage || '/images/icon-vlml.png';
        dietaryImage.alt = product.dietary;
      }
    } else {
      setHidden(dietary, true);
    }
    const likes = productPage.querySelector('[data-product-likes]');
    if (likes) {
      likes.textContent = String(Math.max(0, Number(product.likes || 0)));
      likes.closest('.emerald-likes')?.setAttribute('aria-label', `${likes.textContent} 個喜歡`);
    }
    updateMeta(product);
    renderGallery(product);
  };

  const renderRelated = (product, products) => {
    const related = productPage.querySelector('[data-product-related]');
    const track = related?.querySelector('[data-related-track]');
    if (!related || !track) return;
    const candidates = products
      .filter(item => item.id !== product.id && productPath(item))
      .sort((left, right) => {
        const sameCategory = Number(right.cat === product.cat) - Number(left.cat === product.cat);
        return sameCategory || new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      })
      .slice(0, 10);
    if (!candidates.length) {
      related.hidden = true;
      return;
    }
    related.hidden = false;
    track.innerHTML = candidates.map(item => {
      const image = (Array.isArray(item.images) && item.images[0]) || item.img || '';
      const href = productPath(item);
      return `<article class="emerald-related-card"><a href="${escapeHtml(href)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.title || '商品')}" loading="lazy"><span>${escapeHtml(formatDate(item.createdAt))}</span><h3>${escapeHtml(item.title || '商品')}</h3><b aria-hidden="true">▪▪&nbsp; 更多</b></a></article>`;
    }).join('');
  };

  const bindRelatedControls = () => {
    productPage.querySelectorAll('[data-related-carousel]').forEach(carousel => {
      const track = carousel.querySelector('[data-related-track]');
      const move = direction => track?.scrollBy({ left: direction * Math.max((track.clientWidth || 0) * .82, 280), behavior: 'smooth' });
      carousel.querySelector('[data-related-previous]')?.addEventListener('click', () => move(-1));
      carousel.querySelector('[data-related-next]')?.addEventListener('click', () => move(1));
    });
  };

  const renderPurchase = product => {
    productPage.querySelectorAll('.product-detail-purchase, .product-detail-pending-price').forEach(element => element.remove());
    const inStock = product.published !== false && Number(product.priceValue || 0) > 0 && Number(product.quantity ?? 1) > 0;
    if (Number(product.priceValue || 0) <= 0) {
      const pending = document.createElement('p');
      pending.className = 'product-detail-pending-price';
      pending.textContent = '價格待設定';
      const badge = copy.querySelector('[data-product-dietary]');
      if (badge && !badge.hidden) badge.insertAdjacentElement('afterend', pending);
      else titleElement.insertAdjacentElement('afterend', pending);
      return;
    }
    const section = document.createElement('section');
    section.className = 'product-detail-purchase';
    section.setAttribute('aria-label', '商品購買');
    section.innerHTML = `<p class="product-detail-price">${money(product.priceValue)}</p><div class="cake-product-purchase" data-cake-purchase><div class="cake-quantity-control" aria-label="選擇數量"><button type="button" data-cake-quantity-change="-1"${inStock ? '' : ' disabled'} aria-label="減少數量">−</button><output data-cake-quantity aria-live="polite">1</output><button type="button" data-cake-quantity-change="1"${inStock ? '' : ' disabled'} aria-label="增加數量">＋</button></div><button class="cake-add-cart" type="button" data-product-detail-add-cart${inStock ? '' : ' disabled'}>${inStock ? '加入購物車' : '暫停供應'}</button></div><p class="product-detail-purchase-message" data-product-detail-message role="status"></p>`;
    const badge = copy.querySelector('[data-product-dietary]');
    if (badge && !badge.hidden) badge.insertAdjacentElement('afterend', section);
    else titleElement.insertAdjacentElement('afterend', section);

    section.querySelectorAll('[data-cake-quantity-change]').forEach(button => button.addEventListener('click', () => {
      const output = section.querySelector('[data-cake-quantity]');
      output.textContent = String(Math.max(1, Math.min(99, Number(output.textContent || 1) + Number(button.dataset.cakeQuantityChange || 0))));
    }));
    const addButton = section.querySelector('[data-product-detail-add-cart]');
    addButton.addEventListener('click', async () => {
      const message = section.querySelector('[data-product-detail-message]');
      const quantity = Number(section.querySelector('[data-cake-quantity]').textContent || 1);
      addButton.disabled = true;
      addButton.textContent = '加入中…';
      message.textContent = '';
      try {
        const response = await fetch('/api/cart/add', { method: 'POST', credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, qty: quantity }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || '加入購物車失敗。');
        addButton.textContent = '已加購物車';
        document.querySelector('.cart-trigger')?.click();
      } catch (error) {
        message.textContent = error.message;
        addButton.textContent = '加入購物車';
      } finally {
        addButton.disabled = false;
      }
    });
  };

  const showError = message => {
    const status = document.createElement('p');
    status.className = 'product-detail-error';
    status.setAttribute('role', 'status');
    status.textContent = message;
    productPage.prepend(status);
  };

  fetch('/api/products', { credentials: 'include', headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('無法載入商品資料。')))
    .then(data => {
      const products = Array.isArray(data.products) ? data.products : [];
      const product = products.find(item => productId && item.id === productId)
        || products.find(item => {
          const itemPath = productPath(item);
          return itemPath === pagePath || normalize(item.title) === normalize(titleElement.textContent);
        });
      if (!product) throw new Error('找不到此商品，可能已下架。');
      syncProductDetails(product);
      renderPurchase(product);
      renderRelated(product, products);
      bindRelatedControls();
      productPage.dataset.productLoaded = 'true';
    })
    .catch(error => {
      console.warn(error);
      showError(error.message || '商品資料載入失敗。');
    });
})();
