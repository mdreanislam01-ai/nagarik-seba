/* Nagarik Seba — order deliveries (customer side).
   Decorates the customer's own order tables (order + history pages)
   with a ডেলিভারি button per order. The admin's text / PDF / image
   deliveries for that order open in a modal with দেখুন (view) and
   ডাউনলোড (download). No app.js edit: this file ticks and decorates
   after each render, and guards on the login markers (never the hash
   alone), like the other ns-*.js page scripts. */
(function () {
  var _esc = (typeof esc === 'function') ? esc : function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  function loginShowing() {
    return !!(document.getElementById('nsSlideCard') || document.querySelector('.ns-ll'));
  }
  function ready() {
    return !loginShowing() && typeof nsToken === 'function' && nsToken()
      && typeof nsCall === 'function' && typeof showModal === 'function';
  }
  function b64Blob(b64, mime) {
    var bin = atob(b64), len = bin.length, arr = new Uint8Array(len);
    for (var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  function delIcon(d) {
    if (d.kind === 'text') return '📝';
    if (d.mime_type === 'application/pdf') return '📄';
    return '🖼️';
  }
  function delSize(b64) { return Math.round((b64 || '').length * 3 / 4 / 1024); }
  function delListHTML(items) {
    if (!items.length) return '<p class="muted">এই অর্ডারে এখনো কোনো ডেলিভারি দেওয়া হয়নি। অ্যাডমিন ডেলিভারি দিলে এখানেই দেখতে পাবেন।</p>';
    return items.map(function (d) {
      var title = d.kind === 'text' ? 'টেক্সট' : _esc(d.file_name || 'ফাইল');
      var meta = (d.kind === 'file' ? delSize(d.file_data) + ' KB · ' : '') + _esc((d.created_at || '').slice(0, 10));
      var content = d.kind === 'text'
        ? '<div style="white-space:pre-wrap;word-break:break-word;background:#f1f5f9;border-radius:8px;padding:8px 10px;margin-top:6px;max-height:180px;overflow:auto">' + _esc(d.text_content || '') + '</div>'
        : '<div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap"><button class="btn" style="padding:6px 12px;font-size:13px" onclick="nsDelView(' + d.id + ')">দেখুন</button> <button class="btn" style="padding:6px 12px;font-size:13px" onclick="nsDelDown(' + d.id + ')">ডাউনলোড</button></div>';
      return '<div style="border:1px solid #e2e8f0;border-radius:12px;padding:10px;margin-bottom:8px"><div style="display:flex;gap:8px;align-items:center"><span style="font-size:20px">' + delIcon(d) + '</span><b>' + title + '</b> <span class="muted">' + meta + '</span></div>' + content + '</div>';
    }).join('');
  }
  window.nsShowDeliveries = async function (id) {
    if (typeof showModal !== 'function') return;
    showModal('অর্ডার #' + id + ' — ডেলিভারি', '<p class="muted">লোড হচ্ছে…</p>');
    try {
      var r = await nsCall('/orders/' + id + '/deliveries');
      window._nsDel = { orderId: id, items: r.deliveries || [] };
      showModal('অর্ডার #' + id + ' — ডেলিভারি', delListHTML(window._nsDel.items));
    } catch (e) {
      showModal('অর্ডার #' + id + ' — ডেলিভারি', '<p>ডেলিভারি লোড হয়নি: ' + _esc((e && e.message) || 'আবার চেষ্টা করুন।') + '</p>');
    }
  };
  window.nsDelView = function (did) {
    var d = (window._nsDel.items || []).filter(function (x) { return x.id === did; })[0];
    if (!d || !d.file_data) return;
    var w = window.open(URL.createObjectURL(b64Blob(d.file_data, d.mime_type)), '_blank');
    if (!w) {
      window.nsDelDown(did);
      if (typeof showModal === 'function') showModal('ডেলিভারি', '<p>ফাইলটি নতুন ট্যাবে খুলল না, তাই ডাউনলোড করা হচ্ছে। Downloads ফোল্ডার থেকে ফাইলটি খুলুন।</p>');
    }
  };
  window.nsDelDown = function (did) {
    var d = (window._nsDel.items || []).filter(function (x) { return x.id === did; })[0];
    if (!d || !d.file_data) return;
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b64Blob(d.file_data, d.mime_type));
    a.download = d.file_name || 'delivery';
    document.body.appendChild(a); a.click(); a.remove();
  };
  function decorate() {
    if (!ready()) return;
    var tables = document.querySelectorAll('#main table');
    tables.forEach(function (tbl) {
      var head = tbl.querySelector('tr');
      if (!head) return;
      var ths = head.querySelectorAll('th');
      if (ths.length !== 4) return;
      var t0 = ths[0].textContent.trim(), t3 = ths[3].textContent.trim();
      if (!((t0 === 'NO' || t0 === 'ID') && t3 === 'CREATED')) return;
      if (tbl.querySelector('th[data-ns-del]')) return;
      var hcell = document.createElement('th');
      hcell.setAttribute('data-ns-del', '1');
      hcell.textContent = 'ডেলিভারি';
      head.appendChild(hcell);
      tbl.querySelectorAll('tr').forEach(function (row, idx) {
        if (idx === 0) return;
        var tds = row.querySelectorAll('td');
        if (!tds.length) return;
        var oid = parseInt((tds[0].textContent || '').trim(), 10);
        var cell = document.createElement('td');
        if (isNaN(oid)) { cell.textContent = '—'; }
        else { cell.innerHTML = '<button class="btn" style="padding:6px 12px;font-size:13px" onclick="nsShowDeliveries(' + oid + ')">ডেলিভারি</button>'; }
        row.appendChild(cell);
      });
    });
  }
  setInterval(decorate, 400);
  ['hashchange', 'pageshow', 'visibilitychange'].forEach(function (ev) {
    document.addEventListener(ev, function () { setTimeout(decorate, 50); });
  });
})();
