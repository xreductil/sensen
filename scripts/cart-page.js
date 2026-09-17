(() => {
  const root = document.querySelector('[data-full-cart]');
  if (!root) return;

  const money = value => '$' + Number(value || 0).toFixed(2);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const api = async (path, options = {}) => {
    const response = await fetch(path, { ...options, credentials: 'include', headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || '操作失敗。');
    return data;
  };
  const loginUrl = () => '/customer/admin/?return=' + encodeURIComponent('/checkout/');
  const requireLogin = async () => {
    const response = await fetch('/api/me', { credentials: 'include', headers: { Accept: 'application/json' } });
    const data = await response.json().catch(() => ({}));
    if (response.ok) return true;
    if (response.status === 401) { window.location.assign(loginUrl()); return false; }
    throw new Error(data.error || '目前無法確認會員登入狀態。');
  };
  const toIsoDate = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  const saved = key => localStorage.getItem(key) || '';
  const save = () => {
    const method = root.querySelector('[data-cart-shipping]');
    const coupon = root.querySelector('[data-cart-coupon]');
    const pickup = root.querySelector('[data-cart-pickup]');
    const recipient = root.querySelector('[data-cart-recipient]');
    const phone = root.querySelector('[data-cart-phone]');
    const address = root.querySelector('[data-cart-address]');
    const note = root.querySelector('[data-cart-note]');
    localStorage.setItem('sensen-cart-shipping', method?.value || 'pickup');
    localStorage.setItem('sensen-cart-coupon', coupon?.value.trim().toUpperCase() || '');
    localStorage.setItem('sensen-cart-pickup', pickup?.value || '');
    localStorage.setItem('sensen-cart-recipient', recipient?.value.trim() || '');
    localStorage.setItem('sensen-cart-phone', phone?.value.trim() || '');
    localStorage.setItem('sensen-cart-address', address?.value.trim() || '');
    localStorage.setItem('sensen-cart-note', note?.value.trim() || '');
  };
  const showMessage = (element, text, error = false) => { element.textContent = text || ''; element.className = text ? (error ? 'cart-form-error' : 'cart-form-success') : ''; };

  const load = async () => {
    const cart = await api('/api/cart');
    if (!cart.items?.length) { root.innerHTML = '<p>目前購物車是空的。</p>'; return; }
    root.innerHTML = '<div class="cart-items-list">' + cart.items.map(item => '<article class="cart-item-card"><img src="' + escapeHtml(item.img || '') + '" alt=""><div class="cart-item-info"><h3>' + escapeHtml(item.title || '商品') + '</h3><small>' + escapeHtml(item.cat || '') + ' · ' + money(item.priceValue) + ' · 製作時間 ' + Number(item.day || 5) + ' 天</small><div class="cart-item-controls"><button type="button" data-cart-id="' + escapeHtml(item.id) + '" data-cart-qty="' + (Number(item.qty) - 1) + '" aria-label="減少數量">−</button><b>' + Number(item.qty || 0) + '</b><button type="button" data-cart-id="' + escapeHtml(item.id) + '" data-cart-qty="' + (Number(item.qty) + 1) + '" aria-label="增加數量">＋</button><button type="button" class="cart-remove-button" data-cart-remove="' + escapeHtml(item.id) + '">移除</button></div></div><strong>' + money(Number(item.priceValue || 0) * Number(item.qty || 0)) + '</strong></article>').join('') + '</div>' +
      '<div class="cart-checkout-options"><h2>配送方式</h2><label>物流方式<select data-cart-shipping><option value="pickup">門市自取（免運）</option><option value="home">宅配（$120）</option><option value="frozen">冷凍宅配（$240）</option></select></label><div class="cart-delivery-fields" data-cart-delivery-fields hidden><label>收件人<input data-cart-recipient autocomplete="name"></label><label>電話<input data-cart-phone type="tel" autocomplete="tel"></label><label>地址<input data-cart-address autocomplete="street-address"></label></div><label>取貨／配送日期<input data-cart-pickup type="date" required></label><label>給店家的備註<textarea data-cart-note rows="3" placeholder="例如：蛋糕牌文字、配送提醒"></textarea></label><label>優惠碼<div class="cart-coupon-row"><input data-cart-coupon type="text" placeholder="輸入優惠碼" autocomplete="off" value="' + escapeHtml(saved('sensen-cart-coupon')) + '"><button class="cart-coupon-button" type="button" data-apply-coupon>套用</button></div></label><small class="cart-date-hint" data-cart-date-hint></small><p class="cart-form-message" data-cart-quote-message role="status"></p></div>' +
      '<div class="cart-price-summary"><div><span>商品小計</span><strong data-cart-subtotal>' + money(cart.subtotal ?? cart.total) + '</strong></div><div><span>運費</span><strong data-cart-shipping-fee>$0.00</strong></div><div data-cart-discount-row hidden><span>折扣</span><strong data-cart-discount>-$0.00</strong></div><div class="cart-page-total"><span>訂單合計</span><strong data-cart-total>' + money(cart.total) + '</strong></div></div>' +
      '<p class="cart-form-message" data-cart-checkout-message role="status"></p><button class="button cart-checkout-button" type="button" data-cart-checkout>前往結帳</button><a class="cart-login-link" href="/customer/admin/">尚未登入？前往會員中心</a>';

    const shipping = root.querySelector('[data-cart-shipping]');
    const note = root.querySelector('[data-cart-note]');
    const deliveryFields = root.querySelector('[data-cart-delivery-fields]');
    const coupon = root.querySelector('[data-cart-coupon]');
    const pickup = root.querySelector('[data-cart-pickup]');
    const dateHint = root.querySelector('[data-cart-date-hint]');
    const quoteMessage = root.querySelector('[data-cart-quote-message]');
    const checkoutMessage = root.querySelector('[data-cart-checkout-message]');
    const subtotalEl = root.querySelector('[data-cart-subtotal]');
    const shippingFeeEl = root.querySelector('[data-cart-shipping-fee]');
    const discountRow = root.querySelector('[data-cart-discount-row]');
    const discountEl = root.querySelector('[data-cart-discount]');
    const totalEl = root.querySelector('[data-cart-total]');
    const checkoutButton = root.querySelector('[data-cart-checkout]');
    const applyCouponButton = root.querySelector('[data-apply-coupon]');
    let quoteTimer;
    if (applyCouponButton) applyCouponButton.hidden = true;
    const method = saved('sensen-cart-shipping') || 'pickup';
    shipping.value = ['pickup', 'home', 'frozen'].includes(method) ? method : 'pickup';
    const minDate = new Date(); minDate.setHours(0, 0, 0, 0); minDate.setDate(minDate.getDate() + Number(cart.leadDays || 5));
    pickup.min = toIsoDate(minDate); pickup.value = saved('sensen-cart-pickup') >= pickup.min ? saved('sensen-cart-pickup') : pickup.min;
    dateHint.textContent = '最早可取貨／配送日期：' + pickup.min + '（依購物車內最長製作時間計算）';

    const fillAddress = async () => {
      try {
        const data = await api('/api/me');
        const address = data.address || {};
        [['[data-cart-recipient]', 'fullName'], ['[data-cart-phone]', 'phone'], ['[data-cart-address]', 'address']].forEach(([selector, key]) => { const field = root.querySelector(selector); if (field && !field.value) field.value = address[key] || ''; });
      } catch (_) { /* 會員登入會在送出訂單時檢查 */ }
    };
    const syncDeliveryFields = () => { deliveryFields.hidden = shipping.value === 'pickup'; if (shipping.value !== 'pickup') fillAddress(); save(); };
    const quote = async () => {
      showMessage(quoteMessage, '');
      try {
        const data = await api('/api/cart/quote', { method: 'POST', body: JSON.stringify({ couponCode: coupon.value.trim(), shippingMethod: shipping.value }) });
        subtotalEl.textContent = money(data.subtotal); shippingFeeEl.textContent = money(data.shippingFee); discountRow.hidden = !Number(data.discount); discountEl.textContent = '-' + money(data.discount); totalEl.textContent = money(data.total); save();
        if (coupon.value.trim()) showMessage(quoteMessage, Number(data.discount) ? '優惠碼已套用。' : '優惠碼有效，但目前沒有折扣。');
      } catch (error) { showMessage(quoteMessage, error.message, true); }
    };
    root.querySelectorAll('[data-cart-id]').forEach(button => button.addEventListener('click', async () => { await api('/api/cart/item', { method: 'PATCH', body: JSON.stringify({ productId: button.dataset.cartId, qty: Number(button.dataset.cartQty) }) }); load(); }));
    root.querySelectorAll('[data-cart-remove]').forEach(button => button.addEventListener('click', async () => { await api('/api/cart/item', { method: 'DELETE', body: JSON.stringify({ productId: button.dataset.cartRemove }) }); load(); }));
    shipping.addEventListener('change', () => { syncDeliveryFields(); quote(); });
    root.querySelector('[data-apply-coupon]').addEventListener('click', quote);
    coupon.addEventListener('input', () => {
      showMessage(quoteMessage, '');
      clearTimeout(quoteTimer);
      quoteTimer = setTimeout(quote, 500);
    }); coupon.addEventListener('change', save); pickup.addEventListener('change', save);
    syncDeliveryFields(); await quote();
    checkoutButton.addEventListener('click', async () => {
      try { if (!await requireLogin()) return; } catch (error) { showMessage(checkoutMessage, error.message, true); return; }
      save();
      window.location.assign('/checkout/');
    });
  };
  load().catch(error => { root.innerHTML = '<p class="cart-form-error">' + escapeHtml(error.message) + '</p>'; });
})();
