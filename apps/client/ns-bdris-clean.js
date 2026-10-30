/* Nagarik Seba client — newbdris page cleanup, client only.
   On #/order/newbdris only:
   - 2026-10-30, at the user's explicit instruction (screenshot
     with the whole card crossed out): the ENTIRE order card is
     removed — "নতুন জন্ম নিবন্ধন আবেদন" heading, delivery note,
     closed banner, "অপশন বাছুন" label, option pills and total
     note, all of it. Nothing of that card remains on the page.
   - Consequence, handled honestly: without a selected option
     the order would have no price. So the order now always
     goes as নরমাল (800 টাকা) — the option that was selected
     by default in the user's screenshot — resolved server-side
     from option_name, exactly as before. If the user wants a
     different fixed price, change DEFAULT_OPTION below.
   - The remaining order button at the bottom of the brn form
     submits the newbdris ORDER with that option and the filled
     brn fields as payload, instead of the old brn-service
     (5 tk) button. No route or API change. */
(function () {
  'use strict';
  var BRN_FIELDS = ['Register Office Address*','Upazila / Pourashava / City Corporation','Zila*','Birth Registration Number*','Gender*','Date of Registration*','Date of Issuance*','Left Bar Code*','QR Link*','Date of Birth*','Date of Birth in Word','নাম*','Name','পিতার নাম*','Father Name','পিতার জাতীয়তা','Father Nationality','মাতার নাম*','Mother Name','মাতার জাতীয়তা','Mother Nationality','জন্মস্থান*','Place of Birth','স্থায়ী ঠিকানা*','Permanent Address'];
  function isNewBdris() {
    return (location.hash || '').indexOf('newbdris') !== -1;
  }
  var DEFAULT_OPTION = { name: 'নরমাল', text: 'নরমাল (800 টাকা)' };
  function selectedOption() {
    // The option card was removed entirely (user instruction,
    // 2026-10-30), so there is no pill to read any more. The
    // order always uses the default option above.
    var sel = document.querySelector('#opts .opt.sel');
    if (!sel) return DEFAULT_OPTION;
    var txt = (sel.textContent || '').trim();
    return { name: txt.replace(/\s*\(.*$/, ''), text: txt };
  }
  var applying = false;
  function updateTotal() {
    var el = document.getElementById('nsBdrisTotal');
    var sel = selectedOption();
    var txt = sel ? ('এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + sel.text + ' কাটা হবে।') : 'অপশন বাছুন।';
    if (el && el.textContent !== txt) el.textContent = txt;
  }
  window.nsNewBdrisOrder = async function () {
    try {
      if (typeof nsToken === 'function' && !nsToken()) {
        if (typeof showModal === 'function') showModal('লগইন প্রয়োজন', 'অর্ডার করতে প্রথমে লগইন করুন।');
        location.hash = '#/login'; return;
      }
      var sel = selectedOption() || DEFAULT_OPTION;
      var card = document.getElementById('brnCopyCard');
      var inputs = card ? card.querySelectorAll('.brn-grid input, .brn-grid select, .brn-grid textarea') : [];
      var fields = BRN_FIELDS.map(function (f, i) {
        return { field: f, value: (inputs[i] && inputs[i].value) || '' };
      });
      var r = await nsCall('/orders', 'POST', { service_id: 'newbdris', option_name: sel.name, payload: { fields: fields } });
      if (typeof NS_STATE !== 'undefined') NS_STATE.wallet = r.wallet_bdt;
      if (typeof nsRefresh === 'function') await nsRefresh(true);
      if (typeof render === 'function') render();
      if (typeof showModal === 'function') showModal('অর্ডার সফল', 'অর্ডার #' + r.order.id + ' — ' + r.order.amount_bdt + ' টাকা কেটেছে, স্ট্যাটাস: ' + r.order.status + '।');
    } catch (e) {
      if (typeof showModal === 'function') showModal('অর্ডার হয়নি', (e && e.message === 'insufficient_balance') ? 'ব্যালান্স কম — রিচার্জ করুন।' : (e && e.message ? e.message : 'আবার চেষ্টা করুন।'));
    }
  };
  function apply() {
    if (applying) return; applying = true;
    try {
    if (!isNewBdris()) return;
    var main = document.getElementById('main'); if (!main) return;
    var cards = main.querySelectorAll('.card');
    var orderCard = null, brnCard = document.getElementById('brnCopyCard');
    cards.forEach(function (c) { if (c.id !== 'brnCopyCard' && !orderCard) orderCard = c; });
    if (orderCard) {
      // The whole order card is removed (user instruction,
      // 2026-10-30). Removing it outright — not pruning children
      // — so no heading, banner, pill or note can survive a
      // re-render; apply() runs again on every render and
      // removes the fresh card too. updateTotal() is a no-op
      // once #nsBdrisTotal is gone (it guards a missing element).
      orderCard.remove();
      updateTotal();
    }
    if (brnCard) {
      var h2 = brnCard.querySelector('h2'); if (h2) h2.remove();
      var sub = brnCard.querySelector('.brn-sub'); if (sub) sub.remove();
      // Replace the misleading 5 tk note with the fixed-price note
      // (the option card is gone, so the price is no longer a choice).
      var notice = brnCard.querySelector('p.notice');
      if (notice && notice.textContent !== 'নরমাল (800 টাকা) অনুযায়ী অ্যাকাউন্ট থেকে কাটা হবে।') notice.textContent = 'নরমাল (800 টাকা) অনুযায়ী অ্যাকাউন্ট থেকে কাটা হবে।';
      // Replace the old brn-service order button with the unified order button.
      var oldBtn = null;
      brnCard.querySelectorAll('button').forEach(function (b) {
        if ((b.textContent || '').indexOf('অর্ডার করুন') !== -1) oldBtn = b;
      });
      if (oldBtn && oldBtn.id !== 'nsBdrisOrderBtn') {
        var wrap = oldBtn.parentElement;
        var nb = document.createElement('button');
        nb.className = 'btn'; nb.id = 'nsBdrisOrderBtn'; nb.textContent = 'অর্ডার করুন (ব্যালেন্স থেকে কাটবে)';
        nb.setAttribute('onclick', 'nsNewBdrisOrder()');
        if (wrap) { wrap.innerHTML = ''; wrap.appendChild(nb); var sp = document.createElement('span'); sp.className = 'muted'; sp.textContent = ' এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না'; wrap.appendChild(sp); }
      }
      brnCard.style.marginTop = '0';
    }
    } finally { applying = false; }
  }
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('#opts .opt')) setTimeout(updateTotal, 50);
  });
  apply();
  window.addEventListener('hashchange', function () { setTimeout(apply, 100); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () { apply(); }).observe(mainEl, { childList: true, subtree: true });
  }
})();
