(() => {
  const status = document.querySelector('[data-add-product-status]');
  if (!status) return;

  const observer = new MutationObserver(() => {
    if (status.textContent.includes('已加入前台菜單與 Inventory') && !status.querySelector('a')) {
      observer.disconnect();
      window.location.assign('inventory.html');
    }
  });

  observer.observe(status, { childList: true, characterData: true, subtree: true });
})();
