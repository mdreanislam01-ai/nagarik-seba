/* ns-dash-grid.js v1 — Dashboard in the dhakaseba layout style (own brand + real data).
   Transforms ONLY #/dashboard: adds heading + welcome + support button and rebuilds
   the service cards as a grid (pastel band + coloured icon tile + price pill).
   Menu (NS_CATS) and every other page are untouched. Tick pattern, no MutationObserver. */
(function () {
  'use strict';
  var BN = '০১২৩৪৫৬৭৮৯';
  function bn(n) { return String(n).replace(/\d/g, function (d) { return BN[d]; }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onDashboard() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    return h === '' || h.split('/')[0] === 'dashboard';
  }
  function loginShowing() { return !!(document.querySelector('#nsSlideCard') || document.querySelector('.ns-ll')); }
  function bandBg(c) {
    if (!c) return 'rgba(15,118,110,0.12)';
    c = String(c).trim();
    if (c.charAt(0) === '#' && (c.length === 7 || c.length === 4)) return c + '1f';
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (m) { var p = m[1].split(','); return 'rgba(' + p[0].trim() + ',' + p[1].trim() + ',' + p[2].trim() + ',0.12)'; }
    return 'rgba(15,118,110,0.12)';
  }
  function liveCount(id, fallback) {
    try {
      if (window.NS_STATE && NS_STATE.stats && NS_STATE.stats.by_service && NS_STATE.stats.by_service[id] != null) {
        return NS_STATE.stats.by_service[id];
      }
    } catch (e) {}
    return fallback;
  }
  function userName() {
    try { if (window.NS_STATE && NS_STATE.user && NS_STATE.user.name) return NS_STATE.user.name; } catch (e) {}
    try { if (typeof getProfileInfo === 'function') return getProfileInfo().name || 'ব্যবহারকারী'; } catch (e) {}
    return 'ব্যবহারকারী';
  }
  function transform() {
    var main = document.getElementById('main');
    if (!main) return;
    if (document.querySelector('#main .ns-dg-services')) { syncLive(); return; }
    var wrap = document.getElementById('service-cards');
    if (!wrap) return;
    var olds = wrap.querySelectorAll('.svc-card');
    if (!olds.length) return;
    if (typeof SERVICES === 'undefined' || !SERVICES.length) return;
    var byName = {};
    SERVICES.forEach(function (s) { byName[s.name] = s; });
    var cards = [];
    olds.forEach(function (card, i) {
      var head = card.querySelector('.svc-head');
      var nameEl = head ? head.querySelector('b') : null;
      var name = nameEl ? nameEl.textContent.trim() : '';
      var svc = byName[name] || SERVICES[i];
      if (!svc) return;
      var color = '#0f766e';
      try { if (head && head.style && head.style.background) color = head.style.background; } catch (e) {}
      var icon = '';
      try { var ic = card.querySelector('.card-ico'); if (ic) icon = ic.innerHTML; } catch (e) {}
      var fallbackCount = 0;
      try {
        var spans = card.querySelectorAll('.svc-body span');
        if (spans.length > 1) { var m = String(spans[1].textContent).match(/(\d+)/); if (m) fallbackCount = parseInt(m[1], 10); }
      } catch (e) {}
      cards.push({ svc: svc, color: color, icon: icon, count: liveCount(svc.id, fallbackCount) });
    });
    if (!cards.length) return;
    var dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    welcomeDate = dateStr;
    var waSvg = '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true" style="width:18px;height:18px;flex:none"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm-3.2-9.3c.3-.6 1-1 1.6-.7l1.1.7c.2.1.4.3.5.5l.7 1.2c.1.3 0 .7-.2.9l-.6.7c-.2.2-.3.5-.1.8.5 1 1.3 1.8 2.3 2.3.3.2.6.1.8-.1l.7-.6c.2-.2.6-.3.9-.2l1.2.7c.2.1.4.3.5.5l.7 1.1c.3.6-.1 1.3-.7 1.6-.6.3-1.2.4-1.8.2-2.6-.8-4.9-3.1-5.7-5.7-.2-.6-.1-1.2.2-1.8z"/></svg>';
    var headHtml = '<div class="ns-dg-head"><div class="ns-dg-head-l"><h2 class="ns-dg-title">ড্যাশবোর্ড</h2>'
      + '<div class="ns-dg-welcome">স্বাগতম ' + esc(userName()) + ', আজ ' + esc(dateStr) + '</div></div>'
      + '<div class="ns-dg-support"><a class="ns-dg-wa" href="#/support">' + waSvg + '<span>সাপোর্ট</span></a></div></div>';
    var gridHtml = cards.map(function (c) {
      var s = c.svc;
      var sub = (s.title && s.title !== s.name) ? '<span class="ns-dg-desc">' + esc(s.title) + '</span>' : '';
      var cnt = c.count > 0
        ? '<span class="ns-dg-count">' + bn(c.count) + 'টি কার্ড তালিকা</span>'
        : '<span class="ns-dg-count" style="display:none"></span>';
      return '<a class="ns-dg-card" href="#/service/' + esc(s.id) + '">'
        + '<span class="ns-dg-band" style="background:' + esc(bandBg(c.color)) + '"><span class="ns-dg-tile" style="background:' + esc(c.color) + '">' + c.icon + '</span></span>'
        + '<span class="ns-dg-body"><b class="ns-dg-name">' + esc(s.name) + '</b>' + sub
        + '<span class="ns-dg-foot"><span class="ns-dg-price" data-ns-dg-price="' + esc(s.id) + '">৳' + bn(s.cost) + '</span>' + cnt + '</span></span></a>';
    }).join('');
    var sec = document.createElement('section');
    sec.className = 'ns-dg-services';
    sec.innerHTML = '<h3 class="ns-dg-sec">সেবাসমূহ</h3><div class="ns-dg-grid">' + gridHtml + '</div>';
    var headDiv = document.createElement('div');
    headDiv.innerHTML = headHtml;
    main.insertBefore(headDiv.firstChild, main.firstChild);
    main.insertBefore(sec, wrap);
    main.classList.add('ns-dg-on');
  }
  var welcomeDate = '';
  function syncLive() {
    try {
      var wEl = document.querySelector('#main .ns-dg-welcome');
      if (wEl && window.NS_STATE && NS_STATE.user && NS_STATE.user.name && welcomeDate) {
        var wt = 'স্বাগতম ' + NS_STATE.user.name + ', আজ ' + welcomeDate;
        if (wEl.textContent !== wt) wEl.textContent = wt;
      }
      if (!window.NS_STATE || !NS_STATE.stats || !NS_STATE.stats.by_service) return;
      document.querySelectorAll('#main .ns-dg-card').forEach(function (cardEl) {
        var priceEl = cardEl.querySelector('[data-ns-dg-price]');
        if (!priceEl) return;
        var id = priceEl.getAttribute('data-ns-dg-price');
        var svc = (typeof SERVICES !== 'undefined') ? SERVICES.find(function (s) { return s.id === id; }) : null;
        if (svc) { var t = '৳' + bn(svc.cost); if (priceEl.textContent !== t) priceEl.textContent = t; }
        var n = NS_STATE.stats.by_service[id];
        var cntEl = cardEl.querySelector('.ns-dg-count');
        if (cntEl && n != null) {
          var ct = bn(n) + 'টি কার্ড তালিকা';
          if (n > 0) { cntEl.style.display = ''; if (cntEl.textContent !== ct) cntEl.textContent = ct; }
          else { cntEl.style.display = 'none'; }
        }
      });
    } catch (e) {}
  }
  function tick() {
    var main = document.getElementById('main');
    if (!onDashboard() || loginShowing()) { if (main) main.classList.remove('ns-dg-on'); return; }
    transform();
  }
  tick();
  setInterval(tick, 400);
  window.addEventListener('hashchange', tick);
  window.addEventListener('pageshow', tick);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
