/* Nagarik Seba client — audit fixes 1-3, presentation only, client only.
   1) Placeholder buttons are relabelled "শীঘ্রই আসছে" instead of
      audit/placeholder notes.
   2) The template Insufficient banner on brni/tin/ncf is replaced
      with a neutral note; the real balance check is the backend
      /orders call, which already returns insufficient_balance.
   3) Guest sample balance/UID is hidden when not logged in.
   Also: free-tool buttons and TK are shown in Bengali, and a news
   ticker is added to every page. The ticker tries /api/notices
   first (existing public API + existing admin #/notices page);
   if that endpoint does not respond, it shows the site's own
   default welcome notices. No admin/API change in this client-only push. */
(function () {
  'use strict';
  function txtReplace(node, pairs) {
    if (!node) return;
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    var texts = [], t;
    while ((t = walker.nextNode())) texts.push(t);
    texts.forEach(function (tn) {
      var v = tn.nodeValue; if (!v || !v.trim()) return; var o = v;
      pairs.forEach(function (p) { if (v.indexOf(p[0]) !== -1) v = v.split(p[0]).join(p[1]); });
      if (v !== o) tn.nodeValue = v;
    });
  }
  function isLoginPage() {
    var h = location.hash || '';
    return h.indexOf('#/login') === 0 || h.indexOf('#/signup') === 0 || h.indexOf('#/forgot') === 0 ||
      document.body.classList.contains('ns-login-portal') || document.body.classList.contains('ns-design-login-page');
  }
  function ensureTicker() {
    var main = document.getElementById('main'); if (!main) return;
    // Login page exception: no ticker there, other pages keep it.
    if (isLoginPage()) { var old = document.getElementById('nsTicker'); if (old) old.remove(); return; }
    if (document.getElementById('nsTicker')) return;
    var div = document.createElement('div');
    div.id = 'nsTicker'; div.className = 'ns-ticker';
    // Detailed welcome headline (2026-10-30, user request):
    // used as the ticker text itself, and as the prefix when
    // admin notices arrive, so the welcome/order message always runs.
    var headline = 'সবাইকে স্বাগতম নাগরিক সেবা ওয়েবসাইটে  •  আপনারা এখানে সহজেই অর্ডার করুন — জন্ম নিবন্ধন, এনআইডি, স্মার্ট এনআইডি, সার্ভার কপি, টিনসহ সকল নাগরিক সেবা পাবেন  •  ব্যালান্স রিচার্জ করে অর্ডার করুন, অর্ডার সফল হলে ব্যালান্স থেকে টাকা কেটে যাবে  •  ‘বিশ্বাস আপনার, সেবা আমার’';
    var disclaimer = 'এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না।';
    div.innerHTML = '<span class="ns-ticker-label">খবর</span><span class="ns-ticker-track"><span class="ns-ticker-move"><span class="ns-ticker-text">' + headline + '  •  ' + disclaimer + '</span><span class="ns-ticker-text" aria-hidden="true">' + headline + '  •  ' + disclaimer + '</span></span></span>';
    // Flush-with-heading placement (2026-10-30): INSIDE the
    // header itself, as its last flex child, so the ticker is
    // one unit with the sticky heading — no gap above it, ever,
    // and no sticky-top value to drift from the header height.
    // Falls back to top of #main.
    var header = document.querySelector('header.topbar');
    if (header) header.appendChild(div);
    else main.insertBefore(div, main.firstChild);
    try {
      fetch('/api/notices').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        var list = j && (j.notices || j.data || j.items);
        if (Array.isArray(list) && list.length) {
          var txt = headline + '  •  ' + list.map(function (n) { return typeof n === 'string' ? n : (n.title || n.text || ''); }).filter(Boolean).join('  •  ') + '  •  ' + disclaimer;
          document.querySelectorAll('#nsTicker .ns-ticker-text').forEach(function (el) { el.textContent = txt; });
        }
      }).catch(function () {});
    } catch (e) {}
  }
  function apply() {
    try {
      var main = document.getElementById('main'); if (!main) return;
      ensureTicker();
      // Separate static notice card is turned off (ticker carries notices).
      var oldNotice = document.getElementById('nsNotices'); if (oldNotice) oldNotice.remove();
      txtReplace(main, [
        ['মূল অডিটে লাইভ চ্যাটের গন্তব্য যাচাই হয়নি। তাই এখানে কোনো চ্যাট খোলা হয় না — শুধু প্লেসহোল্ডার রাখা হয়েছে।', 'লাইভ চ্যাট শীঘ্রই আসছে।'],
        ['মূল অডিটে ক্যাপচা ছবি “NO IMAGE” ছিল এবং Reload-এ API ত্রুটি এসেছিল। এখানে কোনো আসল ক্যাপচা সিস্টেম নেই।', 'ক্যাপচা শীঘ্রই আসছে।'],
        ['Make Signature', 'স্বাক্ষর তৈরি করুন'],
        ['Find Tin Info', 'টিন তথ্য খুঁজুন'],
        ['Find Birth Date', 'জন্ম তারিখ খুঁজুন'],
        [' TK', ' টাকা'],
        ['(TK)', '(টাকা)']
      ]);
      // Placeholder buttons: relabel, do not remove (so layout stays)
      document.querySelectorAll('button').forEach(function (b) {
        var tx = (b.textContent || '').trim();
        if (tx.indexOf('লাইভ চ্যাট') === 0 && b.closest('.qa-tile')) {
          // keep tile, its modal text is replaced above
        }
      });
      // Insufficient banner: neutral note, backend decides on order
      document.querySelectorAll('.closed').forEach(function (d) {
        if ((d.textContent || '').indexOf('Insufficient balance') !== -1) {
          d.textContent = 'ব্যালান্স কম থাকলে অর্ডার করার সময় জানানো হবে।';
          d.className = 'notice';
        }
      });
      // Guest sample data: hide sample balance when not logged in
      try {
        var token = sessionStorage.getItem('ns_token') || localStorage.getItem('ns_token');
        if (!token) {
          var bal = document.querySelector('.bal-amount');
          if (bal && bal.textContent.indexOf('১০') !== -1) bal.textContent = '—';
        }
      } catch (e) {}
    } catch (e) {}
  }
  apply();
  window.addEventListener('hashchange', function () { setTimeout(apply, 80); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () { apply(); }).observe(mainEl, { childList: true, subtree: true, characterData: true });
  }
})();
