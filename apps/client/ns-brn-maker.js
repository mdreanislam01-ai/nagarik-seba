/* Nagarik Seba client — জন্মনিবন্ধন ক্রিয়েট (brn) maker-style page (v2, 2026-11-02).
   v2 change: the create form now opens as a MODAL (overlay), the way the
   reference maker's form opens — instead of an inline section. Opened by
   the "+ নতুন জন্মনিবন্ধন তৈরি (৳৫)" button; closed by ×, backdrop click
   or ESC. The autoload popup (z-index 99990) still opens ABOVE this modal
   (this modal is z-index 900). The order button hides this modal first,
   so the order result dialog (z-index 50) is never hidden behind it; on
   a failed order the form keeps its typed values and can be reopened.
   Everything else is v1: header card, records table from the customer's
   own brn orders, the ORIGINAL 25 brn fields moved whole in original
   order under 7 section headings, dashed box opening the existing
   autoload panel (typed info only). No seals, no QR generation, no
   badge, no certificate output, no government lookup, no app.js edit,
   no API change. The আবেদন (newbdris) page is untouched. */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#0f766e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var IC_BUILD = svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>');
  var IC_DOC = svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>');
  var IC_CAL = svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>');
  var IC_USER = svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>');
  var IC_GROUP = svg('<circle cx="9" cy="8" r="3"/><path d="M2.5 20c0-3 2.8-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c2.2 0.3 4.5 1.7 4.5 4"/>');
  var IC_HOME = svg('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>');

  /* Section headings, by DOM index of the .brn-field they precede.
     Field order is NOT changed: autoload (3=BRN, 9=DOB), icons
     (4=Gender, 15/16/19/20=nationalities) and nsOrderPayload (def.fields
     paired with inputs in DOM order) all depend on it. Headings use
     .ns-brn-sec, never .brn-field, so those indices never shift. */
  var SECTIONS = [
    [0, 'REGISTER OFFICE', IC_BUILD],
    [3, 'REGISTRATION', IC_DOC],
    [9, 'DATE OF BIRTH', IC_CAL],
    [11, 'IDENTITY', IC_USER],
    [13, 'FATHER', IC_GROUP],
    [17, 'MOTHER', IC_GROUP],
    [21, 'BIRTH & LOCATION', IC_HOME]
  ];

  function isBrnPage() {
    try {
      return (location.hash || '').replace('#/', '') === 'service/brn';
    } catch (e) { return false; }
  }
  function isLoginShowing() {
    return !!(document.querySelector('#nsSlideCard') || document.querySelector('.ns-ll'));
  }
  function hasToken() {
    try { return typeof nsToken === 'function' && !!nsToken(); } catch (e) { return false; }
  }
  function formWrap() { return document.getElementById('nsBrnFormWrap'); }
  function openModal() {
    var w = formWrap();
    if (!w) return;
    w.style.display = 'block';
    try { w.scrollTop = 0; } catch (e) {}
  }
  function closeModal() {
    var w = formWrap();
    if (w) w.style.display = 'none';
  }

  function orderPayloadFields(order) {
    try {
      var p = order ? order.payload_json : null;
      if (typeof p === 'string') { try { p = JSON.parse(p); } catch (e) { return []; } }
      if (p && Array.isArray(p.fields)) return p.fields;
      if (p && p.payload && Array.isArray(p.payload.fields)) return p.payload.fields;
    } catch (e) {}
    return [];
  }
  function fieldVal(fields, name) {
    for (var i = 0; i < fields.length; i++) {
      if (fields[i] && fields[i].field === name) return fields[i].value || '';
    }
    return '';
  }
  function fmtDate(v) {
    var s = String(v || '');
    if (!s) return '—';
    return s.length > 16 ? s.slice(0, 16).replace('T', ' ') : s.replace('T', ' ');
  }
  function brnOrders() {
    try {
      var all = (typeof NS_STATE !== 'undefined' && NS_STATE && Array.isArray(NS_STATE.orders))
        ? NS_STATE.orders : [];
      return all.filter(function (o) { return o && o.service_id === 'brn'; })
        .sort(function (a, b) { return (b.id || 0) - (a.id || 0); })
        .slice(0, 50);
    } catch (e) { return []; }
  }

  function renderTable() {
    var tbody = document.getElementById('nsBrnTbody');
    var empty = document.getElementById('nsBrnEmpty');
    if (!tbody) return;
    var rows = brnOrders();
    var sig = rows.map(function (o) { return o.id + ':' + o.status; }).join(',');
    if (tbody.dataset.nsSig === sig) return;
    tbody.dataset.nsSig = sig;
    if (!rows.length) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    tbody.innerHTML = rows.map(function (o) {
      var f = orderPayloadFields(o);
      var st = esc(o.status || '—');
      return '<tr><td>' + esc(fieldVal(f, 'Name') || '—') + '</td>' +
        '<td>' + esc(fieldVal(f, 'Birth Registration Number*') || '—') + '</td>' +
        '<td>' + esc(fieldVal(f, 'Date of Birth*') || '—') + '</td>' +
        '<td>৳ ' + esc(o.amount_bdt == null ? '—' : o.amount_bdt) + '</td>' +
        '<td><span class="ns-brn-st ns-st-' + st + '">' + st + '</span></td>' +
        '<td>' + esc(fmtDate(o.created_at)) + '</td>' +
        '<td><button type="button" class="ns-brn-view" data-ns-brn-view="' + o.id + '">দেখুন</button></td></tr>';
    }).join('');
  }

  function viewOrder(id) {
    var rows = brnOrders();
    var o = null;
    for (var i = 0; i < rows.length; i++) { if (String(rows[i].id) === String(id)) { o = rows[i]; break; } }
    if (!o || typeof showModal !== 'function') return;
    var f = orderPayloadFields(o);
    var body = '<p class="muted">অর্ডার #' + esc(o.id) + ' · ৳ ' + esc(o.amount_bdt == null ? '—' : o.amount_bdt) +
      ' · ' + esc(o.status || '—') + ' · ' + esc(fmtDate(o.created_at)) + '</p>';
    if (f.length) {
      body += '<div class="ns-brn-viewrows">' + f.filter(function (x) { return x && x.value; }).map(function (x) {
        return '<div><b>' + esc(String(x.field).replace(/\*$/, '')) + '</b><span>' + esc(x.value) + '</span></div>';
      }).join('') + '</div>';
    } else {
      body += '<p class="muted">এই অর্ডারের বিস্তারিত তথ্য পাওয়া যায়নি।</p>';
    }
    showModal('জন্ম নিবন্ধন — অর্ডার #' + esc(o.id), body);
  }

  function addSections(grid) {
    if (!grid || grid.dataset.nsBrnSec) return;
    var fields = grid.querySelectorAll('.brn-field');
    SECTIONS.forEach(function (sec) {
      var idx = sec[0];
      if (idx >= fields.length) return;
      var h = document.createElement('div');
      h.className = 'ns-brn-sec';
      h.innerHTML = sec[2] + '<span>' + sec[1] + '</span>';
      grid.insertBefore(h, fields[idx]);
    });
    grid.dataset.nsBrnSec = '1';
  }

  function build() {
    if (!isBrnPage() || isLoginShowing() || !hasToken()) return;
    var main = document.getElementById('main');
    if (!main) return;
    var maker = document.getElementById('nsBrnMaker');
    if (maker) { renderTable(); return; }
    var orig = main.querySelector('.brn-card:not(#nsBrnMakerForm)');
    if (!orig) return;
    var grid = orig.querySelector('.brn-grid');
    if (!grid) return;
    var dash = orig.querySelector('.brn-dash');
    var status = orig.querySelector('#brnDocStatus');
    var noteEl = orig.querySelector('.notice');
    var noteText = noteEl ? noteEl.textContent.trim() : 'জন্মনিবন্ধন মেক ৫ টাকা করে কাটবে।';

    maker = document.createElement('div');
    maker.id = 'nsBrnMaker';
    maker.innerHTML =
      '<div class="card ns-brn-head">' +
        '<div><h2>📄 জন্মনিবন্ধন মেকার</h2>' +
        '<p class="muted">আপনার জন্মনিবন্ধন তালিকা দেখুন এবং নতুন নিবন্ধন তৈরি করুন।</p></div>' +
        '<button type="button" class="btn ns-brn-create" id="nsBrnCreateBtn">+ নতুন জন্মনিবন্ধন তৈরি (৳৫)</button>' +
      '</div>' +
      '<div class="card ns-brn-list">' +
        '<h3>📄 জন্ম নিবন্ধন তালিকা</h3>' +
        '<div class="ns-brn-tablewrap"><table class="ns-brn-table"><thead><tr>' +
        '<th>Name (English)</th><th>Birth Reg. No.</th><th>Date of Birth</th>' +
        '<th>Cost</th><th>Status</th><th>Created</th><th>Actions</th>' +
        '</tr></thead><tbody id="nsBrnTbody"></tbody></table></div>' +
        '<div class="ns-brn-empty" id="nsBrnEmpty" style="display:none">' +
        '<div class="ns-brn-empty-ico">📄</div>' +
        '<b>কোনো নিবন্ধন পাওয়া যায়নি</b>' +
        '<p class="muted">আপনার প্রথম নিবন্ধন তৈরি করুন</p></div>' +
      '</div>' +
      '<div class="ns-brn-formwrap" id="nsBrnFormWrap" style="display:none">' +
        '<div class="card brn-card ns-brn-maker-form" id="nsBrnMakerForm">' +
          '<div class="ns-brn-form-head"><h3>নতুন নিবন্ধন তৈরীর ফরম</h3>' +
          '<button type="button" class="ns-brn-x" id="nsBrnFormClose" aria-label="বন্ধ করুন">×</button></div>' +
          '<div id="nsBrnFormBody"></div>' +
          '<p class="notice">' + esc(noteText) + '</p>' +
          '<p><button type="button" class="btn" id="nsBrnMakerOrderBtn">অর্ডার করুন (ব্যালেন্স থেকে কাটবে)</button></p>' +
          '<p class="muted">এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না</p>' +
        '</div>' +
      '</div>';
    orig.parentNode.insertBefore(maker, orig);

    /* Move the original form parts whole into the new form card. Moving
       nodes (not rebuilding them) keeps every listener, value and the
       .brn-grid/.brn-field structure the other scripts depend on. */
    var body = document.getElementById('nsBrnFormBody');
    if (dash) {
      if (!dash.dataset.nsBrnDashText) {
        var txt = dash.querySelector('span:not(.brn-dash-ico)');
        if (txt) txt.innerHTML = 'ডেটা অনুসন্ধান করতে<br>এখানে ক্লিক করুন';
        dash.dataset.nsBrnDashText = '1';
      }
      body.appendChild(dash);
    }
    if (status) body.appendChild(status);
    body.appendChild(grid);
    addSections(grid);
    orig.style.display = 'none';

    var formCard = document.getElementById('nsBrnMakerForm');
    var wrap = document.getElementById('nsBrnFormWrap');
    document.getElementById('nsBrnCreateBtn').addEventListener('click', openModal);
    document.getElementById('nsBrnFormClose').addEventListener('click', closeModal);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) closeModal();
    });
    document.getElementById('nsBrnMakerOrderBtn').addEventListener('click', function () {
      /* Hide this modal first so the order result dialog (z-index 50)
         is never hidden behind it. On a failed order the form keeps its
         typed values and can be reopened; on success render() rebuilds. */
      closeModal();
      try {
        if (typeof nsOrderSubmit === 'function') nsOrderSubmit('service', 'brn', formCard);
      } catch (e) {}
    });
    var list = maker.querySelector('.ns-brn-list');
    list.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-ns-brn-view]') : null;
      if (b) viewOrder(b.getAttribute('data-ns-brn-view'));
    });
    renderTable();
  }

  /* ESC closes this modal only — if the autoload popup is open it has
     its own ESC handler and must stay on top, so skip then. Attached
     once: build() recreates the modal element on every render. */
  document.addEventListener('keydown', function (e) {
    if (!e || e.key !== 'Escape') return;
    if (document.querySelector('.ns-aload-back')) return;
    var w = formWrap();
    if (w && w.style.display === 'block') closeModal();
  });

  build();
  setInterval(build, 300);
  window.addEventListener('hashchange', function () { setTimeout(build, 100); });
  window.addEventListener('pageshow', function () { setTimeout(build, 100); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) setTimeout(build, 100);
  });
})();
