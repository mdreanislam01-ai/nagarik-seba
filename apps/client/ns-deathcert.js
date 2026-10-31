/* ns-deathcert.js v5 — মৃত্যু সনদ আবেদন: সম্পূর্ণ পেজ = ব্যবহারকারীর ছবি + নিচে ৫০ টাকার বার।
   v4 থেকে বদল: (১) ছবি ৮টি ছোট টুকরোয় (প্রতিটি ~৫৫-৯০KB), প্রথম টুকরো স্লো
   নেটেও ~১০ সেকেন্ডে আসে। (২) এই স্ক্রিপ্ট এখন index.html-এর সবার প্রথমে,
   তাই বড় app.js (৫৬৭KB) ডাউনলোড শেষ হওয়ার আগেই ডিজাইন লোড শুরু হয় —
   আগে ডিজাইন-স্ক্রিপ্ট ১৭ নম্বরে ছিল, app.js + ১৪টি স্ক্রিপ্টের পেছনে আটকে
   থাকত, তাই জেনেরিক পেজ মিনিটের পর মিনিট দেখা যেত। (৩) ফরম তৈরি হলে নিচে
   স্পষ্ট নির্দেশনা থাকে (সাদা ঘরে চাপ দিয়ে লিখুন) — যাতে ছবি আর ফরমের
   পার্থক্য বোঝা যায়, ছবির ভেতরে কিছু বদলানো হয়নি। জেনেরিক পেজের
   ইতিহাস/বাটন/নোটিশ কিছুই থাকে না। সংরক্ষণ = আসল অর্ডার, ৫০ টাকা। */
