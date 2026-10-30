/* Nagarik Seba — text consistency fix (presentation only).
   Menu / dashboard / service-page names, currency and a few jumbled
   sentences were different in different places. This file does NOT
   change any price, route, cost, API call or order flow.
   It only unifies the visible text, after app.js has rendered. */
(function () {
  'use strict';
  try {
    // 1) Service data: page title = menu/dashboard name, so the same
    //    service is not called one thing in the menu and another on
    //    its own page. brni gets both names, so it stays recognisable.
    if (typeof SERVICES !== 'undefined' && Array.isArray(SERVICES)) {
      SERVICES.forEach(function (s) {
        if (!s) return;
        if (s.id === 'brni') {
          s.name = 'জন্মনিবন্ধন নম্বর তথ্য (মিনিস্ট্রি ডাটা)';
          s.title = s.name;
          if (s.note) s.note = s.note.replace('($ 10)', '(৳ ১০)');
        } else {
          s.title = s.name;
        }
        if (s.id === 'sc' && s.note) {
          s.note = 'সার্ভার কপি ১০ টাকা (API ৫) / ২৫ টাকা (API ৩)। পিন নম্বর ও ফুল ঠিকানা আসবে।';
        }
        if (s.id === 'tin' && s.note) {
          s.note = s.note.replace('Insufficient balance', 'ব্যালান্স অপর্যাপ্ত');
        }
        if (s.id === 'ncf' && s.note) {
          s.note = s.note.replace('Insufficient balance', 'ব্যালান্স অপর্যাপ্ত');
        }
      });
    }

    var REPLACEMENTS = [
      // Dashboard service cards: "$ 1 কার্ড খরচ" etc. -> taka, and
      // the server-copy card price is corrected in the card loop below.
      ['সার্ভিস কার্ড', 'সার্ভিসসমূহ'],
      ['Orders Logs', 'অর্ডার লগ'],
      ['Quick Access', 'দ্রুত অ্যাক্সেস'],
      ['No data available in table', 'কোনো তথ্য নেই'],
      ['Insufficient balance! You don\'t have enough balance to use this service.', 'ব্যালান্স অপর্যাপ্ত! এই সার্ভিস ব্যবহারের জন্য পর্যাপ্ত ব্যালেন্স নেই।'],
      ['অর্ডার বন্ধ থাকায় সাবমিট বোতাম নেইতে কোনো অর্ডার করা হয় না।', 'অর্ডার বন্ধ থাকায় সাবমিট বোতাম নেই, তাই কোনো অর্ডার করা হয় না।'],
      ['Cards Lists (All Time)', 'কার্ড তালিকা (সর্বমোট)'],
      ['Profile Update', 'প্রোফাইল আপডেট'],
      ['Change Password', 'পাসওয়ার্ড পরিবর্তন'],
      ['Theme Color', 'থিম রঙ'],
      ['Verified: Yes', 'ভেরিফাইড: হ্যাঁ'],
      ['Balance: 10', 'ব্যালেন্স: ৳ ১০'],
      ['Joined: তারিখ', 'যোগদান: তারিখ'],
    ];

    function fixText(node) {
      if (!node) return;
      var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      var texts = [];
      var t;
      while ((t = walker.nextNode())) texts.push(t);
      texts.forEach(function (tn) {
        var v = tn.nodeValue;
        if (!v || !v.trim()) return;
        var orig = v;
        REPLACEMENTS.forEach(function (pair) {
          if (v.indexOf(pair[0]) !== -1) v = v.split(pair[0]).join(pair[1]);
        });
        // Currency in dashboard cards and notes: "$ 5" -> "৳ ৫" is
        // handled below for cards; generic "$ " -> "৳ " for other text.
        if (v.indexOf('$ ') !== -1) v = v.split('$ ').join('৳ ');
        if (v !== orig) tn.nodeValue = v;
      });
    }

    function fixCards() {
      document.querySelectorAll('.svc-card').forEach(function (card) {
        var head = card.querySelector('.svc-head');
        var body = card.querySelector('.svc-body');
        if (!head || !body) return;
        var spans = body.querySelectorAll('span');
        spans.forEach(function (sp) {
          var txt = sp.textContent || '';
          // Server copy: dashboard map showed "$ 1" but the service
          // cost is 25 taka (API 3) / 10 taka (API 5). Show the base
          // service cost, 25 taka, like the service page.
          if (head.textContent.indexOf('সার্ভার কপি') !== -1 && txt.indexOf('কার্ড খরচ') !== -1) {
            sp.textContent = '৳ ২৫ খরচ';
          } else if (txt.indexOf('কার্ড খরচ') !== -1) {
            sp.textContent = txt.replace('$', '৳').replace('কার্ড খরচ', 'খরচ');
          }
        });
      });
      // Order pages with options: total note showed "?" before an
      // option was picked. Show the first option's price instead.
      var total = document.getElementById('totalNote');
      var firstOpt = document.querySelector('#opts .opt');
      if (total && firstOpt && total.textContent.indexOf('?') !== -1) {
        var m = firstOpt.textContent.match(/(\d+)\s*TK/);
        if (m) total.textContent = 'এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + m[1] + ' টাকা কাটা হবে।';
      }
    }

    function apply() {
      try {
        var main = document.getElementById('main');
        if (!main) return;
        fixText(main);
        fixCards();
      } catch (e) { /* presentation only: never break the page */ }
    }

    apply();
    window.addEventListener('hashchange', function () { setTimeout(apply, 50); });
    var mainEl = document.getElementById('main');
    if (mainEl && typeof MutationObserver !== 'undefined') {
      var obs = new MutationObserver(function () { apply(); });
      obs.observe(mainEl, { childList: true, subtree: true, characterData: true });
    }
  } catch (e) { /* presentation only: never break the page */ }
})();
