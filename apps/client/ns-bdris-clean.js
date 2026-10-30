/* Nagarik Seba client — newbdris page cleanup, client only.
   On #/order/newbdris only:
   - Removes the marked middle section: the single "ফরম পূরণ করুন*"
     input, the total note, the order-closed note paragraph, the
     "অর্ডার ইতিহাস" table, and the wrapper order button in the
     order card, plus the "জন্ম নিবন্ধন ক্রিয়েট" heading/subtext
     of the copied brn card.
   - The parts above (order header, closed banner, option pills)
     and below (upload button + brn form fields) then join directly.
   - The remaining order button at the bottom of the brn form now
     submits the newbdris ORDER with the selected option price
     (800/800/1000/2000, resolved server-side from option_name)
     and the filled brn fields as payload, instead of the old
     brn-service (5 tk) button. No price, route or API change. */
(function () {
  'use strict';
  var BRN_FIELDS = ['Register Office Address*','Upazila / Pourashava / City Corporation','Zila*','Birth Registration Number*','Gender*','Date of Registration*','Date of Issuance*','Left Bar Code*','QR Link*','Date of Birth*','Date of Birth in Word','নাম*','Name','পিতার নাম*','Father Name','পিতার জাতীয়তা','Father Nationality','মাতার নাম*','Mother Name','মাতার জাতীয়তা','Mother Nationality','জন্মস্থান*','Place of Birth','স্থায়ী ঠিকানা*','Permanent Address'];
  function isNewBdris() {
    return (location.hash || '').indexOf('newbdris') !== -1;
  }
  function selectedOption() {
    var sel = document.querySelector('#opts .opt.sel');
    if (!sel) return null;
    var txt = (sel.textContent || '').trim();
    return { name: txt.replace(/\s*\(.*$/, ''), text: txt };
  }
  function updateTotal() {
    var el = document.getElementById('nsBdrisTotal');
    var sel = selectedOption();
    if (el) el.textContent = sel ? ('এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + sel.text + ' কাটা হবে।') : 'অপশন বাছুন।';
  }
  window.nsNewBdrisOrder = async function () {
    try {
      if (typeof nsToken === 'function' && !nsToken()) {
        if (typeof showModal === 'function') showModal('লগইন প্রয়োজন', 'অর্ডার করতে প্রথমে লগইন করুন।');
        location.hash = '#/login'; return;
      }
      var sel = selectedOption();
      if (!sel) { if (typeof showModal === 'function') showModal('অপশন বাছুন', 'প্রথমে একটি অপশন বাছুন।'); return; }
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
    if (!isNewBdris()) return;
    var main = document.getElementById('main'); if (!main) return;
    var cards = main.querySelectorAll('.card');
    var orderCard = null, brnCard = document.getElementById('brnCopyCard');
    cards.forEach(function (c) { if (c.id !== 'brnCopyCard' && !orderCard) orderCard = c; });
    if (orderCard) {
      // Keep h2, label, closed banner, option label + #opts. Remove the rest.
      Array.from(orderCard.children).forEach(function (child) {
        var txt = child.textContent || '';
        if (child.tagName === 'H2') return;
        if (child.classList && child.classList.contains('closed')) return;
        if (child.id === 'opts') return;
        if (child.tagName === 'LABEL' && txt.indexOf('অপশন বাছুন') !== -1) return;
        if (child.tagName === 'P' && txt.indexOf('ঢাকা সিটি') !== -1) return;
        child.remove();
      });
      if (!document.getElementById('nsBdrisTotal')) {
        var p = document.createElement('p');
        p.className = 'notice'; p.id = 'nsBdrisTotal';
        orderCard.appendChild(p);
      }
      updateTotal();
      orderCard.style.marginBottom = '8px';
    }
    if (brnCard) {
      var h2 = brnCard.querySelector('h2'); if (h2) h2.remove();
      var sub = brnCard.querySelector('.brn-sub'); if (sub) sub.remove();
      // Replace the misleading 5 tk note with the option-price note.
      var notice = brnCard.querySelector('p.notice');
      if (notice) notice.textContent = 'নির্বাচিত অপশনের দাম অনুযায়ী অ্যাকাউন্ট থেকে কাটা হবে।';
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
