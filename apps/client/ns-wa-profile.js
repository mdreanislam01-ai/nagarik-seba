/* Nagarik Seba client — WhatsApp support icon inside the profile
   card, client only (2026-10-30, user request).
   Before: the dashboard had a long "হোয়াটসঅ্যাপ সাপোর্ট" card
   under the profile card, linking to #/support (the site has no
   real external WhatsApp link — the audit found only the support
   page placeholder, so this icon goes to the same #/support
   destination, it does not invent a WhatsApp number/link).
   Now: that long card is hidden, and a green WhatsApp icon is
   added inside the profile card, next to the QR button, linking
   to #/support. Clicking it opens Support, same as before. */
(function () {
  'use strict';
  var WA_PATH = 'M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm-3.2-9.3c.3-.6 1-1 1.6-.7l1.1.7c.2.1.4.3.5.5l.7 1.2c.1.3 0 .7-.2.9l-.6.7c-.2.2-.3.5-.1.8.5 1 1.3 1.8 2.3 2.3.3.2.6.1.8-.1l.7-.6c.2-.2.6-.3.9-.2l1.2.7c.2.1.4.3.5.5l.7 1.1c.3.6-.1 1.3-.7 1.6-.6.3-1.2.4-1.8.2-2.6-.8-4.9-3.1-5.7-5.7-.2-.6-.1-1.2.2-1.8z';
  function apply() {
    try {
      // Hide the long WhatsApp card below the profile card.
      document.querySelectorAll('.wa-card').forEach(function (c) { c.remove(); });
      var row = document.querySelector('.profile-card .profile-row');
      if (!row || row.querySelector('.ns-wa-profile')) return;
      var a = document.createElement('a');
      a.className = 'ns-wa-profile';
      a.href = '#/support';
      a.title = 'WhatsApp সাপোর্ট';
      a.setAttribute('aria-label', 'WhatsApp সাপোর্ট');
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="' + WA_PATH + '"/></svg>';
      row.appendChild(a);
    } catch (e) {}
  }
  apply();
  window.addEventListener('hashchange', function () { setTimeout(apply, 80); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () { apply(); }).observe(mainEl, { childList: true, subtree: true });
  }
})();
