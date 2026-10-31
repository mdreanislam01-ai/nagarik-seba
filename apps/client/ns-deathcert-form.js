/* ns-deathcert-form.js v1 — মৃত্যু সনদ আবেদন: নিজের ডিজাইন করা নেটিভ ফরম।
   ছবির ওভারলে ডিজাইন (v1–v6) সম্পূর্ণ বাদ দেওয়া হয়েছে ব্যবহারকারীর নির্দেশে:
   ওভারলেতে ইনপুটের placeholder ছবির ছাপা লেখার ওপরে ডাবল দেখাত, তাই খালি
   ঘরে লেখা-লেখা লাগত। এই ফরমে লেবেল ঘরের ওপরে, ঘর খালি থাকলে সত্যিই খালি —
   কোনো ডাবল লেখা নেই। ছবির সব অপশন/ফিল্ড আছে (দ্বিতীয় ঠিকানার সারিটি
   "অতিরিক্ত ঠিকানা (ঐচ্ছিক)" নামে রাখা হয়েছে, যাতে প্রথম ঠিকানার সঙ্গে
   গুলিয়ে না যায়)। রঙ সাইটের টিল। টপবার/সাইডবার স্বাভাবিক থাকে (এটা এখন
   সাধারণ সার্ভিস পেজ)। সংরক্ষণ = আসল অর্ডার, ৫০ টাকা। টাইপ করা তথ্য খসড়া
   হিসেবে এই ডিভাইসে থাকে (পেজ আবার আঁকা হলেও লেখা হারায় না), সফল হলে মুছে যায়। */
