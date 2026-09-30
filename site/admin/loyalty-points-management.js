(() => {
  const api = async (path, options = {}) => {
    const response = await fetch(path, {
      ...options,
      credentials: 'include',
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || '紅利點數服務暫時無法使用。');
    return data;
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const formatDate = value => {
    const text = String(value || '').trim();
    if (!text) return '-';
    const date = new Date(/^\d{4}-\d{2}-\d{2}T/.test(text) ? text : text.replace(' ', 'T') + 'Z');
    return Number.isNaN(date.getTime()) ? text : new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  };

  const form = document.querySelector('#points-rule-form');
  const message = document.querySelector('#points-message');
  const formStatus = document.querySelector('#points-form-status');
  const table = document.querySelector('#points-table');
  const setMessage = (text, error = false) => { message.textContent = text || ''; message.className = `small mb-3 ${error ? 'text-danger' : 'text-success'}`; };

  const fillRule = rule => {
    if (!rule) return;
    form.elements.enabled.checked = rule.enabled === true;
    form.elements.spendAmount.value = Number(rule.spendAmount || 100);
    form.elements.earnPoints.value = Number(rule.earnPoints || 1);
    form.elements.minimumOrderAmount.value = Number(rule.minimumOrderAmount || 0);
    form.elements.redeemPoints.value = Number(rule.redeemPoints || 1);
    form.elements.redeemAmount.value = Number(rule.redeemAmount || 1);
    form.elements.description.value = rule.description || '';
  };

  const render = data => {
    fillRule(data.rule);
    const summary = data.summary || {};
    document.querySelector('[data-points-summary="points"]').textContent = Number(summary.points || 0).toLocaleString('zh-TW');
    document.querySelector('[data-points-summary="members"]').textContent = Number(summary.memberCount || 0).toLocaleString('zh-TW');
    document.querySelector('[data-points-summary="transactions"]').textContent = Number(summary.transactionCount || 0).toLocaleString('zh-TW');
    const transactions = data.transactions || [];
    table.innerHTML = transactions.length ? transactions.map(item => {
      const points = Number(item.points || 0);
      return `<tr><td><strong>${escapeHtml(item.memberName || '會員')}</strong></td><td>${escapeHtml(item.memberEmail || '-')}</td><td class="fw-semibold ${points < 0 ? 'text-danger' : 'text-success'}">${points > 0 ? '+' : ''}${points.toLocaleString('zh-TW')}</td><td>${escapeHtml(item.description || '點數異動')}</td><td>${escapeHtml(formatDate(item.createdAt))}</td></tr>`;
    }).join('') : '<tr><td colspan="5" class="text-secondary py-4">目前尚無點數紀錄。</td></tr>';
  };

  const load = async () => {
    try {
      render(await api('/api/admin/points/rules'));
      setMessage('紅利點數規則已載入。');
    } catch (error) {
      setMessage(error.message || '紅利點數規則載入失敗。', true);
      table.innerHTML = `<tr><td colspan="5" class="text-danger py-4">${escapeHtml(error.message || '無法載入點數資料。')}</td></tr>`;
    }
  };

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    formStatus.textContent = '儲存中…';
    try {
      const fields = new FormData(form);
      const data = await api('/api/admin/points/rules', { method: 'PUT', body: JSON.stringify({
        enabled: form.elements.enabled.checked,
        spendAmount: Number(fields.get('spendAmount')),
        earnPoints: Number(fields.get('earnPoints')),
        minimumOrderAmount: Number(fields.get('minimumOrderAmount')),
        redeemPoints: Number(fields.get('redeemPoints')),
        redeemAmount: Number(fields.get('redeemAmount')),
        description: fields.get('description'),
      }) });
      fillRule(data.rule);
      formStatus.textContent = '規則已儲存。';
      setMessage('紅利點數規則已更新，會員端將依新規則顯示。');
    } catch (error) {
      formStatus.textContent = '';
      setMessage(error.message || '紅利點數規則儲存失敗。', true);
    } finally {
      button.disabled = false;
    }
  });

  load();
})();
