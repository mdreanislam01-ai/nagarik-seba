/* ns-deathcert-form.js v2 — মৃত্যু সনদ আবেদন: নিজের ডিজাইন করা নেটিভ ফরম।
   ছবির ওভারলে ডিজাইন (v1–v6) সম্পূর্ণ বাদ দেওয়া হয়েছে ব্যবহারকারীর নির্দেশে:
   ওভারলেতে ইনপুটের placeholder ছবির ছাপা লেখার ওপরে ডাবল দেখাত, তাই খালি
   ঘরে লেখা-লেখা লাগত। এই ফরমে লেবেল ঘরের ওপরে, ঘর খালি থাকলে সত্যিই খালি —
   কোনো ডাবল লেখা নেই। ছবির সব অপশন/ফিল্ড আছে (দ্বিতীয় ঠিকানার সারিটি
   "অতিরিক্ত ঠিকানা (ঐচ্ছিক)" নামে রাখা হয়েছে, যাতে প্রথম ঠিকানার সঙ্গে
   গুলিয়ে না যায়)। রঙ সাইটের টিল। টপবার/সাইডবার স্বাভাবিক থাকে (এটা এখন
   সাধারণ সার্ভিস পেজ)। সংরক্ষণ = আসল অর্ডার, ৫০ টাকা। টাইপ করা তথ্য খসড়া
   হিসেবে এই ডিভাইসে থাকে (পেজ আবার আঁকা হলেও লেখা হারায় না), সফল হলে মুছে যায়।
   v2: সব লেবেলে সাইটের মতো সাদামাটা একরঙা আউটলাইন SVG আইকন (রঙিন ইমোজি নয়),
   হেডারে সাইটের লোগো (টপবারের লোগো থেকেই নেওয়া — আলাদা ফাইল নয়), হেডারে
   হালকা ব্যাকগ্রাউন্ড প্যাটার্ন, সংরক্ষণ বাটনে টিল গ্রেডিয়েন্ট + আইকন + ছায়া।
   স্টাইল JS-এর ভেতরেই <style> হিসেবে আসে — তাই CSS ফাইল স্লো নেটে না এলেও
   রঙ/আইকন ঠিক থাকবে। */
