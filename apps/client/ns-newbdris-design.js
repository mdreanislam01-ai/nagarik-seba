/* ns-newbdris-design.js — newbdris page design, client only, 2026-10-30.
   User request, with screenshots: on #/order/newbdris, put the
   autoload section FIRST at the top, then the personal-info form
   below it, designed like the screenshots (layout, icon chips,
   header bars, dashed upload box, full-width button).
   Colours: the screenshots use a blue gradient; per the user's
   permission to use the site's own colour, the gradient/bars use
   the site's teal (#0f766e) instead, so the page stays unified
   with nagarikseba. Icons are NOT replaced — the existing
   .brn-ico SVGs are kept exactly, only given a light chip
   background like the screenshots.
   SAFETY / HONESTY, read this before changing the autoload:
   - DOM order of .brn-grid fields is NEVER changed (order
     submission and document auto-fill map fields by DOM index).
     Only CSS styling is applied to the personal-info card.
   - The autoload "লোড করুন" button does NOT fetch any
     government/BDRIS data and does NOT pretend to. There is no
     agreed external lookup for this page (my-api.top was only
     investigated publicly, no login/test). What it honestly does:
     it checks the math captcha, then pre-fills the BRN number and
     Date of Birth you typed into the matching personal-info
     fields below (and DOB-in-words via the existing listener),
     then scrolls you to the personal-info form to complete the
     rest manually. The existing document-upload auto-fill button
     inside the personal-info card is kept untouched.
   - No price, option, route or order flow is changed. The order
     button created by ns-bdris-clean.js keeps its text and its
     newbdris submission; only its styling is changed. */
