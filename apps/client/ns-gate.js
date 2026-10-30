/* ns-gate.js — Entry notice gate (2026-10-30).
   The gate is painted in index.html before app.js runs, so login /
   registration are never visible first. The gate shows on EVERY
   page load; consent only removes it until the next load, and
   inside one page it never reappears on navigation.
   Cross does NOT dismiss to the site — it shows the blocked screen,
   with only "notice again" as a way back. No login is reachable
   without consent in this session. */
(function () {
  var gate = document.getElementById('nsGate');
  if (!gate) return;
  /* 2026-10-30 fix: NO stored consent. Earlier the consent was saved
     in sessionStorage, so the notice showed only once and never again
     in the same tab/session — that is why the user saw it once and
     then never. Now the gate shows on EVERY page load / fresh entry,
     and consent only removes it until the next load. SPA navigation
     (hash change) does not reload the page, so it does not reappear
     while moving inside the site. */
  window.nsGateConsent = function () {
    gate.remove();
  };
  window.nsGateClose = function () {
    var card = document.getElementById('nsGateCardBody');
    var blocked = document.getElementById('nsGateBlocked');
    if (card) card.style.display = 'none';
    if (blocked) blocked.style.display = 'block';
  };
  window.nsGateAgain = function () {
    var card = document.getElementById('nsGateCardBody');
    var blocked = document.getElementById('nsGateBlocked');
    if (blocked) blocked.style.display = 'none';
    if (card) card.style.display = 'block';
  };
})();
