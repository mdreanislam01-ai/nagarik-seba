/* ns-login-land.js — Nagarik Seba client LOGIN LANDING (additive, v1).
   WHAT IT DOES: only when body has class ns-login-portal AND #main
   contains .ns-slide-page (the login/signup view app.js renders), it
   rearranges THOSE EXISTING nodes into the reference landing layout:
   the real .ns-slide-brand logo node moves into the new site header,
   the real #nsSlideCard moves into the new login column, and a
   header / hero / services / benefits / footer shell is built around
   them. Nothing is rebuilt, duplicated or faked.
   WHAT IT NEVER DOES: it never touches #nsGate (entry-notice gate),
   never touches forgot mode (.ns-login-wrap has no .ns-slide-page,
   so this script no-ops there), never creates a login form, never
   calls any API, never changes a route, price or flow. Auth stays
   exactly app.js's: #nsSlideCard, both forms, all input IDs, inline
   onsubmit handlers, nsSlideTo() toggles, eye toggles and the
   #/forgot link are preserved untouched (nodes are MOVED with
   appendChild/replaceWith, so values, focus, listeners and inline
   handlers survive). The visible "নতুন অ্যাকাউন্ট তৈরি করুন" /
   "লগইনে ফিরুন" buttons call the same nsSlideTo('signup'|'login').
   NO MutationObserver (past infinite-loop bugs): a 500ms read-only
   interval + a hashchange listener. The tick writes DOM only when no
   .ns-ll wrapper exists yet, i.e. only once per fresh app.js render
   (app.js replaces #main.innerHTML on render, which destroys the
   wrapper, so the next tick rebuilds from the fresh nodes).
   NAV NOTE: in-page items are <button>s using scrollIntoView, NOT
   hash anchors — a hash change would make app.js re-render the page
   and lose the scroll. Only real routes use <a href>: #/support and
   #/order/<service-id>. Social icons are plain <span>s, no links.
   TRUTHFULNESS: no "সরকারি" platform claim, no "স্মার্ট বাংলাদেশ"
   slogan, no hotline, no invented contact email, no invented
   external social URLs; the non-government disclaimer is shown
   under the login column and in the footer. */

