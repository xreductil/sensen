(() => {
  const form = document.getElementById('addProductForm');
  const status = document.querySelector('[data-add-product-status]');
  if (!form || !status) return;

  const value = id => document.getElementById(id)?.value.trim() || '';
  const imageInput = document.getElementById('productImage');
  const imagePreview = form.querySelector('[data-product-image-preview]');
  let imagePreviewUrl = '';

  imageInput?.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    imagePreviewUrl = file ? URL.createObjectURL(file) : '';
    if (!imagePreview) return;
    imagePreview.src = imagePreviewUrl;
    imagePreview.classList.toggle('d-none', !imagePreviewUrl);
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
    field.innerHTML = '<label class="form-label mb-1">多組售價</label><div class="small text-secondary mb-2">以規格／名稱搭配售價設定，例如：6 吋 $1080、8 吋 $1580。</div><div data-create-price-options></div><button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-create-add-price-option>＋新增規格售價</button>';
    (categoryBlock || priceRow).insertAdjacentElement('afterend', field);
    field.querySelector('[data-create-add-price-option]').addEventListener('click', () => addPriceOptionRow());
    return field.querySelector('[data-create-price-options]');
  };

  const addPriceOptionRow = (option = {}) => {
    const container = ensurePriceOptionsEditor();
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end mb-2';
    row.innerHTML = '<div class="col-sm-5"><label class="form-label small mb-1">規格／名稱<input class="form-control" data-create-price-label placeholder="例如：6 吋"></label></div><div class="col-sm-5"><label class="form-label small mb-1">售價<input class="form-control" data-create-price-value type="number" min="0.01" step="0.01" placeholder="例如：1080"></label></div><div class="col-sm-2"><button type="button" class="btn btn-outline-danger w-100" data-create-remove-price>移除</button></div>';
    row.querySelector('[data-create-price-label]').value = option[0] || '';
    row.querySelector('[data-create-price-value]').value = option[1] ?? '';
    row.querySelector('[data-create-remove-price]').addEventListener('click', () => row.remove());
    container.append(row);
  };

  const collectPriceOptions = () => {
    const sizes = {};
    for (const row of ensurePriceOptionsEditor()?.children || []) {
      const label = row.querySelector('[data-create-price-label]').value.trim();
      const rawValue = row.querySelector('[data-create-price-value]').value;
      const price = Number(rawValue);
      if (!label && !rawValue) continue;
      if (!label || !Number.isFinite(price) || price <= 0) throw new Error('每組規格售價都需要填寫名稱與有效價格。');
      if (sizes[label]) throw new Error(`規格「${label}」不可重複。`);
      sizes[label] = Number(price.toFixed(2));
    }
    return sizes;
  };

  ensurePriceOptionsEditor();
  addPriceOptionRow();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = form.querySelector('[type="submit"]');
    const file = imageInput?.files?.[0];
    const title = value('productName');
    button.disabled = true;
    button.textContent = '儲存中…';
    status.className = 'small mt-3 mb-0 text-secondary';
    status.textContent = '';

    try {
      if (!file) throw new Error('請先選擇商品圖片。');
      const sizes = collectPriceOptions();
      if (!Object.keys(sizes).length) throw new Error('請至少新增一組規格售價。');
      document.getElementById('productPrice').value = Object.values(sizes)[0];
      document.getElementById('productSize').value = Object.keys(sizes).join('、');
      status.textContent = '圖片上傳中…';
      const imagePath = await uploadProductImage(file);
      status.textContent = '圖片已上傳，正在儲存商品…';
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sku: value('productSKU'),
          priceValue: Number(value('productPrice')),
          quantity: Number(value('productStock')),
          cat: value('productCategory'),
          img: imagePath,
          desc: value('productDescription'),
          size: value('productSize'),
          storage: value('productStorage'),
          other: value('productOther'),
          published: true,
          variants: Object.keys(sizes).length ? { sizes } : null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品儲存失敗。');
      const pageUrl = String(data.pageUrl || data.product?.url || '').trim();
      if (!pageUrl) throw new Error('商品已儲存，但沒有建立商品詳細頁網址。');
      form.reset();
      const priceOptions = form.querySelector('[data-create-price-options]');
      if (priceOptions) priceOptions.innerHTML = '';
      addPriceOptionRow();
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
