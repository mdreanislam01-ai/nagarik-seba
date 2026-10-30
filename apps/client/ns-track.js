/* ns-track.js — First-party visitor tracking for nagarikseba.com (2026-10-30).
   Sends ONE anonymous page-view per page (session id stored locally,
   no user id, no login data) to POST /api/visits, and the session
   length to POST /api/visits/duration when the tab closes. The admin
   "ভিজিটর পরিসংখ্যান" page reads these rows; nothing is sent to any
   third party from this script (the API server itself does a cached
   IP-to-city lookup for the location column). All failures are
   silent so tracking can never break the site. */
(function () {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  var KEY = 'ns_track_sid', START = 'ns_track_start';
  function sid() {
    try {
      var s = localStorage.getItem(KEY);
      if (!s) {
        s = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
          : ('ns-' + Date.now() + '-' + Math.floor(Math.random() * 1e9));
        localStorage.setItem(KEY, s);
      }
      return s;
    } catch (e) { return 'ns-' + Date.now(); }
  }
  function start() {
    try {
      var t = localStorage.getItem(START);
      if (!t) { t = String(Date.now()); localStorage.setItem(START, t); }
      return Number(t) || Date.now();
    } catch (e) { return Date.now(); }
  }
  function post(path, body) {
    try {
      fetch('/api' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }
  function track() {
    post('/visits', { session_id: sid(), page: (location.hash || '#/dashboard').slice(0, 200) });
  }
  track();
  window.addEventListener('hashchange', track);
  window.addEventListener('pagehide', function () {
    var secs = Math.round((Date.now() - start()) / 1000);
    if (secs >= 5) post('/visits/duration', { session_id: sid(), seconds: secs });
  });
})();
