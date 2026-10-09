(() => {
  const form = document.getElementById('addProductForm');
  const status = document.querySelector('[data-add-product-status]');
  if (!form || !status) return;

  const value = id => document.getElementById(id)?.value.trim() || '';
  const escapeHtml = input => String(input ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const imageInput = document.getElementById('productImage');
  const imagePreview = form.querySelector('[data-product-image-preview]');
  let imagePreviewUrls = [];

  imageInput?.addEventListener('change', () => {
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    imagePreviewUrls = [...(imageInput.files || [])].map(file => URL.createObjectURL(file));
    if (!imagePreview) return;
    imagePreview.innerHTML = [...(imageInput.files || [])].map((file, index) => `<figure class="mb-0 text-center"><img src="${imagePreviewUrls[index]}" alt="${file.name.replace(/[&<>\"']/g, '')}" class="img-thumbnail" style="width:120px;height:96px;object-fit:contain;"><figcaption class="small text-secondary text-truncate" style="max-width:120px;">${file.name.replace(/[&<>\"']/g, '')}</figcaption></figure>`).join('');
  });

  const uploadProductImage = async file => {
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
    if (!response.ok) throw new Error(data.error || '商品圖片上傳失敗。');
    if (!data.image) throw new Error('商品圖片上傳後沒有取得圖片路徑。');
    return data.image;
  };

  const ensurePriceOptionsEditor = () => {
    const existing = form.querySelector('[data-create-price-options]');
    if (existing) return existing;
    const priceInput = document.getElementById('productPrice');
    const priceColumn = priceInput?.closest('.col-md-6');
    const priceRow = priceColumn?.parentElement;
    const sizeColumn = document.getElementById('productSize')?.closest('.col-md-6');
    const categoryBlock = document.getElementById('productCategory')?.closest('.mb-3');
    if (!priceRow) return null;
    priceColumn.hidden = true;
    // The visible price is now collected from the multi-price rows below.
    // Keep the legacy input available for the API payload, but do not let its
    // empty hidden value block the form's native submit event.
    priceInput.required = false;
    if (sizeColumn) sizeColumn.hidden = true;
    const field = document.createElement('div');
    field.className = 'mb-3';
    field.innerHTML = '<label class="form-label mb-1">多組售價</label><div class="small text-secondary mb-2">請分別選擇規格／名稱與價格類型（原價或特價），再填寫對應金額；預設價格請勾選「預設」。</div><div data-create-price-options></div><button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-create-add-price-option>＋新增規格售價</button>';
    (categoryBlock || priceRow).insertAdjacentElement('afterend', field);
    field.querySelector('[data-create-add-price-option]').addEventListener('click', () => addPriceOptionRow());
    return field.querySelector('[data-create-price-options]');
  };

  const ensureDefaultPriceOption = () => {
    const rows = [...(ensurePriceOptionsEditor()?.children || [])];
    if (rows.length && !rows.some(row => row.querySelector('[data-create-price-default]')?.checked)) {
      rows[0].querySelector('[data-create-price-default]').checked = true;
    }
  };

  const addPriceOptionRow = (option = {}, isDefault = false, optionLabels = []) => {
    const container = ensurePriceOptionsEditor();
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end mb-2';
    const optionLabel = String(option[0] || '').trim();
    const priceType = ['原價', '特價'].includes(optionLabel) ? optionLabel : '';
    const specLabel = priceType ? '' : optionLabel;
    row.innerHTML = `<div class="col-sm-2"><label class="form-check mb-2"><input class="form-check-input" data-create-price-default type="radio" name="createDefaultPrice" aria-label="設為預設價格"><span class="form-check-label">預設</span></label></div><div class="col-sm-3"><label class="form-label small mb-1">規格／名稱<input class="form-control" data-create-price-spec type="text" placeholder="例如：6吋、8吋；或一盒數量"></label></div><div class="col-sm-3"><label class="form-label small mb-1">價格類型<select class="form-select" data-create-price-type><option value="">不指定</option><option value="原價">原價</option><option value="特價">特價</option></select></label></div><div class="col-sm-3"><label class="form-label small mb-1">售價<input class="form-control" data-create-price-value type="number" min="0.01" step="0.01" placeholder="例如：1080"></label></div><div class="col-sm-1"><button type="button" class="btn btn-outline-danger w-100" data-create-remove-price>移除</button></div>`;
    row.querySelector('[data-create-price-spec]').value = specLabel;
    row.querySelector('[data-create-price-type]').value = priceType;
    row.querySelector('[data-create-price-spec]').addEventListener('change', event => { if (event.currentTarget.value) row.querySelector('[data-create-price-type]').value = ''; });
    row.querySelector('[data-create-price-type]').addEventListener('change', event => { if (event.currentTarget.value) row.querySelector('[data-create-price-spec]').value = ''; });
    row.querySelector('[data-create-price-value]').value = option[1] ?? '';
    row.querySelector('[data-create-price-default]').checked = isDefault;
    row.querySelector('[data-create-remove-price]').addEventListener('click', () => { row.remove(); ensureDefaultPriceOption(); });
    container.append(row);
    ensureDefaultPriceOption();
  };

  const collectPriceOptions = () => {
    const sizes = {};
    let defaultSize = '';
    for (const row of ensurePriceOptionsEditor()?.children || []) {
      const spec = row.querySelector('[data-create-price-spec]').value.trim();
      const priceType = row.querySelector('[data-create-price-type]').value.trim();
      const label = priceType || spec;
      const rawValue = row.querySelector('[data-create-price-value]').value;
      const price = Number(rawValue);
      if (!label && !rawValue) continue;
      if (!label || !Number.isFinite(price) || price <= 0) throw new Error('每組售價都需要選擇規格或價格類型，並填寫有效價格。');
      if (sizes[label]) throw new Error(`規格「${label}」不可重複。`);
      sizes[label] = Number(price.toFixed(2));
      if (row.querySelector('[data-create-price-default]')?.checked) defaultSize = label;
    }
    if (Object.keys(sizes).length && !defaultSize) throw new Error('請勾選一組預設價格。');
    return { sizes, defaultSize };
  };

  ensurePriceOptionsEditor();
  addPriceOptionRow(['原價', '']);
  addPriceOptionRow(['特價', '']);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = form.querySelector('[type="submit"]');
    const files = [...(imageInput?.files || [])];
    const title = value('productName');
    button.disabled = true;
    button.textContent = '儲存中…';
    status.className = 'small mt-3 mb-0 text-secondary';
    status.textContent = '';

    try {
      if (!files.length) throw new Error('請至少選擇一張商品圖片。');
      const { sizes, defaultSize } = collectPriceOptions();
      if (!Object.keys(sizes).length) throw new Error('請至少新增一組規格售價。');
      const priceTypes = Object.fromEntries(Object.entries(sizes).filter(([label]) => ['原價', '特價'].includes(label)));
      const sizeOptions = Object.fromEntries(Object.entries(sizes).filter(([label]) => !['原價', '特價'].includes(label)));
      const defaultPriceType = priceTypes[defaultSize] != null ? defaultSize : '原價';
      document.getElementById('productPrice').value = sizes['特價'] ?? sizes[defaultSize] ?? Object.values(sizes)[0];
      document.getElementById('productSize').value = Object.keys(sizeOptions).join('、');
      status.textContent = `正在上傳 ${files.length} 張圖片…`;
      const imagePaths = [];
      for (const [index, file] of files.entries()) {
        status.textContent = `正在上傳圖片 ${index + 1}/${files.length}…`;
        imagePaths.push(await uploadProductImage(file));
      }
      status.textContent = '圖片已上傳，正在儲存商品…';
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sku: value('productSKU'),
          priceValue: Number(value('productPrice')),
          originalPrice: Number(sizes['原價'] ?? value('productPrice')),
          quantity: Number(value('productStock')),
          cat: value('productCategory'),
          img: imagePaths[0],
          images: imagePaths,
          desc: value('productDescription'),
          size: value('productSize'),
          storage: value('productStorage'),
          other: value('productOther'),
          published: true,
          variants: Object.keys(sizes).length ? { sizes: sizeOptions, priceTypes, defaultSize, defaultPriceType } : null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品儲存失敗。');
      const pageUrl = String(data.pageUrl || data.product?.url || '').trim();
      if (!pageUrl) throw new Error('商品已儲存，但沒有建立商品詳細頁網址。');
      form.reset();
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      imagePreviewUrls = [];
      if (imagePreview) imagePreview.replaceChildren();
      const priceOptions = form.querySelector('[data-create-price-options]');
      if (priceOptions) priceOptions.innerHTML = '';
      addPriceOptionRow(['原價', '']);
      addPriceOptionRow(['特價', '']);
      status.className = 'small mt-3 mb-0 text-success';
      status.replaceChildren(
        document.createTextNode(`${data.product?.title || title} 已加入前台菜單與 Inventory，商品詳細頁已建立：`),
        Object.assign(document.createElement('a'), {
          href: pageUrl,
          target: '_blank',
          rel: 'noreferrer',
          textContent: '立即查看',
        }),
      );
    } catch (error) {
      status.className = 'small mt-3 mb-0 text-danger';
      status.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = '新增商品';
    }
  }, true);
})();
