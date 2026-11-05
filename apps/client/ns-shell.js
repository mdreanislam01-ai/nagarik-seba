/* ns-shell.js v2 — Whole customer portal in the dhakaseba layout style (own brand + own prices).
   Shell: fixed white sidebar (own logo + name, bottom profile card), white header
   (Home button + real balance pill + bell + theme switch), pale grey-blue page,
   mobile bottom nav (Home/Wallet/Services/Transactions/Profile, as in the reference
   screenshots). Option pages: fee + balance pills, striped form-card edge, info-card
   title, full-width order button — own fields/prices/flows unchanged. Login portal
   untouched. Tick pattern, no MutationObserver. */
(function () {
  'use strict';
  var BN = '০১২৩৪৫৬৭৮৯';
  function bn(n) { return String(n).replace(/\d/g, function (d) { return BN[d]; }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function loggedIn() {
    try {
      if (document.body.classList.contains('ns-login-portal')) return false;
      if (document.querySelector('#nsSlideCard') || document.querySelector('.ns-ll')) return false;
      return typeof nsToken === 'function' ? !!nsToken() : false;
    } catch (e) { return false; }
  }
  function hash() { return (location.hash || '').replace(/^#\/?/, ''); }
  var HOME_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>';
  var WALLET_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>';
  var GRID_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  var USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>';
  var RECEIPT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3h14v18l-2-1.5L15 21l-2-1.5L11 21l-2-1.5L7 21l-2-1.5z"/><path d="M9 8h6M9 12h6"/></svg>';

  function headerLogo() {
    try {
      var img = document.querySelector('header.topbar .logo-mark img') || document.querySelector('header.topbar img');
      if (img && img.getAttribute('src')) return img.getAttribute('src');
    } catch (e) {}
    return '';
  }
  function userInfo() {
    try {
      if (typeof NS_STATE !== 'undefined' && NS_STATE && NS_STATE.user) return NS_STATE.user;
    } catch (e) {}
    return null;
  }
  function wallet() {
    try {
      if (typeof NS_STATE !== 'undefined' && NS_STATE && NS_STATE.wallet != null) return NS_STATE.wallet;
    } catch (e) {}
    return null;
  }

  function ensureHeader() {
    var header = document.querySelector('header.topbar');
    if (!header) return;
    if (!document.getElementById('nsShHome')) {
      var home = document.createElement('a');
      home.id = 'nsShHome';
      home.className = 'ns-sh-home';
      home.href = '#/dashboard';
      home.innerHTML = HOME_SVG + '<span>হোম</span>';
      var logo = header.querySelector('.logo-mark');
      if (logo && logo.nextSibling) header.insertBefore(home, logo.nextSibling);
      else if (logo) header.appendChild(home);
      else header.insertBefore(home, header.firstChild);
    }
    if (!document.getElementById('nsShBal')) {
      var bal = document.createElement('a');
      bal.id = 'nsShBal';
      bal.className = 'ns-sh-bal';
      bal.href = '#/recharge';
      bal.innerHTML = WALLET_SVG + '<span class="ns-sh-bal-amt">৳ —</span>';
      var bell = header.querySelector('.ns-bell');
      if (bell) header.insertBefore(bal, bell);
      else header.appendChild(bal);
    }
  }
  function ensureSidebar() {
    var side = document.getElementById('sidebar');
    if (!side) return;
    if (!document.getElementById('nsShSideHead')) {
      var head = document.createElement('div');
      head.id = 'nsShSideHead';
      head.className = 'ns-sh-side-head';
      var src = headerLogo();
      var logoHtml = src
        ? '<span class="ns-sh-side-logo"><img src="' + esc(src) + '" alt="নাগরিক সেবা"></span>'
        : '<span class="ns-sh-side-logo ns-sh-side-logo-txt">না</span>';
      head.innerHTML = logoHtml + '<span class="ns-sh-side-name">নাগরিক সেবা</span>';
      side.insertBefore(head, side.firstChild);
    }
    if (!document.getElementById('nsShSideProf')) {
      var prof = document.createElement('a');
      prof.id = 'nsShSideProf';
      prof.className = 'ns-sh-side-prof';
      prof.href = '#/profile';
      prof.innerHTML = '<span class="ns-sh-side-av">…</span><span class="ns-sh-side-pi"><b>…</b><small>…</small></span>';
      var logout = side.querySelector('.sidebar-logout');
      if (logout) side.insertBefore(prof, logout);
      else side.appendChild(prof);
    }
  }
  function ensureBottomNav() {
    if (document.getElementById('nsBottomNav')) return;
    var nav = document.createElement('nav');
    nav.id = 'nsBottomNav';
    nav.setAttribute('aria-label', 'নিচের মেনু');
    var items = [
      { h: '#/dashboard', ico: HOME_SVG, label: 'Home', key: 'home' },
      { h: '#/recharge', ico: WALLET_SVG, label: 'Wallet', key: 'wallet' },
      { h: '#/dashboard', ico: GRID_SVG, label: 'Services', key: 'services' },
      { h: '#/history/nid', ico: RECEIPT_SVG, label: 'Transactions', key: 'transactions' },
      { h: '#/profile', ico: USER_SVG, label: 'Profile', key: 'profile' }
    ];
    nav.innerHTML = items.map(function (it) {
      return '<a class="ns-sh-bn" data-ns-bn="' + it.key + '" href="' + it.h + '">' + it.ico + '<span>' + it.label + '</span></a>';
    }).join('');
    document.body.appendChild(nav);
    var svc = nav.querySelector('[data-ns-bn="services"]');
    if (svc) svc.addEventListener('click', function (e) {
      if (hash() === '' || hash().split('/')[0] === 'dashboard') {
        var target = document.querySelector('#main .ns-dg-services') || document.getElementById('service-cards');
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  }
  function syncLive() {
    var w = wallet();
    var bal = document.getElementById('nsShBal');
    if (bal) {
      var amt = bal.querySelector('.ns-sh-bal-amt');
      if (w != null) { bal.style.display = ''; if (amt) amt.textContent = '৳' + bn(w); }
      else bal.style.display = 'none';
    }
    var u = userInfo();
    var prof = document.getElementById('nsShSideProf');
    if (prof && u) {
      var av = prof.querySelector('.ns-sh-side-av');
      var nm = prof.querySelector('.ns-sh-side-pi b');
      var em = prof.querySelector('.ns-sh-side-pi small');
      if (u.name) {
        if (av && av.textContent !== u.name.charAt(0)) av.textContent = u.name.charAt(0);
        if (nm && nm.textContent !== u.name) nm.textContent = u.name;
      }
      if (u.email && em && em.textContent !== u.email) em.textContent = u.email;
    }
    var h = hash(), first = h.split('/')[0];
    document.querySelectorAll('#nsBottomNav .ns-sh-bn').forEach(function (a) {
      var k = a.getAttribute('data-ns-bn');
      var on = (k === 'home' && (h === '' || first === 'dashboard')) ||
        (k === 'services' && (first === 'service' || first === 'order' || first === 'free')) ||
        (k === 'wallet' && first === 'recharge') ||
        (k === 'transactions' && first === 'history') ||
        (k === 'profile' && (first === 'profile' || first === 'myinfo' || first === 'devices'));
      a.classList.toggle('active', !!on);
    });
  }
  /* Option pages (service/order/free): fee + balance pills, striped form card,
     info-card title — own fields/prices/flows unchanged. */
  function enhanceOptionPage() {
    var h = hash(), parts = h.split('/');
    if (parts[0] !== 'service' && parts[0] !== 'order' && parts[0] !== 'free') return;
    var card = document.querySelector('#main .card');
    if (!card) return;
    if (!card.classList.contains('ns-sh-striped')) card.classList.add('ns-sh-striped');
    if (!card.querySelector('.ns-sh-pills')) {
      var svc = null;
      try {
        var list = parts[0] === 'service' ? (typeof SERVICES !== 'undefined' ? SERVICES : []) : (typeof ORDERS !== 'undefined' ? ORDERS : []);
        for (var i = 0; i < list.length; i++) { if (list[i] && list[i].id === parts[1]) { svc = list[i]; break; } }
      } catch (e) {}
      var w = wallet();
      var pills = document.createElement('div');
      pills.className = 'ns-sh-pills';
      pills.innerHTML = (svc && svc.cost != null ? '<span class="ns-sh-pill ns-sh-pill-fee">✦ ফি: ৳' + bn(svc.cost) + '</span>' : '')
        + '<span class="ns-sh-pill ns-sh-pill-bal">💳 ব্যালেন্স: ৳' + (w != null ? bn(w) : '—') + '</span>';
      var h2 = card.querySelector('h2');
      if (h2 && h2.nextSibling) card.insertBefore(pills, h2.nextSibling);
      else card.insertBefore(pills, card.firstChild);
    }
    var balPill = card.querySelector('.ns-sh-pill-bal');
    if (balPill) {
      var w2 = wallet();
      var bt = '💳 ব্যালেন্স: ৳' + (w2 != null ? bn(w2) : '—');
      if (balPill.textContent !== bt) balPill.textContent = bt;
    }
    var notice = card.querySelector('.notice');
    if (notice && !card.querySelector('.ns-sh-info-title')) {
      var t = document.createElement('h4');
      t.className = 'ns-sh-info-title';
      t.textContent = 'সার্ভিস তথ্য ও নিয়মাবলী';
      notice.parentNode.insertBefore(t, notice);
    }
  }
  function tick() {
    if (!loggedIn()) { document.body.classList.remove('ns-sh-on'); return; }
    document.body.classList.add('ns-sh-on');
    ensureHeader();
    ensureSidebar();
    ensureBottomNav();
    syncLive();
    enhanceOptionPage();
  }
  tick();
  setInterval(tick, 400);
  window.addEventListener('hashchange', tick);
  window.addEventListener('pageshow', tick);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
