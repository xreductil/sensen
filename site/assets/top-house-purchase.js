(() => {
  const buttons = [...document.querySelectorAll('[data-top-house-product-id]')];
  if (!buttons.length) return;

  buttons.forEach(button => button.addEventListener('click', async () => {
    const card = button.closest('article');
    const message = card?.querySelector('[data-top-house-product-message]');
    const originalLabel = '加入購物車';
    button.disabled = true;
    button.textContent = '加入中…';
    if (message) message.textContent = '';
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: button.dataset.topHouseProductId, qty: 1 })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || '加入購物車失敗。');
      button.textContent = '已加入購物車';
      if (message) message.textContent = '已加入購物車。';
      document.querySelector('.cart-trigger')?.click();
      window.setTimeout(() => {
        button.textContent = originalLabel;
        button.disabled = false;
      }, 1600);
    } catch (error) {
      if (message) message.textContent = error.message || '加入購物車失敗。';
      button.textContent = originalLabel;
      button.disabled = false;
    }
  }));
})();
