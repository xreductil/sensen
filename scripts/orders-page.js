(() => {
  const root = document.querySelector('[data-orders-page]');
  if (!root) return;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const labels = { created: '訂單已建立', pending: '待付款', pending_payment: '待付款', processing: '準備中', shipped: '配送中', ready_for_pickup: '可取貨', completed: '已完成', picked_up: '已取貨', cancelled: '已取消' };
  const parseOrderDate = value => { const text = String(value || '').trim(); if (!text) return null; const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(text) ? text.replace(' ', 'T') + 'Z' : text; const date = new Date(normalized); return Number.isNaN(date.getTime()) ? null : date; };
  const formatOrderDate = value => { const date = parseOrderDate(value); return date ? new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date) : ''; };
  const formatFulfillmentDate = value => value ? String(value).slice(0, 10) : '';
  const render = order => {
    const status = String(order.status || 'created').toLowerCase();
    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const timeline = history.length ? '<ol class="order-timeline">' + history.map(event => '<li class="' + (event.status === status ? 'is-current' : '') + '"><b>' + escapeHtml(labels[event.status] || event.status || '更新') + '</b><small>' + escapeHtml(formatOrderDate(event.at)) + '</small></li>').join('') + '</ol>' : '';
    const tracking = order.trackingNumber ? '<p class="order-tracking">貨運單號：<strong>' + escapeHtml(order.trackingNumber) + '</strong></p>' : '<p class="order-tracking">貨運單號：尚未提供</p>';
    return '<article class="order-detail-card"><div class="order-detail-head"><div><b>#' + escapeHtml(order.id) + '</b><small>' + escapeHtml(order.shippingLabel || '門市自取') + ' · 取貨／配送：' + escapeHtml(formatFulfillmentDate(order.fulfillmentDate)) + '</small><small>下單時間：' + escapeHtml(formatOrderDate(order.createdAt) || '未提供') + '</small></div><strong>$' + Number(order.total || 0).toFixed(2) + '</strong></div><p class="order-status-line">目前狀態：<span class="status">' + escapeHtml(labels[status] || order.status || '已建立') + '</span></p>' + tracking + timeline + '</article>';
  };
  fetch('/api/orders', { credentials: 'include' }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || '請先登入會員中心。'); const orders = (data.orders || []).slice().sort((left, right) => (parseOrderDate(right.createdAt)?.getTime() || 0) - (parseOrderDate(left.createdAt)?.getTime() || 0)); root.innerHTML = orders.length ? orders.map(render).join('') : '<p>目前沒有訂單。</p>'; }).catch(error => { root.innerHTML = '<p class="account-error">' + escapeHtml(error.message) + '</p>'; });
})();
