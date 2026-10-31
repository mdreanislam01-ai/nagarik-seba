/* ns-brn-autoload.js — BRN "Autoload Information" popup (v1, 2026-10-31).
   WHAT IT DOES: the dashed "স্বয়ংক্রিয়ভাবে ডেটা লোড করতে এখানে ক্লিক
   করুন" button on the brn form used to open the document picker
   (brnTopDocPick). Clicking it now opens a reference-style popup
   (BRN + Date of Birth + Captcha Image + Captcha Text + Load) in the
   site's teal colours. Load does NOT fetch government data: it only
   writes what the user typed in the popup into the form's own BRN
   (field index 3) and Date of Birth (index 9, YYYY-MM-DD converted to
   DD/MM/YYYY) fields, firing input/change so Date-of-Birth-in-Word
   fills, then closes and scrolls to the form.
   CAPTCHA ALWAYS WORKS: the image is an inline SVG generated locally
   (same proven pattern as the dobFinder captcha) — no server, no image
   URL, nothing to 404 or time out. It regenerates on open, on the
   refresh button, and automatically on a wrong answer.
   CLOSE ALWAYS WORKS: red ×, backdrop click, ESC key, successful Load,
   and hashchange (navigation) all go through one closePopup().
   DOCUMENT PICKER IS NOT LOST: the popup has a small link that closes
   the popup and runs the original brnTopDocPick, so filling from the
   user's own document still works exactly as before.
   No app.js edit, no API call, no route/price change. */
