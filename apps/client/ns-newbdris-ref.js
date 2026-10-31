/* ns-newbdris-ref.js — NEWBDRIS reference redesign, written fresh
   2026-10-31 (v1). This REPLACES the earlier reference-redesign
   code (v8–v11 in ns-newbdris-design.js), which was deleted in
   full: no code is reused from it. The earlier version froze the
   page because a MutationObserver rewrote the history table on
   every DOM change, re-triggering itself.
   This version has NO MutationObserver at all. It checks the page
   once a second with a cheap interval and only ever writes when
   something actually changed, so it cannot loop:
   - Title "নতুন জন্ম নিবন্ধন অর্ডার" at the top of #/order/newbdris.
   - Type cards just before the personal-info hero (নরমাল/পসিবল/
     মিনিস্ট্রি/CTG নরমাল) with the site's own prices (800/800/
     1000/2000, confirmed by the user 2026-10-31 — NOT the
     reference's 780/1920). Selection works through
     ns-bdris-clean.js's selectedOption(), so order submission,
     field order/count and prices are untouched.
   - Order-history section after the personal card, from real
     NS_STATE newbdris orders (NO/COST/STATUS/SYNC/CREATED/ACTION),
     with search, show-entries and pagination. It re-renders only
     when the filtered data, search, show-count or page changed.
   - SINGLE headline: on this page only, the existing header
     ticker's text becomes the page headline; on every other page
     the regular headline runs, restored on leaving. No second
     headline and no page notice bar are created.
   - Logos (2026-10-31, user-supplied): the first three Type cards
     use the user's Dhaka South City Corporation logo and the
     fourth (CTG) uses the user's Chattogram City Corporation logo,
     as separate lightweight 160px transparent PNG files
     (160px white-background JPEG data URIs embedded in this file,
     about 10KB each — binary PNG uploads are not supported by
     the push tool, and JPEG keeps the page light, as requested). NOT copied: the reference site's own seal, its
     phone number, and its form-textarea template. The site itself
     remains a non-government site (see its existing disclaimer).
     Type artwork is an original teal gradient + NS badge, and
     the brn fields stay exactly as they are. */
