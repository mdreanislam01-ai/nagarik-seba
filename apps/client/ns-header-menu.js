/* ns-header-menu.js v1 — site's own three-dot header menu (client only, 2026-11-07).
   The ⋮ button in header row 1 opens a right-side vertical dropdown with
   EXISTING options only: Profile, Notifications, Dark Mode (the site's own
   switch, moved here from the header row), Logout. No new options.
   Closes on outside click, Escape, hash change, or item click. The button is
   static HTML in index.html — one-time setup, no tick needed. */
(function () {
  'use strict';
  function setup() {
    var btn = document.getElementById('nsDotsBtn');
    var menu = document.getElementById('nsDotsMenu');
    if (!btn || !menu || btn._nsDotsWired) return;
    btn._nsDotsWired = true;
    function open() {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      if (menu.hidden) return;
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    window.addEventListener('hashchange', close);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
