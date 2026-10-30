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
   - NOT copied from the reference: the other site's circular
     seal logo, its phone number, and its form-textarea template.
     Type artwork is an original teal gradient + NS badge, and
     the brn fields stay exactly as they are. */
(function () {
  'use strict';
  var PAGE_HEADLINE = 'অর্ডার করার আগে অবশ্যই ইনবক্সে কথা বলে অর্ডার করুন ধন্যবাদ 🥰। ২০০৭/২০০৮ এ মেয়েদের কাজ বন্ধ ❌';
  var TYPES = [
    { name: 'নরমাল', price: '800' },
    { name: 'পসিবল', price: '800' },
    { name: 'মিনিস্ট্রি', price: '1000' },
    { name: 'CTG নরমাল', price: '2000' }
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
  function build() {
    var main = document.getElementById('main');
    var card = document.getElementById('brnCopyCard');
    if (!main || !card) return;
    if (main.querySelector('.profile-card')) return;
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
        return '<div class="opt' + (i === 0 ? ' sel' : '') + '" data-name="' + ty.name + '" data-price="' + ty.price + '"><div class="ns-type-img"><span class="ns-type-badge">NS</span></div><div class="ns-type-name">🌟 ' + ty.name + ' 🌟</div><div class="ns-type-price">(' + ty.price + ' টাকা)</div></div>';
      }).join('');
      tc.innerHTML = '<div class="ns-type-label">Type <span>*</span></div><div id="opts" class="ns-type-grid">' + grid + '</div><p id="nsBdrisTotal" class="ns-type-total">এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে নরমাল (800 টাকা) কাটা হবে।</p>';
      var hero = card.previousElementSibling;
      if (hero && hero.classList.contains('ns-nb-hero')) card.parentNode.insertBefore(tc, hero);
      else card.parentNode.insertBefore(tc, card);
      tc.querySelectorAll('#opts .opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          tc.querySelectorAll('#opts .opt').forEach(function (o) { o.classList.remove('sel'); });
          opt.classList.add('sel');
          var tot = document.getElementById('nsBdrisTotal');
          var txt = 'এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + opt.getAttribute('data-name') + ' (' + opt.getAttribute('data-price') + ' টাকা) কাটা হবে।';
          if (tot) tot.textContent = txt;
          var notice = card.querySelector('p.notice');
          if (notice) notice.textContent = opt.getAttribute('data-name') + ' (' + opt.getAttribute('data-price') + ' টাকা) অনুযায়ী অ্যাকাউন্ট থেকে কাটা হবে।';
        });
      });
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
  function tick() {
    try {
      if (!isNewBdris()) {
        setTicker(false);
        ['nsNbPageTitle', 'nsTypeCard', 'nsOrderHistory'].forEach(function (id) {
          var el = document.getElementById(id); if (el) el.remove();
        });
        lastHistKey = '';
        return;
      }
      setTicker(true);
      build();
    } catch (e) {}
  }
  tick();
  window.addEventListener('hashchange', function () { setTimeout(tick, 100); });
  /* No MutationObserver by design: a 1-second read-only check that
     only writes when something changed cannot storm, unlike an
     observer that fires on every write it just made. */
  setInterval(tick, 1000);
})();
