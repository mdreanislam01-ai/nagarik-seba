/* ns-shell.js v1 — Whole customer portal in the dhakaseba layout style (own brand + own data).
   Shell only: fixed white sidebar (own logo + name, bottom profile card), white header
   (Home button + real balance pill + bell + theme switch), pale grey-blue page,
   mobile bottom nav. Option pages keep their own fields/prices/flows; only their
   look is restyled (see ns-shell.css). Login portal untouched. Tick pattern, no MutationObserver. */
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
  var CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M9.5 10.5h5"/></svg>';

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
      { h: '#/dashboard', ico: HOME_SVG, label: 'হোম', key: 'home' },
      { h: '#/dashboard', ico: GRID_SVG, label: 'সেবা', key: 'services' },
      { h: '#/recharge', ico: PLUS_SVG, label: 'রিচার্জ', key: 'recharge' },
      { h: '#/history/nid', ico: CLOCK_SVG, label: 'হিস্টোরি', key: 'history' },
      { h: '#/profile', ico: USER_SVG, label: 'প্রোফাইল', key: 'profile' }
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
        (k === 'recharge' && first === 'recharge') ||
        (k === 'history' && first === 'history') ||
        (k === 'profile' && (first === 'profile' || first === 'myinfo' || first === 'devices'));
      a.classList.toggle('active', !!on);
    });
  }
  function tick() {
    if (!loggedIn()) { document.body.classList.remove('ns-sh-on'); return; }
    document.body.classList.add('ns-sh-on');
    ensureHeader();
    ensureSidebar();
    ensureBottomNav();
    syncLive();
  }
  tick();
  setInterval(tick, 400);
  window.addEventListener('hashchange', tick);
  window.addEventListener('pageshow', tick);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
