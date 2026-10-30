/* ns-notify.js — header notification bell (client only, 2026-10-30).
   Placement: header row 1, right cluster — bell, then dark switch,
   then menu button. No extra header row, no extra header height
   (bell is 40px, logo is 56px, so row 1 height does not change).
   Panel: clicking the bell opens a modal listing real data already
   loaded by the app — orders, recharges and support tickets from
   NS_STATE — plus admin announcements from /api/notices when
   logged out. No new API endpoint, no fake notification is invented.
   Badge = number of pending items (pending orders + pending
   recharges + open/replied tickets), capped at 9+. */
(function(){
  var BELL_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0f766e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var STATUS_BN = {Pending:'পেন্ডিং',Received:'গ্রহণ করা হয়েছে',Completed:'সম্পন্ন',Refunded:'ফেরত দেওয়া হয়েছে',pending:'পেন্ডিং',approved:'অনুমোদিত',rejected:'বাতিল',open:'খোলা',replied:'জবাব এসেছে',closed:'বন্ধ'};
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function state(){ try { return (typeof NS_STATE !== 'undefined' && NS_STATE) || {}; } catch(e){ return {}; } }
  function loggedIn(){ try { return typeof nsToken === 'function' ? !!nsToken() : false; } catch(e){ return false; } }
  function svcName(id){
    try { var list = (typeof SERVICES !== 'undefined' && SERVICES) || []; for (var i=0;i<list.length;i++){ if (list[i] && list[i].id === id) return list[i].name || list[i].title || id; } } catch(e){}
    return id || '';
  }
  function when(s){ try { var d = new Date(s); if (isNaN(d)) return ''; return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}); } catch(e){ return ''; } }
  function pendingCount(){
    var st = state(), n = 0;
    (st.orders || []).forEach(function(o){ if (o.status === 'Pending' || o.status === 'Received') n++; });
    (st.recharges || []).forEach(function(r){ if (r.status === 'pending') n++; });
    (st.tickets || []).forEach(function(t){ if (t.status === 'open' || t.status === 'replied') n++; });
    return n;
  }
  function itemHTML(icon, title, sub, status){
    return '<div class="ns-notif-item"><span class="ns-notif-ico">' + icon + '</span><span class="ns-notif-main"><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></span><span class="ns-notif-st">' + esc(STATUS_BN[status] || status || '') + '</span></div>';
  }
  function openPanel(){
    var st = state(), html = '';
    if (!loggedIn()){
      html += '<p>লগইন করলে আপনার অর্ডার, রিচার্জ ও সাপোর্ট মেসেজের নোটিফিকেশন এখানে দেখা যাবে।</p><p><a class="btn" href="#/login" onclick="closeModal()">লগইন করুন</a></p><hr>';
      html += '<h4 style="margin:10px 0 6px">ঘোষণা</h4><div id="nsNotifAnn">লোড হচ্ছে…</div>';
      if (window.showModal) window.showModal('নোটিফিকেশন', html);
      try {
        var base = (typeof API_BASE !== 'undefined' && API_BASE) || '/api';
        fetch(base + '/notices').then(function(r){ return r.json(); }).then(function(j){
          var el = document.getElementById('nsNotifAnn'); if (!el) return;
          var list = (j && j.notices) || [];
          el.innerHTML = list.length ? list.map(function(n){ return itemHTML('📢', n.title || 'ঘোষণা', n.body || '', ''); }).join('') : '<p>এখন কোনো ঘোষণা নেই।</p>';
        }).catch(function(){ var el = document.getElementById('nsNotifAnn'); if (el) el.innerHTML = '<p>ঘোষণা আনা যায়নি।</p>'; });
      } catch(e){}
      return;
    }
    var orders = (st.orders || []).slice(0, 8), recharges = (st.recharges || []).slice(0, 5), tickets = (st.tickets || []).slice(0, 5);
    html += '<h4 style="margin:4px 0 6px">অর্ডার</h4>';
    html += orders.length ? orders.map(function(o){ return itemHTML('🧾', 'অর্ডার #' + o.id + ' — ' + svcName(o.service_id), (o.option_name ? o.option_name + ' • ' : '') + (o.amount_bdt != null ? '৳' + o.amount_bdt + ' • ' : '') + when(o.created_at) + (o.result_text ? ' • ' + o.result_text : ''), o.status); }).join('') : '<p>এখনো কোনো অর্ডার নেই।</p>';
    html += '<h4 style="margin:12px 0 6px">রিচার্জ</h4>';
    html += recharges.length ? recharges.map(function(r){ return itemHTML('💰', 'রিচার্জ ৳' + r.amount_bdt, (r.method || '') + ' • ' + when(r.created_at), r.status); }).join('') : '<p>এখনো কোনো রিচার্জ নেই।</p>';
    html += '<h4 style="margin:12px 0 6px">সাপোর্ট মেসেজ</h4>';
    html += tickets.length ? tickets.map(function(t){ return itemHTML('💬', t.subject || ('টিকিট #' + t.id), when(t.created_at), t.status); }).join('') : '<p>এখনো কোনো সাপোর্ট মেসেজ নেই।</p>';
    html += '<p style="margin-top:14px"><a class="btn ghost" href="#/dashboard" onclick="closeModal()">ড্যাশবোর্ডে সব দেখুন</a> <a class="btn ghost" href="#/support" onclick="closeModal()">সাপোর্টে যান</a></p>';
    if (window.showModal) window.showModal('নোটিফিকেশন', html);
  }
  function updateBadge(){
    var btn = document.querySelector('.ns-bell'); if (!btn) return;
    var n = loggedIn() ? pendingCount() : 0, badge = btn.querySelector('.ns-bell-badge');
    if (!badge){ badge = document.createElement('span'); badge.className = 'ns-bell-badge'; btn.appendChild(badge); }
    badge.textContent = n > 9 ? '9+' : String(n);
    badge.style.display = n > 0 ? 'flex' : 'none';
  }
  function setup(){
    var header = document.querySelector('header.topbar'); if (!header) return;
    if (!header.querySelector('.ns-bell')){
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'ns-bell'; btn.title = 'নোটিফিকেশন'; btn.setAttribute('aria-label', 'নোটিফিকেশন');
      btn.innerHTML = BELL_SVG;
      btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); openPanel(); });
      var menu = header.querySelector('.menu-btn');
      if (menu) header.insertBefore(btn, menu); else header.appendChild(btn);
    }
    updateBadge();
  }
  document.addEventListener('DOMContentLoaded', setup);
  if (document.readyState !== 'loading') setup();
  new MutationObserver(function(){ setup(); }).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('hashchange', function(){ setTimeout(updateBadge, 300); });
})();
