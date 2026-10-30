/* Nagarik Seba client — dashboard QR code, client only.
   The dashboard profile-card QR button previously only showed a
   text modal saying it was NOT an encoded QR code. Now, for a
   logged-in user, clicking it generates a real QR code
   automatically, different for every user, from that user's own
   /me data (NS_STATE.user, already fetched by the client):
     - website: https://www.nagarikseba.com
     - User ID: user.uid (shown as #<uid>)
     - Name: user.name
     - Email: user.email (Gmail / login email from the account)
   Scanning the QR shows exactly those lines — no password, no
   token, no balance, no phone is put in the QR.
   The QR is generated LOCALLY in the browser with the qrcodejs
   library (loaded from a CDN as script only; the user's data is
   never sent to the CDN or any other server to make the QR).
   If the user is not logged in, the button shows the login
   prompt instead, as before. The inline onclick set by the
   original render wrapper is bypassed with a capture-phase
   click listener, so it cannot replace this behaviour. */
(function () {
  'use strict';
  var SITE = 'https://www.nagarikseba.com';
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function loadQrLib(done) {
    if (typeof window.QRCode !== 'undefined') { done(true); return; }
    var tried = 0;
    var urls = [
      'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
      'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
    ];
    (function next() {
      if (typeof window.QRCode !== 'undefined') { done(true); return; }
      if (tried >= urls.length) { done(false); return; }
      var s = document.createElement('script');
      s.src = urls[tried++];
      s.onload = function () { done(typeof window.QRCode !== 'undefined'); };
      s.onerror = next;
      document.head.appendChild(s);
    })();
  }
  // Preload the library so a click is instant in normal use.
  if (document.readyState === 'complete') loadQrLib(function () {});
  else window.addEventListener('load', function () { loadQrLib(function () {}); });

  function showQr() {
    if (typeof window.showModal !== 'function') return;
    /* NOTE (bug fix 2026-10-30): NS_STATE and nsToken are top-level
       consts in app.js, NOT window properties, so window.NS_STATE /
       window.nsToken are always undefined and the QR used to show
       "login required" even when logged in. Use the bare globals,
       which later classic scripts share. */
    var user = null;
    try { user = typeof NS_STATE !== 'undefined' && NS_STATE.user ? NS_STATE.user : null; } catch (e) { user = null; }
    var loggedIn = false;
    try { loggedIn = typeof nsToken === 'function' ? !!nsToken() : false; } catch (e) { loggedIn = false; }
    if (!loggedIn || !user) {
      window.showModal('লগইন প্রয়োজন', 'QR দেখতে প্রথমে লগইন করুন।');
      return;
    }
    var uid = user.uid || '';
    var name = user.name || '';
    var email = user.email || '';
    if (!uid || !name || !email) {
      window.showModal('QR কোড', 'আপনার প্রোফাইলে ইউজার আইডি, নাম বা ইমেইল পাওয়া যায়নি। প্রোফাইল আপডেট করে আবার চেষ্টা করুন।');
      return;
    }
    var payload = SITE + '\nUser ID: #' + uid + '\nName: ' + name + '\nEmail: ' + email;
    window.showModal('QR কোড',
      '<div id="nsQrBox" style="display:flex;justify-content:center;padding:12px 0"></div>'
      + '<p style="text-align:center;margin:0">UID: #' + esc(uid) + ' • ' + esc(name) + '</p>'
      + '<p style="text-align:center;margin:6px 0 0;color:#64748b;font-size:13px">স্ক্যান করলে ইউজার আইডি, নাম, ইমেইল এবং ' + esc(SITE) + ' দেখাবে।</p>');
    var box = document.getElementById('nsQrBox');
    if (!box) return;
    function render() {
      box.innerHTML = '';
      var oldDl = document.getElementById('nsQrDl'); if (oldDl) oldDl.remove();
      try {
        new window.QRCode(box, { text: payload, width: 220, height: 220, correctLevel: window.QRCode.CorrectLevel.M });
      } catch (e) {
        box.innerHTML = '<p>QR তৈরি হয়নি। আবার চেষ্টা করুন।</p>';
        return;
      }
      // Save / download button (2026-10-30): the QR is generated
      // locally, so its canvas/img can be exported as a PNG file
      // without sending anything anywhere. On a phone this
      // downloads the QR image, which can then be shared/saved.
      var dl = document.createElement('button');
      dl.id = 'nsQrDl';
      dl.type = 'button';
      dl.className = 'btn';
      dl.style.cssText = 'display:block;margin:12px auto 0';
      dl.textContent = '⬇ QR সেভ / ডাউনলোড করুন';
      dl.onclick = function () {
        var dataUrl = '';
        var canvas = box.querySelector('canvas');
        if (canvas) { try { dataUrl = canvas.toDataURL('image/png'); } catch (e) {} }
        if (!dataUrl) {
          var img = box.querySelector('img');
          if (img && img.src) dataUrl = img.src;
        }
        if (!dataUrl) { dl.textContent = 'সেভ করা যায়নি, আবার চেষ্টা করুন'; return; }
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'nagarikseba-qr-' + uid + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        dl.textContent = '✓ QR ডাউনলোড হয়েছে';
      };
      box.insertAdjacentElement('afterend', dl);
    }
    if (typeof window.QRCode !== 'undefined') render();
    else {
      box.innerHTML = '<p style="text-align:center">QR তৈরি হচ্ছে…</p>';
      loadQrLib(function (ok) { if (ok) render(); else box.innerHTML = '<p>QR লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>'; });
    }
  }
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.qr-btn') : null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    showQr();
  }, true);
})();