(function () {
  'use strict';

  /* Lightweight inline-SVG scene (monument + flag + laptop + phone).
     Original drawing, a few KB — NEVER the reference screenshot, and
     no base64 image is used anywhere in these files. */
  var ART =
    '<svg class="ns-ll-art" viewBox="0 0 640 400" role="img" aria-label="নাগরিক সেবা">' +
    '<defs><linearGradient id="nsll-sky" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#8ecdf5"/><stop offset="1" stop-color="#e3f3fd"/>' +
    '</linearGradient></defs>' +
    '<rect width="640" height="400" fill="url(#nsll-sky)"/>' +
    '<circle cx="540" cy="70" r="34" fill="#fff7cc" opacity="0.9"/>' +
    '<g fill="#ffffff" opacity="0.9"><ellipse cx="120" cy="70" rx="52" ry="18"/><ellipse cx="160" cy="58" rx="40" ry="16"/><ellipse cx="430" cy="52" rx="46" ry="15"/></g>' +
    '<g fill="#b8d4ea"><rect x="30" y="190" width="42" height="90"/><rect x="84" y="210" width="34" height="70"/><rect x="520" y="200" width="40" height="80"/></g>' +
    '<rect x="0" y="280" width="640" height="120" fill="#7ec8a9"/>' +
    '<rect x="0" y="330" width="640" height="70" fill="#a8d8f0"/>' +
    '<g><rect x="238" y="120" width="6" height="190" fill="#64748b"/>' +
    '<rect x="244" y="128" width="104" height="62" fill="#006a4e"/>' +
    '<circle cx="296" cy="159" r="17" fill="#f42a41"/></g>' +
    '<g fill="#cfa07a"><path d="M150 300 L190 150 L210 150 L230 300 Z"/><path d="M120 300 L150 190 L168 190 L178 300 Z"/><path d="M222 300 L232 190 L250 190 L280 300 Z"/></g>' +
    '<g fill="#8d6e63"><path d="M190 150 L200 118 L210 150 Z"/></g>' +
    '<g><ellipse cx="120" cy="316" rx="26" ry="10" fill="#16a34a"/><ellipse cx="150" cy="322" rx="20" ry="8" fill="#22c55e"/><ellipse cx="330" cy="318" rx="24" ry="9" fill="#16a34a"/></g>' +
    '<g><rect x="150" y="262" width="210" height="118" rx="10" fill="#1e293b"/><rect x="162" y="272" width="186" height="92" rx="6" fill="#dbeafe"/>' +
    '<g fill="#2563eb"><circle cx="182" cy="292" r="9"/><circle cx="212" cy="292" r="9"/><circle cx="242" cy="292" r="9"/></g>' +
    '<g fill="#93c5fd"><rect x="172" y="314" width="60" height="8" rx="4"/><rect x="172" y="330" width="100" height="8" rx="4"/><rect x="248" y="314" width="80" height="8" rx="4"/></g>' +
    '<path d="M138 380 L372 380 L384 392 L126 392 Z" fill="#94a3b8"/></g>' +
    '<g><rect x="378" y="282" width="64" height="106" rx="10" fill="#0f172a"/><rect x="386" y="292" width="48" height="80" rx="4" fill="#eff6ff"/>' +
    '<g fill="#2563eb"><circle cx="402" cy="308" r="6"/><circle cx="422" cy="308" r="6"/></g>' +
    '<rect x="394" y="326" width="32" height="6" rx="3" fill="#93c5fd"/><rect x="394" y="338" width="32" height="6" rx="3" fill="#bfdbfe"/></g>' +
    '<g><rect x="428" y="216" width="118" height="42" rx="21" fill="#16a34a"/><path d="M452 237 l8 8 14 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '</svg>';

  function svcIcon(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  var IC = {
    doc: svcIcon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
    id: svcIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M14 9h3M14 13h3M6 17h12"/>'),
    chip: svcIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="8" y="9" width="8" height="6" rx="1"/><path d="M8 12H3M21 12h-5M12 9V5M12 19v-4"/>'),
    server: svcIcon('<rect x="4" y="3" width="16" height="6" rx="2"/><rect x="4" y="11" width="16" height="6" rx="2"/><circle cx="8" cy="6" r="1" fill="currentColor"/><circle cx="8" cy="14" r="1" fill="currentColor"/>'),
    cert: svcIcon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h4"/><circle cx="16" cy="16" r="3"/>'),
    search: svcIcon('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="11" cy="11" r="3"/><path d="M13.5 13.5L20 20"/>'),
    shield: svcIcon('<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    clock: svcIcon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    easy: svcIcon('<path d="M12 21s-7-4.5-7-11V6l7-3 7 3v4c0 6.5-7 11-7 11z"/><path d="M9 12l2 2 4-4"/>'),
    support: svcIcon('<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12" width="4" height="7" rx="2"/><rect x="17" y="12" width="4" height="7" rx="2"/><path d="M19 19a3 3 0 0 1-3 3h-3"/>'),
    tag: svcIcon('<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/>')
  };

  var SERVICES = [
    { name: 'জন্ম নিবন্ধন', sub: 'জন্ম নিবন্ধন অর্ডার করুন', href: '#/order/brn', bg: '#dcfce7', fg: '#15803d', icon: IC.doc },
    { name: 'জাতীয় পরিচয়পত্র', sub: 'এনআইডি সংক্রান্ত সেবা', href: '#/order/nid', bg: '#dbeafe', fg: '#1d4ed8', icon: IC.id },
    { name: 'স্মার্ট এনআইডি', sub: 'স্মার্ট কার্ড সেবা', href: '#/order/snid', bg: '#ede9fe', fg: '#7c3aed', icon: IC.chip },
    { name: 'সার্ভার কপি', sub: 'সার্ভার কপি অর্ডার করুন', href: '#/order/sc', bg: '#ffedd5', fg: '#ea580c', icon: IC.server },
    { name: 'টিন সার্টিফিকেট', sub: 'টিন সংক্রান্ত সেবা', href: '#/order/tin', bg: '#ccfbf1', fg: '#0f766e', icon: IC.cert },
    { name: 'জন্ম তথ্য', sub: 'জন্ম নিবন্ধন নম্বর তথ্য', href: '#/order/brni', bg: '#fce7f3', fg: '#be185d', icon: IC.search }
  ];

  var BENEFITS = [
    { t: 'নিরাপদ লগইন', s: 'আপনার অ্যাকাউন্ট সুরক্ষিত থাকে', bg: '#16a34a', icon: IC.shield },
    { t: 'দ্রুত প্রক্রিয়া', s: 'কম ধাপে অর্ডার সম্পন্ন হয়', bg: '#2563eb', icon: IC.clock },
    { t: 'সহজ ব্যবহার', s: 'মোবাইল ও কম্পিউটার — দুটোতেই চলে', bg: '#7c3aed', icon: IC.easy },
    { t: 'সাপোর্ট ব্যবস্থা', s: 'সমস্যা হলে সাপোর্টে জানাতে পারবেন', bg: '#0891b2', icon: IC.support },
    { t: 'স্বচ্ছ মূল্য', s: 'অর্ডারের আগে চার্জ দেখা যায়', bg: '#ea580c', icon: IC.tag }
  ];

  function servicesHTML() {
    return SERVICES.map(function (s) {
      return '<a class="ns-ll-svc" href="' + s.href + '"><i style="background:' + s.bg + ';color:' + s.fg + '">' + s.icon + '</i><b>' + s.name + '</b><small>' + s.sub + '</small></a>';
    }).join('');
  }
  function benefitsHTML() {
    return BENEFITS.map(function (b) {
      return '<div class="ns-ll-ben"><i style="background:' + b.bg + '">' + b.icon + '</i><div><b>' + b.t + '</b><span>' + b.s + '</span></div></div>';
    }).join('');
  }

  function shellHTML() {
    return '' +
      '<header class="ns-ll-head"><div class="ns-ll-head-in">' +
      '<div class="ns-ll-brand"><span class="ns-ll-brand-slot"></span><span class="ns-ll-brand-text"><b>নাগরিক সেবা</b><small>nagarikseba.com</small></span></div>' +
      '<nav class="ns-ll-nav" aria-label="প্রধান মেনু">' +
      '<button type="button" data-ns-ll-scroll="ns-ll-top">হোম</button>' +
      '<button type="button" data-ns-ll-scroll="ns-ll-about">আমাদের সম্পর্কে</button>' +
      '<button type="button" data-ns-ll-scroll="ns-ll-services">সেবাসমূহ</button>' +
      '<a href="#/support">সহায়তা</a>' +
      '<button type="button" data-ns-ll-scroll="ns-ll-contact">যোগাযোগ</button>' +
      '<a class="ns-ll-support" href="#/support">🎧 সাপোর্ট</a>' +
      '<span class="ns-ll-soc-row"><span class="ns-ll-soc" aria-hidden="true">f</span><span class="ns-ll-soc yt" aria-hidden="true">▶</span></span>' +
      '</nav>' +
      '<button type="button" class="ns-ll-burger" aria-label="মেনু খুলুন/বন্ধ করুন" aria-expanded="false">☰</button>' +
      '</div></header>' +
      '<div class="ns-ll-hero">' +
      '<div class="ns-ll-hero-text">' +
      '<span class="ns-ll-badge"><i>✓</i>নাগরিক সেবা পোর্টাল</span>' +
      '<h1>নাগরিক সেবা</h1>' +
      '<p class="ns-ll-tag">সবার সেবা, সবার পাশে</p>' +
      '<p class="ns-ll-intro">নাগরিক সেবা একটি বেসরকারি অনলাইন সেবা পোর্টাল। জন্ম নিবন্ধন, জাতীয় পরিচয়পত্র, সার্ভার কপি, টিনসহ বিভিন্ন সেবার অর্ডার এখানে সহজে করা যায়। লগইন করে ড্যাশবোর্ড থেকে অর্ডার করুন।</p>' +
      ART +
      '</div>' +
      '<div class="ns-ll-auth"><div class="ns-ll-card-logo-slot"></div><div class="ns-ll-card-slot"></div>' +
      '<div class="ns-ll-toggle">' +
      '<button type="button" class="ns-ll-to-signup" onclick="nsSlideTo(\'signup\')">নতুন অ্যাকাউন্ট তৈরি করুন</button>' +
      '<button type="button" class="ns-ll-to-login" onclick="nsSlideTo(\'login\')">লগইনে ফিরুন</button>' +
      '</div>' +
      '<p class="ns-ll-note">এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না।</p>' +
      '</div>' +
      '<section class="ns-ll-services" id="ns-ll-services"><div class="ns-ll-sec-head"><h2>আমাদের সেবাসমূহ</h2><span>সব সেবা দেখুন ↓</span></div>' +
      '<div class="ns-ll-svc-grid">' + servicesHTML() + '</div>' +
      '<button type="button" class="ns-ll-all" data-ns-ll-scroll="ns-ll-services">সব সেবা দেখুন →</button>' +
      '</section>' +
      '</div>' +
      '<section class="ns-ll-benefits" id="ns-ll-about"><div class="ns-ll-benefits-in">' + benefitsHTML() + '</div></section>' +
      '<footer class="ns-ll-foot" id="ns-ll-contact"><div class="ns-ll-foot-in">' +
      '<div class="ns-ll-foot-brand"><b>' + IC.shield.replace('currentColor', '#fff') + ' নাগরিক সেবা</b>' +
      '<p>নাগরিকদের জন্য সহজ অনলাইন সেবা অর্ডারের পোর্টাল। লগইন করে ড্যাশবোর্ড থেকে সেবা নিন।</p>' +
      '<span class="ns-ll-soc" aria-hidden="true">f</span> <span class="ns-ll-soc yt" aria-hidden="true">▶</span></div>' +
      '<div><h3>দ্রুত লিংক</h3><ul>' +
      '<li><button type="button" data-ns-ll-scroll="ns-ll-top">হোম</button></li>' +
      '<li><button type="button" data-ns-ll-scroll="ns-ll-about">আমাদের সম্পর্কে</button></li>' +
      '<li><button type="button" data-ns-ll-scroll="ns-ll-services">সেবাসমূহ</button></li>' +
      '<li><a href="#/support">সাপোর্ট</a></li>' +
      '</ul></div>' +
      '<div><h3>আমাদের সেবাসমূহ</h3><ul>' + SERVICES.map(function (s) {
        return '<li><a href="' + s.href + '">' + s.name + '</a></li>';
      }).join('') + '</ul></div>' +
      '<div><h3>যোগাযোগ করুন</h3><ul>' +
      '<li><span>🌐 nagarikseba.com</span></li>' +
      '<li><a href="#/support">🎧 সাপোর্ট সেন্টার</a></li>' +
      '</ul></div>' +
      '</div>' +
      '<div class="ns-ll-disclaimer"><p>এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না। এটি একটি বেসরকারি সেবা পোর্টাল; কোনো সরকারি ওয়েবসাইট নয়।</p></div>' +
      '<div class="ns-ll-copy">© ২০২৬ নাগরিক সেবা। সর্বস্বত্ব সংরক্ষিত।</div>' +
      '</footer>';
  }

  function build() {
    if (document.querySelector('.ns-ll')) return true;
    if (!document.body.classList.contains('ns-login-portal')) return false;
    var main = document.getElementById('main');
    if (!main) return false;
    var page = main.querySelector('.ns-slide-page');
    if (!page) return false;
    var card = page.querySelector('#nsSlideCard');
    if (!card) return false;
    var brand = page.querySelector('.ns-slide-brand');
    if (!brand) return false;

    var wrap = document.createElement('div');
    wrap.className = 'ns-ll';
    wrap.id = 'ns-ll-top';
    wrap.innerHTML = shellHTML();
    main.insertBefore(wrap, page);

    var brandSlot = wrap.querySelector('.ns-ll-brand-slot');
    if (brandSlot) brandSlot.replaceWith(brand);

    var logoSlot = wrap.querySelector('.ns-ll-card-logo-slot');
    if (logoSlot) {
      var logoWrap = document.createElement('div');
      logoWrap.className = 'ns-ll-card-logo';
      logoWrap.appendChild(brand.cloneNode(true));
      logoSlot.replaceWith(logoWrap);
    }

    var cardSlot = wrap.querySelector('.ns-ll-card-slot');
    if (cardSlot) cardSlot.replaceWith(card);

    if (page.querySelectorAll('*').length === 0) { page.remove(); }
    else { page.style.display = 'none'; } /* only the hidden panel remains in the shell */

    var head = wrap.querySelector('.ns-ll-head');
    var burger = wrap.querySelector('.ns-ll-burger');
    if (head && burger) {
      burger.addEventListener('click', function () {
        var open = head.classList.toggle('ns-ll-nav-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    wrap.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-ns-ll-scroll]') : null;
      if (!btn) return;
      var el = document.getElementById(btn.getAttribute('data-ns-ll-scroll'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (head) head.classList.remove('ns-ll-nav-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
    return true;
  }

  function tick() { try { build(); } catch (e) {} }
  document.addEventListener('hashchange', function () { setTimeout(tick, 60); });
  setInterval(tick, 500);
  tick();
})();
