/* Nagarik Seba client — brn field icons, client only.
   Follows the Infinity Waves screenshot field-by-field, without
   swapping any other icon and without changing field names, order
   in the DOM, or any other design:
   - Gender (DOM index 4) was a plain person icon; in the screenshot
     it is an ID-card icon (person inside a card). Replace with the
     site's existing ID-card SVG shape.
   - Nationality fields (DOM indices 15, 16, 19, 20: পিতার জাতীয়তা,
     Father Nationality, মাতার জাতীয়তা, Mother Nationality) were a
     plain single-person icon; in the screenshot they are a group
     (two persons) icon. Replace with a group SVG in the site's
     existing outline style.
   All other brn icons already match the screenshot by type and are
   left untouched: Register Office = building, Upazila/Zila and
   birth place = pin, dates = calendar, Left Bar Code = barcode,
   QR Link = QR squares, names = single person, addresses = home.
   Applies to both the brn service page and the brn copy form on
   the newbdris page (both use .brn-grid). */
(function () {
  'use strict';
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var ID_CARD = svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c1-1.5 2-2 3-2s2 .5 3 2"/><path d="M14 9h4M14 13h4"/>');
  var GROUP = svg('<circle cx="9" cy="8" r="3"/><path d="M2.5 20c0-3 2.8-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c2.2 0.3 4.5 1.7 4.5 4"/>');
  function apply() {
    document.querySelectorAll('.brn-grid').forEach(function (grid) {
      var fields = grid.querySelectorAll('.brn-field');
      fields.forEach(function (field, i) {
        if (field.dataset.nsIconFixed) return;
        var ico = field.querySelector('.brn-ico');
        if (!ico) return;
        if (i === 4) { ico.innerHTML = ID_CARD; field.dataset.nsIconFixed = '1'; }
        else if (i === 15 || i === 16 || i === 19 || i === 20) { ico.innerHTML = GROUP; field.dataset.nsIconFixed = '1'; }
      });
    });
  }
  apply();
  window.addEventListener('hashchange', function () { setTimeout(apply, 100); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () { apply(); }).observe(mainEl, { childList: true, subtree: true });
  }
})();