(function () {
  'use strict';
  var DRAFT_KEY = 'ns_deathcert_form_draft_v1';
  var FIELDS = [
    { id: 'nsDcBrn', label: 'মৃত ব্যক্তির জন্ম নিবন্ধন নম্বর', type: 'text', req: true, key: 'brn' },
    { id: 'nsDcGender', label: 'লিঙ্গ', type: 'select', opts: ['', 'পুরুষ', 'মহিলা', 'অন্যান্য'], req: true, key: 'gender' },
    { id: 'nsDcDob', label: 'জন্ম তারিখ', type: 'date', req: true, key: 'dob' },
    { id: 'nsDcDod', label: 'মৃত্যুর তারিখ', type: 'date', req: true, key: 'dod' },
    { id: 'nsDcCause', label: 'মৃত্যুর কারণ', type: 'select', opts: ['', 'বার্ধক্য / প্রাকৃতিক', 'রোগ', 'দুর্ঘটনা', 'অন্যান্য'], req: true, key: 'cause' },
    { id: 'nsDcPlace', label: 'মৃত্যুর স্থান', type: 'select', opts: ['', 'নিজ বাসস্থান', 'হাসপাতাল', 'অন্যান্য'], req: true, key: 'place' },
    { id: 'nsDcNameBn', label: 'মৃত ব্যক্তির নাম (বাংলা)', type: 'text', req: true, key: 'name_bn' },
    { id: 'nsDcNameEn', label: 'ইংরেজি নাম', type: 'text', req: true, key: 'name_en' },
    { id: 'nsDcFatherBn', label: 'পিতার নাম (বাংলা)', type: 'text', req: true, key: 'father_bn' },
    { id: 'nsDcFatherEn', label: 'পিতার ইংরেজি নাম', type: 'text', req: true, key: 'father_en' },
    { id: 'nsDcMotherBn', label: 'মাতার নাম (বাংলা)', type: 'text', req: true, key: 'mother_bn' },
    { id: 'nsDcMotherEn', label: 'মাতার ইংরেজি নাম', type: 'text', req: true, key: 'mother_en' },
    { id: 'nsDcSpouseBn', label: 'স্বামী/স্ত্রীর নাম', type: 'text', req: false, key: 'spouse_bn' },
    { id: 'nsDcSpouseEn', label: 'স্বামী/স্ত্রীর ইংরেজি নাম', type: 'text', req: false, key: 'spouse_en' },
    { id: 'nsDcAddrBn', label: 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (বাংলা)', type: 'text', req: true, key: 'address_bn' },
    { id: 'nsDcAddrEn', label: 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (ইংরেজি)', type: 'text', req: true, key: 'address_en' },
    { id: 'nsDcAddr2Bn', label: 'অতিরিক্ত ঠিকানা (বাংলা) (ঐচ্ছিক)', type: 'text', req: false, key: 'address2_bn' },
    { id: 'nsDcAddr2En', label: 'অতিরিক্ত ঠিকানা (ইংরেজি) (ঐচ্ছিক)', type: 'text', req: false, key: 'address2_en' },
    { id: 'nsDcPermBn', label: 'স্থায়ী ঠিকানা', type: 'text', req: true, key: 'permanent_bn' },
    { id: 'nsDcApplicant', label: 'আবেদনকারীর নাম ও মৃত ব্যক্তির সাথে সম্পর্ক', type: 'text', req: true, key: 'applicant', ph: 'যেমন: পুত্র, কন্যা, স্বামী/স্ত্রী ইত্যাদি', full: true },
    { id: 'nsDcMobile', label: 'আবেদনকারীর মোবাইল নম্বর', type: 'tel', req: true, key: 'mobile', ph: '01XXXXXXXXX' },
    { id: 'nsDcApplicantNid', label: 'আবেদনকারীর জাতীয় পরিচয়পত্র (NID) / জন্ম নিবন্ধন নম্বর', type: 'text', req: true, key: 'applicant_nid' }
  ];
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function isLoginShowing() {
    try { return !!document.querySelector('#nsSlideCard, .ns-ll'); } catch (e) { return false; }
  }
  function isDeathcert() { return (location.hash || '').indexOf('deathcert') !== -1; }
  function fieldHtml(f) {
    var lbl = '<label for="' + f.id + '">' + esc(f.label) + (f.req ? ' <span class="nsdcf-req">*</span>' : '') + '</label>';
    var ctl;
    if (f.type === 'select') {
      var o = '';
      f.opts.forEach(function (op, i) { o += '<option value="' + esc(op) + '">' + (i === 0 ? 'নির্বাচন করুন' : esc(op)) + '</option>'; });
      ctl = '<select id="' + f.id + '">' + o + '</select>';
    } else {
      ctl = '<input id="' + f.id + '" type="' + f.type + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + '>';
    }
    return '<div class="nsdcf-field">' + lbl + ctl + '</div>';
  }
  function formHtml() {
    var pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15], [16, 17]];
    var h = '<div class="nsdcf-wrap" id="nsDcfWrap">';
    h += '<div class="nsdcf-head"><h2>মৃত্যু সনদ আবেদন</h2><p>মৃত ব্যক্তি ও আবেদনকারীর তথ্য</p></div>';
    h += '<div class="nsdcf-card">';
    h += '<label class="nsdcf-upload" for="nsDcDoc"><b>📎 দস্তাবেজ আপলোড করুন</b><span id="nsDcDocName">ছবি বা PDF বেছে নিতে এখানে চাপ দিন</span><input id="nsDcDoc" type="file" accept="image/*,application/pdf"></label>';
    pairs.forEach(function (p) { h += '<div class="nsdcf-row">' + fieldHtml(FIELDS[p[0]]) + fieldHtml(FIELDS[p[1]]) + '</div>'; });
    h += '<div class="nsdcf-full">' + fieldHtml(FIELDS[18]) + '</div>';
    h += '<label class="nsdcf-checkrow"><input id="nsDcPermSame" type="checkbox"> বর্তমান ঠিকানার মতো হলে টিক দিন (স্থায়ী ঠিকানায় বর্তমান ঠিকানা বসে যাবে)</label>';
    h += '<div class="nsdcf-full">' + fieldHtml(FIELDS[19]) + '</div>';
    h += '<div class="nsdcf-row">' + fieldHtml(FIELDS[20]) + fieldHtml(FIELDS[21]) + '</div>';
    h += '<div class="nsdcf-note">দ্রষ্টব্য: সকল তথ্য সঠিকভাবে প্রদান করুন। ভুল তথ্য দিলে আবেদন বাতিল হতে পারে।</div>';
    h += '<div class="nsdcf-draft" id="nsDcDraftNote" hidden>আগের অসম্পূর্ণ আবেদন লোড হয়েছে। <button type="button" id="nsDcDraftClear">খসড়া মুছুন</button></div>';
    h += '<div class="nsdcf-err" id="nsDcErr" hidden></div>';
    h += '<button type="button" class="nsdcf-save" id="nsDcSave">সংরক্ষণ করুন</button>';
    h += '<a class="nsdcf-back" href="#/dashboard">← পেছনে যান</a>';
    h += '</div>';
    h += '<div class="nsdcf-price">মূল্য: ৫০ টাকা (প্রতি আবেদন) — সংরক্ষণ করলেই ব্যালেন্স থেকে ৫০ টাকা কাটবে।</div>';
    h += '</div>';
    return h;
  }
  function val(id) { var el = $(id); return el ? (el.value || '').trim() : ''; }
  function saveDraft() {
    try {
      var d = {};
      FIELDS.forEach(function (f) { d[f.id] = val(f.id); });
      var c = $('nsDcPermSame'); d.nsDcPermSame = c ? !!c.checked : false;
      var doc = $('nsDcDoc'); d.docName = (doc && doc.files && doc.files[0]) ? doc.files[0].name : (d.docName || '');
      var nameEl = $('nsDcDocName'); if (nameEl && d.docName) nameEl.textContent = d.docName;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (e) {}
  }
  function restoreDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      var any = false;
      FIELDS.forEach(function (f) { var el = $(f.id); if (el && d[f.id]) { el.value = d[f.id]; any = true; } });
      var c = $('nsDcPermSame'); if (c && d.nsDcPermSame) c.checked = true;
      var nameEl = $('nsDcDocName'); if (nameEl && d.docName) nameEl.textContent = d.docName;
      if (any) { var n = $('nsDcDraftNote'); if (n) n.hidden = false; }
      return any;
    } catch (e) { return false; }
  }
  function clearForm() {
    FIELDS.forEach(function (f) { var el = $(f.id); if (el) el.value = ''; });
    var c = $('nsDcPermSame'); if (c) c.checked = false;
    var nameEl = $('nsDcDocName'); if (nameEl) nameEl.textContent = 'ছবি বা PDF বেছে নিতে এখানে চাপ দিন';
    var n = $('nsDcDraftNote'); if (n) n.hidden = true;
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }
  function showErr(msg) { var e = $('nsDcErr'); if (e) { e.textContent = msg; e.hidden = false; } }
  function hideErr() { var e = $('nsDcErr'); if (e) e.hidden = true; }
  function build() {
    var main = $('main');
    if (!main) return;
    if ($('nsDcfWrap')) return;
    var stray = $('nsOrderBtn'); if (stray && stray.remove) stray.remove();
    main.innerHTML = formHtml();
    FIELDS.forEach(function (f) {
      var el = $(f.id);
      if (el) el.addEventListener('input', saveDraft);
    });
    var doc = $('nsDcDoc');
    if (doc) doc.addEventListener('change', function () {
      var nameEl = $('nsDcDocName');
      if (nameEl && doc.files && doc.files[0]) nameEl.textContent = doc.files[0].name;
      saveDraft();
    });
    var permSame = $('nsDcPermSame');
    if (permSame) permSame.addEventListener('change', function () {
      if (permSame.checked) { var p = $('nsDcPermBn'); if (p) p.value = val('nsDcAddrBn'); }
      saveDraft();
    });
    var addr = $('nsDcAddrBn');
    if (addr) addr.addEventListener('input', function () {
      if (permSame && permSame.checked) { var p = $('nsDcPermBn'); if (p) p.value = val('nsDcAddrBn'); }
    });
    var clr = $('nsDcDraftClear');
    if (clr) clr.addEventListener('click', clearForm);
    var save = $('nsDcSave');
    if (save) save.addEventListener('click', onSave);
    restoreDraft();
  }
  function onSave() {
    hideErr();
    var payload = {};
    for (var i = 0; i < FIELDS.length; i++) {
      var f = FIELDS[i], v = val(f.id);
      if (f.req && !v) { showErr('সব ঘর পূরণ করুন।'); return; }
      payload[f.key] = v;
    }
    if (payload.dob && payload.dod && payload.dod < payload.dob) { showErr('মৃত্যুর তারিখ জন্ম তারিখের আগে হতে পারবে না।'); return; }
    var mob = (payload.mobile || '').replace(/\D/g, '');
    if (mob.length < 10 || mob.length > 15) { showErr('মোবাইল নম্বর ১০–১৫ ডিজিটের হতে হবে।'); return; }
    var doc = $('nsDcDoc');
    payload.document_name = (doc && doc.files && doc.files[0]) ? doc.files[0].name : '';
    var save = $('nsDcSave');
    if (save) { save.disabled = true; save.textContent = 'জমা হচ্ছে…'; }
    saveDraft();
    nsCall('/orders', 'POST', { service_id: 'deathcert', payload: payload }).then(function (r) {
      if (save) { save.disabled = false; save.textContent = 'সংরক্ষণ করুন'; }
      var id = (r && r.order && r.order.id) ? r.order.id : '';
      clearForm();
      showModal('অর্ডার সফল', 'অর্ডার #' + id + ' — ৫০ টাকা কেটেছে।');
    }).catch(function (err) {
      if (save) { save.disabled = false; save.textContent = 'সংরক্ষণ করুন'; }
      var m = err && err.message ? err.message : '';
      if (m.indexOf('service_not_found') !== -1) showErr('সার্ভিসটি এখনো চালু হয়নি — অ্যাডমিনে deathcert যোগ করুন।');
      else if (m.indexOf('insufficient_balance') !== -1) showErr('ব্যালান্স কম — রিচার্জ করুন।');
      else if (m.indexOf('orders_closed') !== -1) showErr('অর্ডার এখন বন্ধ আছে।');
      else showErr('নেট সমস্যা — আবার চেষ্টা করুন।');
    });
  }
  function cleanup() {
    var w = $('nsDcfWrap');
    if (w) { var main = $('main'); if (main) main.innerHTML = ''; }
  }
  function tick() {
    if (!isDeathcert() || isLoginShowing()) { cleanup(); return; }
    build();
  }
  tick();
  window.addEventListener('hashchange', function () { setTimeout(tick, 100); });
  window.addEventListener('pageshow', function () { setTimeout(tick, 50); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(tick, 50); });
  setInterval(tick, 150);
})();
