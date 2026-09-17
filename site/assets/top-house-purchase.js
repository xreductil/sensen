(() => {
  const buttons = [...document.querySelectorAll('[data-top-house-product-id]')];
  if (!buttons.length) return;

  buttons.forEach(button => button.addEventListener('click', async () => {
    const card = button.closest('article');
    const message = card?.querySelector('[data-top-house-product-message]');
    const flavorButtons = [...(card?.querySelectorAll('[data-top-house-flavor]') || [])];
    const selectedFlavor = flavorButtons.find(option => option.classList.contains('is-selected'))?.dataset.topHouseFlavor || '';
    const originalLabel = '加入購物車';
    button.disabled = true;
    button.textContent = '加入中…';
    if (message) message.textContent = '';
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: button.dataset.topHouseProductId, qty: 1, options: selectedFlavor ? { flavor: selectedFlavor } : {} })
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

  document.querySelectorAll('[data-top-house-flavor]').forEach(option => option.addEventListener('click', () => {
    const group = option.closest('.top-house-flavor-list');
    group?.querySelectorAll('[data-top-house-flavor]').forEach(item => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  }));
})();
