(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => '$' + Number(value || 0).toFixed(2);
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
  let products = [];
  let currentPage = 1;
  const dialog = $('#inventory-product-dialog');

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
    const variantSizes = product?.variants?.sizes || {};
    const sizes = Object.keys(variantSizes).length ? variantSizes : product?.priceOptions || {};
    return Object.entries(sizes).filter(([label, value]) => String(label).trim() && Number.isFinite(Number(value)) && Number(value) > 0);
  }

  function ensurePriceOptionsEditor() {
    const form = $('#inventory-product-form');
    if (!form || form.querySelector('[data-inventory-price-options]')) return form?.querySelector('[data-inventory-price-options]');
    const priceInput = form.elements.priceValue;
    const priceColumn = priceInput?.closest('.col-md-4');
    const specColumn = form.elements.spec?.closest('.col-md-6');
    const sizeColumn = form.elements.size?.closest('.col-md-6');
    const categoryColumn = form.elements.cat?.closest('.col-md-6');
    if (!priceColumn) return null;
    priceColumn.hidden = true;
    if (specColumn) specColumn.hidden = true;
    if (sizeColumn) sizeColumn.hidden = true;
    const field = document.createElement('div');
    field.className = 'col-12';
    field.innerHTML = '<label class="form-label mb-1">多組售價</label><div class="small text-secondary mb-2">以規格／名稱搭配售價設定，例如：6 吋 $1080、8 吋 $1580。</div><div data-inventory-price-options></div><button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-inventory-add-price-option>＋新增規格售價</button>';
    (categoryColumn || priceColumn).insertAdjacentElement('afterend', field);
    field.querySelector('[data-inventory-add-price-option]').addEventListener('click', () => addPriceOptionRow());
    return field.querySelector('[data-inventory-price-options]');
  }

  function addPriceOptionRow(option = {}) {
    const container = ensurePriceOptionsEditor();
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end mb-2 inventory-price-option';
    row.innerHTML = `<div class="col-sm-5"><label class="form-label small mb-1">規格／名稱<input class="form-control" data-price-option-label placeholder="例如：6 吋"></label></div><div class="col-sm-5"><label class="form-label small mb-1">售價<input class="form-control" data-price-option-value type="number" min="0.01" step="0.01" placeholder="例如：1080"></label></div><div class="col-sm-2"><button type="button" class="btn btn-outline-danger w-100" data-remove-price-option aria-label="移除這組售價">移除</button></div>`;
    row.querySelector('[data-price-option-label]').value = option[0] || '';
    row.querySelector('[data-price-option-value]').value = option[1] ?? '';
    row.querySelector('[data-remove-price-option]').addEventListener('click', () => row.remove());
    container.append(row);
  }

  function collectPriceOptions() {
    const container = ensurePriceOptionsEditor();
    const sizes = {};
    for (const row of container?.querySelectorAll('.inventory-price-option') || []) {
      const label = row.querySelector('[data-price-option-label]').value.trim();
      const value = Number(row.querySelector('[data-price-option-value]').value);
      if (!label && !row.querySelector('[data-price-option-value]').value) continue;
      if (!label || !Number.isFinite(value) || value <= 0) throw new Error('每組規格售價都需要填寫名稱與有效價格。');
      if (sizes[label]) throw new Error(`規格「${label}」不可重複。`);
      sizes[label] = Number(value.toFixed(2));
    }
    return sizes;
  }

  function thumbnailSettings(product) {
    const source = product?.thumbnail && typeof product.thumbnail === 'object' ? product.thumbnail : {};
    const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
    return {
      offsetX: Math.max(-1000, Math.min(1000, Math.round(number(source.offsetX, 0)))),
      offsetY: Math.max(-1000, Math.min(1000, Math.round(number(source.offsetY, 0)))),
      scale: Math.max(25, Math.min(300, number(source.scale, 100))),
    };
  }

  function thumbnailImagePath(value) {
    return String(value || '').trim().replace(/^\/assets\/images\//i, '/images/');
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
    field.innerHTML = '<label class="form-label mb-1">縮圖顯示區塊</label><div class="small text-secondary mb-2">可用正負像素調整圖片位置，縮放比例以百分比設定。</div><div class="row g-2"><div class="col-sm-4"><label class="form-label small mb-1">水平位置（px）<input class="form-control" name="thumbnailOffsetX" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-sm-4"><label class="form-label small mb-1">垂直位置（px）<input class="form-control" name="thumbnailOffsetY" type="number" min="-1000" max="1000" step="1" value="0"></label></div><div class="col-sm-4"><label class="form-label small mb-1">縮放比例（%）<input class="form-control" name="thumbnailScale" type="number" min="25" max="300" step="1" value="100"></label></div></div><div class="inventory-thumbnail-preview mt-3" data-thumbnail-preview style="height:220px;max-width:360px;border:1px solid #e5e7eb;border-radius:10px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;overflow:hidden"><img data-thumbnail-preview-image alt="縮圖預覽" style="width:100%;height:100%;object-fit:contain;transform-origin:center;transition:transform .15s ease"></div>';
    imageColumn.insertAdjacentElement('afterend', field);
    const update = () => {
      const settings = thumbnailSettings({ thumbnail: {
        offsetX: form.elements.thumbnailOffsetX.value,
        offsetY: form.elements.thumbnailOffsetY.value,
        scale: form.elements.thumbnailScale.value,
      }});
      const image = field.querySelector('[data-thumbnail-preview-image]');
      image.style.transform = `translate(${settings.offsetX}px, ${settings.offsetY}px) scale(${settings.scale / 100})`;
    };
    [form.elements.thumbnailOffsetX, form.elements.thumbnailOffsetY, form.elements.thumbnailScale, form.elements.img].forEach(input => input?.addEventListener('input', () => {
      const image = field.querySelector('[data-thumbnail-preview-image]');
      if (input === form.elements.img) image.src = thumbnailImagePath(input.value);
      update();
    }));
    update();
    return field;
  }

  function collectThumbnailSettings() {
    const form = $('#inventory-product-form');
    ensureThumbnailEditor();
    return thumbnailSettings({ thumbnail: {
      offsetX: form.elements.thumbnailOffsetX?.value,
      offsetY: form.elements.thumbnailOffsetY?.value,
      scale: form.elements.thumbnailScale?.value,
    }});
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
    $('[data-sensen-table="inventory"]').innerHTML = visible.length ? visible.map(item => { const options = productPriceOptions(item); const priceMarkup = options.length ? `<div>${money(item.priceValue)} <small class="text-secondary">預設</small></div>${options.map(([label, value]) => `<small class="d-block text-secondary">${escapeHtml(label)}：${money(value)}</small>`).join('')}` : money(item.priceValue); return `<tr class="align-middle"><td><div class="d-flex align-items-center gap-3"><img src="${escapeHtml(item.img || '/images/admin/product-1.webp')}" alt="${escapeHtml(item.title)}" class="avatar avatar-md rounded object-fit-cover" style="width:48px;height:48px;" onerror="this.onerror=null;this.src='/images/admin/product-1.webp';"><div><strong>${escapeHtml(item.title)}</strong><small class="d-block text-secondary">${escapeHtml(item.day || '')} 天製作</small></div></div></td><td>${escapeHtml(item.sku || item.id)}</td><td>${escapeHtml(item.cat || '')}</td><td>${escapeHtml(item.spec || '—')}</td><td>${priceMarkup}</td><td class="${Number(item.quantity || 0) < 10 ? 'text-danger fw-bold' : ''}">${Number(item.quantity || 0)}</td><td><span class="badge ${item.published === false ? 'text-bg-secondary' : 'text-bg-success'}">${item.published === false ? '下架' : '上架'}</span></td><td><button type="button" class="btn btn-sm btn-outline-primary me-1" data-inventory-edit="${escapeHtml(item.id)}">編輯</button><button type="button" class="btn btn-sm btn-outline-secondary me-1" data-inventory-toggle="${escapeHtml(item.id)}">${item.published === false ? '上架' : '下架'}</button><button type="button" class="btn btn-sm btn-outline-danger" data-inventory-delete="${escapeHtml(item.id)}">刪除</button></td></tr>`; }).join('') : '<tr><td colspan="8" class="text-secondary py-4">沒有符合條件的商品。</td></tr>';
    const label = $('[data-inventory-page-label]');
    if (label) label.textContent = filtered.length ? `商品 ${start + 1}-${Math.min(start + pageSize, filtered.length)}／共 ${filtered.length} 項` : '商品 0-0／共 0 項';
    const pagination = $('[data-inventory-pagination]');
    if (pagination) {
      pagination.innerHTML = [`<li class="page-item ${currentPage <= 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-inventory-page="prev" aria-label="上一頁">上一頁</a></li>`, ...Array.from({ length: totalPages }, (_, index) => { const page = index + 1; return `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-inventory-page="${page}" aria-label="第 ${page} 頁">${page}</a></li>`; }), `<li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-inventory-page="next" aria-label="下一頁">下一頁</a></li>`].join('');
      pagination.querySelectorAll('[data-inventory-page]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); if (button.closest('.page-item').classList.contains('disabled')) return; const target = button.dataset.inventoryPage; currentPage = target === 'next' ? currentPage + 1 : target === 'prev' ? currentPage - 1 : Number(target); render(); }));
    }
    $$('[data-inventory-edit]').forEach(button => button.addEventListener('click', () => open(products.find(item => item.id === button.dataset.inventoryEdit))));
    $$('[data-inventory-toggle]').forEach(button => button.addEventListener('click', async () => { const item = products.find(product => product.id === button.dataset.inventoryToggle); if (!item) return; await api('/api/admin/products', { method: 'PATCH', body: JSON.stringify({ id: item.id, published: item.published === false }) }); await load(); }));
    $$('[data-inventory-delete]').forEach(button => button.addEventListener('click', async () => { const item = products.find(product => product.id === button.dataset.inventoryDelete); if (!item || !window.confirm(`確定刪除「${item.title}」？`)) return; await api('/api/admin/products', { method: 'DELETE', body: JSON.stringify({ id: item.id }) }); await load(); }));
  }

  function open(product = null) {
    const form = $('#inventory-product-form');
    const thumbnailEditor = ensureThumbnailEditor();
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
    form.elements.priceValue.value = product?.priceValue ?? '';
    form.elements.quantity.value = product?.quantity ?? 0;
    form.elements.day.value = product?.day || 5;
    form.elements.img.value = product?.img || '';
    form.elements.desc.value = product?.desc || '';
    const thumbnail = thumbnailSettings(product);
    if (form.elements.thumbnailOffsetX) form.elements.thumbnailOffsetX.value = thumbnail.offsetX;
    if (form.elements.thumbnailOffsetY) form.elements.thumbnailOffsetY.value = thumbnail.offsetY;
    if (form.elements.thumbnailScale) form.elements.thumbnailScale.value = thumbnail.scale;
    if (thumbnailEditor) {
      thumbnailEditor.querySelector('[data-thumbnail-preview-image]').src = thumbnailImagePath(product?.img || form.elements.img.value);
      thumbnailEditor.querySelector('[data-thumbnail-preview-image]').style.transform = `translate(${thumbnail.offsetX}px, ${thumbnail.offsetY}px) scale(${thumbnail.scale / 100})`;
    }
    form.elements.published.checked = product?.published !== false;
    form.elements.newArrival.checked = product ? product.newArrival === true : true;
    const options = productPriceOptions(product);
    (options.length ? options : product ? [[product.spec || product.size || '預設', product.priceValue]] : [[]]).forEach(option => addPriceOptionRow(option));
    $('#inventory-product-message').textContent = '';
    dialog.showModal();
  }

  async function load() { const data = await api('/api/admin/products'); products = data.products || []; renderFilters(); render(); }
  $('#inventory-product-search').addEventListener('input', () => { currentPage = 1; render(); }); $('#inventory-category-filter').addEventListener('change', () => { currentPage = 1; render(); }); $('#inventory-visibility-filter').addEventListener('change', () => { currentPage = 1; render(); });
  ensureThumbnailEditor();
  $('#inventory-product-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); try { const sizes = collectPriceOptions(); if (!Object.keys(sizes).length) throw new Error('請至少新增一組規格售價。'); data.priceValue = Number(Object.values(sizes)[0]); data.spec = Object.keys(sizes).join('、'); data.size = data.spec; await api('/api/admin/products', { method: data.id ? 'PATCH' : 'POST', body: JSON.stringify({ ...data, priceValue: Number(data.priceValue), quantity: Number(data.quantity), variants: { sizes }, thumbnail: collectThumbnailSettings(), published: form.elements.published.checked, newArrival: form.elements.newArrival.checked }) }); dialog.close(); await load(); } catch (error) { $('#inventory-product-message').textContent = error.message; $('#inventory-product-message').className = 'text-danger small'; } });
  const loadProducts = () => load().catch(error => { const status = $('[data-inventory-excel-status]'); if (status) status.textContent = error.message; const table = $('[data-sensen-table="inventory"]'); if (table) table.innerHTML = '<tr><td colspan="8" class="text-danger py-4">商品資料載入失敗，請稍後再試。</td></tr>'; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadProducts, { once: true }); else loadProducts();
})();
