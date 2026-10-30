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
  function ensureTicker() {
    var main = document.getElementById('main'); if (!main) return;
    if (document.getElementById('nsTicker')) return;
    var div = document.createElement('div');
    div.id = 'nsTicker'; div.className = 'ns-ticker';
    div.innerHTML = '<span class="ns-ticker-label">খবর</span><span class="ns-ticker-text" id="nsTickerText">আপনাকে স্বাগতম। ‘বিশ্বাস আপনার, সেবা আমার’।  •  অর্ডার গ্রহণ চালু আছে — তথ্য দিয়ে অর্ডার করুন। এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না।</span>';
    main.insertBefore(div, main.firstChild);
    try {
      fetch('/api/notices').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        var list = j && (j.notices || j.data || j.items);
        var el = document.getElementById('nsTickerText');
        if (el && Array.isArray(list) && list.length) {
          el.textContent = 'আপনাকে স্বাগতম। ‘বিশ্বাস আপনার, সেবা আমার’।  •  ' + list.map(function (n) { return typeof n === 'string' ? n : (n.title || n.text || ''); }).filter(Boolean).join('  •  ');
        }
      }).catch(function () {});
    } catch (e) {}
  }
  function apply() {
    try {
      var main = document.getElementById('main'); if (!main) return;
      ensureTicker();
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
