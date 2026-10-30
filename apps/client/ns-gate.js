/* ns-gate.js — Entry notice gate (2026-10-30).
   The gate is painted in index.html before app.js runs, so login /
   registration are never visible first. Consent is per browser
   session (sessionStorage): a fresh visit shows the notice again,
   and inside one session it never reappears on navigation.
   Cross does NOT dismiss to the site — it shows the blocked screen,
   with only "notice again" as a way back. No login is reachable
   without consent in this session. */
(function () {
  var gate = document.getElementById('nsGate');
  if (!gate) return;
  try {
    if (sessionStorage.getItem('ns_gate_ok') === '1') { gate.remove(); return; }
  } catch (e) {}
  window.nsGateConsent = function () {
    try { sessionStorage.setItem('ns_gate_ok', '1'); } catch (e) {}
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
