(() => {
  const form = document.getElementById('addProductForm');
  const status = document.querySelector('[data-add-product-status]');
  if (!form || !status) return;

  const value = id => document.getElementById(id)?.value.trim() || '';

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
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '商品儲存失敗。');
      form.reset();
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