(function () {
  'use strict';
  var STRIPS = ['ns-deathcert-s1.txt?v=1', 'ns-deathcert-s2.txt?v=1',
    'ns-deathcert-s3.txt?v=1', 'ns-deathcert-s4.txt?v=1',
    'ns-deathcert-s5.txt?v=1', 'ns-deathcert-s6.txt?v=1',
    'ns-deathcert-s7.txt?v=1', 'ns-deathcert-s8.txt?v=1'];
  var DRAFT_KEY = 'ns_deathcert_draft_v1';
  var loaded = 0, attempts = [0, 0, 0, 0, 0, 0, 0, 0], loading = false, gen = 0, curGen = 0;

  function isDeathCert() {
    return (location.hash || '') === '#/order/deathcert';
  }
  function isLoginShowing() {
    return !!document.querySelector('#nsSlideCard, .ns-ll');
  }
  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function st(l, t, w, h) {
    return 'style="left:' + l + '%;top:' + t + '%;width:' + w + '%;height:' + h + '%;"';
  }
  function inp(id, type, l, t, w, h, ph) {
    return '<input class="nsdc2-inp" id="' + id + '" type="' + type + '" placeholder="' + escAttr(ph || '') + '" ' + st(l, t, w, h) + '>';
  }
  function sel(id, l, t, w, h, opts) {
    var o = '<option value=""></option>' + opts.map(function (x) {
      return '<option value="' + escAttr(x) + '">' + escAttr(x) + '</option>';
    }).join('');
    return '<select class="nsdc2-inp nsdc2-sel" id="' + id + '" ' + st(l, t, w, h) + '>' + o + '</select>';
  }
  // ছবির সাদা ঘরগুলোর ওপরে ওভারলে (v2/v3-এর মাপ হুবহু)।
  function overlaysHTML() {
    var h = '';
    h += '<input class="nsdc2-file" id="nsDcDoc" type="file" accept="image/*,application/pdf" ' + st(24, 19.8, 50, 7.7) + '>';
    h += inp('nsDcBrn', 'text', 6.5, 30.95, 41.5, 1.7, '');
    h += sel('nsDcGender', 55.0, 30.95, 38.5, 1.7, ['পুরুষ', 'মহিলা', 'অন্যান্য']);
    h += inp('nsDcDob', 'date', 6.5, 35.95, 37.5, 1.7, '');
    h += inp('nsDcDod', 'date', 55.0, 35.95, 38.5, 1.7, '');
    h += sel('nsDcCause', 6.5, 40.95, 38.0, 1.7, ['বার্ধক্য / প্রাকৃতিক', 'রোগ', 'দুর্ঘটনা', 'অন্যান্য']);
    h += sel('nsDcPlace', 55.0, 40.95, 38.5, 1.7, ['নিজ বাসস্থান', 'হাসপাতাল', 'অন্যান্য']);
    h += inp('nsDcNameBn', 'text', 6.5, 45.95, 41.5, 1.7, 'মৃত ব্যক্তির নাম (বাংলা)');
    h += inp('nsDcNameEn', 'text', 55.0, 45.95, 42.0, 1.7, 'English Name)');
    h += inp('nsDcFatherBn', 'text', 6.5, 50.95, 41.5, 1.7, 'পিতার নাম (বাংলা)');
    h += inp('nsDcFatherEn', 'text', 55.0, 50.95, 42.0, 1.7, "Father's Name in English)");
    h += inp('nsDcMotherBn', 'text', 6.5, 55.95, 41.5, 1.7, 'মাতার নাম (বাংলা)');
    h += inp('nsDcMotherEn', 'text', 55.0, 55.95, 42.0, 1.7, "Mother's Name in English)");
    h += inp('nsDcSpouseBn', 'text', 6.5, 60.95, 41.5, 1.7, 'স্বামী / স্ত্রীর নাম');
    h += inp('nsDcSpouseEn', 'text', 55.0, 60.95, 42.0, 1.7, 'Spouse Name in English)');
    h += inp('nsDcAddrBn', 'text', 6.5, 65.95, 41.5, 1.7, 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (বাংলা)');
    h += inp('nsDcAddrEn', 'text', 55.0, 65.95, 42.0, 1.7, 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা (ইংরেজি)');
    h += inp('nsDcAddr2Bn', 'text', 6.5, 70.95, 41.5, 1.7, 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা');
    h += inp('nsDcAddr2En', 'text', 55.0, 70.95, 42.0, 1.7, 'মৃত্যুপূর্ব বাসস্থান/বর্তমান ঠিকানা');
    h += inp('nsDcPermBn', 'text', 6.5, 75.95, 41.5, 1.7, 'স্থায়ী ঠিকানা লিখুন');
    h += '<input class="nsdc2-check" id="nsDcPermSame" type="checkbox" ' + st(51.0, 76.2, 2.5, 1.4) + '>';
    h += inp('nsDcApplicant', 'text', 6.5, 81.15, 90.5, 1.7, '(যমন: পুত্র, কন্যা, স্বামী/স্ত্রী ইত্যাদি)');
    h += inp('nsDcMobile', 'tel', 6.5, 86.15, 41.5, 1.7, 'আবেদনকারীর মোবাইল নম্বর');
    h += inp('nsDcApplicantNid', 'text', 55.0, 86.15, 42.0, 1.7, 'আবেদনকারীর জাতীয় পরিচয়পত্র (NID) / জন্ম নিবন্ধন নম্বর');
    h += '<button type="button" class="nsdc2-btn" id="nsDcSave" aria-label="সংরক্ষণ করুন" ' + st(2.2, 92.0, 95.1, 2.3) + '></button>';
    h += '<a class="nsdc2-btn" href="#/dashboard" aria-label="পেছনে যান" ' + st(43.0, 95.6, 14.0, 1.4) + '></a>';
    return h;
  }

  var REQ = ['nsDcBrn', 'nsDcGender', 'nsDcDob', 'nsDcDod', 'nsDcCause', 'nsDcPlace',
    'nsDcNameBn', 'nsDcNameEn', 'nsDcFatherBn', 'nsDcFatherEn', 'nsDcMotherBn', 'nsDcMotherEn',
    'nsDcAddrBn', 'nsDcAddrEn', 'nsDcPermBn', 'nsDcApplicant', 'nsDcMobile', 'nsDcApplicantNid'];
  var ALL = REQ.concat(['nsDcSpouseBn', 'nsDcSpouseEn', 'nsDcAddr2Bn', 'nsDcAddr2En']);

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function prefill() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!d) return;
      ALL.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && d[id]) el.value = d[id];
      });
    } catch (e) {}
  }
  function clearForm() {
    ALL.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var same = document.getElementById('nsDcPermSame');
    if (same) same.checked = false;
    var docEl = document.getElementById('nsDcDoc');
    if (docEl) docEl.value = '';
    var stEl = document.getElementById('nsDcDocStatus');
    if (stEl) stEl.textContent = '';
  }
  function payload() {
    var d = {};
    ALL.forEach(function (id) { d[id] = val(id); });
    return {
      brn: d.nsDcBrn, gender: d.nsDcGender, dob: d.nsDcDob, dod: d.nsDcDod,
      cause: d.nsDcCause, place: d.nsDcPlace,
      name_bn: d.nsDcNameBn, name_en: d.nsDcNameEn,
      father_bn: d.nsDcFatherBn, father_en: d.nsDcFatherEn,
      mother_bn: d.nsDcMotherBn, mother_en: d.nsDcMotherEn,
      spouse_bn: d.nsDcSpouseBn, spouse_en: d.nsDcSpouseEn,
      address_bn: d.nsDcAddrBn, address_en: d.nsDcAddrEn,
      address2_bn: d.nsDcAddr2Bn, address2_en: d.nsDcAddr2En,
      permanent_bn: d.nsDcPermBn, applicant: d.nsDcApplicant,
      mobile: d.nsDcMobile, applicant_nid: d.nsDcApplicantNid,
      document_name: (function () {
        var docEl = document.getElementById('nsDcDoc');
        return (docEl && docEl.files && docEl.files[0]) ? docEl.files[0].name : '';
      })()
    };
  }
  function submit() {
    var err = document.getElementById('nsDcErr');
    var status = document.getElementById('nsDcDocStatus');
    var missing = REQ.filter(function (id) { return !val(id); });
    if (missing.length) {
      if (err) err.textContent = 'দয়া করে * চিহ্নিত সব ঘর পূরণ করুন।';
      return;
    }
    var dob = val('nsDcDob'), dod = val('nsDcDod');
    if (dob && dod && dod < dob) {
      if (err) err.textContent = 'মৃত্যুর তারিখ জন্ম তারিখের আগে হতে পারে না।';
      return;
    }
    var mob = val('nsDcMobile').replace(/[\s\-]/g, '');
    if (!/^\d{10,15}$/.test(mob)) {
      if (err) err.textContent = 'সঠিক মোবাইল নম্বর দিন (শুধু সংখ্যা)।';
      return;
    }
    if (err) err.textContent = '';
    var d = {};
    ALL.forEach(function (id) { d[id] = val(id); });
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) {}
    var btn = document.getElementById('nsDcSave');
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'অর্ডার পাঠানো হচ্ছে… (৫০ টাকা কাটবে)';
    if (typeof nsCall !== 'function') {
      if (status) status.textContent = '';
      if (btn) btn.disabled = false;
      if (typeof showModal === 'function') showModal('অর্ডার হয়নি', 'অ্যাপ লোড হয়নি — পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
      return;
    }
    nsCall('/orders', 'POST', { service_id: 'deathcert', payload: payload() }).then(function (r) {
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      if (status) status.textContent = '';
      if (btn) btn.disabled = false;
      clearForm();
      if (typeof NS_STATE !== 'undefined' && r && r.wallet_bdt !== undefined) NS_STATE.wallet = r.wallet_bdt;
      if (typeof showModal === 'function' && r && r.order) {
        showModal('অর্ডার সফল', 'অর্ডার #' + r.order.id + ' — ৫০ টাকা কেটেছে, স্ট্যাটাস: ' + r.order.status + '।');
      }
    }).catch(function (e) {
      if (status) status.textContent = '';
      if (btn) btn.disabled = false;
      var m = (e && e.message) || '';
      var msg = m;
      if (m === 'service_not_found') msg = 'সার্ভারে মৃত্যু সনদ সার্ভিসটি এখনো যোগ হয়নি — অ্যাডমিন থেকে যোগ করার পর অর্ডার করা যাবে। আপনার তথ্য এই ডিভাইসে সংরক্ষিত আছে।';
      else if (m === 'insufficient_balance') msg = 'ব্যালান্স কম — রিচার্জ করুন।';
      else if (m === 'orders_closed') msg = 'অর্ডার গ্রহণ বর্তমানে বন্ধ আছে।';
      if (typeof showModal === 'function') showModal('অর্ডার হয়নি', msg);
      else if (err) err.textContent = msg;
    });
  }
  function wireOverlays() {
    var inpDoc = document.getElementById('nsDcDoc');
    var stEl = document.getElementById('nsDcDocStatus');
    if (inpDoc) {
      inpDoc.addEventListener('change', function () {
        if (stEl) stEl.textContent = inpDoc.files && inpDoc.files[0] ? 'ফাইল: ' + inpDoc.files[0].name : '';
      });
    }
    var same = document.getElementById('nsDcPermSame');
    if (same) {
      same.addEventListener('change', function () {
        if (same.checked) {
          var a = document.getElementById('nsDcAddrBn');
          var p = document.getElementById('nsDcPermBn');
          if (a && p) p.value = a.value;
        }
      });
    }
    var btn = document.getElementById('nsDcSave');
    if (btn) btn.addEventListener('click', submit);
  }
  function setLoad(text, showRetry) {
    var s = document.getElementById('nsDcLoadStatus');
    if (s) s.textContent = text;
    var r = document.getElementById('nsDcRetry');
    if (r) r.hidden = !showRetry;
  }
  function showOverlays() {
    var pic = document.getElementById('nsDcPic');
    if (!pic || document.getElementById('nsDcSave')) return;
    pic.insertAdjacentHTML('beforeend', overlaysHTML());
    setLoad('ফরম তৈরি — ছবির সাদা ঘরগুলোতে চাপ দিয়ে তথ্য লিখুন, তারপর নিচের সংরক্ষণ বাটনে চাপ দিন।', false);
    wireOverlays();
    prefill();
  }
  function loadStrip(i, g) {
    if (g !== curGen) return;
    if (!document.getElementById('nsDcWrap')) { loading = false; return; }
    if (i >= STRIPS.length) { loading = false; showOverlays(); return; }
    loading = true;
    attempts[i]++;
    setLoad('নতুন ডিজাইন লোড হচ্ছে… (' + (i + 1) + '/' + STRIPS.length + ' অংশ) — স্লো নেটে একটু সময় লাগবে, পেজটি খোলা রাখুন।', false);
    fetch(STRIPS[i]).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.text();
    }).then(function (b64) {
      if (g !== curGen) return;
      var pic = document.getElementById('nsDcPic');
      if (!pic) { loading = false; return; }
      pic.insertAdjacentHTML('beforeend', '<img class="nsdc2-strip" src="data:image/jpeg;base64,' + b64.trim() + '" alt="">');
      loaded = i + 1;
      loadStrip(i + 1, g);
    }).catch(function () {
      if (g !== curGen) return;
      if (!document.getElementById('nsDcWrap')) { loading = false; return; }
      if (attempts[i] < 3) {
        setLoad('নেট দুর্বল — ছবির ' + (i + 1) + ' নম্বর অংশ আবার আনা হচ্ছে…', false);
        setTimeout(function () { loadStrip(i, g); }, attempts[i] === 1 ? 2000 : 4000);
      } else {
        loading = false;
        setLoad('ছবির ' + (i + 1) + ' নম্বর অংশ লোড হয়নি — নেট চেক করে আবার চেষ্টা করুন।', true);
      }
    });
  }
  function startLoad() {
    if (loading) return;
    var pic = document.getElementById('nsDcPic');
    if (!pic) return;
    if (loaded >= STRIPS.length) { showOverlays(); return; }
    loadStrip(loaded, curGen);
  }
  function setFullPage(on) {
    try {
      if (on) document.body.classList.add('nsdc2-full');
      else document.body.classList.remove('nsdc2-full');
    } catch (e) {}
  }
  function cleanup() {
    var wrap = document.getElementById('nsDcWrap');
    if (wrap) wrap.remove();
    setFullPage(false);
    loaded = 0; attempts = [0, 0, 0, 0]; loading = false;
  }
  function build() {
    var main = document.getElementById('main');
    if (!main || document.getElementById('nsDcWrap')) return;
    main.innerHTML = '<div class="nsdc2-wrap" id="nsDcWrap">'
      + '<div class="nsdc2-pic" id="nsDcPic"></div>'
      + '<p id="nsDcLoadStatus" class="nsdc2-status"></p>'
      + '<p><button type="button" class="nsdc2-retry" id="nsDcRetry" hidden>আবার চেষ্টা করুন</button></p>'
      + '<p id="nsDcDocStatus" class="nsdc2-status"></p>'
      + '<p id="nsDcErr" class="nsdc2-err"></p>'
      + '<div class="nsdc2-price">মূল্য: ৫০ টাকা (প্রতি আবেদন) — সংরক্ষণ করলেই ব্যালেন্স থেকে ৫০ টাকা কাটবে।</div>'
      + '<p class="nsdc2-hint">ছবি ছোট দেখালে দুই আঙুলে জুম করে ঘরগুলো পূরণ করুন।</p>'
      + '</div>';
    loaded = 0; attempts = [0, 0, 0, 0, 0, 0, 0, 0]; loading = false; curGen = ++gen;
    setFullPage(true);
    var retry = document.getElementById('nsDcRetry');
    if (retry) retry.addEventListener('click', function () {
      attempts[loaded] = 0;
      setLoad('ছবি আবার লোড হচ্ছে…', false);
      startLoad();
    });
    startLoad();
  }
  function tick() {
    try {
      if (!isDeathCert() || isLoginShowing()) {
        if (document.getElementById('nsDcWrap')) cleanup();
        else setFullPage(false);
        return;
      }
      var ob = document.getElementById('nsOrderBtn');
      if (document.getElementById('nsDcWrap') && ob) ob.remove();
      build();
      if (document.getElementById('nsDcWrap') && !loading && loaded < STRIPS.length) startLoad();
    } catch (e) {}
  }
  tick();
  window.addEventListener('hashchange', function () { setTimeout(tick, 100); });
  setInterval(tick, 500);
})();
