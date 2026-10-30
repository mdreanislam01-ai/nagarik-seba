/* ns-newbdris-design.js — newbdris page, full screenshot design, client only.
   Rebuilt 2026-10-30 from the user's two screenshots, at their
   explicit instruction that NOTHING old should remain on this page:
   - Page background: light-blue gradient, like the screenshots.
   - FIRST: Autoload hero + Autoload card.
   - THEN: New-birth-registration hero + Personal-info card.
   - Blue gradient header bars (#2563eb -> #1e40af, exactly the
     screenshots' blue — this page only; the rest of the site
     keeps its teal).
   - Field icon chips, dashed upload box, full-width blue buttons,
     footer notes, and the "পেছনে যান" link, as in the screenshots.
   What is NOT changed, and why (these are functional, not design):
   - DOM order/count of .brn-grid inputs is NEVER changed: order
     submission and document auto-fill map fields by DOM index.
     Visual order is changed ONLY with CSS `order` on this page,
     to match the screenshots' field sequence as closely as the
     separate Upazila and Zila inputs allow (the screenshots show
     them combined in one line; this site has them as two
     separate inputs, so both stay, adjacent, with their own
     labels — merging them would send an empty Zila and break
     the order).
   - 2026-10-30 the user had the whole option card removed
     (see ns-bdris-clean.js): no option pills remain on this
     page. The order now always goes as নরমাল (800 টাকা),
     the option that was selected by default before removal.
   - The autoload "লোড করুন" button does NOT fetch government/
     BDRIS data and does NOT pretend to (no agreed external
     lookup exists). After the math captcha it pre-fills the BRN
     and DOB you typed into the personal-info fields below and
     scrolls there. The card states this plainly.
   - Background illustrations are recreated as inline SVG in
     the same style as the screenshots (document + leaves +
     checkmark for autoload; baby + document + leaves + heart
     for personal info). The screenshots themselves cannot be
     used as background images — they contain UI text and would
     render blurred and wrong-sized. If the user uploads the
     original background artwork files without UI, they can be
     swapped in exactly. */
