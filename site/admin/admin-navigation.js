(() => {
  const navigationItems = [
    ['index.html', 'ti-home', '後台總覽'],
    ['inventory.html', 'ti-box-seam', '商品庫存'],
    ['store-management.html', 'ti-shopping-cart', '門市管理'],
    ['create-product.html', 'ti-plus', '新增商品'],
    ['reports.html', 'ti-receipt', '報表分析'],
    ['discount-codes.html', 'ti-discount-2', '優惠碼'],
    ['news-editor.html', 'ti-news', '最新消息'],
    ['404-error.html', 'ti-alert-circle', '404 Error'],
    ['docs.html', 'ti-file-text', '使用說明']
  ];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.querySelector('#sidebar');
  if (sidebar) {
    sidebar.innerHTML = `<div class="logo-area"><div class="patria-admin-brand"><span class="patria-admin-icon"><i class="ti ti-tools-kitchen-2"></i></span><span class="patria-admin-copy"><strong>森森</strong><em>SENSEN BAKERY</em></span></div></div><ul class="nav flex-column"><li class="px-4 py-2"><small class="nav-text">主要功能</small></li>${navigationItems.map(([href, icon, label]) => `<li><a class="nav-link${href === currentPage ? ' active' : ''}" href="${href}"${href === currentPage ? ' aria-current="page"' : ''}><i class="ti ${icon}"></i><span class="nav-text">${label}</span></a></li>`).join('')}<li><a class="nav-link" href="/"><i class="ti ti-arrow-back-up"></i><span class="nav-text">返回森森官網</span></a></li><li class="px-4 pt-4 pb-2"><small class="nav-text">帳戶</small></li><li><a class="nav-link" href="signin.html"><i class="ti ti-logout"></i><span class="nav-text">登入</span></a></li><li><a class="nav-link" href="signup.html"><i class="ti ti-user-plus"></i><span class="nav-text">註冊</span></a></li></ul>`;
  }

  const topbar = document.querySelector('#topbar');
  if (topbar) {
    topbar.innerHTML = `<button id="toggleBtn" class="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm" type="button" aria-label="收合側欄"><i class="ti ti-layout-sidebar-left-expand"></i></button><button id="mobileBtn" class="btn btn-light btn-icon btn-sm d-lg-none me-2" type="button" aria-label="開啟側欄"><i class="ti ti-layout-sidebar-left-expand"></i></button><div class="ms-auto d-flex align-items-center gap-3"><span class="text-secondary small d-none d-sm-inline">森森後台 · 管理員</span><a class="position-relative btn-icon btn-sm btn-light btn rounded-circle" data-bs-toggle="dropdown" aria-expanded="false" href="#" role="button" aria-label="通知"><i class="ti ti-bell"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2" data-admin-notification-count>0<span class="visually-hidden">則未讀通知</span></span></a><div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-0"><ul class="list-unstyled p-0 m-0" data-admin-notifications><li class="p-3 text-secondary small">載入會員活動…</li></ul></div><img src="/images/admin/avatar-1.jpg" alt="管理員" class="avatar avatar-sm rounded-circle"></div>`;
  }
})();
