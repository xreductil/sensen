(() => {
  const form = document.getElementById('addProductForm');
  const status = document.querySelector('[data-add-product-status]');
  if (!form || !status) return;

  const value = id => document.getElementById(id)?.value.trim() || '';

  const ensurePriceOptionsEditor = () => {
    const existing = form.querySelector('[data-create-price-options]');
    if (existing) return existing;
    const priceInput = document.getElementById('productPrice');
    const priceRow = priceInput?.closest('.col-md-6')?.parentElement;
    if (!priceRow) return null;
    const field = document.createElement('div');
    field.className = 'mb-3';
    field.innerHTML = '<label class="form-label mb-1">多組售價（可選）</label><div class="small text-secondary mb-2">可依尺寸、口味或包裝設定不同售價。</div><div data-create-price-options></div><button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-create-add-price-option>＋新增規格售價</button>';
    priceRow.insertAdjacentElement('afterend', field);
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

  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = form.querySelector('[type="submit"]');
    const file = document.getElementById('productImage')?.files?.[0];
    const imagePath = file ? `img/menu/${file.name}` : '';
    const title = value('productName');
    button.disabled = true;
    button.textContent = '儲存中…';
    status.className = 'small mt-3 mb-0 text-secondary';
    status.textContent = '';

    try {
      const sizes = collectPriceOptions();
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
          variants: Object.keys(sizes).length ? { sizes } : null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品儲存失敗。');
      form.reset();
      const priceOptions = form.querySelector('[data-create-price-options]');
      if (priceOptions) priceOptions.innerHTML = '';
      status.className = 'small mt-3 mb-0 text-success';
      status.textContent = `${data.product?.title || title} 已加入前台菜單與 Inventory。`;
    } catch (error) {
      status.className = 'small mt-3 mb-0 text-danger';
      status.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = '新增商品';
    }
  }, true);
})();