(function(){
  'use strict';
  function isNewBdris(){ return (location.hash || '').indexOf('newbdris') !== -1; }
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
      msg.style.color = ok ? '#166534' : '#dc2626';
      msg.style.background = ok ? '#f0fdf4' : '#fef2f2';
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
    if (inputs[3]) { inputs[3].value = brn.value.trim(); fire(inputs[3]); }
    if (inputs[9]) { inputs[9].value = toDDMMYYYY(dob.value); fire(inputs[9]); }
    say('জন্ম নিবন্ধন নম্বর ও জন্ম তারিখ ব্যক্তিগত তথ্যে বসানো হয়েছে। বাকি তথ্য পূরণ করে অর্ডার করুন।', true);
    try { card.scrollIntoView({behavior: 'smooth', block: 'start'}); } catch(e){}
  }
  var DOC_ART = '<svg viewBox="0 0 120 110" width="120" height="110" aria-hidden="true"><ellipse cx="60" cy="52" rx="52" ry="48" fill="#dbeafe"/><rect x="28" y="8" width="64" height="88" rx="8" fill="#fff" stroke="#bfdbfe"/><circle cx="52" cy="32" r="9" fill="#2563eb"/><rect x="68" y="24" width="20" height="5" rx="2" fill="#93c5fd"/><rect x="38" y="50" width="44" height="5" rx="2" fill="#bfdbfe"/><rect x="38" y="62" width="44" height="5" rx="2" fill="#bfdbfe"/><rect x="38" y="74" width="30" height="5" rx="2" fill="#bfdbfe"/><circle cx="88" cy="82" r="14" fill="#16a34a"/><path d="M82 82l4 4 8-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 92c8-2 14-8 16-16M108 92c-8-2-14-8-16-16" stroke="#16a34a" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  var BABY_ART = '<svg viewBox="0 0 120 110" width="120" height="110" aria-hidden="true"><ellipse cx="60" cy="52" rx="52" ry="48" fill="#dbeafe"/><rect x="22" y="10" width="56" height="82" rx="8" fill="#fff" stroke="#bfdbfe"/><circle cx="42" cy="30" r="8" fill="#2563eb"/><rect x="56" y="24" width="14" height="4" rx="2" fill="#93c5fd"/><rect x="30" y="48" width="40" height="4" rx="2" fill="#bfdbfe"/><rect x="30" y="58" width="40" height="4" rx="2" fill="#bfdbfe"/><circle cx="82" cy="72" r="20" fill="#93c5fd"/><circle cx="82" cy="66" r="9" fill="#fde68a"/><path d="M74 74c2 6 6 10 8 10s6-4 8-10" fill="#60a5fa"/><path d="M96 40c6-1 10-5 12-11" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M100 58c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z" fill="#ef4444"/></svg>';
  function build(){
    var main = document.getElementById('main');
    if (!main) return;
    if (!isNewBdris()){
      main.classList.remove('ns-nb-page');
      return;
    }
    main.classList.add('ns-nb-page');
    var card = document.getElementById('brnCopyCard');
    if (!card) return;
    // Personal-info hero + header bar, once.
    if (!card.classList.contains('ns-nb-design')) {
      card.classList.add('ns-nb-design');
      var hero2 = document.createElement('div');
      hero2.className = 'ns-nb-hero';
      hero2.innerHTML = '<div class="ns-nb-hero-text"><span class="ns-nb-hero-ico">📄</span><div><b>নতুন জন্মনিবন্ধন</b><small>জন্ম নিবন্ধন করুন, নাগরিকত্বের প্রথম ধাপ</small><span>সঠিক তথ্য দিন, নিরাপদ থাকুন<br>আপনার শিশুর উজ্জ্বল ভবিষ্যৎ নিশ্চিত করুন।</span></div></div><div class="ns-nb-hero-art">' + BABY_ART + '</div>';
      card.parentNode.insertBefore(hero2, card);
      var head = document.createElement('div');
      head.className = 'ns-nb-head';
      head.innerHTML = '<span class="ns-nb-head-l">👤 ব্যক্তিগত তথ্য</span><span class="ns-nb-head-r">সঠিক তথ্য দিন, দ্রুত সেবা নিন</span>';
      card.insertBefore(head, card.firstChild);
      // Upload box wording, as in the screenshot. The button's
      // onclick (document auto-fill) is untouched.
      var dash = card.querySelector('.brn-dash');
      if (dash) {
        var spans = dash.querySelectorAll('span');
        if (spans.length > 1) spans[spans.length - 1].innerHTML = 'স্বয়ংক্রিয়ভাবে আপলোড করুন<br>এখানে ক্লিক করুন';
      }
      // Footer note + back link, after the order button.
      var foot = document.createElement('div');
      foot.className = 'ns-nb-foot';
      foot.innerHTML = '<p class="ns-nb-note">🛡️ দ্রষ্টব্য: সকল তথ্য সঠিকভাবে প্রদান করুন। ভুল তথ্য দিলে আবেদন বাতিল হতে পারে।</p><p class="ns-nb-back"><a href="#/dashboard">← পেছনে যান</a></p>';
      card.appendChild(foot);
    }
    // Autoload hero + card at the very top, once per render.
    if (document.getElementById('nsAutoCard')) return;
    var wrap = document.createElement('div');
    wrap.id = 'nsAutoCard';
    wrap.innerHTML =
      '<div class="ns-nb-hero"><div class="ns-nb-hero-text"><span class="ns-nb-hero-ico">📄</span><div><b>অটোলোড তথ্য</b><small>Autoload Information</small><span>আপনার জন্ম নিবন্ধন নম্বর, জন্ম তারিখ ও ক্যাপচা পূরণ করে তথ্য দেখুন।</span></div></div><div class="ns-nb-hero-art">' + DOC_ART + '</div></div>'
      + '<div class="ns-auto-card">'
      + '<div class="ns-auto-bar"><span>👤 তথ্য প্রদান করুন</span><span class="ns-auto-bar-r">সঠিক তথ্য দিন, দ্রুত সেবা নিন</span></div>'
      + '<div class="ns-auto-body">'
      + '<div class="ns-auto-field"><span class="ns-auto-fico">🪪</span><div class="ns-auto-fmain"><label class="ns-auto-label">জন্ম নিবন্ধন নম্বর *</label><input id="nsAutoBrn" class="ns-auto-input" placeholder="XXXXXXXXXXXXXXXXX" inputmode="numeric"></div></div>'
      + '<div class="ns-auto-field"><span class="ns-auto-fico">📅</span><div class="ns-auto-fmain"><label class="ns-auto-label">জন্ম তারিখ *</label><div class="ns-auto-with-ico"><input id="nsAutoDob" class="ns-auto-input" placeholder="YYYY-MM-DD"><span class="ns-auto-in-ico">📅</span></div></div></div>'
      + '<div class="ns-auto-field"><span class="ns-auto-fico">🛡️</span><div class="ns-auto-fmain"><label class="ns-auto-label">ক্যাপচা ছবি *</label><div class="ns-auto-cap-row"><span id="nsAutoCaptchaImg" class="ns-auto-cap-img"></span><button type="button" id="nsAutoCapRefresh" class="ns-auto-cap-refresh">↻ নতুন ক্যাপচা</button></div></div></div>'
      + '<div class="ns-auto-field"><span class="ns-auto-fico">⌨️</span><div class="ns-auto-fmain"><label class="ns-auto-label">ক্যাপচা টেক্সট *</label><input id="nsAutoCaptchaTxt" class="ns-auto-input" placeholder="XX" inputmode="numeric"></div></div>'
      + '<button type="button" id="nsAutoLoadBtn" class="ns-auto-btn">➤ লোড করুন</button>'
      + '<p id="nsAutoMsg" class="ns-auto-msg"></p>'
      + '<p class="ns-auto-note">ⓘ ইশিত: সঠিক তথ্য প্রদান করুন, অন্যথায় তথ্য পাওয়া যাবে না। এই লোড বোতামটি আপনার লেখা নম্বর ও তারিখ নিচের ব্যক্তিগত তথ্যে বসিয়ে দেয়; সরকারি ডাটাবেস থেকে কোনো তথ্য আনা হয় না।</p>'
      + '</div></div>';
    var firstCard = main.querySelector('.card');
    if (firstCard) main.insertBefore(wrap, firstCard); else main.insertBefore(wrap, card);
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
    // Idempotent only: build() returns early when its elements
    // exist, and creates nothing when they do — no self-loop.
    new MutationObserver(function(){ apply(); }).observe(mainEl, {childList: true, subtree: true});
  }
})();
