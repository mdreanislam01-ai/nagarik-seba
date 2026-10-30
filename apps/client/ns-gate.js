/* ns-gate.js — Entry notice gate (2026-10-31, v3).
   RULE CHANGE 2026-10-31 (user instruction): the gate shows ONLY
   at login time — never again on a page reload for a logged-in
   user, and never again in the same tab after consent.
   - Logged in (ns_token in localStorage or sessionStorage, the
     same key app.js uses) → the gate is removed at once, before
     anything is painted, so a reload on any page never pops it.
   - Not logged in, first entry in this tab → the gate shows, as
     before; consent is remembered in sessionStorage for this tab
     only, so a reload in the same tab does not pop it again.
   - New tab / new session, still logged out → the gate shows
     again at entry, i.e. at login time.
   Cross still does NOT dismiss to the site — it shows the blocked
   screen, with only "notice again" as a way back. */
(function () {
  var gate = document.getElementById('nsGate');
  if (!gate) return;
  function hasToken() {
    try {
      return !!(localStorage.getItem('ns_token') || sessionStorage.getItem('ns_token'));
    } catch (e) { return false; }
  }
  function hasConsent() {
    try { return sessionStorage.getItem('ns_gate_ok') === '1'; } catch (e) { return false; }
  }
  if (hasToken() || hasConsent()) { gate.remove(); return; }
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
