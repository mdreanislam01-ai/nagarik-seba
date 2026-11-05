/* ns-login-land.js — Nagarik Seba client LOGIN LANDING (v9, new design).
   DESIGN SOURCE: the user-supplied file
   "nagarik_seba_login_register_animated_2_8xc6.html" (2026-11-06) — the
   minimal animated login/register portal. This file implements THAT
   design + animation. The previous login landing design (v8: memorial
   hero, header/nav, services, benefits, footer, social row) is
   COMPLETELY REMOVED — none of its markup, images or code remain.
   WHAT IT DOES: only when body has class ns-login-portal AND #main
   contains .ns-slide-page (the login/signup view app.js renders), it
   rearranges THOSE EXISTING nodes into the new design: the real
   .ns-slide-brand logo node moves into the brand logo slot, the real
   #nsSlideCard moves into the card's form slot, and the new
   brand / card / tabs / headings shell is built around them. Nothing
   is rebuilt, duplicated or faked.
   WHAT IT NEVER DOES: it never touches #nsGate (entry-notice gate),
   never touches forgot mode (.ns-login-wrap has no .ns-slide-page,
   so this script no-ops there), never creates a login form, never
   calls any API, never changes a route, price or flow. Auth stays
   exactly app.js's: #nsSlideCard, both forms, all input IDs, inline
   onsubmit handlers (nsDoLogin / nsSlideSignup), nsSlideTo() toggles,
   eye toggles and the #/forgot link are preserved untouched (nodes
   are MOVED with appendChild/replaceWith, so values, focus, listeners
   and inline handlers survive). The visible tabs and the switch lines
   below the forms call the same nsSlideTo('signup'|'login') — with
   the file's 190ms panel-leave animation first. The real submit
   buttons keep their real labels ("লগইন" / "রেজিস্ট্রেশন"):
   nsDoLogin finds the login button by its exact text, so the label
   must not change. The real form headings are hidden by the CSS and
   replaced by this design's own headings ("স্বাগতম!" / "নতুন
   অ্যাকাউন্ট"), toggled by syncTabs(). The direct-child inputs get a
   wrapper + field icon (as in the file) — same nodes, just reparented.
   NO MutationObserver (past infinite-loop bugs): a 500ms read-only
   interval + a hashchange listener. The tick writes DOM only when no
   .ns-ll9 wrapper exists yet, i.e. only once per fresh app.js render
   (app.js replaces #main.innerHTML on render, which destroys the
   wrapper, so the next tick rebuilds from the fresh nodes).
   TRUTHFULNESS: no "সরকারি" platform claim, no "স্মার্ট বাংলাদেশ"
   slogan, no hotline, no invented contact email, no invented social
   URLs. The non-government disclaimer lives in the entry-notice gate
   and on the dashboard, as before. */

