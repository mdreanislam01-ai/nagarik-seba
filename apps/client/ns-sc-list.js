/* Nagarik Seba — server copy list redesign (sc history page ONLY).
   Restyles ONLY #/history/sc in the emerald card design, using the page's
   REAL orders. No app.js edit, no new functionality: amounts, statuses and
   dates come from the rendered table, delivery opens the existing
   nsShowDeliveries modal. No NID form, no fetch, no sample data, no
   external fonts/CDN. Sidebar icons, navigation and all other pages
   are untouched. Tick pattern mirrors ns-delivery.js (no MutationObserver). */
(function () {
  function isScHistory() {
    try {
      return location.hash.replace('#/', '').split('?')[0] === 'history/sc';
    } catch (e) { return false; }
  }
  function loginShowing() {
    return !!(document.getElementById('nsSlideCard') || document.querySelector('.ns-ll'));
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function statusPill(st) {
    var k = String(st || '').trim().toLowerCase();
    var cls = 'ns-sc-pill';
    if (k === 'pending') cls += ' ns-sc-pending';
    else if (k === 'received') cls += ' ns-sc-received';
    else if (k === 'completed') cls += ' ns-sc-completed';
    else if (k === 'refunded') cls += ' ns-sc-refunded';
    else cls += ' ns-sc-other';
    return '<span class="' + cls + '">' + esc(st) + '</span>';
  }
  function transform() {
    if (!isScHistory() || loginShowing()) return;
    if (typeof nsToken !== 'function' || !nsToken()) return;
    var main = document.getElementById('main');
    if (!main) return;
    var tbl = main.querySelector('table');
    if (!tbl || tbl.dataset.nsScList) return;
    var ths = tbl.querySelectorAll('tr th');
    if (ths.length < 4) return;
    if (ths[0].textContent.trim() !== 'ID' || ths[3].textContent.trim() !== 'CREATED') return;
    var rows = [];
    tbl.querySelectorAll('tr').forEach(function (row, idx) {
      if (idx === 0) return;
      var tds = row.querySelectorAll('td');
      if (!tds.length) return;
      if (/কোনো অর্ডার নেই/.test(row.textContent || '')) return;
      var id = parseInt((tds[0].textContent || '').trim(), 10);
      if (isNaN(id)) return;
      rows.push({
        id: id,
        amount: (tds[1].textContent || '').trim(),
        status: (tds[2].textContent || '').trim(),
        created: (tds[3].textContent || '').trim()
      });
    });
    var card = tbl.closest('.card');
    var wrap = tbl.closest('.table-wrap');
    var top = card ? card.querySelector('.tbl-top') : null;
    var bottom = card ? card.querySelector('.tbl-bottom') : null;
    var h2 = card ? card.querySelector('h2') : null;
    var note = null;
    if (card) card.querySelectorAll('p.muted').forEach(function (p) {
      if (p.textContent.indexOf('আসল অর্ডার ইতিহাস') !== -1) note = p;
    });
    var html = '<div class="ns-sc-list">';
    html += '<div class="ns-sc-head"><div><div class="ns-sc-badge">সার্ভার কপি</div>';
    html += '<h1 class="ns-sc-title">সার্ভার কপি লিস্ট</h1>';
    html += '<p class="ns-sc-sub">এখানে আপনার আসল অর্ডার ইতিহাস দেখা যাবে; অর্ডার স্ট্যাটাস অ্যাডমিন আপডেট করবে।</p></div>';
    html += '<a class="ns-sc-new" href="#/service/sc">নতুন কপি</a></div>';
    if (!rows.length) {
      html += '<div class="ns-sc-empty">এই সার্ভিসে এখনো কোনো অর্ডার নেই</div>';
    } else {
      html += rows.map(function (o) {
        return '<div class="ns-sc-card"><div class="ns-sc-left">'
          + '<div class="ns-sc-order">অর্ডার #' + o.id + ' ' + statusPill(o.status) + '</div>'
          + '<div class="ns-sc-date">' + esc(o.created) + '</div></div>'
          + '<div class="ns-sc-right"><div class="ns-sc-amount">৳' + esc(o.amount) + '</div>'
          + '<button type="button" class="ns-sc-del" onclick="nsShowDeliveries(' + o.id + ')">ডেলিভারি</button></div></div>';
      }).join('');
    }
    html += '</div>';
    var box = document.createElement('div');
    box.innerHTML = html;
    var listEl = box.firstChild;
    if (wrap && wrap.parentNode) wrap.parentNode.insertBefore(listEl, wrap.nextSibling);
    else if (tbl.parentNode) tbl.parentNode.insertBefore(listEl, tbl.nextSibling);
    if (top) top.style.display = 'none';
    if (wrap) wrap.style.display = 'none';
    if (bottom) bottom.style.display = 'none';
    if (h2) h2.style.display = 'none';
    if (note) note.style.display = 'none';
    tbl.dataset.nsScList = '1';
  }
  setInterval(transform, 400);
  ['hashchange', 'pageshow', 'visibilitychange'].forEach(function (ev) {
    document.addEventListener(ev, function () { setTimeout(transform, 50); });
  });
})();
