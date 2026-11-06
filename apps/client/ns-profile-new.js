/* Nagarik Seba — Profile & Settings redesign (2026-11-06), v2.
   Layout follows the user's supplied profile-settings HTML (4 tabs:
   Profile / Account / Preferences / Sessions, cover + avatar,
   identity, sections) but uses ONLY the site's own teal colours
   (see ns-profile-new.css) — NOT the HTML file's dark navy / orange.
   Sample data in the HTML file (Tuhin, sirajulmostafat2002@gmail.com,
   +8801830713325, @Tuhin) is NEVER used: every field shows the real
   logged-in user from NS_STATE.user (/me).
   REAL wiring only: name+phone save -> PUT /me (server-side); password
   change -> the existing nsChangePassword() (POST /auth/change-password);
   sessions -> GET /me/devices + nsRevokeDevice(); preferences ->
   the real dark-mode toggle + notifications link. Demo-only parts
   of the HTML (profession, email-change form, Google link, Telegram /
   WhatsApp order system, delete-account) are NOT built: there is no
   API for them.
   v2 (2026-11-06 fix): this file NO LONGER builds the panel. app.js
   render() now emits the new panel itself (nsProfPageHTML), so the old
   design can never come back on a re-render. This file only WIRES the
   panel (tabs, draft, dark toggle, sessions) via window.nsPnWire,
   called by app.js right after render and by the tick below.
   build() is kept ONLY as a fallback: if the panel is missing
   (e.g. an old cached app.js is still serving the old page), the
   tick builds it — same markup as nsProfPageHTML in app.js. */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function user() { try { return (typeof NS_STATE !== 'undefined' && NS_STATE.user) || {}; } catch (e) { return {}; } }
  function ready() {
    try {
      var h = (location.hash || '').replace('#/', '') || 'dashboard';
      if (h !== 'profile') return false;
      if (typeof nsToken !== 'function' || !nsToken()) return false;
      if (!user().id && !user().email) return false;
      if (typeof nsCall !== 'function') return false;
      return true;
    } catch (e) { return false; }
  }
  function avatarHTML(u) {
    var src = '';
    try { if (typeof NS_STATE !== 'undefined' && NS_STATE.photoData) src = NS_STATE.photoData; } catch (e) {}
    if (!src) { try { if (typeof getProfilePhoto === 'function') src = getProfilePhoto() || ''; } catch (e) {} }
    if (!src) { try { if (typeof nsAvatarFor === 'function') src = nsAvatarFor(u.name) || ''; } catch (e) {} }
    var inner = '';
    if (src) inner = '<img src="' + esc(src) + '" alt="প্রোফাইল ছবি">';
    else {
      var ch = (u.name || 'ন').trim().charAt(0) || 'ন';
      inner = '<span class="ns-pn-initials">' + esc(ch) + '</span>';
    }
    if (u.verified) inner += '<span class="ns-pn-vbadge">✓</span>';
    return inner;
  }
  function joinedStr(u) {
    try { if (u.created_at) return new Date(u.created_at).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }); } catch (e) {}
    return '—';
  }
  /* Fallback only: build the panel when app.js did not render it
     (old cached app.js). Same markup as nsProfPageHTML() in app.js. */
  function build() {
    var main = document.querySelector('#main');
    if (!main) return;
    if (main.querySelector('.ns-pn-panel')) return; // already built
    var u = user();
    var draft = window._nsPnDraft || {};
    var name = draft.name != null ? draft.name : (u.name || '');
    var phone = draft.phone != null ? draft.phone : (u.phone || '');
    var wallet = (typeof NS_STATE !== 'undefined' && NS_STATE.wallet != null) ? NS_STATE.wallet : '';
    var verified = !!u.verified;
    var html = '<div class="ns-pn-panel">'
      + '<h1>Profile &amp; Settings</h1>'
      + '<p class="ns-pn-intro">Manage your profile information, email &amp; password, preferences, and sessions.</p>'
      + '<nav class="ns-pn-tabs">'
      + '<button type="button" class="ns-pn-tab active" data-tab="profile">Profile</button>'
      + '<button type="button" class="ns-pn-tab" data-tab="account">Account</button>'
      + '<button type="button" class="ns-pn-tab" data-tab="preferences">Preferences</button>'
      + '<button type="button" class="ns-pn-tab" data-tab="sessions">Sessions</button>'
      + '</nav>'
      // ---- Profile tab ----
      + '<section class="ns-pn-content active" id="ns-pn-profile">'
      + '<div class="ns-pn-cover"><div class="ns-pn-avatar">' + avatarHTML(u) + '</div></div>'
      + '<div class="ns-pn-identity"><h2>' + esc(u.name || '') + '</h2>'
      + '<div class="ns-pn-email">' + esc(u.email || '') + '</div>'
      + '<div class="ns-pn-badges"><span class="ns-pn-badge member">Member</span>'
      + (verified ? '<span class="ns-pn-badge verified">✓ Verified Account</span>' : '')
      + '</div></div>'
      + '<div class="ns-pn-section"><h3>Personal Information</h3><p class="ns-pn-desc">Update your personal details here.</p>'
      + '<div class="ns-pn-field"><label>Name</label><input id="nsPnName" value="' + esc(name) + '"></div>'
      + '<div class="ns-pn-field"><label>Email</label><input value="' + esc(u.email || '') + '" disabled><p class="ns-pn-hint">Email cannot be changed from here.</p></div>'
      + '<div class="ns-pn-field"><label>Phone Number</label><input id="nsPnPhone" value="' + esc(phone) + '" type="tel"></div>'
      + '<div class="ns-pn-row"><button type="button" class="ns-pn-btn" onclick="nsPnCancel()">Cancel</button>'
      + '<button type="button" class="ns-pn-btn teal" onclick="nsPnSave()">Save Changes</button></div>'
      + '</div>'
      + '<div class="ns-pn-section"><h3>Account Details</h3>'
      + '<div class="ns-pn-field"><label>User ID</label><input value="' + esc(u.uid || '') + '" disabled></div>'
      + '<div class="ns-pn-field"><label>Balance</label><input value="৳ ' + esc(wallet) + '" disabled></div>'
      + '<div class="ns-pn-field"><label>Joined</label><input value="' + esc(joinedStr(u)) + '" disabled></div>'
      + '</div>'
      + '</section>'
      // ---- Account tab ----
      + '<section class="ns-pn-content" id="ns-pn-account">'
      + '<div class="ns-pn-section" style="border:0;padding-top:0;margin-top:0"><h3 class="ns-pn-orange-title">Password Change</h3>'
      + '<p class="ns-pn-desc">Use a strong password for your account security.</p>'
      + '<div class="ns-pn-field"><label>Current Password</label><input id="nsPnOldPass" type="password" placeholder="বর্তমান পাসওয়ার্ড"></div>'
      + '<div class="ns-pn-field"><label>New Password</label><input id="nsPnNewPass" type="password" placeholder="কমপক্ষে ৮ অক্ষর"></div>'
      + '<div class="ns-pn-field"><label>Confirm Password</label><input id="nsPnConfPass" type="password" placeholder="আবার পাসওয়ার্ড লিখুন"></div>'
      + '<button type="button" class="ns-pn-btn teal" onclick="nsChangePassword()">Update Password</button></div>'
      + '<div class="ns-pn-section"><h3 class="ns-pn-orange-title">Linked Accounts</h3>'
      + '<p class="ns-pn-desc">Your login methods for this account.</p>'
      + '<div class="ns-pn-account-card"><div class="ns-pn-account-head"><div class="ns-pn-gicon">@</div>'
      + '<div><div class="ns-pn-account-name">Email &amp; Password</div><div class="ns-pn-account-sub">' + esc(u.email || '') + '</div></div>'
      + '<span class="ns-pn-account-status">✓ Active</span></div></div>'
      + '</div>'
      + '</section>'
      // ---- Preferences tab (real site settings only) ----
      + '<section class="ns-pn-content" id="ns-pn-preferences">'
      + '<div class="ns-pn-section" style="border:0;padding-top:0;margin-top:0"><h3>Preferences</h3>'
      + '<p class="ns-pn-desc">Your display and notification settings.</p>'
      + '<div class="ns-pn-toggle-row"><div><strong>Dark Mode</strong><small>Switch the site to a dark theme.</small></div>'
      + '<label class="ns-pn-switch"><input type="checkbox" id="nsPnDark" ' + (document.body.classList.contains('dark') ? 'checked' : '') + '><span class="ns-pn-slider"></span></label></div>'
      + '<div class="ns-pn-toggle-row"><div><strong>Notifications</strong><small>See notices and updates from the admin.</small></div>'
      + '<button type="button" class="ns-pn-btn" onclick="location.hash=\'#/notices\'">View Notices</button></div>'
      + '</div>'
      + '</section>'
      // ---- Sessions tab (real devices) ----
      + '<section class="ns-pn-content" id="ns-pn-sessions">'
      + '<div class="ns-pn-section" style="border:0;padding-top:0;margin-top:0"><h3>Security &amp; Sessions</h3>'
      + '<p class="ns-pn-desc">View and manage your active logins across different devices.</p>'
      + '<div id="nsPnDevices"><p class="ns-pn-desc">Loading sessions…</p></div>'
      + '<div class="ns-pn-info-box">For your account security, change your password if you see a login from an unfamiliar device.</div>'
      + '</div>'
      + '</section>'
      + '</div>';
    main.innerHTML = html;
    wirePanel(main);
  }
  /* Wire an already-rendered panel (idempotent). Called by app.js
     right after render and by the tick below. Never rebuilds HTML. */
  function wirePanel(main) {
    main = main || document.querySelector('#main');
    if (!main) return;
    var panel = main.querySelector('.ns-pn-panel');
    if (!panel || panel.dataset.nsPnWired) return;
    panel.dataset.nsPnWired = '1';
    // Tabs
    var tabs = panel.querySelectorAll('.ns-pn-tab');
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.toggle('active', x === btn); });
        panel.querySelectorAll('.ns-pn-content').forEach(function (c) { c.classList.toggle('active', c.id === 'ns-pn-' + btn.dataset.tab); });
        if (btn.dataset.tab === 'sessions') loadDevices();
      });
    });
    // Draft preservation (rebuilds must not lose typed name/phone)
    var nEl = document.getElementById('nsPnName'), pEl = document.getElementById('nsPnPhone');
    function keepDraft() {
      window._nsPnDraft = {
        name: nEl ? nEl.value : '',
        phone: pEl ? pEl.value : ''
      };
    }
    if (nEl) nEl.addEventListener('input', keepDraft);
    if (pEl) pEl.addEventListener('input', keepDraft);
    // Dark-mode toggle
    var dEl = document.getElementById('nsPnDark');
    if (dEl) dEl.addEventListener('change', function () {
      try { if (typeof toggleDark === 'function') toggleDark(); } catch (e) {}
      try { var sw = document.querySelector('.switch__input'); if (sw) sw.checked = document.body.classList.contains('dark'); } catch (e) {}
      dEl.checked = document.body.classList.contains('dark');
    });
    loadDevices();
  }
  window.nsPnWire = wirePanel;
  function loadDevices() {
    var box = document.getElementById('nsPnDevices');
    if (!box) return;
    if (typeof nsCall !== 'function') { box.innerHTML = '<p class="ns-pn-desc">Sessions could not be loaded.</p>'; return; }
    nsCall('/me/devices').then(function (s) {
      var list = (s && s.devices) || [];
      if (!list.length) { box.innerHTML = '<p class="ns-pn-desc">No other sessions found.</p>'; return; }
      var rows = list.map(function (d) {
        var dev = d.platform || d.device_id || d.device || 'Device';
        var ip = d.ip || '—';
        var created = '—';
        try { if (d.created_at) created = new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }); } catch (e) {}
        var cur = d.is_current ? '<span class="ns-pn-current">Current Session</span>' : '';
        var rev = d.id ? '<button type="button" class="ns-pn-btn red" onclick="nsPnRevoke(' + d.id + ')">Revoke</button>' : '';
        return '<tr><td>' + esc(dev) + '<br><span style="color:#94a3b8">' + esc(created) + '</span></td><td>' + esc(ip) + '</td><td>' + cur + '</td><td>' + rev + '</td></tr>';
      }).join('');
      box.innerHTML = '<table class="ns-pn-table"><thead><tr><th>Device</th><th>IP</th><th>Status</th><th>Action</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }).catch(function () {
      box.innerHTML = '<p class="ns-pn-desc">Sessions could not be loaded.</p>';
    });
  }
  window.nsPnRevoke = function (id) {
    try { if (typeof nsRevokeDevice === 'function') { nsRevokeDevice(id); setTimeout(loadDevices, 1200); } } catch (e) {}
  };
  window.nsPnCancel = function () {
    var u = user();
    var n = document.getElementById('nsPnName'); if (n) n.value = u.name || '';
    var p = document.getElementById('nsPnPhone'); if (p) p.value = u.phone || '';
    window._nsPnDraft = null;
  };
  window.nsPnSave = async function () {
    var nEl = document.getElementById('nsPnName'), pEl = document.getElementById('nsPnPhone');
    var name = nEl ? nEl.value.trim() : '';
    var phone = pEl ? pEl.value.trim() : '';
    if (!name) { if (typeof showModal === 'function') showModal('প্রোফাইল আপডেট', 'দয়া করে নাম লিখুন।'); return; }
    if (!phone) { if (typeof showModal === 'function') showModal('প্রোফাইল আপডেট', 'দয়া করে নম্বর লিখুন।'); return; }
    var digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { if (typeof showModal === 'function') showModal('প্রোফাইল আপডেট', 'দয়া করে সঠিক নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।'); return; }
    try {
      var r = await nsCall('/me', 'PUT', { name: name, phone: phone });
      if (r && r.user) { try { NS_STATE.user = r.user; } catch (e) {} if (r.wallet_bdt != null) { try { NS_STATE.wallet = r.wallet_bdt; } catch (e) {} } }
      window._nsPnDraft = null;
      /* v2: do NOT remove the panel (that forced a rebuild and lost the
         tab state). Just update the shown name in place. */
      try { var h2 = document.querySelector('.ns-pn-identity h2'); if (h2) h2.textContent = name; } catch (e) {}
      if (typeof showModal === 'function') showModal('প্রোফাইল আপডেট হয়েছে', 'নাম ও নম্বর সংরক্ষিত হয়েছে।');
    } catch (e) {
      var m = (e && e.message) || '';
      var msg = m === 'invalid_phone' ? 'দয়া করে সঠিক নম্বর লিখুন।' : (m === 'name_required' ? 'দয়া করে নাম লিখুন।' : (m || 'আবার চেষ্টা করুন।'));
      if (typeof showModal === 'function') showModal('প্রোফাইল আপডেট হয়নি', msg);
    }
  };
  function tick() {
    if (!ready()) return;
    var main = document.querySelector('#main');
    if (!main) return;
    if (main.querySelector('.ns-pn-panel')) wirePanel(main);
    else build(); // fallback only (old cached app.js)
  }
  setInterval(tick, 400);
  window.addEventListener('hashchange', function () { setTimeout(tick, 60); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(tick, 60); });
  window.addEventListener('pageshow', function () { setTimeout(tick, 60); });
  setTimeout(tick, 60);
})();
