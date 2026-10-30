/* ns-timeout.js — API fetch timeout guard, client only.
   Root cause found 2026-10-31: app.js's nsCall() uses plain fetch
   with NO timeout, and every page render awaits a long sequential
   chain (/settings, then /services, /me, /orders, /recharges,
   /login-logs, plus photo/stats/tickets on first load). On a very
   slow or flaky mobile connection a single hanging fetch therefore
   blocks the whole render forever: the sidebar highlight and the
   page ticker change (those run immediately on hash change), but
   the page content never repaints, so the old dashboard stays on
   screen and the site looks dead.
   Fix: wrap window.fetch for API calls only (same-origin /api/
   proxy and api.nagarikseba.com) with a 15-second AbortController
   timeout. A timed-out call rejects as a network error, which
   nsCall already retries once and render already catches, so the
   render completes with whatever data is available instead of
   hanging forever. Non-API fetches (CDN, etc.) pass through
   untouched, and a caller-supplied signal is never overridden.
   This does not make a slow network fast — it only guarantees
   the page eventually loads instead of staying stuck. */
(function () {
  'use strict';
  if (window.__nsFetchTimeoutInstalled) return;
  window.__nsFetchTimeoutInstalled = true;
  var origFetch = window.fetch.bind(window);
  var TIMEOUT_MS = 15000;
  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    var isApi = url.indexOf('/api/') !== -1 || url.indexOf('api.nagarikseba.com') !== -1;
    if (!isApi) return origFetch(input, init);
    if (init && init.signal) return origFetch(input, init);
    var controller = null;
    try { controller = new AbortController(); } catch (e) { return origFetch(input, init); }
    var timer = setTimeout(function () { try { controller.abort(); } catch (e) {} }, TIMEOUT_MS);
    var opts = {};
    if (init) { for (var k in init) { if (Object.prototype.hasOwnProperty.call(init, k)) opts[k] = init[k]; } }
    opts.signal = controller.signal;
    return origFetch(input, opts).then(function (r) {
      clearTimeout(timer); return r;
    }, function (e) {
      clearTimeout(timer); throw e;
    });
  };
})();
