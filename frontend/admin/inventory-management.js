(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => '$' + Number(value || 0).toFixed(2);
  const displaySpec = value => {
    const spec = String(value || '').trim();
    return ['原價', '特價', '不指定', '售價'].includes(spec) ? '' : spec;
  };
  const productUpdateSignalKey = 'sensen-products-updated';
  const productUpdateChannelName = 'sensen-products-updated';
  const api = async (path, options = {}) => { const response = await fetch(path, { ...options, credentials: 'include', headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) } }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || '操作失敗。'); return data; };
  const pageSize = 10;
  const topHouseCategories = [
    '頂家彌月｜波士頓派系列',
    '頂家彌月｜大熊禮盒',
    '頂家彌月｜小熊禮盒',
    '頂家彌月｜圓圓派',
    '頂家彌月｜鄉村乳酪禮盒',
    '頂家彌月｜彌月長條蛋糕',
    '頂家彌月｜搭配單品',
  ];
  const defaultCategories = ['生日蛋糕', '造型蛋糕', '冰淇淋蛋糕', '伴手禮', '飲品 MENU', ...topHouseCategories];
  const liftedThumbnailProductIds = new Set([
    'new-souvenir-image-02',
    'new-souvenir-image-03',
    'new-souvenir-image-04',
    'new-souvenir-image-05',
    'new-souvenir-image-06',
    'new-souvenir-image-07',
    'new-souvenir-image-08',
    'new-souvenir-image-11'
  ]);
  const referenceThumbnailProductIds = new Set([
    'new-birthday-cake-image-01',
    'new-birthday-cake-image-02',
    'new-birthday-cake-image-03',
    'new-birthday-cake-image-04',
    'new-birthday-cake-image-05',
    'new-birthday-cake-image-06',
    'new-birthday-cake-image-07'
  ]);
  const legacyRelativeThumbnailProductIds = new Set([
    ...referenceThumbnailProductIds,
    ...liftedThumbnailProductIds
  ].filter(id => !id.startsWith('rose-salt-')));
  let products = [];
  let currentPage = 1;
  const dialog = $('#inventory-product-dialog');

  const normalizeImagePath = value => String(value || '').trim();
  const uploadProductImages = async files => {
    const uploaded = [];
    for (const [index, file] of files.entries()) {
      const body = new FormData();
      body.append('image', file);
      body.append('folder', 'products');
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `第 ${index + 1} 張商品圖片上傳失敗。`);
      if (!data.image) throw new Error('商品圖片上傳後沒有取得圖片路徑。');
      uploaded.push(data.image);
    }
    return uploaded;
  };

  function clearPendingImagePreviews(form) {
    (form._pendingImagePreviewUrls || []).forEach(url => URL.revokeObjectURL(url));
    form._pendingImagePreviewUrls = [];
  }

  function renderImagePreview(form) {
    const preview = form.querySelector('[data-inventory-image-preview]');
    if (!preview) return;
    clearPendingImagePreviews(form);
    const existingImages = Array.isArray(form._editingImages) ? form._editingImages : [];
    const files = [...(form.elements.imageFiles?.files || [])];
    const pendingUrls = files.map(file => URL.createObjectURL(file));
    form._pendingImagePreviewUrls = pendingUrls;
    preview.innerHTML = existingImages.map((src, index) => `<figure class="mb-0 position-relative text-center"><img src="${escapeHtml(src)}" alt="商品圖片 ${index + 1}" class="img-thumbnail" style="width:120px;height:96px;object-fit:contain;"><button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0" data-remove-product-image="${index}" aria-label="移除第 ${index + 1} 張圖片">×</button><figcaption class="small text-secondary">已儲存${index === 0 ? '（主圖）' : ''}</figcaption></figure>`).join('') + files.map((file, index) => `<figure class="mb-0 text-center"><img src="${pendingUrls[index]}" alt="${escapeHtml(file.name)}" class="img-thumbnail" style="width:120px;height:96px;object-fit:contain;"><figcaption class="small text-secondary text-truncate" style="max-width:120px;">待上傳</figcaption></figure>`).join('');
    preview.querySelectorAll('[data-remove-product-image]').forEach(button => button.addEventListener('click', () => {
      form._editingImages.splice(Number(button.dataset.removeProductImage), 1);
      form.elements.img.value = form._editingImages[0] || '';
      renderImagePreview(form);
    }));
  }

  function addCategory(select) {
    const name = window.prompt('請輸入新的商品分類');
    const categoryName = String(name || '').trim();
    if (!categoryName) return;
    const existing = [...select.options].find(option => option.value === categoryName);
    if (existing) {
      select.value = categoryName;
      return;
    }
    select.add(new Option(categoryName, categoryName));
    select.value = categoryName;
  }

  function productPriceOptions(product) {
    const priceTypes = product?.variants?.priceTypes || {};
    const priceTypeLabels = Object.keys(priceTypes).map(label => String(label).trim());
    const hasUnspecifiedOnly = priceTypeLabels.length === 1 && ['不指定', '售價'].includes(priceTypeLabels[0]);
    const variantSizes = hasUnspecifiedOnly ? {} : (product?.variants?.sizes || {});
    const sizes = { ...variantSizes, ...priceTypes };
    const fallbackSizes = Object.keys(sizes).length ? sizes : product?.priceOptions || {};
    const options = Object.entries(fallbackSizes).filter(([label, value]) => String(label).trim() && Number.isFinite(Number(value)) && Number(value) > 0);
    if (options.length === 1 && ['原價', '特價', '售價'].includes(String(options[0][0]).trim())) {
      return [['不指定', options[0][1]]];
    }
    return options;
  }

  function productPriceSummary(product) {
    const options = productPriceOptions(product);
    const values = Object.fromEntries(options);
    const rawPriceTypes = product?.variants?.priceTypes || {};
    const hasSingleExplicitPriceType = Object.keys(rawPriceTypes).length === 1;
    const originalPrice = Number(values['原價'] ?? product?.originalPrice ?? product?.priceValue ?? 0) || 0;
    const salePrice = Number(values['特價'] ?? product?.priceValue ?? originalPrice) || 0;
    const isTiered = !hasSingleExplicitPriceType && originalPrice > salePrice && salePrice > 0;
    const hasOnlyPriceTypeLabels = options.length > 1 && options.every(([label]) => ['原價', '特價'].includes(String(label).trim()));
    const sourceOptions = !isTiered && hasOnlyPriceTypeLabels
      ? [['不指定', salePrice || originalPrice]]
      : options;
    const rows = [];
    const seen = new Set();
    sourceOptions.forEach(([label, value]) => {
      const normalizedLabel = String(label || '').trim();
      const normalizedValue = Number(value);
      if (!normalizedLabel || !Number.isFinite(normalizedValue) || normalizedValue <= 0 || seen.has(normalizedLabel)) return;
      seen.add(normalizedLabel);
      rows.push([normalizedLabel, normalizedValue]);
    });
    if (!rows.length && !isTiered && salePrice > 0) rows.push(['不指定', salePrice]);
    return {
      originalPrice: isTiered ? originalPrice : Number(rows[0]?.[1] || salePrice || originalPrice || 0),
      salePrice: isTiered ? salePrice : Number(rows[0]?.[1] || salePrice || originalPrice || 0),
      isTiered,
      options: rows,
    };
  }

  function ensurePriceOptionsEditor() {
    const form = $('#inventory-product-form');
    if (!form || form.querySelector('[data-inventory-price-options]')) return form?.querySelector('[data-inventory-price-options]');
    form.noValidate = true;
    const priceInput = form.elements.priceValue;
    const priceColumn = priceInput?.closest('.col-md-4');
    const originalPriceInput = form.elements.originalPrice;
    const originalPriceColumn = originalPriceInput?.closest('.col-md-4');
    const specColumn = form.elements.spec?.closest('.col-md-6');
    const sizeColumn = form.elements.size?.closest('.col-md-6');
    const categoryColumn = form.elements.cat?.closest('.col-md-6');
    if (!priceColumn) return null;
    priceColumn.hidden = true;
    // The visible price is collected from the multi-price rows below. The
    // hidden legacy input must not block the form's native submit event.
    priceInput.required = false;
    if (originalPriceColumn) originalPriceColumn.hidden = true;
    if (originalPriceInput) originalPriceInput.required = false;
    if (specColumn) specColumn.hidden = true;
    if (sizeColumn) sizeColumn.hidden = true;
    const field = document.createElement('div');
    field.className = 'col-12';
    field.innerHTML = '<label class="form-label mb-1">多組售價</label><div class="small text-secondary mb-2">請分別選擇規格／名稱與價格類型（單一價格請選「不指定」；多組價格再選原價或特價），再填寫對應金額；預設價格請勾選「預設」。</div><div data-inventory-price-options></div><button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-inventory-add-price-option>＋新增規格售價</button>';
    (categoryColumn || priceColumn).insertAdjacentElement('afterend', field);
    field.querySelector('[data-inventory-add-price-option]').addEventListener('click', () => addPriceOptionRow());
    return field.querySelector('[data-inventory-price-options]');
  }

  function ensureDefaultPriceOption() {
    const container = ensurePriceOptionsEditor();
    const rows = [...(container?.querySelectorAll('.inventory-price-option') || [])];
    if (rows.length && !rows.some(row => row.querySelector('[data-price-option-default]')?.checked)) {
      rows[0].querySelector('[data-price-option-default]').checked = true;
    }
  }

  function addPriceOptionRow(option = {}, isDefault = false, optionLabels = []) {
    const container = ensurePriceOptionsEditor();
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end mb-2 inventory-price-option';
    const optionLabel = String(option[0] || '').trim();
    const priceType = ['原價', '特價'].includes(optionLabel) ? optionLabel : '';
    const isUnspecified = ['不指定', '售價'].includes(optionLabel);
    const specLabel = priceType || isUnspecified ? '' : optionLabel;
    row.innerHTML = `<div class="col-sm-2"><label class="form-check mb-2"><input class="form-check-input" data-price-option-default type="radio" name="inventoryDefaultPrice" aria-label="設為預設價格"><span class="form-check-label">預設</span></label></div><div class="col-sm-3"><label class="form-label small mb-1">規格／名稱<input class="form-control" data-price-option-spec type="text"></label></div><div class="col-sm-3"><label class="form-label small mb-1">價格類型<select class="form-select" data-price-option-type><option value="">不指定</option><option value="原價">原價</option><option value="特價">特價</option></select></label></div><div class="col-sm-3"><label class="form-label small mb-1">售價<input class="form-control" data-price-option-value type="number" min="0.01" step="0.01" placeholder="例如：1080"></label></div><div class="col-sm-1"><button type="button" class="btn btn-outline-danger w-100" data-remove-price-option aria-label="移除這組售價">移除</button></div>`;
    row.querySelector('[data-price-option-spec]').value = specLabel;
    row.querySelector('[data-price-option-type]').value = priceType;
    row.querySelector('[data-price-option-value]').value = option[1] ?? '';
    row.querySelector('[data-price-option-default]').checked = isDefault;
    row.querySelector('[data-remove-price-option]').addEventListener('click', () => { row.remove(); ensureDefaultPriceOption(); });
    container.append(row);
    ensureDefaultPriceOption();
  }

  function collectPriceOptions() {
    const container = ensurePriceOptionsEditor();
    const sizeOptions = {};
    const priceTypes = {};
    const rows = [...(container?.querySelectorAll('.inventory-price-option') || [])];
    let defaultSize = '';
    for (const row of rows) {
      const spec = row.querySelector('[data-price-option-spec]').value.trim();
      const priceType = row.querySelector('[data-price-option-type]').value.trim();
      const value = Number(row.querySelector('[data-price-option-value]').value);
      if (!spec && !priceType && !row.querySelector('[data-price-option-value]').value) continue;
      if (!Number.isFinite(value) || value <= 0) throw new Error('每組售價都需要填寫有效價格；沒有規格時請維持價格類型「不指定」。');
      const normalizedValue = Number(value.toFixed(2));
      if (spec) sizeOptions[spec] = normalizedValue;
      else if (priceType) priceTypes[priceType] = normalizedValue;
      else priceTypes['不指定'] = normalizedValue;
      if (row.querySelector('[data-price-option-default]')?.checked) defaultSize = spec || priceType || '不指定';
    }
    if (!Object.keys(sizeOptions).length && !Object.keys(priceTypes).length) throw new Error('請至少新增一組規格售價。');
    if (defaultSize === '' && (Object.keys(sizeOptions).length || Object.keys(priceTypes).length)) throw new Error('請勾選一組預設價格。');
    return { sizeOptions, priceTypes, defaultSize };
  }

  function thumbnailSettings(product) {
    const source = product?.thumbnail && typeof product.thumbnail === 'object' ? product.thumbnail : {};
    const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
    const normalize = value => ({
      offsetX: Math.max(-1000, Math.min(1000, Math.round(number(value?.offsetX, number(source.offsetX, 0))))),
      offsetY: Math.max(-1000, Math.min(1000, Math.round(number(value?.offsetY, number(source.offsetY, 0))))),
      scale: Math.max(25, Math.min(300, number(value?.scale, number(source.scale, 100)))),
    });
    const desktop = normalize(source.desktop && typeof source.desktop === 'object' ? source.desktop : source);
    const mobile = normalize(source.mobile && typeof source.mobile === 'object' ? source.mobile : desktop);
    return { ...desktop, desktop, mobile };
  }

  function thumbnailImagePath(value) {
    return String(value || '').trim().replace(/^\/assets\/images\//i, '/images/');
  }

  function notifyProductUpdate(productId) {
    const message = { productId: String(productId || ''), updatedAt: Date.now() };
    try { window.localStorage.setItem(productUpdateSignalKey, JSON.stringify(message)); } catch (error) { /* storage may be disabled */ }
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(productUpdateChannelName);
      channel.postMessage(message);
      channel.close();
    }
  }

  function thumbnailPresetOffsetY(product, settings) {
    // These offsets are the legacy framing rules used by the public product
    // cards. Keep the editor preview on the same visual baseline on every device.
    if (product?.id === 'new-birthday-cake-image-03') return 0;
    if (legacyRelativeThumbnailProductIds.has(product?.id)) {
      return -120;
    }
    if (product?.cat === '伴手禮' && settings.offsetX === 0 && settings.offsetY === 0 && settings.scale === 100) return -8;
    return 0;
  }

  function ensureThumbnailEditor() {
    const form = $('#inventory-product-form');
    if (!form) return null;
    const existing = form.querySelector('[data-inventory-thumbnail-editor]');
    if (existing) return existing;
    const imageColumn = form.elements.img?.closest('.col-12');
    if (!imageColumn) return null;
    const field = document.createElement('div');
    field.className = 'col-12';
    field.dataset.inventoryThumbnailEditor = '';
    field.innerHTML = '<label class="form-label mb-1">縮圖顯示區塊</label><div class="small text-secondary mb-2">電腦與手機可分別設定水平位置、垂直位置與縮放比例；未設定手機參數時會沿用電腦版。</div><div class="row g-3"><div class="col-md-6"><div class="border rounded p-3"><strong class="d-block mb-2">電腦版</strong><div class="row g-2"><div class="col-4"><label class="form-label small mb-1">水平（px）<input class="form-control" name="thumbnailDesktopOffsetX" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-4"><label class="form-label small mb-1">垂直（px）<input class="form-control" name="thumbnailDesktopOffsetY" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-4"><label class="form-label small mb-1">縮放（%）<input class="form-control" name="thumbnailDesktopScale" type="number" min="25" max="300" step="1" value="100"></label></div></div><div class="inventory-thumbnail-preview mt-3" data-thumbnail-preview="desktop" style="width:100%;max-width:220px;aspect-ratio:1 / 1;margin:auto;padding:clamp(16px, 2vw, 28px);border:1px solid #e5e7eb;border-radius:14px;background:#f7f7f7;display:grid;align-items:center;box-sizing:border-box;overflow:hidden"><img data-thumbnail-preview-image alt="電腦版縮圖預覽" style="display:block;width:100%;height:auto;max-height:100%;object-fit:contain;transform-origin:center bottom;transition:transform .15s ease"></div></div></div><div class="col-md-6"><div class="border rounded p-3"><strong class="d-block mb-2">手機版</strong><div class="row g-2"><div class="col-4"><label class="form-label small mb-1">水平（px）<input class="form-control" name="thumbnailMobileOffsetX" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-4"><label class="form-label small mb-1">垂直（px）<input class="form-control" name="thumbnailMobileOffsetY" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-4"><label class="form-label small mb-1">縮放（%）<input class="form-control" name="thumbnailMobileScale" type="number" min="25" max="300" step="1" value="100"></label></div></div><div class="inventory-thumbnail-preview mt-3" data-thumbnail-preview="mobile" style="width:100%;max-width:180px;aspect-ratio:1 / 1;margin:auto;padding:clamp(16px, 2vw, 28px);border:1px solid #e5e7eb;border-radius:14px;background:#f7f7f7;display:grid;align-items:center;box-sizing:border-box;overflow:hidden"><img data-thumbnail-preview-image alt="手機版縮圖預覽" style="display:block;width:100%;height:auto;max-height:100%;object-fit:contain;transform-origin:center bottom;transition:transform .15s ease"></div></div></div></div>';
    imageColumn.insertAdjacentElement('afterend', field);
    const update = () => {
      const settings = collectThumbnailSettings();
      ['desktop', 'mobile'].forEach(device => {
        const image = field.querySelector(`[data-thumbnail-preview="${device}"] [data-thumbnail-preview-image]`);
        const deviceSettings = settings[device];
        const presetOffsetY = thumbnailPresetOffsetY(field._thumbnailProduct, deviceSettings);
        if (image) image.style.transform = `translate(${deviceSettings.offsetX}px, ${deviceSettings.offsetY + presetOffsetY}px) scale(${deviceSettings.scale / 100})`;
      });
    };
    field._thumbnailProduct = null;
    field._updateThumbnailPreview = update;
    [form.elements.thumbnailDesktopOffsetX, form.elements.thumbnailDesktopOffsetY, form.elements.thumbnailDesktopScale, form.elements.thumbnailMobileOffsetX, form.elements.thumbnailMobileOffsetY, form.elements.thumbnailMobileScale, form.elements.img].forEach(input => input?.addEventListener('input', () => {
      const images = field.querySelectorAll('[data-thumbnail-preview-image]');
      if (input === form.elements.img) images.forEach(image => { image.src = thumbnailImagePath(input.value); });
      update();
    }));
    update();
    return field;
  }

  function collectThumbnailSettings() {
    const form = $('#inventory-product-form');
    ensureThumbnailEditor();
    const read = prefix => ({
      offsetX: form.elements[`${prefix}OffsetX`]?.value,
      offsetY: form.elements[`${prefix}OffsetY`]?.value,
      scale: form.elements[`${prefix}Scale`]?.value,
    });
    return thumbnailSettings({ thumbnail: {
      desktop: read('thumbnailDesktop'),
      mobile: read('thumbnailMobile'),
    }});
  }

  function ensureDietaryEditor() {
    const form = $('#inventory-product-form');
    if (!form) return null;
    const existing = form.querySelector('input[name="dietary"]');
    if (existing) return existing;
    const otherColumn = form.elements.other?.closest('.col-12');
    if (!otherColumn) return null;
    const field = document.createElement('div');
    field.className = 'col-12';
    field.innerHTML = '<label class="form-check"><input class="form-check-input" name="dietary" type="checkbox" value="蛋奶素"><span class="form-check-label">蛋奶素</span></label>';
    otherColumn.insertAdjacentElement('afterend', field);
    return field.querySelector('[name="dietary"]');
  }

  function ensureFlavorEditor() {
    const form = $('#inventory-product-form');
    if (!form) return null;
    const existing = form.querySelector('[data-inventory-flavor-editor]');
    if (existing) return existing;
    const anchor = form.elements.spec?.closest('.col-md-6') || form.elements.other?.closest('.col-12');
    if (!anchor) return null;
    const field = document.createElement('div');
    field.className = 'col-12';
    field.dataset.inventoryFlavorEditor = '';
    field.innerHTML = '<div class="border rounded p-3 bg-light-subtle"><label class="form-label mb-1">口味選項</label><div class="small text-secondary mb-2">需要在前台顯示口味按鈕時使用；請以逗號、頓號或換行分隔，例如：烏豆沙、芋頭、抹茶、棗泥。</div><div class="row g-2"><div class="col-md-8"><input class="form-control" name="flavorOptions" placeholder="烏豆沙、芋頭、抹茶、棗泥"></div><div class="col-md-4"><label class="form-label small mb-1">任選數量<input class="form-control" name="flavorCount" type="number" min="1" step="1" placeholder="例如：3"></label></div></div></div>';
    anchor.insertAdjacentElement('afterend', field);
    return field;
  }

  function collectFlavorSettings() {
    const form = $('#inventory-product-form');
    ensureFlavorEditor();
    const flavors = [...new Set(String(form.elements.flavorOptions?.value || '')
      .split(/[,，、/\n]+/)
      .map(value => value.trim())
      .filter(Boolean))];
    const count = Number(form.elements.flavorCount?.value || 0);
    if (!flavors.length) return { flavors: [], flavorCount: 0 };
    if (!Number.isInteger(count) || count < 1 || count > flavors.length) {
      throw new Error(`任選數量需介於 1 至 ${flavors.length} 種之間。`);
    }
    return { flavors, flavorCount: count };
  }

  function renderFilters() {
    const category = $('#inventory-category-filter');
    const current = category.value;
    const categories = [...new Set([...defaultCategories, ...products.map(item => String(item.cat || '').trim()).filter(Boolean)])];
    category.innerHTML = '<option value="">全部分類</option>' + categories.map(item => '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>').join('');
    category.value = current;
    const productCategory = $('#inventory-product-form')?.elements.cat;
    if (productCategory) {
      const selected = productCategory.value;
      if (productCategory.tagName !== 'SELECT') {
        const select = document.createElement('select');
        select.className = 'form-select';
        select.name = 'cat';
        select.required = true;
        productCategory.replaceWith(select);
      }
      const select = $('#inventory-product-form').elements.cat;
      select.innerHTML = '<option value="">選擇商品分類</option>' + categories.map(item => '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>').join('');
      select.value = selected;
      const label = select.closest('label');
      if (label && !label.querySelector('[data-inventory-add-category]')) {
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'btn btn-sm btn-outline-secondary mt-2';
        addButton.dataset.inventoryAddCategory = '';
        addButton.textContent = '新增分類';
        addButton.addEventListener('click', () => addCategory(select));
        label.append(addButton);
      }
    }
  }

  function render() {
    const query = $('#inventory-product-search').value.trim().toLowerCase();
    const category = $('#inventory-category-filter').value;
    const visibility = $('#inventory-visibility-filter').value;
    const filtered = products.filter(item => (!query || [item.title, item.sku, item.spec, item.cat, ...productPriceOptions(item).flat()].join(' ').toLowerCase().includes(query)) && (!category || item.cat === category) && (!visibility || (visibility === 'published' ? item.published !== false : item.published === false)));
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const start = (currentPage - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);
    $('[data-sensen-table="inventory"]').innerHTML = visible.length ? visible.map(item => { const summary = productPriceSummary(item); const priceMarkup = summary.isTiered ? `<div><span class="text-secondary">原價</span> ${money(summary.originalPrice)}</div><div><span class="text-danger">特價</span> ${money(summary.salePrice)} <small class="text-secondary">預設</small></div>${summary.options.filter(([label]) => !['原價', '特價'].includes(label)).map(([label, value]) => `<small class="d-block text-secondary">${escapeHtml(label)}：${money(value)}</small>`).join('')}` : summary.options.map(([label, value]) => `<div><span class="text-secondary">${escapeHtml(label)}</span> ${money(value)}</div>`).join(''); return `<tr class="align-middle"><td><div class="d-flex align-items-center gap-3"><img src="${escapeHtml(item.img || '/images/admin/product-1.webp')}" alt="${escapeHtml(item.title)}" class="avatar avatar-md rounded object-fit-cover" style="width:48px;height:48px;" onerror="this.onerror=null;this.src='/images/admin/product-1.webp';"><div><strong>${escapeHtml(item.title)}</strong><small class="d-block text-secondary">${escapeHtml(item.day || '')} 天製作</small></div></div></td><td>${escapeHtml(item.sku || item.id)}</td><td>${escapeHtml(item.cat || '')}</td><td>${escapeHtml(displaySpec(item.spec) || '—')}</td><td>${priceMarkup}</td><td class="${Number(item.quantity || 0) < 10 ? 'text-danger fw-bold' : ''}">${Number(item.quantity || 0)}</td><td><span class="badge ${item.published === false ? 'text-bg-secondary' : 'text-bg-success'}">${item.published === false ? '下架' : '上架'}</span></td><td><button type="button" class="btn btn-sm btn-outline-primary me-1" data-inventory-edit="${escapeHtml(item.id)}">編輯</button><button type="button" class="btn btn-sm btn-outline-secondary me-1" data-inventory-toggle="${escapeHtml(item.id)}">${item.published === false ? '上架' : '下架'}</button><button type="button" class="btn btn-sm btn-outline-danger" data-inventory-delete="${escapeHtml(item.id)}">刪除</button></td></tr>`; }).join('') : '<tr><td colspan="8" class="text-secondary py-4">沒有符合條件的商品。</td></tr>';
    const label = $('[data-inventory-page-label]');
    if (label) label.textContent = filtered.length ? `商品 ${start + 1}-${Math.min(start + pageSize, filtered.length)}／共 ${filtered.length} 項` : '商品 0-0／共 0 項';
    const pagination = $('[data-inventory-pagination]');
    if (pagination) {
      pagination.innerHTML = [`<li class="page-item ${currentPage <= 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-inventory-page="prev" aria-label="上一頁">上一頁</a></li>`, ...Array.from({ length: totalPages }, (_, index) => { const page = index + 1; return `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-inventory-page="${page}" aria-label="第 ${page} 頁">${page}</a></li>`; }), `<li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-inventory-page="next" aria-label="下一頁">下一頁</a></li>`].join('');
      pagination.querySelectorAll('[data-inventory-page]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); if (button.closest('.page-item').classList.contains('disabled')) return; const target = button.dataset.inventoryPage; currentPage = target === 'next' ? currentPage + 1 : target === 'prev' ? currentPage - 1 : Number(target); render(); }));
    }
    $$('[data-inventory-edit]').forEach(button => button.addEventListener('click', () => open(products.find(item => item.id === button.dataset.inventoryEdit))));
    $$('[data-inventory-toggle]').forEach(button => button.addEventListener('click', async () => { const item = products.find(product => product.id === button.dataset.inventoryToggle); if (!item) return; await api('/api/admin/products', { method: 'PATCH', body: JSON.stringify({ id: item.id, published: item.published === false }) }); notifyProductUpdate(item.id); await load(); }));
    $$('[data-inventory-delete]').forEach(button => button.addEventListener('click', async () => { const item = products.find(product => product.id === button.dataset.inventoryDelete); if (!item || !window.confirm(`確定刪除「${item.title}」？`)) return; await api('/api/admin/products', { method: 'DELETE', body: JSON.stringify({ id: item.id }) }); notifyProductUpdate(item.id); await load(); }));
  }

  function open(product = null) {
    const form = $('#inventory-product-form');
    const thumbnailEditor = ensureThumbnailEditor();
    const dietaryInput = ensureDietaryEditor();
    const flavorEditor = ensureFlavorEditor();
    form.reset();
    const priceOptions = ensurePriceOptionsEditor();
    if (priceOptions) priceOptions.innerHTML = '';
    $('#inventory-dialog-title').textContent = product ? '編輯商品' : '新增商品';
    form.elements.id.value = product?.id || '';
    form.elements.title.value = product?.title || '';
    form.elements.sku.value = product?.sku || '';
    form.elements.cat.value = product?.cat || '';
    form.elements.spec.value = product?.spec || '';
    form.elements.size.value = product?.size || product?.spec || '';
    form.elements.storage.value = product?.storage || '';
    form.elements.other.value = product?.other || '';
    const summary = productPriceSummary(product);
    if (form.elements.originalPrice) form.elements.originalPrice.value = summary.originalPrice || '';
    form.elements.priceValue.value = summary.salePrice || '';
    form.elements.quantity.value = product?.quantity ?? 0;
    form.elements.day.value = product?.day || 5;
    form.elements.img.value = product?.img || '';
    form._editingImages = [...new Set((Array.isArray(product?.images) && product.images.length ? product.images : [product?.img]).map(normalizeImagePath).filter(Boolean))];
    renderImagePreview(form);
    form.elements.desc.value = product?.desc || '';
    form._editingVariants = product?.variants && typeof product.variants === 'object' ? { ...product.variants } : {};
    const flavors = Array.isArray(form._editingVariants.flavors) ? form._editingVariants.flavors.map(value => String(value || '').trim()).filter(Boolean) : [];
    if (flavorEditor) {
      form.elements.flavorOptions.value = flavors.join('、');
      form.elements.flavorCount.value = flavors.length ? Number(form._editingVariants.flavorCount || 1) : '';
    }
    const thumbnail = thumbnailSettings(product);
    ['desktop', 'mobile'].forEach(device => {
      const settings = thumbnail[device];
      if (form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}OffsetX`]) form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}OffsetX`].value = settings.offsetX;
      if (form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}OffsetY`]) form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}OffsetY`].value = settings.offsetY;
      if (form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}Scale`]) form.elements[`thumbnail${device[0].toUpperCase()}${device.slice(1)}Scale`].value = settings.scale;
    });
    if (thumbnailEditor) {
      thumbnailEditor._thumbnailProduct = product || null;
      thumbnailEditor.querySelectorAll('[data-thumbnail-preview-image]').forEach(image => { image.src = thumbnailImagePath(product?.img || form.elements.img.value); });
      thumbnailEditor._updateThumbnailPreview?.();
    }
    form.elements.published.checked = product?.published !== false;
    form.elements.newArrival.checked = product ? product.newArrival === true : true;
    if (dietaryInput) dietaryInput.checked = ['蛋奶素', '奶蛋素'].includes(String(product?.dietary || '').trim());
    const defaultSize = String(product?.variants?.defaultPriceType || product?.variants?.defaultSize || '').trim() || summary.options.find(([, value]) => Number(value) === Number(summary.salePrice))?.[0] || summary.options[0]?.[0] || '';
    const priceRows = product
      ? summary.options.length
        ? summary.options
        : summary.isTiered
          ? [['原價', summary.originalPrice], ['特價', summary.salePrice]]
          : [['不指定', summary.salePrice]]
      : [['不指定', '']];
    const optionLabels = [...new Set([...summary.options.map(([label]) => label), ...(summary.isTiered || !product ? ['原價', '特價'] : [])])];
    priceRows.forEach(option => addPriceOptionRow(option, option[0] === defaultSize || (!defaultSize && option[0] === '原價'), optionLabels));
    $('#inventory-product-message').textContent = '';
    dialog.showModal();
  }

  async function load() { const data = await api('/api/admin/products'); products = data.products || []; renderFilters(); render(); }
  $('#inventory-product-search').addEventListener('input', () => { currentPage = 1; render(); }); $('#inventory-category-filter').addEventListener('change', () => { currentPage = 1; render(); }); $('#inventory-visibility-filter').addEventListener('change', () => { currentPage = 1; render(); });
  ensureThumbnailEditor();
  ensureDietaryEditor();
  ensureFlavorEditor();
  $('#inventory-product-form').elements.imageFiles?.addEventListener('change', () => renderImagePreview($('#inventory-product-form')));
  $('#inventory-product-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const message = $('#inventory-product-message');
    const dietaryInput = form.querySelector('input[name="dietary"]') || ensureDietaryEditor();
    const dietary = dietaryInput?.checked === true ? '蛋奶素' : '';
    const data = Object.fromEntries(new FormData(form));
    const files = [...(form.elements.imageFiles?.files || [])];
    button.disabled = true;
    button.textContent = '儲存中…';
    message.textContent = '';
    message.className = 'small';
    try {
      const { sizeOptions, priceTypes, defaultSize } = collectPriceOptions();
      const flavorSettings = collectFlavorSettings();
      const variants = { ...(form._editingVariants || {}), sizes: sizeOptions, defaultSize };
      if (Object.keys(priceTypes).length) {
        variants.priceTypes = priceTypes;
        variants.defaultPriceType = priceTypes[defaultSize] != null ? defaultSize : Object.keys(priceTypes)[0] || '';
      } else {
        delete variants.priceTypes;
        delete variants.defaultPriceType;
      }
      if (flavorSettings.flavors.length) {
        variants.flavors = flavorSettings.flavors;
        variants.flavorCount = flavorSettings.flavorCount;
      } else {
        delete variants.flavors;
        delete variants.flavorCount;
      }
      data.priceValue = Number(priceTypes['特價'] ?? sizeOptions[defaultSize] ?? priceTypes['原價'] ?? Object.values(sizeOptions)[0] ?? Object.values(priceTypes)[0]);
      data.originalPrice = Number(priceTypes['原價'] ?? data.originalPrice ?? data.priceValue);
      data.spec = Object.keys(sizeOptions).join('、');
      data.size = data.spec;
      let images = [...new Set((form._editingImages || []).map(normalizeImagePath).filter(Boolean))];
      if (data.img && data.img !== images[0]) images = [normalizeImagePath(data.img), ...images.filter(image => image !== normalizeImagePath(data.img))];
      if (files.length) {
        message.textContent = `正在上傳 ${files.length} 張商品圖片…`;
        images = [...images, ...(await uploadProductImages(files))];
      }
      if (!images.length) throw new Error('請至少提供一張商品圖片。');
      data.img = images[0];
      delete data.imageFiles;
      const result = await api('/api/admin/products', {
        method: data.id ? 'PATCH' : 'POST',
        body: JSON.stringify({
          ...data,
          images,
          priceValue: Number(data.priceValue),
          quantity: Number(data.quantity),
          variants,
          thumbnail: collectThumbnailSettings(),
          published: form.elements.published.checked,
          newArrival: form.elements.newArrival.checked,
          dietary,
        }),
      });
      if (String(result.product?.dietary || '') !== dietary) {
        throw new Error('蛋奶素設定未成功儲存，請重新整理頁面後再試。');
      }
      notifyProductUpdate(result.product?.id || data.id);
      clearPendingImagePreviews(form);
      dialog.close();
      await load();
    } catch (error) {
      message.textContent = error.message;
      message.className = 'text-danger small';
    } finally {
      button.disabled = false;
      button.textContent = '儲存商品';
    }
  });
  const loadProducts = () => load().catch(error => { const status = $('[data-inventory-excel-status]'); if (status) status.textContent = error.message; const table = $('[data-sensen-table="inventory"]'); if (table) table.innerHTML = '<tr><td colspan="8" class="text-danger py-4">商品資料載入失敗，請稍後再試。</td></tr>'; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadProducts, { once: true }); else loadProducts();
})();
