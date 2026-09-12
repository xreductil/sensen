(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => '$' + Number(value || 0).toFixed(0);
  const statusLabels = {
    created: '訂單已建立',
    pending: '待付款',
    pending_payment: '待付款',
    processing: '處理中',
    shipped: '已出貨',
    ready_for_pickup: '待取貨',
    completed: '已完成',
    picked_up: '已取貨',
    cancelled: '已取消'
  };

  const parseDate = value => {
    const text = String(value || '').trim();
    if (!text) return null;
    // Cloudflare D1's CURRENT_TIMESTAMP is UTC but has no offset suffix.
    const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(text)
      ? text.replace(' ', 'T') + 'Z'
      : text;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatOrderDate = value => {
    const date = parseDate(value);
    return date
      ? new Intl.DateTimeFormat('zh-TW', {
          timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).format(date)
      : '時間未提供';
  };

  const productImage = value => {
    const source = String(value || '').trim();
    if (!source) return '/images/icon-cake.png';
    if (/^(?:https?:)?\/\//i.test(source) || source.startsWith('/images/')) return source;
    const file = source.replace(/^\/?(?:assets\/)?images\//i, '').replace(/^\/+/, '');
    return '/images/' + file.split('/').map(part => encodeURIComponent(part)).join('/');
  };

  const normalizeTitle = value => String(value || '')
    .replace(/<br\s*\/?\s*>/gi, '')
    .replace(/[\s（）()\-]/g, '')
    .toLowerCase();

  const loadDashboardData = async () => {
    const [productsResponse, ordersResponse, summaryResponse] = await Promise.all([
      fetch('/api/products', { credentials: 'include' }),
      fetch('/api/admin/orders', { credentials: 'include' }),
      fetch('/api/admin/summary', { credentials: 'include' })
    ]);
    if (!productsResponse.ok || !ordersResponse.ok) throw new Error('森森資料尚未連線。');

    const products = (await productsResponse.json()).products || [];
    const orderData = (await ordersResponse.json()).orders || [];
    const summary = summaryResponse.ok ? ((await summaryResponse.json()).summary || null) : null;
    const productIds = new Set(products.map(product => String(product.id)));
    const productIdsByTitle = new Map(products.map(product => [normalizeTitle(product.title), String(product.id)]));
    const productIdForOrderItem = item => {
      const directId = String(item.productId || '');
      if (productIds.has(directId)) return directId;
      return productIdsByTitle.get(normalizeTitle(item.title)) || '';
    };
    const orders = orderData.filter(order => Array.isArray(order.items) && order.items.length > 0);
    const activeOrders = orders.filter(order => String(order.status || '').toLowerCase() !== 'cancelled');

    const sold = new Map();
    activeOrders.forEach(order => (order.items || []).forEach(item => {
      const productId = productIdForOrderItem(item);
      if (!productId) return;
      const current = sold.get(productId) || { qty: 0, revenue: 0 };
      current.qty += Math.max(0, Number(item.qty || 0));
      current.revenue += Math.max(0, Number(item.qty || 0)) * Math.max(0, Number(item.priceValue || 0));
      sold.set(productId, current);
    }));

    const topProducts = products
      .filter(product => sold.has(String(product.id)))
      .sort((left, right) => {
        const leftSales = sold.get(String(left.id));
        const rightSales = sold.get(String(right.id));
        return rightSales.qty - leftSales.qty || rightSales.revenue - leftSales.revenue || String(left.title).localeCompare(String(right.title), 'zh-Hant');
      })
      .slice(0, 5);
    const lowStockProducts = products
      .filter(product => Number.isFinite(Number(product.quantity)) && Number(product.quantity) > 0 && Number(product.quantity) < 10)
      .sort((left, right) => Number(left.quantity) - Number(right.quantity) || String(left.title).localeCompare(String(right.title), 'zh-Hant'))
      .slice(0, 5);
    const recentOrders = orders
      .map((order, index) => ({ order, index, time: parseDate(order.createdAt)?.getTime() || 0 }))
      .sort((left, right) => right.time - left.time || right.index - left.index)
      .slice(0, 5)
      .map(entry => entry.order);

    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = String(value);
    };
    const activeSales = activeOrders.reduce((sum, order) => sum + Math.max(0, Number(order.total || 0)), 0);
    const activeItemCount = activeOrders.reduce((sum, order) => sum + (order.items || []).reduce((itemSum, item) => itemSum + Math.max(0, Number(item.qty || 0)), 0), 0);
    setText('[data-admin-stat="sales"]', money(activeSales));
    setText('[data-admin-stat="products"]', products.length);
    setText('[data-admin-stat="orders"]', orders.length);
    setText('[data-admin-stat="items"]', activeItemCount);
    setText('[data-admin-summary="completed-sales"]', money(summary?.completedSales ?? activeOrders.filter(order => ['completed', 'picked_up'].includes(String(order.status || '').toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0)));
    setText('[data-admin-summary="pending-sales"]', money(summary?.pendingSales ?? Math.max(0, activeSales - activeOrders.filter(order => ['completed', 'picked_up'].includes(String(order.status || '').toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0))));
    setText('[data-admin-status]', '已連線：客戶訂單與商品庫存');

    const topList = document.querySelector('[data-admin-list="top-products"]');
    if (topList) topList.innerHTML = topProducts.length
      ? topProducts.map(product => {
          const sales = sold.get(String(product.id));
          return `<li class="list-group-item d-flex align-items-center gap-3"><img src="${escapeHtml(productImage(product.img))}" alt="${escapeHtml(product.title || '商品圖片')}" class="avatar avatar-md rounded object-fit-cover"><div class="flex-grow-1"><strong>${escapeHtml(product.title)}</strong><small class="d-block text-secondary">已售 ${sales.qty} 件</small></div><b>${money(product.priceValue)}</b></li>`;
        }).join('')
      : '<li class="list-group-item text-secondary">目前沒有銷售資料。</li>';

    const lowList = document.querySelector('[data-admin-list="low-stock-products"]');
    if (lowList) lowList.innerHTML = lowStockProducts.length
      ? lowStockProducts.map(product => `<li class="list-group-item d-flex align-items-center gap-3"><img src="${escapeHtml(productImage(product.img))}" alt="${escapeHtml(product.title || '商品圖片')}" class="avatar avatar-md rounded object-fit-cover"><span class="flex-grow-1">${escapeHtml(product.title)}</span><strong class="text-danger">剩餘 ${Number(product.quantity)} 件</strong></li>`).join('')
      : '<li class="list-group-item text-secondary">目前沒有低庫存商品。</li>';

    const recentList = document.querySelector('[data-admin-list="recent-orders"]');
    if (recentList) recentList.innerHTML = recentOrders.length
      ? recentOrders.map(order => {
          const itemCount = (order.items || []).reduce((sum, item) => sum + Math.max(0, Number(item.qty || 0)), 0);
          const status = String(order.status || 'created').toLowerCase();
          return `<li class="list-group-item d-flex align-items-center gap-3 admin-order-row"><span class="flex-grow-1"><strong>#${escapeHtml(order.id)}</strong><small class="d-block text-secondary">${escapeHtml(order.customer?.name || '森森會員')} · ${itemCount} 件 · ${escapeHtml(formatOrderDate(order.createdAt))}</small></span><span class="badge bg-success-subtle text-success">${escapeHtml(statusLabels[status] || status)}</span><strong>${money(order.total)}</strong></li>`;
        }).join('')
      : '<li class="list-group-item text-secondary">目前沒有訂單。</li>';
  };

  const run = () => loadDashboardData().catch(error => {
    const status = document.querySelector('[data-admin-status]');
    if (status) status.textContent = error.message;
  });

  // The bundled admin script also hydrates this page; run after it so this
  // dashboard has one consistent data source and cannot be overwritten by
  // the template's sample-data renderer.
  window.addEventListener('load', run, { once: true });
})();