(function () {
  'use strict';
  /* Safety-fix 2026-10-31: announce that this script loaded, and clear
     the 9s safety class if it already fired — the safety must only reveal
     the old design when this script truly failed to load, never while it
     is alive and waiting for slow API data. */
  try { window._nsLlLoaded = true; if (document.body) document.body.classList.remove('ns-ll-show-old'); } catch (e) {}

  var switching = false;

  function shellHTML() {
    return '' +
      '<div class="ns-ll9-wrap">' +
      '<header class="ns-ll9-brand">' +
      '<span class="ns-ll9-logo-slot"></span>' +
      '<h1>নাগরিক সেবা</h1><p>সবার সেবা, সবার পাশে</p>' +
      '</header>' +
      '<section class="ns-ll9-card">' +
      '<div class="ns-ll9-tabs" id="nsLl9Tabs">' +
      '<button class="ns-ll9-tab active" id="nsLl9LoginTab" type="button">লগইন</button>' +
      '<button class="ns-ll9-tab" id="nsLl9RegTab" type="button">রেজিস্ট্রেশন</button>' +
      '</div>' +
      '<div class="ns-ll9-heading" id="nsLl9HeadLogin"><h2>স্বাগতম!</h2><p>আপনার অ্যাকাউন্টে প্রবেশ করুন</p></div>' +
      '<div class="ns-ll9-heading" id="nsLl9HeadReg" style="display:none"><h2>নতুন অ্যাকাউন্ট</h2><p>আপনার তথ্য দিয়ে রেজিস্ট্রেশন করুন</p></div>' +
      '<div class="ns-ll9-card-slot"></div>' +
      '<div class="ns-ll9-notice" id="nsLl9Notice"></div>' +
      '</section>' +
      '</div>';
  }

  function currentMode() {
    var card = document.getElementById('nsSlideCard');
    return (card && card.classList.contains('ns-slide-signup')) ? 'register' : 'login';
  }

  function syncTabs() {
    var mode = currentMode();
    var tabs = document.getElementById('nsLl9Tabs');
    if (tabs) tabs.classList.toggle('reg', mode === 'register');
    var lt = document.getElementById('nsLl9LoginTab');
    var rt = document.getElementById('nsLl9RegTab');
    if (lt) lt.classList.toggle('active', mode === 'login');
    if (rt) rt.classList.toggle('active', mode === 'register');
    var hl = document.getElementById('nsLl9HeadLogin');
    var hr = document.getElementById('nsLl9HeadReg');
    if (hl) hl.style.display = mode === 'login' ? '' : 'none';
    if (hr) hr.style.display = mode === 'register' ? '' : 'none';
  }

  /* The file's tab switch: the old panel leaves (190ms), then the real
     toggle runs and the new panel enters. */
  function goTo(mode) {
    if (mode === currentMode() || switching) return;
    if (typeof nsSlideTo !== 'function') return;
    switching = true;
    var card = document.getElementById('nsSlideCard');
    var oldForm = null;
    if (card) {
      oldForm = card.querySelector(currentMode() === 'register' ? '.ns-slide-form-signup' : '.ns-slide-form-login');
      if (oldForm) oldForm.classList.add('ns-ll9-leaving');
    }
    setTimeout(function () {
      try {
        if (oldForm) oldForm.classList.remove('ns-ll9-leaving');
        nsSlideTo(mode === 'register' ? 'signup' : 'login');
        syncTabs();
      } catch (e) {}
      switching = false;
    }, 190);
  }

  /* Wrap the direct-child inputs in an .ns-ll9-input-wrap with a field
     icon, as in the file. Same input nodes, just reparented — ids,
     values, placeholders and handlers are untouched. */
  function wrapFieldInputs(card) {
    var specs = [
      { id: 'authEmail', icon: '✉' },
      { id: 'suName', icon: '♙' },
      { id: 'suEmail', icon: '✉' },
      { id: 'suPhone', icon: '✉' }
    ];
    specs.forEach(function (s) {
      var inp = card.querySelector('#' + s.id);
      if (!inp || inp.dataset.ll9wrapped) return;
      var parent = inp.parentElement;
      if (!parent || parent.classList.contains('ns-ll9-input-wrap') || parent.classList.contains('ns-slide-passwrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'ns-ll9-input-wrap';
      parent.insertBefore(wrap, inp);
      wrap.appendChild(inp);
      var ic = document.createElement('span');
      ic.className = 'ns-ll9-field-icon';
      ic.textContent = s.icon;
      wrap.appendChild(ic);
      inp.dataset.ll9wrapped = '1';
    });
  }

  /* Append the file's switch lines to the REAL forms (below the submit
     button). They call the same goTo() as the tabs. */
  function addSwitchLines(card) {
    var loginForm = card.querySelector('.ns-slide-form-login');
    var signupForm = card.querySelector('.ns-slide-form-signup');
    if (loginForm && !loginForm.querySelector('.ns-ll9-under')) {
      var p1 = document.createElement('p');
      p1.className = 'ns-ll9-under';
      p1.innerHTML = 'নতুন ব্যবহারকারী? <button class="ns-ll9-textbtn" type="button" data-ns-ll9-go="register">অ্যাকাউন্ট তৈরি করুন</button>';
      loginForm.appendChild(p1);
    }
    if (signupForm && !signupForm.querySelector('.ns-ll9-under')) {
      var p2 = document.createElement('p');
      p2.className = 'ns-ll9-under';
      p2.innerHTML = 'আগে থেকেই অ্যাকাউন্ট আছে? <button class="ns-ll9-textbtn" type="button" data-ns-ll9-go="login">লগইন করুন</button>';
      signupForm.appendChild(p2);
    }
  }

  function build() {
    if (document.querySelector('.ns-ll9')) { syncTabs(); return true; }
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
    wrap.className = 'ns-ll9';
    wrap.innerHTML = shellHTML();
    main.insertBefore(wrap, page);

    var logoSlot = wrap.querySelector('.ns-ll9-logo-slot');
    if (logoSlot) logoSlot.replaceWith(brand);

    var cardSlot = wrap.querySelector('.ns-ll9-card-slot');
    if (cardSlot) cardSlot.replaceWith(card);

    wrapFieldInputs(card);
    addSwitchLines(card);
    syncTabs();

    var lt = wrap.querySelector('#nsLl9LoginTab');
    var rt = wrap.querySelector('#nsLl9RegTab');
    if (lt) lt.addEventListener('click', function () { goTo('login'); });
    if (rt) rt.addEventListener('click', function () { goTo('register'); });

    /* Switch lines + submit ripple, delegated on the wrapper. */
    wrap.addEventListener('click', function (ev) {
      var go = ev.target && ev.target.closest ? ev.target.closest('[data-ns-ll9-go]') : null;
      if (go) { goTo(go.getAttribute('data-ns-ll9-go')); return; }
      var btn = ev.target && ev.target.closest ? ev.target.closest('.ns-slide-btn') : null;
      if (!btn) return;
      var r = btn.getBoundingClientRect(), d = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'ns-ll9-ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (ev.clientX - r.left - d / 2) + 'px';
      s.style.top = (ev.clientY - r.top - d / 2) + 'px';
      btn.appendChild(s);
      setTimeout(function () { s.remove(); }, 750);
    });

    if (page.querySelectorAll('*').length === 0) { page.remove(); }
    else { page.style.display = 'none'; } /* only the hidden panel remains in the shell */

    return true;
  }

  function tick() { try { build(); } catch (e) {} }
  document.addEventListener('hashchange', function () { setTimeout(tick, 60); });
  setInterval(tick, 500);
  tick();
})();
