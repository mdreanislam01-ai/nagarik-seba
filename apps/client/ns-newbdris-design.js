/* ns-newbdris-design.js — newbdris page, client only.
   2026-10-31: the autoload card, new-birth hero and personal-info
   card were removed per user instruction; the reference form now
   lives in ns-newbdris-ref.js. build() stays a no-op so this script
   can never re-add them on any render.
   2026-10-31 slimming: the old build body (hero artworks as base64
   data URIs, ~64KB) was dead code behind build()'s early return and
   was still downloaded on EVERY client page load. It is removed
   here; nothing that actually runs has changed. */
(function(){
  'use strict';
  function build(){ return; }
  function apply(){ try { build(); } catch(e){} }
  apply();
  window.addEventListener('hashchange', function(){ setTimeout(apply, 100); });
  var mainEl = document.getElementById('main');
  if (mainEl && typeof MutationObserver !== 'undefined') {
    new MutationObserver(function(){ apply(); }).observe(mainEl, {childList: true, subtree: true});
  }
})();
