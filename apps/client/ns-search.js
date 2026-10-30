/* Nagarik Seba client — topbar search bar, client only
   (2026-10-30, user request).
   A search bar is placed in the marked empty area of the
   topbar (between the brand and the dark-mode switch).
   As the customer types, a dropdown below the bar shows
   every matching item — services, order services, free
   tools and main pages — filtered by what was typed, in
   Bengali or English (e.g. "জন্ম" or "nid"). Clicking a
   result opens that service/page, clears the search and
   hides the dropdown. No backend change, no new data. */
(function () {
  'use strict';
  function norm(s) { return String(s || '').toLowerCase(); }
  function items() {
    var list = [];
    try {
      if (typeof SERVICES !== 'undefined') SERVICES.forEach(function (s) {
        list.push({ name: s.name || s.title || s.id, cat: 'সার্ভিস', hash: '#/service/' + s.id, key: (s.name || '') + ' ' + (s.title || '') + ' ' + s.id });
      });
    } catch (e) {}
    try {
      if (typeof ORDERS !== 'undefined') ORDERS.forEach(function (o) {
        list.push({ name: o.name || o.id, cat: 'অর্ডার সার্ভিস', hash: '#/order/' + o.id, key: (o.name || '') + ' ' + o.id });
      });
    } catch (e) {}
    try {
      if (typeof FREES !== 'undefined') FREES.forEach(function (f) {
        list.push({ name: f.name || f.id, cat: 'ফ্রি টুল', hash: '#/free/' + f.id, key: (f.name || '') + ' ' + f.id });
      });
    } catch (e) {}
    [
      ['রিচার্জ', 'পেজ', '#/recharge', 'রিচার্জ recharge balance'],
      ['প্রোফাইল', 'পেজ', '#/profile', 'প্রোফাইল profile'],
      ['সাপোর্ট', 'পেজ', '#/support', 'সাপোর্ট support whatsapp'],
      ['লাইভ চ্যাট', 'পেজ', '#/livechat', 'লাইভ চ্যাট live chat'],
      ['ড্যাশবোর্ড', 'পেজ', '#/dashboard', 'ড্যাশবোর্ড dashboard']
    ].forEach(function (p) { list.push({ name: p[0], cat: p[1], hash: p[2], key: p[3] }); });
    return list;
  }
  function setup() {
    var header = document.querySelector('header.topbar');
    if (!header || document.getElementById('nsSearchBox')) return;
    var spacer = header.querySelector('.spacer');
    var box = document.createElement('div');
    box.id = 'nsSearchBox';
    box.className = 'ns-search';
    box.innerHTML = '<input id="nsSearchInput" type="search" placeholder="🔍 সার্চ করুন…" autocomplete="off" aria-label="সেবা সার্চ করুন"><div id="nsSearchDrop" class="ns-search-drop" hidden></div>';
    if (spacer) { spacer.style.flex = '0 0 4px'; header.insertBefore(box, spacer); }
    else header.appendChild(box);
    var input = box.querySelector('#nsSearchInput');
    var drop = box.querySelector('#nsSearchDrop');
    function hide() { drop.hidden = true; drop.innerHTML = ''; }
    function render(q) {
      q = norm(q).trim();
      if (!q) { hide(); return; }
      var all = items();
      var hit = all.filter(function (it) { return norm(it.key).indexOf(q) !== -1 || norm(it.name).indexOf(q) !== -1; });
      if (!hit.length) {
        drop.innerHTML = '<div class="ns-search-empty">কোনো সেবা পাওয়া যায়নি</div>';
      } else {
        drop.innerHTML = hit.slice(0, 12).map(function (it) {
          return '<a class="ns-search-item" href="' + it.hash + '"><span>' + it.name.replace(/</g, '&lt;') + '</span><span class="ns-search-cat">' + it.cat + '</span></a>';
        }).join('');
        drop.querySelectorAll('.ns-search-item').forEach(function (a) {
          a.addEventListener('click', function () { input.value = ''; hide(); input.blur(); });
        });
      }
      drop.hidden = false;
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value.trim()) render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hide(); input.blur(); }
      if (e.key === 'Enter') {
        var first = drop.querySelector('.ns-search-item');
        if (first) { location.hash = first.getAttribute('href'); input.value = ''; hide(); }
      }
    });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) hide(); });
    input.addEventListener('blur', function () { setTimeout(hide, 200); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
