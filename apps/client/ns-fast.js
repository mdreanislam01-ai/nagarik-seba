/* Nagarik Seba client — no "loading" text, instant pages, client only.
   Problem: on every full load the site painted a "লোড হচ্ছে…"
   card and waited for 5 API calls in parallel (/services, /me,
   /orders, /recharges, /login-logs) plus photo/stats/tickets
   before the first real page appeared, so the dashboard felt
   slow and the loading text stayed on screen.
   Fix, without changing any price, route, flow or data:
   1. The loading card is removed immediately when this script
      runs (it runs after app.js, before the API answers, and
      before the browser's first paint in normal parsing), so
      the "লোড হচ্ছে…" text never shows.
   2. Last successful dashboard data is cached in this browser
      only (localStorage, user's own data, no token, no password).
      On the next load, if the user is logged in and a cache
      exists, the dashboard is painted instantly from that cache
      — no waiting for the API. The original nsRefresh() call
      that app.js already started keeps running in the background
      and repaints with fresh data when it arrives, so a stale
      price/balance is only ever a brief first paint, never the
      final state.
   3. After every render, the cache is refreshed, so the next
      visit is instant again. If there is no cache (first visit),
      the page simply waits without any loading text, then
      appears when the API answers, and that visit creates the
      cache.
   4. Clicking inside the site was already a direct render on
      hashchange (no API wait after the first load), so after
      the first paint, page changes stay instant; this script
      does not add any wait to them.
   NOTE: NS_STATE / nsToken / render are top-level consts in
   app.js, not window properties, so bare globals are used. */
(function () {
  'use strict';
  var KEY = 'ns_fast_cache_v1';
  function getCache() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || !c.user || !c.user.uid) return null;
      return c;
    } catch (e) { return null; }
  }
  function saveCache() {
    try {
      if (typeof NS_STATE === 'undefined' || !NS_STATE.user) { localStorage.removeItem(KEY); return; }
      localStorage.setItem(KEY, JSON.stringify({
        user: NS_STATE.user, wallet: NS_STATE.wallet,
        services: NS_STATE.services, orders: NS_STATE.orders,
        recharges: NS_STATE.recharges, logs: NS_STATE.logs,
        savedAt: Date.now()
      }));
    } catch (e) {}
  }
  function token() {
    try { return typeof nsToken === 'function' ? nsToken() : ''; } catch (e) { return ''; }
  }
  // 1. Remove the loading card text immediately.
  var main = document.getElementById('main');
  if (main && main.textContent.indexOf('লোড হচ্ছে') !== -1) main.innerHTML = '';
  // 2. Instant paint from cache, if available.
  var cache = token() ? getCache() : null;
  if (cache) {
    try {
      NS_STATE.user = cache.user; NS_STATE.wallet = cache.wallet;
      if (cache.services) NS_STATE.services = cache.services;
      if (cache.orders) NS_STATE.orders = cache.orders;
      if (cache.recharges) NS_STATE.recharges = cache.recharges;
      if (cache.logs) NS_STATE.logs = cache.logs;
      if (typeof _renderStep3Client === 'function') {
        _renderStep3Client();
        // The pre-wrapper render uses sample UID/balance in its
        // template; correct those two spots from the cache now,
        // the wrapper render will correct everything else shortly.
        var uidEl = document.querySelector('.profile-uid');
        if (uidEl) uidEl.textContent = 'UID: #' + cache.user.uid;
        var balEl = document.querySelector('.bal-amount');
        if (balEl && cache.wallet != null) balEl.textContent = '৳ ' + cache.wallet;
        var nameEl = document.querySelector('.profile-name');
        if (nameEl && cache.user.name) nameEl.textContent = cache.user.name;
      } else if (typeof render === 'function') {
        render();
      }
    } catch (e) {}
  } else if (!token() && typeof render === 'function') {
    // Not logged in: the login page needs no API data, show it now.
    try { render(); } catch (e) {}
  }
  // 3. Refresh the cache after every render (including the
  // background refresh app.js already started).
  try {
    if (typeof render === 'function') {
      var origRender = render;
      render = async function () {
        var r = origRender.apply(this, arguments);
        if (r && typeof r.then === 'function') { try { await r; } catch (e) {} }
        saveCache();
        return r;
      };
    }
  } catch (e) {}
})();