(function () {
  'use strict';
  var PAGE_HEADLINE = 'অর্ডার করার আগে অবশ্যই ইনবক্সে কথা বলে অর্ডার করুন ধন্যবাদ 🥰। ২০০৭/২০০৮ এ মেয়েদের কাজ বন্ধ ❌';
  var LOGO_DSCC = 'data:image/jpeg;base64,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';
  var LOGO_CCC = 'data:image/jpeg;base64,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';
  var TYPES = [
    { name: 'নরমাল', price: '800', logo: LOGO_DSCC },
    { name: 'পসিবল', price: '800', logo: LOGO_DSCC },
    { name: 'মিনিস্ট্রি', price: '1000', logo: LOGO_DSCC },
    { name: 'CTG নরমাল', price: '2000', logo: LOGO_CCC }
  ];
  var histPage = 1, histSearch = '', histShow = 10, lastHistKey = '';
  function isNewBdris() { return (location.hash || '').indexOf('newbdris') !== -1; }
  function setTicker(page) {
    var texts = document.querySelectorAll('#nsTicker .ns-ticker-text');
    if (!texts.length) return;
    if (page) {
      if (!window._nsRefTickerOn) {
        window._nsRefTickerOrig = [texts[0].textContent, texts.length > 1 ? texts[1].textContent : ''];
        window._nsRefTickerOn = true;
      }
      texts.forEach(function (el) { if (el.textContent !== PAGE_HEADLINE) el.textContent = PAGE_HEADLINE; });
    } else if (window._nsRefTickerOn) {
      if (texts[0] && window._nsRefTickerOrig) texts[0].textContent = window._nsRefTickerOrig[0];
      if (texts[1] && window._nsRefTickerOrig) texts[1].textContent = window._nsRefTickerOrig[1];
      window._nsRefTickerOn = false;
    }
  }
  function fmtCreated(c) {
    c = c || ''; if (c.indexOf('T') !== -1) c = c.slice(0, 16).replace('T', ' ');
    return c;
  }
  function histRows() {
    var all = [];
    try { if (typeof NS_STATE !== 'undefined' && NS_STATE && Array.isArray(NS_STATE.orders)) all = NS_STATE.orders; } catch (e) {}
    var rows = all.filter(function (o) { return o && o.service_id === 'newbdris'; });
    if (histSearch) {
      var q = histSearch.toLowerCase();
      rows = rows.filter(function (o) {
        return String(o.id || '').toLowerCase().indexOf(q) !== -1 ||
          String(o.status || '').toLowerCase().indexOf(q) !== -1 ||
          String(o.amount_bdt || '').indexOf(q) !== -1;
      });
    }
    return rows;
  }
  function renderHist() {
    var body = document.getElementById('nsHistBody');
    var foot = document.getElementById('nsHistFoot');
    if (!body) return;
    var rows = histRows();
    var key = histPage + '|' + histSearch + '|' + histShow + '|' + JSON.stringify(rows.map(function (o) { return [o.id, o.amount_bdt, o.status, o.created_at]; }));
    if (key === lastHistKey) return;
    lastHistKey = key;
    var total = rows.length;
    var pages = Math.max(1, Math.ceil(total / histShow));
    if (histPage > pages) { histPage = pages; return renderHist(); }
    var start = total ? (histPage - 1) * histShow + 1 : 0;
    var end = Math.min(total, histPage * histShow);
    var page = rows.slice((histPage - 1) * histShow, histPage * histShow);
    var html;
    if (!page.length) {
      html = '<tr><td colspan="6" class="ns-hist-empty">No data available in table</td></tr>';
    } else {
      html = page.map(function (o) {
        return '<tr><td data-label="NO">' + (o.id || '') + '</td><td data-label="COST">' + (o.amount_bdt || '') + ' টাকা</td><td data-label="STATUS">' + (o.status || '') + '</td><td data-label="SYNC">—</td><td data-label="CREATED">' + fmtCreated(o.created_at) + '</td><td data-label="ACTION">—</td></tr>';
      }).join('');
    }
    if (body.innerHTML !== html) body.innerHTML = html;
    var footTxt = 'Showing ' + start + ' to ' + end + ' of ' + total + ' entries';
    if (foot && foot.textContent !== footTxt) foot.textContent = footTxt;
    var pv = document.getElementById('nsHistPrev'), nx = document.getElementById('nsHistNext');
    if (pv) pv.disabled = histPage <= 1;
    if (nx) nx.disabled = histPage >= pages;
  }

  var FORM_TEMPLATE = [
    "আবেদনকারীর ব্যক্তিগত বিবরণ / Personal Information",
    "",
    "🔹 পুরো নাম (বাংলা):",
    "🔹 Full Name (English - Block Letters):",
    "🔹 First Name (English):",
    "🔹 Last Name (English):",
    "🔹 জন্ম তারিখ (DD/MM/YYYY):",
    "🔹 লিঙ্গ (পুরুষ / নারী / অন্যান্য):",
    "🔹 পিতা-মাতার কততম সন্তান:",
    "🔹 রক্তের গ্রুপ:",
    "🔹 সচল মোবাইল নম্বর:",
    "🔹 ইমেইল এড্রেস (ঐচ্ছিক):",
    "",
    "🔹 পিতার নাম (বাংলা):",
    "🔹 Father's Name (English):",
    "🔹 পিতার জন্ম নিবন্ধন নম্বর (১৭ ডিজিট):",
    "🔹 পিতার NID নম্বর:",
    "🔹 পিতার জন্ম তারিখ (DD/MM/YYYY):",
    "🔹 পিতার জাতীয়তা: ",
    "",
    "🔹 মাতার নাম (বাংলা):",
    "🔹 Mother's Name (English):",
    "🔹 মাতার জন্ম নিবন্ধন নম্বর (১৭ ডিজিট):",
    "🔹 মাতার NID নম্বর:",
    "🔹 মাতার জন্ম তারিখ (DD/MM/YYYY):",
    "🔹 মাতার জাতীয়তা: ",
    "",
    "🔹 বিভাগ (বাংলা):",
    "🔹 জেলা (বাংলা):",
    "🔹 উপজেলা/সিটি কর্পোরেশন (বাংলা):",
    "🔹 ইউনিয়ন/পৌরসভা/ওয়ার্ড (বাংলা):",
    "🔹 ডাকঘর ও পোস্ট কোড (বাংলা):",
    "🔹 গ্রাম/মহল্লা (বাংলা):",
    "🔹 বাসা/রোড/হোল্ডিং নং (বাংলা):",
    "",
    "🔹 Division (English):",
    "🔹 District (English):",
    "🔹 Upazila/City Corp (English):",
    "🔹 Union/Municipality/Ward (English):",
    "🔹 Post Office & Code (English):",
    "🔹 Village/Area (English):",
    "🔹 House/Road/Holding No (English):",
    "",
    "🔹 স্থায়ী ঠিকানা (বাংলা):",
    "🔹 Permanent Address (English):",
    "",
    "🔹 বর্তমান ঠিকানা (বাংলা):",
    "🔹 Present Address (English):",
    "",
    "আবেদনপত্রের সাথে যেসব কাগজপত্র লাগবে",
    "",
    "🔹 ইপিআই টিকা কার্ড / হাসপাতালের ছাড়পত্র / ডাক্তারের প্রত্যয়নপত্র ",
    "🔹 পিতা ও মাতার ১৭ ডিজিটের অনলাইন জন্ম নিবন্ধন সনদ (ফটোকপি)",
    "🔹 পিতা ও মাতার জাতীয় পরিচয়পত্র (NID) (ফটোকপি)",
    "🔹 হোল্ডিং ট্যাক্সের রশিদ / বিদ্যুৎ বিলের কপি / খাজনার দাখিলা",
    "",
    "🔹 তথ্য প্রদানকারীর স্বাক্ষর :",
    "🔹 তারিখ (DD/MM/YYYY) :"
  ].join('\n');
  function totalText(name, price) { return '⭐ এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + name + ' (' + price + ' টাকা) কাটা হবে।'; }
  function submitRefOrder(btn) {
    try {
      if (typeof nsToken === 'function' && !nsToken()) {
        if (typeof showModal === 'function') showModal('লগইন প্রয়োজন', 'অর্ডার করতে প্রথমে লগইন করুন।');
        location.hash = '#/login'; return;
      }
      var ta = document.getElementById('nsRefFormText');
      var text = ta ? ta.value.trim() : '';
      if (!text || text === FORM_TEMPLATE) {
        if (typeof showModal === 'function') showModal('ফরম পূরণ করুন', 'ফরমের ঘরগুলোতে আপনার তথ্য লিখে তারপর Order Now চাপুন।');
        return;
      }
      var sel = document.querySelector('#opts .opt.sel');
      var name = sel ? sel.getAttribute('data-name') : 'নরমাল';
      var price = sel ? sel.getAttribute('data-price') : '800';
      btn.disabled = true; btn.textContent = 'অর্ডার হচ্ছে…';
      nsCall('/orders', 'POST', { service_id: 'newbdris', option_name: name, payload: { details: text } }).then(function (r) {
        if (typeof NS_STATE !== 'undefined') NS_STATE.wallet = r.wallet_bdt;
        if (typeof nsRefresh === 'function') return nsRefresh(true).then(function () { return r; });
        return r;
      }).then(function (r) {
        if (typeof render === 'function') render();
        if (typeof showModal === 'function') showModal('অর্ডার সফল', 'অর্ডার #' + r.order.id + ' — ' + r.order.amount_bdt + ' টাকা কেটেছে, স্ট্যাটাস: ' + r.order.status + '।');
      }).catch(function (e) {
        var msg = 'আবার চেষ্টা করুন।';
        if (e && e.message === 'insufficient_balance') msg = 'ব্যালান্স কম — রিচার্জ করুন।';
        else if (e && e.message === 'orders_closed') msg = 'অর্ডার গ্রহণ বর্তমানে বন্ধ আছে।';
        else if (e && e.message) msg = e.message;
        if (typeof showModal === 'function') showModal('অর্ডার হয়নি', msg);
      }).finally(function () { btn.disabled = false; btn.textContent = 'Order Now'; });
    } catch (e) {
      btn.disabled = false; btn.textContent = 'Order Now';
    }
  }
  function build() {
    var main = document.getElementById('main');
    if (!main) return;
    if (main.querySelector('.profile-card')) return;
    /* Crossed-out section removed (user instruction): the old
       personal-info card, autoload card and new-birth heroes go,
       on this page only. The brn service page is not touched,
       because this only runs while the hash is newbdris. */
    var oldCard = document.getElementById('brnCopyCard'); if (oldCard) oldCard.remove();
    var autoCard = document.getElementById('nsAutoCard'); if (autoCard) autoCard.remove();
    main.querySelectorAll('.ns-nb-hero, .ns-nb-head, .ns-nb-foot').forEach(function (el) { el.remove(); });
    if (!document.getElementById('nsNbPageTitle')) {
      var title = document.createElement('div');
      title.id = 'nsNbPageTitle';
      title.innerHTML = '<h2>নতুন জন্ম নিবন্ধন অর্ডার</h2>';
      main.insertBefore(title, main.firstChild);
    }
    if (!document.getElementById('nsTypeCard')) {
      var tc = document.createElement('div');
      tc.id = 'nsTypeCard'; tc.className = 'card';
      var grid = TYPES.map(function (ty, i) {
        return '<div class="opt' + (i === 0 ? ' sel' : '') + '" data-name="' + ty.name + '" data-price="' + ty.price + '"><div class="ns-type-img"><img class="ns-type-logo" src="' + ty.logo + '" alt="' + ty.name + '"></div><div class="ns-type-name">🌟 ' + ty.name + ' 🌟</div><div class="ns-type-price">(' + ty.price + ' টাকা)</div></div>';
      }).join('');
      tc.innerHTML = '<div class="ns-type-label">Type <span>*</span></div><div id="opts" class="ns-type-grid">' + grid + '</div><p id="nsBdrisTotal" class="ns-type-total">এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে নরমাল (800 টাকা) কাটা হবে।</p>';
      /* BUG FIX 2026-10-31: the old card is removed now, so the
         Type card can no longer be placed relative to it — the
         undefined 'card' threw here and stopped the form/history
         from ever building (title only, blank below). Place it
         right after the title instead. */
      var titleEl = document.getElementById('nsNbPageTitle');
      if (titleEl && titleEl.nextSibling) main.insertBefore(tc, titleEl.nextSibling);
      else main.appendChild(tc);
      tc.querySelectorAll('#opts .opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          tc.querySelectorAll('#opts .opt').forEach(function (o) { o.classList.remove('sel'); });
          opt.classList.add('sel');
          var tot = document.getElementById('nsBdrisTotal');
          var txt = totalText(opt.getAttribute('data-name'), opt.getAttribute('data-price'));
          if (tot) tot.textContent = txt;
          var tot2 = document.getElementById('nsRefTotal');
          if (tot2) tot2.textContent = txt;
          /* Old personal card (and its notice) no longer exists; nsRefTotal above is the total note now. */
        });
      });
    }
    if (!document.getElementById('nsRefFormCard')) {
      var fc = document.createElement('div');
      fc.id = 'nsRefFormCard'; fc.className = 'card';
      fc.innerHTML = '<div class="ns-ref-form-label">ফরম পূরণ করুন: <span>*</span></div><textarea id="nsRefFormText" class="ns-ref-form-text" rows="24" style="min-height:600px"></textarea><p id="nsRefTotal" class="ns-type-total">⭐ এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে নরমাল (800 টাকা) কাটা হবে।</p><button type="button" id="nsRefOrderBtn" class="ns-ref-order-btn">Order Now</button><p class="ns-ref-note">এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না</p>';
      var hs0 = document.getElementById('nsOrderHistory');
      if (hs0) main.insertBefore(fc, hs0); else main.appendChild(fc);
      var ta = document.getElementById('nsRefFormText');
      if (ta) ta.value = FORM_TEMPLATE;
      var ob = document.getElementById('nsRefOrderBtn');
      if (ob) ob.addEventListener('click', function () { submitRefOrder(ob); });
    }
    if (!document.getElementById('nsOrderHistory')) {
      var hs = document.createElement('div');
      hs.id = 'nsOrderHistory'; hs.className = 'card';
      hs.innerHTML = '<h2>অর্ডার ইতিহাস</h2><div class="ns-hist-controls"><label>Show <select id="nsHistShow"><option value="10" selected>10</option><option value="25">25</option><option value="50">50</option></select> entries</label><label>Search: <input id="nsHistSearch" type="search" placeholder=""></label></div><div class="ns-hist-wrap"><table><thead><tr><th>NO</th><th>COST</th><th>STATUS</th><th>SYNC</th><th>CREATED</th><th>ACTION</th></tr></thead><tbody id="nsHistBody"></tbody></table></div><div class="ns-hist-foot"><span id="nsHistFoot"></span><span><button type="button" id="nsHistPrev">Previous</button> <button type="button" id="nsHistNext">Next</button></span></div>';
      main.appendChild(hs);
      var si = document.getElementById('nsHistSearch');
      if (si) si.addEventListener('input', function () { histSearch = si.value.trim(); histPage = 1; lastHistKey = ''; renderHist(); });
      var ss = document.getElementById('nsHistShow');
      if (ss) ss.addEventListener('change', function () { histShow = parseInt(ss.value, 10) || 10; histPage = 1; lastHistKey = ''; renderHist(); });
      var pv = document.getElementById('nsHistPrev');
      if (pv) pv.addEventListener('click', function () { if (histPage > 1) { histPage--; lastHistKey = ''; renderHist(); } });
      var nx = document.getElementById('nsHistNext');
      if (nx) nx.addEventListener('click', function () { histPage++; lastHistKey = ''; renderHist(); });
    }
    renderHist();
  }
  function allBuilt() {
    return document.getElementById('nsNbPageTitle') && document.getElementById('nsTypeCard') && document.getElementById('nsRefFormCard') && document.getElementById('nsOrderHistory');
  }
  function tick() {
    try {
      if (!isNewBdris()) {
        setTicker(false);
        document.documentElement.classList.remove('ns-nb-hide-old');
        ['nsNbPageTitle', 'nsTypeCard', 'nsRefFormCard', 'nsOrderHistory'].forEach(function (id) {
          var el = document.getElementById(id); if (el) el.remove();
        });
        lastHistKey = '';
        return;
      }
      setTicker(true);
      /* Flash fix 2026-10-31: while the reference sections are not
         all built yet (first load, or right after an app re-render
         wiped #main), keep the old app cards hidden via the CSS
         class, so the old design never shows for seconds. Once
         everything is built, the class comes off. After the
         30s safety expiry set by the inline head script, never
         re-add it, so a failed build cannot blank the page. */
      if (!window._nsNbHideExpired && !allBuilt()) document.documentElement.classList.add('ns-nb-hide-old');
      build();
      if (allBuilt()) document.documentElement.classList.remove('ns-nb-hide-old');
    } catch (e) {}
  }
  tick();
  window.addEventListener('hashchange', function () {
    /* Flash fix 2026-10-31 (SPA nav): hide the old cards SYNCHRONOUSLY in this
       same dispatch. app.js's listener (registered first) only STARTS its async
       render here, so no paint from it can happen before this class is on.
       The 100ms tick then builds the reference design. */
    try { if (isNewBdris()) document.documentElement.classList.add('ns-nb-hide-old'); } catch (e) {}
    setTimeout(tick, 100);
  });
  /* No MutationObserver by design: a 1-second read-only check that
     only writes when something changed cannot storm, unlike an
     observer that fires on every write it just made. */
  setInterval(tick, 500);
})();
