/* ns-fresh.js — stale-tab guard (v1, 2026-10-31).
   WHY: an SPA tab keeps old JS in memory forever, and back/forward cache
   restores old state — no server header can fix an already-open tab.
   This polls a tiny version.txt (no-store, a few bytes). When the site
   ships a newer version than the one this tab loaded with, it shows a
   slim bottom bar asking for one reload — it never reloads on its own,
   so no form data is lost. Dismissing it hides it until a NEWER version
   ships. Silent on any fetch failure (offline/slow). */
(function () {
  'use strict';
  var CURRENT = '20261031-06';
  var shownFor = null, lastCheck = 0;
  function showBanner() {
    if (shownFor === CURRENT || document.querySelector('.ns-fresh-bar')) return;
    shownFor = CURRENT;
    var bar = document.createElement('div');
    bar.className = 'ns-fresh-bar';
    bar.setAttribute('style', 'position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;gap:10px;padding:10px 14px;background:#0f172a;color:#fff;font-size:14px;font-family:system-ui,sans-serif;box-shadow:0 -2px 14px rgba(0,0,0,.3)');
    var msg = document.createElement('span');
    msg.style.flex = '1';
    msg.textContent = 'নতুন আপডেট এসেছে — নতুন ডিজাইন দেখতে রিফ্রেশ করুন';
    var go = document.createElement('button');
    go.type = 'button'; go.textContent = 'রিফ্রেশ';
    go.setAttribute('style', 'background:#0ea5e9;color:#fff;border:0;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer;flex:none');
    go.addEventListener('click', function () { location.reload(); });
    var x = document.createElement('button');
    x.type = 'button'; x.textContent = '×';
    x.setAttribute('style', 'background:transparent;color:#cbd5e1;border:0;font-size:20px;line-height:1;cursor:pointer;flex:none');
    x.addEventListener('click', function () { bar.remove(); });
    bar.appendChild(msg); bar.appendChild(go); bar.appendChild(x);
    document.body.appendChild(bar);
  }
  function check() {
    if (document.hidden) return;
    lastCheck = Date.now();
    try {
      var ctl = null;
      if (typeof AbortController !== 'undefined') { ctl = new AbortController(); setTimeout(function () { try { ctl.abort(); } catch (e) {} }, 10000); }
      fetch('version.txt', { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (r) {
        if (!r.ok) return '';
        return r.text();
      }).then(function (t) {
        if (t && t.trim() && t.trim() !== CURRENT) showBanner();
      }).catch(function () {});
    } catch (e) {}
  }
  setInterval(function () { if (Date.now() - lastCheck > 14 * 60 * 1000) check(); }, 60 * 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && Date.now() - lastCheck > 5 * 60 * 1000) check(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
  setTimeout(check, 30000);
})();