(function () {
  'use strict';

  var ctxCard = null;
  var prevOverflow = '';
  var capAns = null;

  function el(id) { return document.getElementById(id); }

  function capNew() {
    var a = 10 + Math.floor(Math.random() * 90);
    var b = 10 + Math.floor(Math.random() * 90);
    var op = Math.random() < 0.5 ? '+' : '-';
    var t;
    if (op === '-' && b > a) { t = a; a = b; b = t; }
    capAns = (op === '+' ? a + b : a - b);
    var dots = '';
    var i;
    for (i = 0; i < 60; i++) {
      dots += '<circle cx="' + Math.floor(Math.random() * 300) + '" cy="' + Math.floor(Math.random() * 80) + '" r="' + (1 + Math.random() * 1.5).toFixed(1) + '" fill="#99f6e4" opacity="0.5"/>';
    }
    return '<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:80px;display:block"><rect width="300" height="80" fill="#f0fdfa"/>' + dots + '<text x="150" y="52" text-anchor="middle" font-size="34" font-weight="700" fill="#0f766e" font-family="system-ui,sans-serif">' + a + ' ' + op + ' ' + b + ' = ?</text></svg>';
  }

  function capRefresh() {
    var box = el('ns-aload-capbox');
    if (box) box.innerHTML = capNew();
    var t = el('ns-aload-cap');
    if (t) t.value = '';
  }

  function closePopup() {
    var back = document.querySelector('.ns-aload-back');
    if (back) back.remove();
    try { document.body.style.overflow = prevOverflow; } catch (e) {}
    document.removeEventListener('keydown', onKey);
    ctxCard = null;
  }

  function onKey(e) {
    if (e && e.key === 'Escape') closePopup();
  }

  function fail(msg) {
    var err = el('ns-aload-err');
    if (!err) return;
    err.textContent = msg;
    err.style.display = 'block';
  }

  function setVal(node, v) {
    try {
      node.value = v;
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) {
      try { node.value = v; } catch (e2) {}
    }
  }

  function doLoad() {
    var brn = (el('ns-aload-brn').value || '').trim();
    var dob = (el('ns-aload-dob').value || '').trim();
    var cap = (el('ns-aload-cap').value || '').trim();
    if (!brn) { fail('Birth Registration Number লিখুন।'); return; }
    if (!dob) { fail('জন্ম তারিখ বসান।'); return; }
    if (!cap) { fail('ক্যাপচার উত্তর লিখুন।'); return; }
    if (parseInt(cap, 10) !== capAns) {
      fail('ক্যাপচার উত্তর সঠিক নয় — নতুন ক্যাপচা দেওয়া হয়েছে।');
      capRefresh();
      return;
    }
    var card = ctxCard;
    var grid = card ? card.querySelector('.brn-grid') : document.querySelector('.brn-grid');
    if (!grid) { fail('ফরম পাওয়া যায়নি — পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।'); return; }
    var fields = grid.querySelectorAll('.brn-field');
    if (!fields || fields.length < 11) { fail('ফরম পাওয়া যায়নি — পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।'); return; }
    var brnIn = fields[3].querySelector('input, select, textarea');
    var dobIn = fields[9].querySelector('input, select, textarea');
    if (!brnIn || !dobIn) { fail('ফরমের ঘর পাওয়া যায়নি।'); return; }
    var ddmmyyyy = dob;
    var m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) ddmmyyyy = m[3] + '/' + m[2] + '/' + m[1];
    setVal(brnIn, brn);
    setVal(dobIn, ddmmyyyy);
    closePopup();
    try { if (card) card.scrollIntoView(); } catch (e) {}
  }

  function openPopup(btn) {
    try { closePopup(); } catch (e) {}
    ctxCard = null;
    try { ctxCard = btn ? btn.closest('.brn-card') : null; } catch (e) {}
    var back = document.createElement('div');
    back.className = 'ns-aload-back';
    back.innerHTML =
      '<div class="ns-aload-card" role="dialog" aria-modal="true" aria-label="Autoload Information">' +
      '<button type="button" class="ns-aload-x" aria-label="বন্ধ করুন">×</button>' +
      '<h3 class="ns-aload-title">Autoload Information</h3>' +
      '<label class="ns-aload-lab">Birth Registration Number*</label>' +
      '<input class="ns-aload-in" id="ns-aload-brn" maxlength="17" placeholder="XXXXXXXXXXXXXXXXX" inputmode="numeric">' +
      '<label class="ns-aload-lab">Date of Birth*</label>' +
      '<input class="ns-aload-in" id="ns-aload-dob" type="date">' +
      '<div class="ns-aload-caprow"><span class="ns-aload-lab">Captcha Image</span>' +
      '<button type="button" class="ns-aload-refresh" title="নতুন ক্যাপচা">↻</button></div>' +
      '<div class="ns-aload-capbox" id="ns-aload-capbox"></div>' +
      '<label class="ns-aload-lab">Captcha Text*</label>' +
      '<input class="ns-aload-in" id="ns-aload-cap" placeholder="XX" inputmode="numeric">' +
      '<div class="ns-aload-hint">🙂 Hint: Try it yourself.</div>' +
      '<div class="ns-aload-err" id="ns-aload-err"></div>' +
      '<button type="button" class="ns-aload-load">Load</button>' +
      '<p class="ns-aload-note">এখানে লেখা তথ্যই ফরমে বসবে; কোনো সরকারি লুকআপ হয় না।</p>' +
      '<button type="button" class="ns-aload-doc">অথবা ডকুমেন্ট (ছবি/PDF) থেকে তথ্য বসান</button>' +
      '</div>';
    document.body.appendChild(back);
    try { prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; } catch (e) {}
    back.addEventListener('click', function (e) { if (e.target === back) closePopup(); });
    back.querySelector('.ns-aload-x').addEventListener('click', closePopup);
    back.querySelector('.ns-aload-refresh').addEventListener('click', capRefresh);
    back.querySelector('.ns-aload-load').addEventListener('click', doLoad);
    back.querySelector('.ns-aload-doc').addEventListener('click', function () {
      closePopup();
      try { if (typeof window.brnTopDocPick === 'function') window.brnTopDocPick(); } catch (e) {}
    });
    ['ns-aload-brn', 'ns-aload-dob', 'ns-aload-cap'].forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener('input', function () { var err = el('ns-aload-err'); if (err) err.style.display = 'none'; });
    });
    document.addEventListener('keydown', onKey);
    capRefresh();
  }

  /* The dashed button's inline onclick is brnTopDocPick (document picker).
     Intercept it in the capture phase — before the inline handler runs —
     so this button now opens the popup instead. Nothing else is touched:
     the original picker still runs from the popup's document link. */
  document.addEventListener('click', function (e) {
    try {
      var btn = (e.target && e.target.closest) ? e.target.closest('.brn-dash') : null;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      openPopup(btn);
    } catch (err) {}
  }, true);

  window.addEventListener('hashchange', function () { try { closePopup(); } catch (e) {} });
})();