(function () {
  'use strict';
  var DRAFT_KEY = 'ns_deathcert_form_draft_v1';
  var FIELDS = [
    { id: 'nsDcBrn', ic: 'doc', label: 'মৃত ব্যক্তির জন্ম নিবন্ধন নম্বর', type: 'text', req: true, key: 'brn' },
    { id: 'nsDcGender', ic: 'user', label: 'লিঙ্গ', type: 'select', opts: ['', 'পুরুষ', 'মহিলা', 'অন্যান্য'], req: true, key: 'gender' },
    { id: 'nsDcDob', ic: 'calendar', label: 'জন্ম তারিখ', type: 'date', req: true, key: 'dob' },
    { id: 'nsDcDod', ic: 'calendar', label: 'মৃত্যুর তারিখ', type: 'date', req: true, key: 'dod' },
    { id: 'nsDcCause', ic: 'clipboard', label: 'মৃত্যুর কারণ', type: 'select', opts: ['', 'বার্ধক্য / প্রাকৃতিক', 'রোগ', 'দুর্ঘটনা', 'অন্যান্য'], req: true, key: 'cause' },
    { id: 'nsDcPlace', ic: 'pin', label: 'মৃত্যুর স্থান', type: 'select', opts: ['', 'নিজ বাসস্থান', 'হাসপাতাল', 'অন্যান্য'], req: true, key: 'place' },
    { id: 'nsDcNameBn', ic: 'user', label: 'মৃত ব্যক্তির নাম (বাংলা)', type: 'text', req: true, key: 'name_bn' },
    { id: 'nsDcNameEn', ic: 'user', label: 'ইংরেজি নাম', type: 'text', req: true, key: 'name_en' },
    { id: 'nsDcFatherBn', ic: 'user', label: 'পিতার নাম (বাংলা)', type: 'text', req: true, key: 'father_bn' },
    { id: 'nsDcFatherEn', ic: 'user', label: 'পিতার ইংরেজি নাম', type: 'text', req: true, key: 'father_en' },
    { id: 'nsDcMotherBn', ic: 'user', label: 'মাতার নাম (বাংলা)', type: 'text', req: true, key: 'mother_bn' },
    { id: 'nsDcMotherEn', ic: 'user', label: 'মাতার ইংরেজি নাম', type: 'text', req: true, key: 'mother_en' },
    { id: 'nsDcSpouseBn', ic: 'users', label: 'স্বামী/স্ত্রীর নাম', type: 'text', req: false, key: 'spouse_bn' },
    { id: 'nsDcSpouseEn', ic: 'users', label: 'স্বামী/স্ত্রীর ইংরেজি নাম', type: 'text', req: false, key: 'spouse_en' },
    { id: 'nsDcAddrBn', ic: 'pin', label: 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (বাংলা)', type: 'text', req: true, key: 'address_bn' },
    { id: 'nsDcAddrEn', ic: 'pin', label: 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (ইংরেজি)', type: 'text', req: true, key: 'address_en' },
    { id: 'nsDcAddr2Bn', ic: 'pin', label: 'অতিরিক্ত ঠিকানা (বাংলা) (ঐচ্ছিক)', type: 'text', req: false, key: 'address2_bn' },
    { id: 'nsDcAddr2En', ic: 'pin', label: 'অতিরিক্ত ঠিকানা (ইংরেজি) (ঐচ্ছিক)', type: 'text', req: false, key: 'address2_en' },
    { id: 'nsDcPermBn', ic: 'home', label: 'স্থায়ী ঠিকানা', type: 'text', req: true, key: 'permanent_bn' },
    { id: 'nsDcApplicant', ic: 'users', label: 'আবেদনকারীর নাম ও মৃত ব্যক্তির সাথে সম্পর্ক', type: 'text', req: true, key: 'applicant', ph: 'যেমন: পুত্র, কন্যা, স্বামী/স্ত্রী ইত্যাদি', full: true },
    { id: 'nsDcMobile', ic: 'phone', label: 'আবেদনকারীর মোবাইল নম্বর', type: 'tel', req: true, key: 'mobile', ph: '01XXXXXXXXX' },
    { id: 'nsDcApplicantNid', ic: 'card', label: 'আবেদনকারীর জাতীয় পরিচয়পত্র (NID) / জন্ম নিবন্ধন নম্বর', type: 'text', req: true, key: 'applicant_nid' }
  ];
  function svg(inner, cls) {
    return '<svg class="' + (cls || 'nsdcf-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var IC = {
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z"/>',
    card: '<rect x="1" y="4" width="20" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'
  };
  function ico(name) { return '<span class="nsdcf-ico">' + svg(IC[name] || IC.doc) + '</span>'; }
  var NS_DCF_CSS = [
    '/* ns-deathcert-form.css v2 — মৃত্যু সনদ আবেদন নেটিভ ফরম (সাইটের টিল) */',
    '.nsdcf-wrap{max-width:720px;margin:0 auto;padding:0 0 24px}',
    '.nsdcf-head{background-image:url(data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%2290%22%3E%3Ccircle cx=%2270%22 cy=%2220%22 r=%2222%22 fill=%22%23ffffff%22 fill-opacity=%220.07%22/%3E%3Ccircle cx=%2215%22 cy=%2275%22 r=%2214%22 fill=%22%23ffffff%22 fill-opacity=%220.06%22/%3E%3Ccircle cx=%2245%22 cy=%2245%22 r=%226%22 fill=%22%23ffffff%22 fill-opacity=%220.05%22/%3E%3C/svg%3E),linear-gradient(135deg,#0f766e,#115e59);color:#fff;border-radius:14px;padding:18px 16px;margin:0 0 14px}',
    '.nsdcf-head h2{margin:0 0 4px;font-size:22px}',
    '.nsdcf-head p{margin:0;opacity:.9;font-size:14px}',
    '.nsdcf-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px}',
    '.nsdcf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 12px}',
    '@media (max-width:640px){.nsdcf-row{grid-template-columns:1fr}}',
    '.nsdcf-field label{display:block;font-weight:700;font-size:14px;color:#0f172a;margin:0 0 6px}',
    '.nsdcf-req{color:#dc2626}',
    '.nsdcf-field input,.nsdcf-field select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:11px 12px;font-size:15px;color:#0f172a;background:#fff}',
    '.nsdcf-field input:focus,.nsdcf-field select:focus{outline:none;border-color:#0f766e;box-shadow:0 0 0 3px rgba(15,118,110,.15)}',
    '.nsdcf-full{margin:0 0 12px}',
    '.nsdcf-upload{display:block;border:2px dashed #0f766e;border-radius:12px;padding:18px 12px;text-align:center;cursor:pointer;color:#0f766e;background:#f0fdfa;margin:0 0 14px}',
    '.nsdcf-upload b{display:block;font-size:15px}',
    '.nsdcf-upload span{font-size:13px;color:#475569}',
    '.nsdcf-upload input{display:none}',
    '.nsdcf-checkrow{display:flex;gap:8px;align-items:flex-start;font-size:14px;color:#334155;margin:0 0 12px;cursor:pointer}',
    '.nsdcf-checkrow input{margin-top:3px;accent-color:#0f766e}',
    '.nsdcf-note{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;border-radius:10px;padding:10px 12px;font-size:14px;margin:0 0 12px;display:flex;gap:8px;align-items:flex-start}',
    '.nsdcf-err{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:10px;padding:10px 12px;font-size:14px;margin:0 0 12px}',
    '.nsdcf-draft{background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:10px;padding:10px 12px;font-size:14px;margin:0 0 12px}',
    '.nsdcf-draft button{border:0;background:none;color:#b91c1c;font-weight:700;cursor:pointer;padding:0 4px}',
    '.nsdcf-save{width:100%;border:0;border-radius:10px;padding:13px;background:linear-gradient(135deg,#0f766e,#115e59);color:#fff;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 6px 16px rgba(15,118,110,.35)}',
    '.nsdcf-save:disabled{opacity:.6}',
    '.nsdcf-back{display:flex;gap:6px;align-items:center;justify-content:center;margin:12px 0 0;color:#0f766e;text-decoration:none;font-size:15px}',
    '.nsdcf-price{background:#e6f4f2;border:1px solid #0f766e;border-radius:10px;color:#0f172a;font-size:15px;font-weight:700;text-align:center;padding:12px 10px;margin:14px 0 0;display:flex;gap:8px;align-items:center;justify-content:center}',
    '',
    '.nsdcf-headrow{display:flex;gap:12px;align-items:center}',
    '.nsdcf-logo{height:44px;width:auto;border-radius:8px;background:#fff;padding:4px;flex:none}',
    '.nsdcf-logobadge{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;color:#fff;flex:none}',
    '.nsdcf-ico{display:inline-flex;vertical-align:-3px;margin-right:6px;color:#0f766e}',
    '.nsdcf-ico svg,.nsdcf-ic{width:17px;height:17px;display:block}',
    '.nsdcf-ic-lg{width:24px;height:24px;display:block}',
    '.nsdcf-ic-btn{width:18px;height:18px;display:block}',
    '.nsdcf-ic-up{width:30px;height:30px;display:block}',
    '.nsdcf-upico{display:block;color:#0f766e;margin:0 auto 6px}',
    '.nsdcf-note .nsdcf-ico{color:#059669;flex:none;margin-top:1px}',
  ].join('\n');
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function isLoginShowing() {
    try { return !!document.querySelector('#nsSlideCard, .ns-ll'); } catch (e) { return false; }
  }
  function isDeathcert() { return (location.hash || '').indexOf('deathcert') !== -1; }
  function fieldHtml(f) {
    var lbl = '<label for="' + f.id + '">' + (f.ic ? ico(f.ic) : '') + esc(f.label) + (f.req ? ' <span class="nsdcf-req">*</span>' : '') + '</label>';
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
  function topbarLogoSrc() {
    try {
      var li = document.querySelector('.topbar img');
      if (li) { var v = li.getAttribute('src'); if (v) return v; }
    } catch (e) {}
    return '';
  }
  function formHtml() {
    var pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15], [16, 17]];
    var logo = topbarLogoSrc();
    var logoHtml = logo ? '<img class="nsdcf-logo" src="' + esc(logo) + '" alt="নাগরিক সেবা">' : '<span class="nsdcf-logobadge">' + svg(IC.doc, 'nsdcf-ic-lg') + '</span>';
    var h = '<div class="nsdcf-wrap" id="nsDcfWrap">';
    h += '<style id="nsDcfStyle">' + NS_DCF_CSS + '</style>';
    h += '<div class="nsdcf-head"><div class="nsdcf-headrow">' + logoHtml + '<div><h2>মৃত্যু সনদ আবেদন</h2><p>মৃত ব্যক্তি ও আবেদনকারীর তথ্য</p></div></div></div>';
    h += '<div class="nsdcf-card">';
    h += '<label class="nsdcf-upload" for="nsDcDoc"><span class="nsdcf-upico">' + svg(IC.upload, 'nsdcf-ic-up') + '</span><b>দস্তাবেজ আপলোড করুন</b><span id="nsDcDocName">ছবি বা PDF বেছে নিতে এখানে চাপ দিন</span><input id="nsDcDoc" type="file" accept="image/*,application/pdf"></label>';
    pairs.forEach(function (p) { h += '<div class="nsdcf-row">' + fieldHtml(FIELDS[p[0]]) + fieldHtml(FIELDS[p[1]]) + '</div>'; });
    h += '<div class="nsdcf-full">' + fieldHtml(FIELDS[18]) + '</div>';
    h += '<label class="nsdcf-checkrow"><input id="nsDcPermSame" type="checkbox"> বর্তমান ঠিকানার মতো হলে টিক দিন (স্থায়ী ঠিকানায় বর্তমান ঠিকানা বসে যাবে)</label>';
    h += '<div class="nsdcf-full">' + fieldHtml(FIELDS[19]) + '</div>';
    h += '<div class="nsdcf-row">' + fieldHtml(FIELDS[20]) + fieldHtml(FIELDS[21]) + '</div>';
    h += '<div class="nsdcf-note">' + ico('check') + '<span>দ্রষ্টব্য: সকল তথ্য সঠিকভাবে প্রদান করুন। ভুল তথ্য দিলে আবেদন বাতিল হতে পারে।</span></div>';
    h += '<div class="nsdcf-draft" id="nsDcDraftNote" hidden>আগের অসম্পূর্ণ আবেদন লোড হয়েছে। <button type="button" id="nsDcDraftClear">খসড়া মুছুন</button></div>';
    h += '<div class="nsdcf-err" id="nsDcErr" hidden></div>';
    h += '<button type="button" class="nsdcf-save" id="nsDcSave">' + svg(IC.send, 'nsdcf-ic-btn') + '<span>সংরক্ষণ করুন</span></button>';
    h += '<a class="nsdcf-back" href="#/dashboard">' + svg(IC.back, 'nsdcf-ic') + '<span>পেছনে যান</span></a>';
    h += '</div>';
    h += '<div class="nsdcf-price">' + ico('tag') + '<span>মূল্য: ৫০ টাকা (প্রতি আবেদন) — সংরক্ষণ করলেই ব্যালেন্স থেকে ৫০ টাকা কাটবে।</span></div>';
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
    if (save) { save.disabled = true; var sp = save.querySelector('span'); if (sp) sp.textContent = 'জমা হচ্ছে…'; }
    saveDraft();
    nsCall('/orders', 'POST', { service_id: 'deathcert', payload: payload }).then(function (r) {
      if (save) { save.disabled = false; var sp = save.querySelector('span'); if (sp) sp.textContent = 'সংরক্ষণ করুন'; }
      var id = (r && r.order && r.order.id) ? r.order.id : '';
      clearForm();
      showModal('অর্ডার সফল', 'অর্ডার #' + id + ' — ৫০ টাকা কেটেছে।');
    }).catch(function (err) {
      if (save) { save.disabled = false; var sp = save.querySelector('span'); if (sp) sp.textContent = 'সংরক্ষণ করুন'; }
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
