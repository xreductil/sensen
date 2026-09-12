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
  const topHouseOriginalPrices = {
    'top-house-boston-classic': 520,
    'top-house-boston-new': 600,
    'top-house-pa1-boston-gift': 635,
    'top-house-pa2-boston-gift': 690,
    'top-house-pa3-boston-gift': 685,
    'top-house-pa4-boston-gift': 880,
    'top-house-c1-big-bear': 835,
    'top-house-c2-big-bear': 670,
    'top-house-c3-big-bear': 875,
    'top-house-c4-big-bear': 785,
    'top-house-b1-little-bear': 720,
    'top-house-b2-little-bear': 530,
    'top-house-b3-little-bear': 475,
    'top-house-b4-little-bear': 515,
    'top-house-l1-country-cheese': 1145,
    'top-house-l2-country-cheese': 1355,
    'top-house-l3-country-cheese': 1000,
    'top-house-k1-creme-brulee': 760,
    'top-house-k2-pistachio-marble': 760,
    'top-house-k3-cheesecake': 760,
    'top-house-k4-light-cheesecake': 670,
    'top-house-k5-belgian-chocolate': 670,
    'top-house-k6-lemon-cheesecake': 670,
    'top-house-a1-strawberry-marble': 360,
    'top-house-a2-honey-cake': 360,
    'top-house-a3-blueberry-angel': 360,
    'top-house-a4-lemon-love': 360,
    'top-house-a5-classic-chocolate': 360,
    'top-house-a6-left-bank-coffee-roll': 580,
    'top-house-a7-vanilla-napoleon': 580,
    'top-house-a7-chocolate-napoleon': 580,
    'top-house-a8-earl-grey-roll': 580,
    'top-house-a9-mocha-chocolate': 580,
    'top-house-a10-violet': 580,
    'top-house-a11-japanese-layer': 580,
    'top-house-a12-osmanthus-oolong': 580
  };
  const topHouseCardTitles = {
    'top-house-boston-classic': '波士頓派（經典口味）',
    'top-house-boston-new': '波士頓派（新品口味）',
    'top-house-pa1-boston-gift': 'PA1 波士頓派禮盒',
    'top-house-pa2-boston-gift': 'PA2 波士頓派禮盒',
    'top-house-pa3-boston-gift': 'PA3 波士頓派禮盒',
    'top-house-pa4-boston-gift': 'PA4 波士頓派禮盒',
    'top-house-c1-big-bear': 'C1 大熊禮盒',
    'top-house-c2-big-bear': 'C2 大熊禮盒',
    'top-house-c3-big-bear': 'C3 大熊禮盒',
    'top-house-c4-big-bear': 'C4 大熊禮盒',
    'top-house-b1-little-bear': 'B1 小熊禮盒',
    'top-house-b2-little-bear': 'B2 小熊禮盒',
    'top-house-b3-little-bear': 'B3 小熊禮盒',
    'top-house-b4-little-bear': 'B4 小熊禮盒',
    'top-house-l1-country-cheese': 'L1 鄉村禮盒',
    'top-house-l2-country-cheese': 'L2 鄉村禮盒',
    'top-house-l3-country-cheese': 'L3 鄉村禮盒',
    'top-house-k1-creme-brulee': 'K1 烤布蕾',
    'top-house-k2-pistachio-marble': 'K2 開心果雲石',
    'top-house-k3-cheesecake': 'K3 重乳酪(草莓/藍莓)',
    'top-house-k4-light-cheesecake': 'K4 輕乳酪',
    'top-house-k5-belgian-chocolate': 'K5 比利時巧克力',
    'top-house-k6-lemon-cheesecake': 'K6 檸檬老奶奶',
    'top-house-a1-strawberry-marble': 'A1 草莓大理石',
    'top-house-a2-honey-cake': 'A2 蜂蜜蛋糕',
    'top-house-a3-blueberry-angel': 'A3 藍莓天使',
    'top-house-a4-lemon-love': 'A4 檸檬之戀',
    'top-house-a5-classic-chocolate': 'A5 經典巧克力',
    'top-house-a6-left-bank-coffee-roll': 'A6 左岸咖啡捲',
    'top-house-a7-vanilla-napoleon': 'A7 香草拿破崙派',
    'top-house-a7-chocolate-napoleon': 'A7 巧克力拿破崙派',
    'top-house-a8-earl-grey-roll': 'A8 伯爵甜心捲',
    'top-house-a9-mocha-chocolate': 'A9 摩卡巧克力',
    'top-house-a10-violet': 'A10 紫羅蘭',
    'top-house-a11-japanese-layer': 'A11 日式千層',
    'top-house-a12-osmanthus-oolong': 'A12 桂花烏龍甜心'
  };
  const sizeOptions = product => {
    const variants = product.variants && typeof product.variants === 'object' ? product.variants : {};
    const source = Object.keys(variants.sizes || {}).length ? variants.sizes : product.priceOptions;
    return Object.entries(source || {})
      .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > 0);
  };
  const productOriginalPrice = product => Number(product.originalPrice || product.priceOriginal || topHouseOriginalPrices[product.id] || 0);
  const priceMarkup = (product, value) => {
    const amount = Number(value || 0);
    const original = productOriginalPrice(product);
    return original > amount && amount > 0
      ? `<span class="product-detail-original-price">原價 ${money(original)}</span><strong class="product-detail-sale-price">特價 ${money(amount)}</strong>`
      : money(amount);
  };
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

  let orderInfoModal;
  let lastOrderInfoTrigger;

  const closeOrderInfoModal = () => {
    if (!orderInfoModal) return;
    orderInfoModal.hidden = true;
    document.body.classList.remove('product-order-info-open');
    lastOrderInfoTrigger?.focus();
  };

  const ensureOrderInfoModal = () => {
    if (orderInfoModal) return orderInfoModal;
    orderInfoModal = document.createElement('div');
    orderInfoModal.className = 'product-order-info-modal';
    orderInfoModal.hidden = true;
    orderInfoModal.innerHTML = '<div class="product-order-info-backdrop" data-product-order-info-close></div><article class="product-order-info-dialog" role="dialog" aria-modal="true" aria-labelledby="product-order-info-title"><button class="product-order-info-close" type="button" data-product-order-info-close aria-label="關閉訂購資訊">×</button><div class="product-order-info-content"><p class="product-order-info-eyebrow">訂購資訊</p><h2 id="product-order-info-title">請聯絡門市訂購</h2><p class="product-order-info-message">客人自行跟門市聯絡下訂</p><a class="product-order-info-store-link" href="/門市資訊/">前往門市資訊</a></div></article>';
    document.body.appendChild(orderInfoModal);
    orderInfoModal.addEventListener('click', event => {
      if (event.target.closest('[data-product-order-info-close]')) closeOrderInfoModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && orderInfoModal && !orderInfoModal.hidden) closeOrderInfoModal();
    });
    return orderInfoModal;
  };

  const openOrderInfoModal = trigger => {
    const modal = ensureOrderInfoModal();
    lastOrderInfoTrigger = trigger;
    modal.hidden = false;
    document.body.classList.add('product-order-info-open');
    modal.querySelector('.product-order-info-close')?.focus();
  };

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
    const apiTitle = String(product.title || '商品');
    const title = productPage.dataset.productId?.startsWith('top-house-')
      ? (titleElement.textContent.trim() || apiTitle)
      : apiTitle;
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
    updateMeta({ ...product, title });
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
      const displayTitle = topHouseCardTitles[item.id] || item.title || '商品';
      return `<article class="emerald-related-card"><a href="${escapeHtml(href)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(displayTitle)}" loading="lazy"><span>${escapeHtml(formatDate(item.createdAt))}</span><h3>${escapeHtml(displayTitle)}</h3><b aria-hidden="true">▪▪&nbsp; 更多</b></a></article>`;
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
    const purchaseSlot = copy.querySelector('[data-product-purchase-slot]');
    const insertPurchase = element => {
      if (purchaseSlot) {
        purchaseSlot.appendChild(element);
        return;
      }
      const badge = copy.querySelector('[data-product-dietary]');
      if (badge && !badge.hidden) badge.insertAdjacentElement('afterend', element);
      else titleElement.insertAdjacentElement('afterend', element);
    };
    const options = sizeOptions(product);
    let selectedSize = options[0]?.[0] || '';
    const selectedPrice = () => Number(options.find(([size]) => size === selectedSize)?.[1] || product.priceValue || 0);
    const inStock = () => product.published !== false && selectedPrice() > 0 && Number(product.quantity ?? 1) > 0;
    if (selectedPrice() <= 0) {
      const pending = document.createElement('p');
      pending.className = 'product-detail-pending-price';
      pending.textContent = '價格待設定';
      insertPurchase(pending);
      return;
    }
    const section = document.createElement('section');
    section.className = 'product-detail-purchase';
    section.setAttribute('aria-label', '訂購資訊');
    const sizeMarkup = options.length > 1
      ? `<div class="product-detail-size-options"><span class="product-detail-size-options-label">商品尺寸</span><div class="product-detail-size-options-list" role="group" aria-label="選擇商品尺寸">${options.map(([size, value], index) => `<button class="product-detail-size-option${index === 0 ? ' is-selected' : ''}" type="button" data-product-size="${escapeHtml(size)}" aria-pressed="${index === 0 ? 'true' : 'false'}">${escapeHtml(size)}<span>${money(value)}</span></button>`).join('')}</div></div>`
      : '';
    section.innerHTML = `${sizeMarkup}<p class="product-detail-price" data-product-detail-price>${priceMarkup(product, selectedPrice())}</p><div class="cake-product-purchase" data-cake-purchase><div class="cake-quantity-control" aria-label="選擇數量"><button type="button" data-cake-quantity-change="-1"${inStock() ? '' : ' disabled'} aria-label="減少數量">−</button><output data-cake-quantity aria-live="polite">1</output><button type="button" data-cake-quantity-change="1"${inStock() ? '' : ' disabled'} aria-label="增加數量">＋</button></div><button class="product-order-info-button cake-add-cart" type="button" data-product-order-info>訂購資訊</button></div>`;
    insertPurchase(section);

    const updateVariant = () => {
      const available = inStock();
      const priceElement = section.querySelector('[data-product-detail-price]');
      if (priceElement) priceElement.innerHTML = priceMarkup(product, selectedPrice());
      section.querySelectorAll('[data-product-size]').forEach(button => {
        const isSelected = button.dataset.productSize === selectedSize;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      });
      section.querySelectorAll('[data-cake-quantity-change]').forEach(button => { button.disabled = !available; });
    };

    section.querySelectorAll('[data-product-size]').forEach(button => button.addEventListener('click', () => {
      selectedSize = button.dataset.productSize || '';
      updateVariant();
    }));

    section.querySelectorAll('[data-cake-quantity-change]').forEach(button => button.addEventListener('click', () => {
      const output = section.querySelector('[data-cake-quantity]');
      output.textContent = String(Math.max(1, Math.min(99, Number(output.textContent || 1) + Number(button.dataset.cakeQuantityChange || 0))));
    }));
    const orderInfoButton = section.querySelector('[data-product-order-info]');
    orderInfoButton.addEventListener('click', () => openOrderInfoModal(orderInfoButton));
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
