(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => '$' + Number(value || 0).toFixed(0);
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  };
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

  const dateParts = value => {
    const date = value instanceof Date ? value : parseDate(value);
    if (!date) return null;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
    return { year: values.year, month: values.month, day: values.day };
  };

  const calendarKey = parts => parts ? `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` : '';
  const calendarDate = parts => new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const calendarParts = date => ({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
  const calendarRangePoint = (start, end) => {
    const startParts = calendarParts(start);
    const endParts = calendarParts(end);
    return {
      label: `${startParts.month}/${startParts.day}–${endParts.month}/${endParts.day}`,
      startKey: calendarKey(startParts),
      endKey: calendarKey(endParts)
    };
  };
  const dashboardRangeState = {
    value: 'year',
    salesRenderer: null,
    customerRenderer: null
  };
  const dashboardRanges = new Set(['year', 'month', 'week']);
  const syncDashboardRange = value => {
    dashboardRangeState.value = dashboardRanges.has(value) ? value : 'year';
    document.querySelectorAll('[data-dashboard-range]').forEach(select => {
      if (select.value !== dashboardRangeState.value) select.value = dashboardRangeState.value;
    });
    dashboardRangeState.salesRenderer?.();
    dashboardRangeState.customerRenderer?.();
  };
  const ordersInRange = (orders, range) => {
    const today = dateParts(new Date());
    if (!today) return [];
    const todayKey = calendarKey(today);
    let startKey = `${today.year}-01-01`;
    if (range === 'month') startKey = `${today.year}-${String(today.month).padStart(2, '0')}-01`;
    if (range === 'week') {
      const start = calendarDate(today);
      start.setUTCDate(start.getUTCDate() - 6);
      startKey = calendarKey(calendarParts(start));
    }
    if (range === 'six-months') {
      const start = calendarDate({ year: today.year, month: today.month, day: 1 });
      start.setUTCMonth(start.getUTCMonth() - 5);
      startKey = calendarKey(calendarParts(start));
    }
    return orders.filter(order => {
      const key = calendarKey(dateParts(order.createdAt));
      return key && key >= startKey && key <= todayKey;
    });
  };

  const installDashboardVisualStyles = () => {
    if (document.getElementById('admin-dashboard-visual-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-dashboard-visual-styles';
    style.textContent = `
      .admin-live-chart { min-height: 350px; }
      .admin-live-legend { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; font-size: .8rem; color: var(--bs-secondary-color, #737373); }
      .admin-live-legend span::before { display: inline-block; width: .65rem; height: .65rem; margin-right: .35rem; content: ''; border-radius: 50%; background: var(--legend-color); }
      .admin-live-bars { display: grid; grid-template-columns: repeat(12, minmax(2rem, 1fr)); align-items: end; gap: .5rem; height: 270px; padding: 1rem 0 0; border-bottom: 1px solid var(--bs-border-color, #e5e5e5); }
      .admin-live-bar-group { display: grid; grid-template-rows: 1fr auto; align-items: end; min-width: 0; height: 100%; text-align: center; }
      .admin-live-bar-stack { display: flex; align-items: end; justify-content: center; gap: .2rem; height: 100%; }
      .admin-live-bar { display: block; width: min(1rem, 40%); min-height: 2px; border-radius: .25rem .25rem 0 0; background: var(--bar-color); }
      .admin-live-bar[data-zero="true"] { opacity: .15; }
      .admin-live-bar-group small { overflow: hidden; margin-top: .5rem; color: var(--bs-secondary-color, #737373); font-size: .7rem; text-overflow: ellipsis; white-space: nowrap; }
      .admin-live-empty { display: grid; place-items: center; height: 270px; color: var(--bs-secondary-color, #737373); }
      .admin-customer-donut { position: relative; display: grid; place-items: center; width: min(11rem, 100%); aspect-ratio: 1; margin: auto; border-radius: 50%; background: conic-gradient(#FB2C36 0 var(--first-degree), #F0B100 var(--first-degree) 100%); }
      .admin-customer-donut::after { width: 65%; height: 65%; content: ''; background: var(--bs-body-bg, #fff); border-radius: 50%; }
      .admin-customer-donut-label { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center; text-align: center; font-size: .8rem; color: var(--bs-secondary-color, #737373); }
    `;
    document.head.appendChild(style);
  };

  const renderSalesPurchase = activeOrders => {
    const chart = document.getElementById('salesPurchaseChart');
    const rangeSelect = document.querySelector('[data-sales-purchase-range]');
    if (!chart) return;
    installDashboardVisualStyles();

    const render = () => {
      const range = dashboardRangeState.value;
      const today = dateParts(new Date());
      const points = [];
      if (range === 'year') {
        for (let month = 1; month <= 12; month += 1) points.push({ label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1], key: `${today.year}-${String(month).padStart(2, '0')}` });
      } else if (range === 'month') {
        const monthStart = calendarDate({ year: today.year, month: today.month, day: 1 });
        const monthEnd = new Date(Date.UTC(today.year, today.month, 0));
        let start = new Date(monthStart);
        const firstMondayOffset = (8 - start.getUTCDay()) % 7;
        if (firstMondayOffset > 0) {
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + firstMondayOffset - 1);
          points.push(calendarRangePoint(start, end > monthEnd ? monthEnd : end));
          start = new Date(end);
          start.setUTCDate(start.getUTCDate() + 1);
        }
        while (start <= monthEnd) {
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + 6);
          points.push(calendarRangePoint(start, end > monthEnd ? monthEnd : end));
          start.setUTCDate(start.getUTCDate() + 7);
        }
      } else {
        const start = calendarDate(today);
        start.setUTCDate(start.getUTCDate() - 6);
        for (let index = 0; index < 7; index += 1) {
          const date = new Date(start);
          date.setUTCDate(start.getUTCDate() + index);
          const parts = calendarParts(date);
          points.push({ label: `${parts.month}/${parts.day}`, key: calendarKey(parts) });
        }
      }
      const scopedOrders = range === 'year'
        ? activeOrders.filter(order => dateParts(order.createdAt)?.year === today.year)
        : ordersInRange(activeOrders, range === 'month' ? 'month' : 'week');
      const sales = points.map(point => scopedOrders.filter(order => {
        const parts = dateParts(order.createdAt);
        const key = range === 'year' ? `${parts?.year}-${String(parts?.month || '').padStart(2, '0')}` : calendarKey(parts);
        return range === 'month' ? key >= point.startKey && key <= point.endKey : key === point.key;
      }).reduce((sum, order) => sum + Math.max(0, Number(order.total || 0)), 0));
      const max = Math.max(1, ...sales);
      const salesTotal = sales.reduce((sum, value) => sum + value, 0);
      chart.innerHTML = `<div class="admin-live-chart" role="img" aria-label="Sales linked to real orders. Purchase has no cost data yet."><div class="admin-live-legend"><span style="--legend-color:#E66239">Sales ${money(salesTotal)}</span><span style="--legend-color:#4FAF7A">Purchase 尚無進貨成本資料</span></div>${sales.length ? `<div class="admin-live-bars" style="grid-template-columns:repeat(${points.length},minmax(2rem,1fr))">${points.map((point, index) => `<div class="admin-live-bar-group"><div class="admin-live-bar-stack"><span class="admin-live-bar" style="--bar-color:#E66239;height:${Math.max(2, sales[index] / max * 100)}%" title="Sales ${money(sales[index])}"${sales[index] ? '' : ' data-zero="true"'}></span><span class="admin-live-bar" style="--bar-color:#4FAF7A;height:2px" title="Purchase 尚無進貨成本資料" data-zero="true"></span></div><small>${escapeHtml(point.label)}</small></div>`).join('')}</div>` : '<div class="admin-live-empty">目前沒有訂單銷售資料。</div>'}</div>`;
    };
    dashboardRangeState.salesRenderer = render;
    if (rangeSelect) {
      rangeSelect.value = dashboardRangeState.value;
      rangeSelect.onchange = () => syncDashboardRange(rangeSelect.value);
    }
    render();
  };

  const renderCustomerOverview = activeOrders => {
    const rangeSelect = document.querySelector('[data-customer-range]');
    const chart = document.getElementById('customerChart');
    if (!chart) return;
    installDashboardVisualStyles();
    const render = () => {
      const scopedOrders = ordersInRange(activeOrders, dashboardRangeState.value);
      const customerOrders = new Map();
      scopedOrders.forEach(order => {
        const key = String(order.userId || order.customer?.email || `guest:${order.id}`);
        customerOrders.set(key, (customerOrders.get(key) || 0) + 1);
      });
      const firstTime = [...customerOrders.values()].filter(count => count === 1).length;
      const returning = [...customerOrders.values()].filter(count => count > 1).length;
      const totalCustomers = firstTime + returning;
      const completedOrders = scopedOrders.filter(order => ['completed', 'picked_up'].includes(String(order.status || '').toLowerCase())).length;
      const firstPercent = totalCustomers ? Math.round(firstTime / totalCustomers * 100) : 0;
      setText('[data-admin-summary="first-time"]', firstTime);
      setText('[data-admin-summary="returning"]', returning);
      setText('[data-admin-summary="completed-orders"]', completedOrders);
      setText('[data-admin-summary="customers"]', totalCustomers);
      setText('[data-admin-summary="orders"]', scopedOrders.length);
      setText('[data-customer-percent="first"]', `${firstPercent}%`);
      setText('[data-customer-percent="return"]', `${100 - firstPercent}%`);
      chart.innerHTML = `<div class="admin-customer-donut" style="--first-degree:${firstPercent * 3.6}deg"><span class="admin-customer-donut-label">${totalCustomers}<br>Customers</span></div>`;
    };
    dashboardRangeState.customerRenderer = render;
    if (rangeSelect) {
      rangeSelect.value = dashboardRangeState.value;
      rangeSelect.onchange = () => syncDashboardRange(rangeSelect.value);
    }
    render();
  };

  const installOrderModalStyles = () => {
    if (document.getElementById('admin-order-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-order-modal-styles';
    style.textContent = `
      .admin-order-row { cursor: pointer; transition: background-color .15s ease; }
      .admin-order-row:hover, .admin-order-row:focus-visible { background-color: rgba(230, 98, 57, .08); outline: none; }
      .admin-order-modal { position: fixed; inset: 0; z-index: 1050; display: grid; place-items: center; padding: 1rem; background: rgba(23, 23, 23, .55); }
      .admin-order-card { position: relative; width: min(100%, 40rem); max-height: min(90vh, 44rem); overflow: auto; padding: 1.5rem; color: var(--bs-body-color, #171717); background: var(--bs-body-bg, #fff); border-radius: .75rem; box-shadow: 0 1rem 3rem rgba(0, 0, 0, .2); }
      .admin-order-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-right: 2rem; }
      .admin-order-close { position: absolute; top: .75rem; right: .75rem; width: 2rem; height: 2rem; border: 0; color: inherit; background: transparent; font-size: 1.5rem; line-height: 1; }
      .admin-order-meta { display: grid; gap: .5rem; margin: 1rem 0; padding: .875rem 1rem; background: var(--bs-tertiary-bg, #f5f5f5); border-radius: .5rem; }
      .admin-order-meta p { margin: 0; }
      .admin-order-items { display: grid; gap: .5rem; }
      .admin-order-item { display: flex; justify-content: space-between; gap: 1rem; padding: .75rem 0; border-bottom: 1px solid var(--bs-border-color, #e5e5e5); }
      .admin-order-total { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--bs-border-color, #e5e5e5); }
    `;
    document.head.appendChild(style);
  };

  const renderOrderModal = order => {
    if (!order) return;
    document.querySelector('[data-admin-order-modal]')?.remove();
    installOrderModalStyles();

    const customer = order.customer || {};
    const status = String(order.status || 'created').toLowerCase();
    const address = order.shippingAddress
      ? [order.shippingAddress.zip, order.shippingAddress.city, order.shippingAddress.address].filter(Boolean).join(' ')
      : '';
    const contact = [customer.email, customer.phone].filter(Boolean).join(' · ') || '未提供聯絡資料';
    const items = Array.isArray(order.items) ? order.items : [];
    const modal = document.createElement('div');
    modal.className = 'admin-order-modal';
    modal.dataset.adminOrderModal = '';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'admin-order-modal-title');
    modal.innerHTML = `
      <div class="admin-order-card">
        <button type="button" class="admin-order-close" data-close-order-modal aria-label="關閉訂單明細">&times;</button>
        <div class="admin-order-head">
          <span id="admin-order-modal-title">訂單明細</span>
          <strong>#${escapeHtml(order.id)}</strong>
        </div>
        <div class="admin-order-meta">
          <p><strong>客戶：</strong>${escapeHtml(customer.name || '森森會員')}<br><span class="text-secondary">${escapeHtml(contact)}</span></p>
          <p><strong>訂單時間：</strong>${escapeHtml(formatOrderDate(order.createdAt))}</p>
          <p><strong>狀態：</strong>${escapeHtml(statusLabels[status] || status)}</p>
          <p><strong>取貨方式：</strong>${escapeHtml(order.shippingLabel || '門市自取')}${order.fulfillmentDate ? ` · ${escapeHtml(order.fulfillmentDate)}` : ''}${address ? `<br><span class="text-secondary">${escapeHtml(address)}</span>` : ''}</p>
        </div>
        <div class="admin-order-items">
          ${items.map(item => `<div class="admin-order-item"><span>${escapeHtml(item.title || '商品')} × ${Number(item.qty || 0)}</span><strong>${money(Number(item.priceValue || 0) * Number(item.qty || 0))}</strong></div>`).join('')}
        </div>
        <div class="admin-order-total"><strong>合計</strong><strong>${money(order.total)}</strong></div>
        <button type="button" class="btn btn-primary w-100 admin-order-complete" data-order-complete="${escapeHtml(order.id)}"${['completed', 'picked_up'].includes(status) ? ' disabled' : ''}>${['completed', 'picked_up'].includes(status) ? '已完成' : '標記為已完成'}</button>
        <button type="button" class="btn btn-outline-primary w-100 mt-2 admin-order-picked-up" data-order-picked-up="${escapeHtml(order.id)}"${status === 'picked_up' ? ' disabled' : ''}>${status === 'picked_up' ? '已取貨' : '標記為已取貨'}</button>
      </div>`;
    document.body.appendChild(modal);

    const close = () => {
      document.removeEventListener('keydown', onKeyDown);
      modal.remove();
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') close();
    };
    modal.querySelector('[data-close-order-modal]').addEventListener('click', close);
    modal.addEventListener('click', event => {
      if (event.target === modal) close();
    });
    const updateStatus = async (nextStatus, button) => {
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = '更新中...';
      try {
        const response = await fetch('/api/admin/orders/status', {
          method: 'PATCH',
          credentials: 'include',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, status: nextStatus })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || '訂單狀態更新失敗。');
        close();
        await loadDashboardData();
      } catch (error) {
        console.error(error);
        button.disabled = false;
        button.textContent = originalText;
      }
    };
    modal.querySelector('[data-order-complete]').addEventListener('click', event => updateStatus('completed', event.currentTarget));
    modal.querySelector('[data-order-picked-up]').addEventListener('click', event => updateStatus('picked_up', event.currentTarget));
    document.addEventListener('keydown', onKeyDown);
    modal.querySelector('[data-close-order-modal]').focus();
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

    const activeSales = activeOrders.reduce((sum, order) => sum + Math.max(0, Number(order.total || 0)), 0);
    const activeItemCount = activeOrders.reduce((sum, order) => sum + (order.items || []).reduce((itemSum, item) => itemSum + Math.max(0, Number(item.qty || 0)), 0), 0);
    setText('[data-admin-stat="sales"]', money(activeSales));
    setText('[data-admin-stat="products"]', products.length);
    setText('[data-admin-stat="orders"]', orders.length);
    setText('[data-admin-stat="items"]', activeItemCount);
    setText('[data-admin-summary="completed-sales"]', money(summary?.completedSales ?? activeOrders.filter(order => ['completed', 'picked_up'].includes(String(order.status || '').toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0)));
    setText('[data-admin-summary="pending-sales"]', money(summary?.pendingSales ?? Math.max(0, activeSales - activeOrders.filter(order => ['completed', 'picked_up'].includes(String(order.status || '').toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0))));
    renderSalesPurchase(activeOrders);
    renderCustomerOverview(activeOrders);
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
    if (recentList) {
      recentList.innerHTML = recentOrders.length
      ? recentOrders.map((order, index) => {
          const itemCount = (order.items || []).reduce((sum, item) => sum + Math.max(0, Number(item.qty || 0)), 0);
          const status = String(order.status || 'created').toLowerCase();
          return `<li class="list-group-item d-flex align-items-center gap-3 admin-order-row" role="button" tabindex="0" data-order-index="${index}" aria-label="查看訂單 #${escapeHtml(order.id)}"><span class="flex-grow-1"><strong>#${escapeHtml(order.id)}</strong><small class="d-block text-secondary">${escapeHtml(order.customer?.name || '森森會員')} · ${itemCount} 件 · ${escapeHtml(formatOrderDate(order.createdAt))}</small></span><span class="badge bg-success-subtle text-success">${escapeHtml(statusLabels[status] || status)}</span><strong>${money(order.total)}</strong></li>`;
        }).join('')
      : '<li class="list-group-item text-secondary">目前沒有訂單。</li>';
      recentList.querySelectorAll('[data-order-index]').forEach(row => {
        const open = () => renderOrderModal(recentOrders[Number(row.dataset.orderIndex)]);
        row.addEventListener('click', open);
        row.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        });
      });
    }
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