(function(){
  'use strict';
  function isNewBdris(){ return (location.hash || '').indexOf('newbdris') !== -1; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var captcha = {a: 0, b: 0};
  function newCaptcha(){
    captcha.a = 10 + Math.floor(Math.random() * 41);
    captcha.b = 10 + Math.floor(Math.random() * 41);
    var el = document.getElementById('nsAutoCaptchaImg');
    if (el) el.textContent = captcha.a + '+' + captcha.b + '=?';
    var t = document.getElementById('nsAutoCaptchaTxt');
    if (t) t.value = '';
  }
  function toDDMMYYYY(v){
    v = (v || '').trim();
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return m[3] + '/' + m[2] + '/' + m[1];
    return v;
  }
  function fire(el){
    try { el.dispatchEvent(new Event('input', {bubbles: true})); } catch(e){}
    try { el.dispatchEvent(new Event('change', {bubbles: true})); } catch(e){}
  }
  function onLoad(){
    var brn = document.getElementById('nsAutoBrn');
    var dob = document.getElementById('nsAutoDob');
    var cap = document.getElementById('nsAutoCaptchaTxt');
    var msg = document.getElementById('nsAutoMsg');
    function say(txt, ok){
      if (!msg) return;
      msg.textContent = txt;
      msg.style.color = ok ? '#0f766e' : '#dc2626';
      msg.style.background = ok ? '#ecfdf5' : '#fef2f2';
    }
    if (!brn || !brn.value.trim()) { say('জন্ম নিবন্ধন নম্বর লিখুন।', false); return; }
    if (!dob || !dob.value.trim()) { say('জন্ম তারিখ লিখুন।', false); return; }
    if (!cap || parseInt(cap.value.trim(), 10) !== captcha.a + captcha.b) {
      say('ক্যাপচা উত্তর ভুল হয়েছে। নতুন ক্যাপচা দেওয়া হলো, আবার চেষ্টা করুন।', false);
      newCaptcha(); return;
    }
    var card = document.getElementById('brnCopyCard');
    if (!card) { say('ব্যক্তিগত তথ্যের ফর্ম পাওয়া যায়নি, পেজটি রিফ্রেশ করুন।', false); return; }
    var inputs = card.querySelectorAll('.brn-grid input, .brn-grid select, .brn-grid textarea');
    // DOM indices are fixed by the original form: 3 = BRN, 9 = DOB.
    if (inputs[3]) { inputs[3].value = brn.value.trim(); fire(inputs[3]); }
    if (inputs[9]) { inputs[9].value = toDDMMYYYY(dob.value); fire(inputs[9]); }
    say('জন্ম নিবন্ধন নম্বর ও জন্ম তারিখ ব্যক্তিগত তথ্যে বসানো হয়েছে। বাকি তথ্য পূরণ করে অর্ডার করুন।', true);
    try { card.scrollIntoView({behavior: 'smooth', block: 'start'}); } catch(e){}
  }
  function build(){
    if (!isNewBdris()) return;
    var main = document.getElementById('main');
    var card = document.getElementById('brnCopyCard');
    if (!main || !card) return;
    // Personal-info card: add the screenshot-style header bar once.
    if (!card.classList.contains('ns-nb-design')) {
      card.classList.add('ns-nb-design');
      var head = document.createElement('div');
      head.className = 'ns-nb-head';
      head.innerHTML = '<span class="ns-nb-head-l">👤 ব্যক্তিগত তথ্য</span><span class="ns-nb-head-r">সঠিক তথ্য দিন, দ্রুত সেবা নিন</span>';
      card.insertBefore(head, card.firstChild);
    }
    // Autoload card at the very top, once per render.
    if (document.getElementById('nsAutoCard')) return;
    var auto = document.createElement('div');
    auto.id = 'nsAutoCard';
    auto.className = 'ns-auto-card';
    auto.innerHTML =
      '<div class="ns-auto-top"><span class="ns-auto-ico">📄</span><span class="ns-auto-titles"><b>অটোলোড তথ্য</b><small>Autoload Information</small><span>আপনার জন্ম নিবন্ধন নম্বর, জন্ম তারিখ ও ক্যাপচা পূরণ করে তথ্য দেখুন।</span></span></div>'
      + '<div class="ns-auto-bar"><span>👤 তথ্য প্রদান করুন</span><span class="ns-auto-bar-r">সঠিক তথ্য দিন, দ্রুত সেবা নিন</span></div>'
      + '<div class="ns-auto-body">'
      + '<label class="ns-auto-label">🪪 জন্ম নিবন্ধন নম্বর *</label><input id="nsAutoBrn" class="ns-auto-input" placeholder="XXXXXXXXXXXXXXXXX" inputmode="numeric">'
      + '<label class="ns-auto-label">📅 জন্ম তারিখ *</label><input id="nsAutoDob" class="ns-auto-input" placeholder="YYYY-MM-DD">'
      + '<label class="ns-auto-label">🛡️ ক্যাপচা ছবি *</label><div class="ns-auto-cap-row"><span id="nsAutoCaptchaImg" class="ns-auto-cap-img"></span><button type="button" id="nsAutoCapRefresh" class="ns-auto-cap-refresh">↻ নতুন ক্যাপচা</button></div>'
      + '<label class="ns-auto-label">⌨️ ক্যাপচা টেক্সট *</label><input id="nsAutoCaptchaTxt" class="ns-auto-input" placeholder="উপরের যোগফল লিখুন" inputmode="numeric">'
      + '<button type="button" id="nsAutoLoadBtn" class="ns-auto-btn">➤ লোড করুন</button>'
      + '<p id="nsAutoMsg" class="ns-auto-msg"></p>'
      + '<p class="ns-auto-note">ⓘ দ্রষ্টব্য: সঠিক তথ্য প্রদান করুন, অন্যথায় তথ্য পাওয়া যাবে না। এই লোড বোতামটি আপনার লেখা নম্বর ও তারিখ নিচের ব্যক্তিগত তথ্যে বসিয়ে দেয়; সরকারি ডাটাবেস থেকে কোনো তথ্য আনা হয় না।</p>'
      + '</div>';
    var firstCard = main.querySelector('.card');
    if (firstCard) main.insertBefore(auto, firstCard); else main.insertBefore(auto, card);
    newCaptcha();
    var loadBtn = document.getElementById('nsAutoLoadBtn');
    if (loadBtn) loadBtn.addEventListener('click', onLoad);
    var refresh = document.getElementById('nsAutoCapRefresh');
    if (refresh) refresh.addEventListener('click', function(e){ e.preventDefault(); newCaptcha(); });
  }
  function apply(){
    try { build(); } catch(e){}
  }
  apply();
  window.addEventListener('hashchange', function(){ setTimeout(apply, 100); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    // Idempotent: build() returns early when the card exists, and
    // only creates elements when they are missing, so this cannot
    // loop (unlike the old notify observer, which rewrote a badge
    // on every callback).
    new MutationObserver(function(){ apply(); }).observe(mainEl, {childList: true, subtree: true});
  }
})();
