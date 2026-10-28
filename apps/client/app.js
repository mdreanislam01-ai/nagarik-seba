/* Nagarik Seba — DESIGN-ONLY demo. No real data service, no submission, no deduction, no real printing. */
const $=s=>document.querySelector(s);
function showModal(t,html){$('#modalTitle').textContent=t;$('#modalBody').innerHTML=html;$('#modalBack').classList.add('open')}
function closeModal(){$('#modalBack').classList.remove('open')}
function demoMsg(what){showModal('নোটিশ',`<p><b>${what}</b> — এই অপশনটি বর্তমানে চালু নয়।</p>`)}
function toggleDark(){document.body.classList.toggle('dark');const sw=document.querySelector('.switch__input');if(sw){sw.checked=document.body.classList.contains('dark')}}
/* Tiny header dark-mode switch (user-supplied markup): checked = dark ON,
   unchecked = light. Keep the checkbox in sync with body.dark. */
(function(){const sw=document.querySelector('.switch__input');if(!sw)return;sw.checked=document.body.classList.contains('dark');sw.addEventListener('change',toggleDark)})();
/* Profile photo — LOCAL-ONLY (no backend, no server upload).
   Saved only in this browser/device via localStorage, downscaled to
   max 512px (JPEG ~0.8) before saving to avoid quota failures.
   It will NOT sync to another phone/PC and is lost if browser data
   is cleared. A real server upload would be needed for cross-device sync. */
const PHOTO_KEY='nagarikseba_profile_photo';
let __pendingPhoto='';
function getProfilePhoto(){try{return localStorage.getItem(PHOTO_KEY)||''}catch(e){return ''}}
function profileAvatarHTML(){
  const ph=getProfilePhoto();
  if(ph) return `<span class="avatar-ph avatar-photo"><img src="${ph}" alt="প্রোফাইল ছবি"></span>`;
  return `<span class="avatar-ph"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg></span>`;
}
function profilePreviewHTML(){
  const ph=getProfilePhoto();
  if(ph) return `<img id="photoPreviewImg" src="${ph}" alt="প্রোফাইল ছবি">`;
  return `<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>`;
}
function handleProfilePhotoFile(input){
  const file=input.files&&input.files[0]; if(!file) return;
  if(!file.type || file.type.indexOf('image/')!==0){showModal('ছবি আপলোড','দয়া করে একটি ছবি ফাইল (JPG/PNG ইত্যাদি) বাছুন।'); input.value=''; return;}
  const reader=new FileReader();
  reader.onload=function(){
    const img=new Image();
    img.onload=function(){
      try{
        const max=512, scale=Math.min(1, max/Math.max(img.width,img.height));
        const w=Math.max(1,Math.round(img.width*scale)), h=Math.max(1,Math.round(img.height*scale));
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        c.getContext('2d').drawImage(img,0,0,w,h);
        __pendingPhoto=c.toDataURL('image/jpeg',0.8);
        const wrap=document.getElementById('photoPreviewWrap');
        if(wrap) wrap.innerHTML=`<img id="photoPreviewImg" src="${__pendingPhoto}" alt="প্রোফাইল ছবি">`;
        const saveBtn=document.getElementById('photoSaveBtn'); if(saveBtn) saveBtn.disabled=false;
        const msg=document.getElementById('photoMsg'); if(msg) msg.textContent='প্রিভিউ দেখা যাচ্ছে — সংরক্ষণ করুন চাপলে হোমপেজের প্রোফাইল কার্ডে দেখা যাবে।';
      }catch(e){showModal('ছবি আপলোড','ছবিটি প্রসেস করা যায়নি। অন্য একটি ছবি চেষ্টা করুন।');}
    };
    img.onerror=function(){showModal('ছবি আপলোড','ছবিটি খোলা যায়নি। অন্য একটি ছবি চেষ্টা করুন।');};
    img.src=reader.result;
  };
  reader.onerror=function(){showModal('ছবি আপলোড','ছবিটি পড়া যায়নি। আবার চেষ্টা করুন।');};
  reader.readAsDataURL(file);
}
function saveProfilePhoto(){
  if(!__pendingPhoto){showModal('ছবি আপলোড','প্রথমে একটি ছবি বাছুন।'); return;}
  try{localStorage.setItem(PHOTO_KEY,__pendingPhoto);}catch(e){showModal('ছবি আপলোড','ছবি সংরক্ষণ করা যায়নি — ফাইলটি বড় হতে পারে, ছোট ছবি চেষ্টা করুন।'); return;}
  __pendingPhoto=''; render();
  showModal('ছবি সংরক্ষণ করা হয়েছে','প্রোফাইল ছবি এই ডিভাইসে সংরক্ষিত হয়েছে। হোমপেজের প্রোফাইল কার্ডে এখন এই ছবি দেখা যাবে।');
}
function removeProfilePhoto(){
  try{localStorage.removeItem(PHOTO_KEY);}catch(e){}
  __pendingPhoto=''; render();
  showModal('ছবি সরানো হয়েছে','প্রোফাইল ছবি সরানো হয়েছে। এখন আবার জেনেরিক আইকন দেখা যাবে।');
}

/* Profile info — LOCAL-ONLY (no backend, no server account).
   Name/phone edited on the Profile page are saved only in this
   browser/device via localStorage, like the profile photo.
   They will NOT sync to another phone/PC and are lost if browser
   data is cleared. A real backend would be needed for cross-device
   profile sync. Email stays disabled/unchanged, balance/UID/Verified
   are deliberately NOT changed by this form. */
const PROFILE_KEY='nagarikseba_profile_info';
const PROFILE_DEFAULTS={name:'নমুনা ব্যবহারকারী',phone:'01XXXXXXXXX'};
function getProfileInfo(){
  try{
    const raw=localStorage.getItem(PROFILE_KEY);
    if(!raw) return {...PROFILE_DEFAULTS};
    const v=JSON.parse(raw);
    return {name:(v.name||'').trim()||PROFILE_DEFAULTS.name, phone:(v.phone||'').trim()||PROFILE_DEFAULTS.phone};
  }catch(e){return {...PROFILE_DEFAULTS}}
}
function saveProfileUpdate(){
  const nameEl=document.getElementById('profileNameInput');
  const phoneEl=document.getElementById('profilePhoneInput');
  const name=nameEl? nameEl.value.trim() : '';
  const phone=phoneEl? phoneEl.value.trim() : '';
  if(!name){showModal('প্রোফাইল আপডেট','দয়া করে নাম লিখুন।'); return;}
  if(!phone){showModal('প্রোফাইল আপডেট','দয়া করে নম্বর লিখুন।'); return;}
  const digits=phone.replace(/\D/g,'');
  if(digits.length<10){showModal('প্রোফাইল আপডেট','দয়া করে সঠিক নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।'); return;}
  try{localStorage.setItem(PROFILE_KEY, JSON.stringify({name,phone}));}
  catch(e){showModal('প্রোফাইল আপডেট','প্রোফাইল সংরক্ষণ করা যায়নি — আবার চেষ্টা করুন।'); return;}
  render();
  showModal('প্রোফাইল আপডেট হয়েছে','নাম ও নম্বর এই ডিভাইসে সংরক্ষিত হয়েছে। হোমপেজের প্রোফাইল কার্ডে এখন নতুন নাম দেখা যাবে।');
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}


const S=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const P={
 house:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
 dollar:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1-1.3-1.5-3-1.5s-3 .5-3 1.5 1 2 3 2.5 3 1 3 2c0 1-1.3 1.5-3 1.5s-3-.5-3-1.5"/>',
 flag:'<path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/>',
 chat:'<path d="M3 11a9 9 0 019-9h1a9 9 0 010 18H8l-5 2z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18.5h2"/>',
 logout:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
 idcard:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c1-1 2-1.5 3-1.5S10 15 11 16M14 9h5M14 12h5M14 15h3"/>',
 doc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
 landmark:'<path d="M3 21h18M4 10l8-6 8 6M6 10v9M10 10v9M14 10v9M18 10v9M3 17h18"/>',
 server:'<rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><circle cx="6" cy="6.5" r="1"/><circle cx="6" cy="17.5" r="1"/>',
 pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
 editdoc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 14l2 2 4-4"/>',
 bank:'<path d="M3 21h18M3 10l9-6 9 6M5 10v10M9 10v10M13 10v10M17 10v10"/>',
 finger:'<path d="M12 11a2 2 0 012 2c0 2-1 4-1 6"/><path d="M8 12c0-3 2-6 4-6s4 3 4 6c0 2-.5 4-1 6"/><path d="M5 13c0-5 3-9 7-9s7 4 7 9c0 3-1 6-2 8"/>',
 pin:'<path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12L20 3M16 7l3 3M19 4l2 2"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>',
 call:'<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.13.96.36 1.9.7 2.8a2 2 0 01-.45 2.1L8.1 9.9a16 16 0 006 6l1.3-1.25a2 2 0 012.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0122 16.9z"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
 searchdoc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><circle cx="16" cy="16" r="3"/><path d="M18.5 18.5L21 21"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a2 2 0 014 0M9 12h6M9 16h6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5S15.5 16.5 15.5 20"/><circle cx="17" cy="9" r="3"/><path d="M16 14.5c2.5.5 4.5 2 4.5 5.5"/>',
 tools:'<path d="M14.7 6.3a4.5 4.5 0 00-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 005.6-6l-3 3-2.5-.5-.5-2.5z"/>',
 receipt:'<path d="M4 2h16v20l-2-1.5L16 22l-2-1.5L12 22l-2-1.5L8 22l-2-1.5L4 22z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
 money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
 mega:'<path d="M3 11v3l14 4V7z"/><path d="M17 8a4 4 0 010 8"/><path d="M7 14v4a2 2 0 004 0v-3"/>',
 toggle:'<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="16" cy="12" r="3"/>',
 chart:'<path d="M3 21h18M7 16v-5M12 16V8M17 16v-8"/>',
 card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
};
const ICONS={
 dashboard:S(P.house),recharge:S(P.dollar),report:S(P.flag),support:S(P.chat),profile:S(P.user),devices:S(P.phone),logout:S(P.logout),
 nid:S(P.idcard),snid:S(P.idcard),brn:S(P.doc),brni:S(P.landmark),sc:S(P.server),ssc:S(P.pen),tin:S(P.doc),ncf:S(P.editdoc),vuk:S(P.bank),
 sign:S(P.pen),servercopy:S(P.server),nidcard:S(P.idcard),smartcardpdf:S(P.doc),biomatic:S(P.finger),tincertificate:S(P.doc),location:S(P.pin),number2imei:S(P.phone),nid2allnumber:S(P.list),info:S(P.info),nidpsset:S(P.key),namethikananid:S(P.house),newbdris:S(P.doc),passport:S(P.globe),calllist:S(P.call),i2an:S(P.phone),pinset:S(P.lock),smartnidcard:S(P.card),
 signature:S(P.pen),tininfo:S(P.searchdoc),dobfinder:S(P.cal),
 history:S(P.clip),doc:S(P.doc)
};
function ico(k){return `<span class="ico">${ICONS[k]||ICONS.doc}</span>`}
const OL_STATUS=[
 ['pending','Pending','<path d="M5 2h14v2l-6 8 6 8v2H5v-2l6-8L5 4V2z"/>'],
 ['received','Received','<path d="M1 7h12v9H1zM13 10h4l4 4v2h-8z"/><circle cx="5.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>'],
 ['completed','Completed','<path d="M9 16.2 4.8 12 3.4 13.4 9 19 21 7 19.6 5.6z"/>'],
 ['refunded','Refunded','<path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/>'],
];
function olTile(s){return `<div class="ol-tile ol-${s[0]}"><span class="ol-circle"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">${s[2]}</svg></span><span class="ol-label">${s[1]}</span><b class="ol-count">0</b></div>`}
function ordersLogsHTML(){return `<div class="orders-logs">`+ORDERS.map(o=>`<section class="ol-section"><h4 class="ol-head">${ico(o.id)}<span>${o.name}</span></h4><div class="ol-grid">`+OL_STATUS.map(olTile).join('')+`</div></section>`).join('')+`</div>`}
const SERVICES=[
 {id:'nid',name:'এনআইডি ক্রিয়েট',title:'নতুন এনআইডি',cost:5,note:'সাইন থেকে এনআইডি মেইক ৫ টাকা করে কাটবে, অটো এনআইডি ১০ টাকা কাটবে।',autoload:true,fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','পিতার নাম*','মাতার নাম*','জন্মস্থান*','জন্ম তারিখ*','রক্তের গ্রুপ','প্রদানের তারিখ*','ঠিকানা*'],uploads:['এনআইডি ছবি*','স্বাক্ষর']},
 {id:'snid',name:'স্মার্ট এনআইডি ক্রিয়েট',title:'নতুন স্মার্ট এনআইডি',cost:10,note:'ছবির ব্যাকগ্রাউন্ড সঠিকভাবে না সরলে আসল ছবি ডাউনলোড করে remove.bg-এর মতো টুল ব্যবহারের পরামর্শ।',autoload:true,fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','পিতার নাম*','মাতার নাম*','জন্মস্থান*','জন্মস্থান (ইংরেজী)*','লিঙ্গ (ইংরেজী)*','জন্ম তারিখ*','রক্তের গ্রুপ','প্রদানের তারিখ*','ঠিকানা*'],uploads:['এনআইডি ছবি*','স্বাক্ষর']},
 {id:'brn',name:'জন্মনিবন্ধন ক্রিয়েট',title:'নতুন জন্মনিবন্ধন',cost:5,note:'জন্মনিবন্ধন মেক ৫ টাকা করে কাটবে।',autoload:'brn',fields:['Register Office Address*','Upazila / Pourashava / City Corporation','Zila*','Birth Registration Number*','Gender*','Date of Registration*','Date of Issuance*','Left Bar Code*','QR Link*','Date of Birth*','Date of Birth in Word','নাম*','Name','পিতার নাম*','Father Name','পিতার জাতীয়তা (বাংলাদেশী)','Father Nationality (Bangladeshi)','মাতার নাম*','Mother Name','মাতার জাতীয়তা (বাংলাদেশী)','Mother Nationality (Bangladeshi)','জন্মস্থান*','Place of Birth','স্থায়ী ঠিকানা*','Permanent Address'],uploads:[]},
 {id:'brni',name:'মিনিস্ট্রি ডাটা',title:'জন্মনিবন্ধন নম্বর তথ্য',cost:100,note:'এই সার্ভিসের খরচ ১০০ টাকা। ব্যালান্স ($ 10) কম হলে মূল সাইটের মতো Insufficient balance দেখানো হয়।',fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','লিঙ্গ (সকল / পুরুষ / মহিলা)','জন্ম তারিখ','হুবহু মিল (না / হ্যাঁ)'],uploads:[]},
 {id:'sc',name:'সার্ভার কপি ডাউনলোড',title:'নতুন সার্ভার কপি',cost:25,note:'সার্ভার কপি ১০ টাকা (API ৫) / ২৫ টাকা (API ৩)। পিন নম্বর ও ফুল ঠিকানা আসবে নোট।',fields:['এনআইডি নম্বর* (১০ / ১৩ / ১৭ ডিজিট)','জন্ম তারিখ* (YYYY-MM-DD)','সার্ভারের API*','সার্ভারের ধরণ* (অরিজিনাল / নতুন / পুরাতন, QR কোডসহ বা ছাড়া)'],uploads:[],api:true},
 {id:'ssc',name:'সাইন টু সার্ভার কপি',title:'সাইন টু সার্ভার কপি',cost:5,note:'এটি প্রিন্ট করতে ৫ টাকা কাটা হবে।',fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','জন্ম তারিখ*','লিঙ্গ (ইংরেজী)*','পিতার নাম','মাতার নাম','স্বামী/স্ত্রীর নাম','জন্মস্থান','রক্তের গ্রুপ','ধর্ম','পেশা','মোবাইল নম্বর','শিক্ষা','পিতার এনআইডি','মায়ের এনআইডি','ফর্ম নম্বর','ভোটার সিরিয়াল নম্বর','ভোটার নম্বর','ভোটার এলাকা','বর্তমান ঠিকানা','স্থায়ী ঠিকানা','সার্ভারের ধরণ*'],uploads:['এনআইডি ছবি*']},
 {id:'tin',name:'টিন সার্টিফিকেট ডাউনলোড',title:'নতুন টিন সার্টিফিকেট',cost:40,note:'টিন সার্টিফিকেট ৪০ টাকা। ব্যালান্স কম হলে Insufficient balance দেখানো হয়।',fields:['ডাটার ধরণ* (টিন নম্বর / টিকিট নম্বর / পুরাতন টিন নম্বর / এনআইডি নম্বর / পাসপোর্ট নম্বর / মোবাইল নম্বর)','ডাটা*'],uploads:[]},
 {id:'ncf',name:'এনআইডি সংশোধন ফর্ম',title:'এনআইডি সংশোধন ফর্ম',cost:25,note:'খরচ ২৫ টাকা। ব্যালান্স কম হলে Insufficient balance দেখানো হয়।',captcha:true,fields:['ইউজারনেম* (জাতীয় পরিচয়পত্র নম্বর অথবা ইউজারনেম)','পাসওয়ার্ড*','ক্যাপচা*'],uploads:[]},
 {id:'vuk',name:'ভাতা ফর্ম ডাউনলোড',title:'ভাতা ফর্ম ডাউনলোড',cost:10,note:'খরচ ১০ টাকা।',fields:['অনুসন্ধানের ধরণ (ট্র্যাকিং নম্বর / এনআইডি নম্বর ও জন্ম তারিখ)','ট্র্যাকিং নম্বর*'],uploads:[]},
];
const ORDERS=[
 {id:'sign',name:'সাইন কপি অর্ডার',label:'সাইন কপি চালু ✅',cost:234,fields:['ব্যক্তির নাম','এনআইডি / ভোটার / জন্মনিবন্ধন / ফরম নম্বর*','জন্ম তারিখ'],demo:true},
 {id:'servercopy',name:'সার্ভার কপি অর্ডার',label:'আন-অফিসিয়াল সার্ভার কপি অর্ডার করুন ✅',cost:60,fields:['এনআইডি নম্বর* (শুধু ১০ / ১৩ / ১৭ ডিজিট)','জন্ম তারিখ*']},
 {id:'nidcard',name:'এনআইডি কপি অর্ডার',label:'এনআইডি কার্ড চালু ✅',cost:320,fields:['ব্যক্তির নাম','এনআইডি / ভোটার / জন্মনিবন্ধন / ফরম নম্বর*','জন্ম তারিখ']},
 {id:'smartcardpdf',name:'স্মার্ট কার্ড PDF অর্ডার',label:'এনআইডি স্মার্ট PDF চালু ✅',cost:350,fields:['ব্যক্তির নাম','এনআইডি / ভোটার / জন্মনিবন্ধন / স্লিপ নম্বর*','জন্ম তারিখ']},
 {id:'biomatic',name:'বায়োমেট্রিক অর্ডার',label:'বায়োমেট্রিক চালু ✅',cost:null,options:[['GP',60]],fields:['মোবাইল নম্বর* (01XXXXXXXXX)']},
 {id:'tincertificate',name:'টিন সার্টিফিকেট অর্ডার',label:'টিন সার্টিফিকেট চালু ✅',cost:12,options:[['TIN NO',12],['NID NO',12],['MOBILE NO',12]],fields:['ব্যক্তির নাম','Data*','জন্ম তারিখ']},
 {id:'location',name:'লোকেশন অর্ডার',label:'লোকেশন সার্ভিস চালু ✅',cost:168,options:[['Location',168],['LRL',168],['LCL',168]],fields:['মোবাইল নম্বর*']},
 {id:'number2imei',name:'নাম্বার টু IMEI অর্ডার',label:'ফোন নম্বর থেকে IMEI নম্বর অর্ডার চালু ✅',cost:168,fields:['মোবাইল নম্বর*']},
 {id:'nid2allnumber',name:'এনআইডি টু অল নাম্বার অর্ডার',label:'Nid To All Number অর্ডার সার্ভিস চালু ✅',cost:312,options:[['Nid To All Number',312]],fields:['Data* (NID ১০ / ১৭ ডিজিট — সাবধানে তথ্য দিন)']},
 {id:'info',name:'INFO অর্ডার',label:'নগদ / বিকাশ / রকেট / ইনফো অর্ডার চালু ✅',cost:null,options:[['Bkash',605],['Nagad Personal',605],['Rocket',550],['Bkash Agent',700],['Bkash Merchant',700],['Nagad Agent',2500]],fields:['মোবাইল নম্বর*']},
 {id:'nidpsset',name:'এনআইডি ইউজার পাসওয়ার্ড সেট',label:'এনআইডি ইউজার পাসওয়ার্ড সেট সার্ভিস চালু ✅',cost:50,fields:['Data* (নাম / এনআইডি / জন্ম তারিখ)','এনআইডি নম্বর* (১০ / ১৩ / ১৭ সংখ্যা)','জন্ম তারিখ*']},
 {id:'namethikananid',name:'নাম-ঠিকানা দিয়ে এনআইডি',label:'নাম-ঠিকানা দিয়ে এনআইডি ও সাইন কপি চালু ✅',cost:350,options:[['SIGN COPY',350],['NID',350]],fields:['ফর্ম পূরণ করুন* (নিজ নাম, জন্ম তারিখ, পিতা-মাতার নাম, ছবি, বিভাগ, জেলা, আসন, থানা, ইউনিয়ন, ওয়ার্ড নং, গ্রাম / ভোটার এলাকা)']},
 {id:'newbdris',name:'নতুন জন্ম নিবন্ধন অর্ডার',label:'ঢাকা সিটি নতুন জন্ম নিবন্ধন চালু, সময় ২৪–৪৮ ঘণ্টা ✅',cost:null,options:[['নরমাল',800],['পসিবল',800],['মিনিস্ট্রি',1000],['CTG নরমাল',2000]],fields:['ফরম পূরণ করুন*']},
 {id:'passport',name:'পাসপোর্ট SB কপি',label:'পাসপোর্ট SB কপি',cost:null,options:[['MRP Passport SB Copy',450],['E Passport SB Copy',600]],fields:['নাম*','Passport / NID / যেকোনো একটি তথ্য*']},
 {id:'calllist',name:'কললিস্ট অর্ডার',label:'কল লিস্ট অর্ডার চালু ✅',cost:null,options:[['৩ মাস কল লিস্ট',1200],['৬ মাস কল লিস্ট',1500]],fields:['Number*']},
 {id:'i2an',name:'IMEI টু অ্যাক্টিভ নম্বর অর্ডার',label:'IMEI To Active Number ও All Number অর্ডার চালু ✅',cost:600,options:[['IMEI To Active Number',600],['IMEI To All Number',600]],fields:['Data* (IMEI 1, IMEI 2, ফোন হারানোর তারিখ)']},
 {id:'pinset',name:'পিন রিসেট',label:'নগদ / বিকাশ পিন রিসেট সার্ভিস চালু ✅',cost:null,pinMissing:true,fields:['Data* (পিন রিসেট করতে চাওয়া নম্বর ও আপনার WhatsApp নম্বরতে কিছু পাঠানো হয় না)']},
 {id:'smartnidcard',name:'অরিজিনাল স্মার্ট কার্ড অর্ডার',label:'১০০% অরিজিনাল স্মার্ট কার্ড — অনলাইন স্ট্যাটাস চেক দেওয়া যাবে',cost:null,options:[['নতুন স্মার্ট কার্ড প্রিন্ট',3300],['রি-প্রিন্ট স্মার্ট কার্ড',3500]],fields:['স্মার্ট কার্ড তথ্য প্রদান করুন* (Name, NID, DOB, WhatsApp নম্বর)','সুন্দরবন কুরিয়ার ঠিকানা* (Received নাম, Received নম্বর, জেলা, থানা, ইউনিয়ন)'],notice:'স্মার্ট কার্ড অর্ডার দিলে সময় দিতে হবে ৪/৬ দিন।'},
];
const HISTORIES=[
 {id:'nid',name:'এনআইডি লিস্ট',cols:['SL','NAME','NID','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি','••••••••••','••••-••-••','তারিখ']]},
 {id:'snid',name:'স্মার্ট এনআইডি লিস্ট',cols:['SL','NAME','NID','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি ১','••••••••••','••••-••-••',''],['2','নমুনা ব্যক্তি ২','••••••••••','••••-••-••',''],['3','নমুনা ব্যক্তি ৩','••••••••••','••••-••-••','']]},
 {id:'brn',name:'জন্মনিবন্ধন লিস্ট',cols:['SL','NAME','BRN','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি','••••••••••','••••-••-••','']]},
 {id:'brni',name:'মিনিস্ট্রি ডাটা লিস্ট',cols:['SL','NAME','UBRN','DATE OF BIRTH','CREATED','ACTION'],rows:[]},
 {id:'sc',name:'সার্ভার কপি লিস্ট',cols:['SL','NAME','NID','PIN','DATE OF BIRTH','CREATED','ACTION'],rows:[]},
 {id:'ssc',name:'সাইন টু সার্ভার কপি লিস্ট',cols:['SL','NAME','NID','PIN','DATE OF BIRTH','CREATED','ACTION'],rows:[]},
 {id:'tin',name:'টিন সার্টিফিকেট লিস্ট',cols:['SL','NAME','TIN','TIN DATE','STATUS','CREATED','ACTION'],rows:[]},
 {id:'ncf',name:'এনআইডি সংশোধন ফর্ম লিস্ট',cols:['SL','NAME','NID','VOTER AREA','ADDRESS','CREATED','ACTION'],rows:[]},
 {id:'vuk',name:'ভাতা ফর্ম ডাউনলোড লিস্ট',cols:['SL','NAME','NID','APPLICATION ID','DATE OF BIRTH','CREATED','ACTION'],rows:[]},
];
const FREES=[
 {id:'signature',name:'স্বাক্ষর তৈরি',field:'স্বাক্ষরের নাম* (প্রথম বা শেষ নাম)',btn:'Make Signature',err:'Invalid name! / Name cannot be left blank!'},
 {id:'tininfo',name:'টিন সার্টিফিকেট তথ্য',field:'টিন নম্বর*',btn:'Find Tin Info',err:'Invalid information! / Tin number should be 12 digits!'},
 {id:'dobfinder',name:'জন্ম তারিখ অনুসন্ধান',field:'১৭টি সংখ্যা ডাটা*',btn:'Find Birth Date',err:'Invalid information! / Data should be 17 digits!'},
];
const SIDEBAR=[
 ['ড্যাশবোর্ড',[['dashboard','ড্যাশবোর্ড']]],
 ['রিচার্জ',[['recharge','রিচার্জ']]],
 ['সার্ভিস',SERVICES.map(s=>['service/'+s.id,s.name])],
 ['অর্ডার সার্ভিস',ORDERS.map(o=>['order/'+o.id,o.name])],
 ['বিনামূল্যে সার্ভিস',FREES.map(f=>['free/'+f.id,f.name])],
 ['হিস্টোরি লিস্ট',HISTORIES.map(h=>['history/'+h.id,h.name])],
 ['হেল্পলাইন',[['report','রিপোর্ট'],['support','সাপোর্ট']]],
 ['অ্যাকাউন্ট',[['profile','প্রোফাইল'],['myinfo','আমার তথ্য'],['devices','ডিভাইস'],['logout','লগআউট']]],
];
function navHTML(){
 // BUG FIX (logout visibility): the old sidebar was one long scrollable
 // list, so Logout — the very last item — sat below the fold on desktop
 // and was effectively unreachable on mobile. The list now lives in its
 // own scrollable area, and a pinned Logout footer (same #/logout action
 // as the list item, not a second/conflicting action) stays visible at
 // the bottom of the sidebar/drawer on both desktop and mobile.
 let h='<div class="sidebar-scroll">';SIDEBAR.forEach(([sec,items])=>{h+=`<h3>${sec}</h3>`+items.map(([r,l])=>{const k=r.split('/').pop();return `<a href="#/${r}" data-r="${r}">${ico(k)}<span>${l}</span></a>`}).join('')});h+='</div>';
 h+=`<div class="sidebar-logout"><a href="#/logout" data-r="logout">${ico('logout')}<span>লগআউট</span></a></div>`;
 return h;
}
function tableHTML(cols,rows,actions){
 const head=`<tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>`;
 const body=rows.length?rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}<td>${actions||''}</td></tr>`).join(''):`<tr><td colspan="${cols.length}">No data available in table</td></tr>`;
 return `<table>${head}${body}</table>`;
}
function fieldHTML(f,i){return `<label>${f}</label><input placeholder="${esc(f)}">`}
function closedBanner(){return `<div class="closed">⚠ নতুন অর্ডারের অনুরোধ বর্তমানে বন্ধ আছে।</div>`}

// Real login activity only: this prototype has no auth backend, so the store
// starts empty. Do NOT seed it with sample/demo entries. Entries may only be
// added by a real login/auth backend when one is connected.
const REAL_LOGIN_ACTIVITY = [];
function activityLogsHTML(){
  if(!REAL_LOGIN_ACTIVITY.length) return `<p class="muted">এখনো কোনো লগইন রেকর্ড নেই</p>`;
  return `<ul>` + REAL_LOGIN_ACTIVITY.map(a=>`<li>${esc(a)}</li>`).join('') + `</ul>`;
}

function render(){
 const hash=location.hash.replace('#/','')||'dashboard';const parts=hash.split('/');
 document.querySelectorAll('.sidebar a').forEach(a=>a.classList.toggle('active',a.dataset.r===hash));
 let m=$('#main');let h='';
 if(hash==='dashboard'){
  h+=`<section class="profile-card">
  <div class="profile-row">
    ${profileAvatarHTML()}
    <div class="profile-info"><b class="profile-name">${esc(getProfileInfo().name)}</b> <span class="verified-pill">✓ ভেরিফাইড</span><div class="profile-uid">UID: #BD-982410</div></div>
    <button class="qr-btn" type="button" onclick="showModal('QR কোড','UID: #BD-982410 — এই QR বোতামটি নমুনা; আসল এনকোড করা QR পেতে আসল ব্যবহারকারী তথ্য / ব্যাকএন্ড প্রয়োজন।')" aria-label="QR কোড"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3"/></svg></button>
  </div>
  <hr class="profile-divider">
  <div class="bal-row"><div class="bal-left"><span class="bal-label">বর্তমান ব্যালেন্স</span><div class="bal-amount">৳ ১০</div></div>
  <a class="recharge-pill" href="#/recharge"><span class="recharge-plus">+</span> রিচার্জ করুন <span aria-hidden="true">›</span></a></div>
  </section>
  <a class="wa-card" href="#/support"><span class="wa-icon"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm-3.2-9.3c.3-.6 1-1 1.6-.7l1.1.7c.2.1.4.3.5.5l.7 1.2c.1.3 0 .7-.2.9l-.6.7c-.2.2-.3.5-.1.8.5 1 1.3 1.8 2.3 2.3.3.2.6.1.8-.1l.7-.6c.2-.2.6-.3.9-.2l1.2.7c.2.1.4.3.5.5l.7 1.1c.3.6-.1 1.3-.7 1.6-.6.3-1.2.4-1.8.2-2.6-.8-4.9-3.1-5.7-5.7-.2-.6-.1-1.2.2-1.8z"/></svg></span><span class="wa-text"><b>হোয়াটসঅ্যাপ সাপোর্ট <span class="wa-dot" aria-hidden="true"></span></b><span class="wa-sub">সরাসরি কথা বলুন • ২৪/৭ সক্রিয় সহায়তা</span></span><span class="wa-arrow" aria-hidden="true">→</span></a>

  <div class="need-head"><span class="need-dot" aria-hidden="true"></span><h3>প্রয়োজনীয় নাগরিক সেবাসমূহ</h3><button class="all-services" type="button" onclick="document.getElementById('service-cards').scrollIntoView({behavior:'smooth'})">সকল সেবা ›</button></div>
  <div class="card" id="service-cards"><h3>সার্ভিস কার্ড</h3><div class="grid svc-grid">`+SERVICES.map(s=>{const d={nid:[5,1,'#2f5aa8'],snid:[10,3,'#0f766e'],brn:[5,1,'#0ea5e9'],brni:[100,0,'#0f766e'],sc:[1,0,'#1d4ed8'],ssc:[5,0,'#06b6d4'],tin:[40,0,'#dc2626'],ncf:[25,0,'#65a30d'],vuk:[10,0,'#1e3a8a']}[s.id]||[s.cost,0,'#0f766e'];return `<article class="svc-card"><div class="svc-head" style="background:${d[2]}"><span class="card-ico">${ico(s.id)}</span><b>${s.name}</b></div><div class="svc-body"><span>$ ${d[0]} কার্ড খরচ</span><span>${d[1]} কার্ড তালিকা</span></div></article>`}).join('')+`</div></div>
  <div class="card orders-logs-card"><h3>Orders Logs</h3><p class="muted">১৮টি অর্ডার সার্ভিসের প্রতিটিতে Pending / Received / Completed / Refunded — সব ০।</p>`+ordersLogsHTML()+`</div>
  <div class="card qa-card"><h3 class="qa-head"><span class="qa-bolt"><svg viewBox="0 0 24 24" fill="#0f766e" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg></span><span>Quick Access</span></h3><div class="qa-grid">
  <a class="qa-tile qa-recharge" href="#/recharge"><span class="qa-icon"><span class="qa-dollar">$</span></span><span class="qa-label">রিচার্জ</span></a>
  <button class="qa-tile qa-chat" type="button" onclick="showModal('লাইভ চ্যাট','মূল অডিটে লাইভ চ্যাটের গন্তব্য যাচাই হয়নি। তাই এখানে কোনো চ্যাট খোলা হয় না — শুধু প্লেসহোল্ডার রাখা হয়েছে।')"><span class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 18 0"/><rect x="3" y="11" width="4" height="7" rx="2"/><rect x="17" y="11" width="4" height="7" rx="2"/><path d="M19 18a3 3 0 0 1-3 3h-2"/></svg></span><span class="qa-label">লাইভ চ্যাট</span></button>
  <a class="qa-tile qa-report" href="#/report"><span class="qa-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="3"/><path d="M12 12v6M8 14l-3 2M16 14l3 2M5 9H3M19 9h2M8 7 6 5M16 7l2-2"/></svg></span><span class="qa-label">রিপোর্ট</span></a>
  <a class="qa-tile qa-profile" href="#/profile"><span class="qa-icon"><svg viewBox="0 0 24 24" fill="#0284c7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg></span><span class="qa-label">প্রোফাইল</span></a>
  </div></div>`;
 }
 else if(hash==='recharge'){
  h+=`<div class="card ns-rch"><h2>রিচার্জ</h2>
  <section class="ns-rch-auto"><h3>⚡ অটোমেটিক পেমেন্ট</h3><p class="muted">bKash / Nagad দিয়ে পে করুন — পেমেন্ট মিললেই ব্যালেন্স অটো যোগ হবে, TrxID লিখতে হবে না।</p>
  <label>Amount*</label><input id="amtAuto" placeholder="সর্বনিম্ন রিচার্জ 100 টাকা" type="number"><p><button class="btn" onclick="nsZammpayStart()">ZammPay দিয়ে পে করুন</button></p></section>
  <section class="ns-rch-manual"><h3>ম্যানুয়াল পেমেন্ট</h3><p class="notice">পেমেন্ট করার পর অবশ্যই সঠিক Transaction ID এবং যে নম্বর থেকে পেমেন্ট করছেন ঐ নম্বর প্রদান করবেন। ভুল তথ্য দিলে আপনার অ্যাকাউন্ট সাসপেন্ড হবে।</p>
  <label>Amount*</label><input id="amt" placeholder="সর্বনিম্ন রিচার্জ 100 টাকা" type="number"><p><button class="btn" onclick="const v=+document.getElementById('amt').value; if(!v||v<100){showModal('যাচাই','সর্বনিম্ন রিচার্জ 100 টাকা।')}else{demoMsg('রিচার্জ')}">Recharge</button></p></section>
  <h3>রিচার্জ ইতিহাস</h3><div id="nsRchHist"></div></div>`;
 }
 else if(parts[0]==='service'){
  const s=SERVICES.find(x=>x.id===parts[1]); if(!s){h+='<p>পাওয়া যায়নি।</p>'}
  else{
   const insufficient=[100,40,25].includes(s.cost)&&s.cost>10;
   h+=`<div class="card"><h2>${ico(s.id)} ${s.title}</h2><p class="notice">${s.note}</p>`;
   if(s.uploads.length) h+=s.uploads.map(u=>`<label>${u}</label><input type="file" onclick="event.preventDefault();demoMsg('ফাইল আপলোড')"></input>`).join('');
   if(s.autoload) h+=`<p><button class="btn ghost" onclick="openAutoload('${s.id}')">এনআইডি অটোলোড করুন / স্বয়ংক্রিয়ভাবে ডেটা লোড করুন</button></p>`;
   if(s.api) h+=`<label>সার্ভারের API*</label><select id="apiSel" onchange="document.getElementById('apiNote').textContent=this.value==='5'?'এটি প্রিন্ট করতে 10 টাকা কাটা হবে':'এটি প্রিন্ট করতে 25 টাকা কাটা হবে'"><option value="3">API ৩ (25 TK)</option><option value="5">API ৫ (10 TK)</option></select><p id="apiNote">এটি প্রিন্ট করতে 25 টাকা কাটা হবে</p><p><button class="btn ghost" onclick="showModal(' ছবি','মূল অডিটে এই  ছবি লোড হয়নি। এখানে কোনো আসল নমুনা ছবি দেখানো হয় না।')"> দেখুন — এখানে ক্লিক করুন</button></p>`;
   if(s.captcha) h+=`<div class="card"><b>ক্যাপচা (প্লেসহোল্ডার)</b><p class="muted">মূল অডিটে ক্যাপচা ছবি “NO IMAGE” ছিল এবং Reload-এ API ত্রুটি এসেছিল। এখানে কোনো আসল ক্যাপচা সিস্টেম নেই।</p><button class="btn ghost" onclick="showModal('Invalid response from the API!',' প্লেসহোল্ডার — মূল সাইটের ত্রুটি-বার্তার নমুনা।')">↻ Reload Captcha</button></div>`;
   if(s.id==='brn') h+=`<p><button class="btn ghost" onclick="randomBRN()">Left Bar Code / QR Link — Random</button> <span id="brnOut" class="muted"></span></p>`;
   h+=s.fields.map((f,i)=>fieldHTML(f,i)).join('');
   if(insufficient) h+=`<div class="closed">Insufficient balance! You don't have enough balance to use this service.</div><p><button class="btn" onclick="location.hash='#/recharge'">Recharge Now</button></p>`;
   else h+=`<p class="notice">এটি প্রিন্ট করতে আপনার অ্যাকাউন্ট থেকে ${s.cost} টাকা কাটা হবে।</p><p><button class="btn" onclick="demoMsg('Save & Print')">Save & Print</button></p>`;
   h+=`</div>`;
  }
 }
 else if(parts[0]==='order'){
  const o=ORDERS.find(x=>x.id===parts[1]); if(!o){h+='<p>পাওয়া যায়নি।</p>'}
  else{
   h+=`<div class="card"><h2>${ico(o.id)} ${o.name}</h2><p>${o.label}</p>${o.notice?`<p class="notice">${o.notice}</p>`:''}${closedBanner()}`;
   if(o.pinMissing) h+=`<p class="notice">মূল অডিটে এই পেজে Operator-এর কোনো অপশন কার্ড রেন্ডার হয়নি — শুধু “Operator*” লেখা ছিল। এখানে সেই ঘাটতিটি প্লেসহোল্ডার হিসেবে চিহ্নিত রাখা হয়েছে, মোট দাম “?” দেখায়।</p>`;
   if(o.options) h+=`<label>অপশন বাছুন</label><div id="opts">`+o.options.map(([n,p],i)=>`<span class="opt ${i===0?'sel':''}" onclick="selectOpt(this,${p})">${n} (${p} TK)</span>`).join('')+`</div>`;
   h+=o.fields.map((f,i)=>fieldHTML(f,i)).join('');
   h+=`<p class="notice" id="totalNote">এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ${o.cost??'?'} টাকা কাটা হবে।</p><p class="muted">অর্ডার বন্ধ থাকায় সাবমিট বোতাম নেইতে কোনো অর্ডার করা হয় না।</p>
   <h3>অর্ডার ইতিহাস</h3>${tableHTML(['NO','COST','STATUS','SYNC','CREATED','ACTION'],[])}${o.id==='smartnidcard'?'<p class="muted">মূল সাইটে এই টেবিলে অতিরিক্ত NAME কলাম ছিল।</p>':''}</div>`;
  }
 }
 else if(parts[0]==='free'){
  const f=FREES.find(x=>x.id===parts[1]);
  if(parts[1]==='signature') h+=`<div class="card"><h2>স্বাক্ষর তৈরি</h2><p class="muted">সঠিক ট্যাব শিরোনাম: “স্বাক্ষর তৈরি” (মূল সাইটে ভুল করে “Date of Birth Finder” দেখাত)।</p>`;
  else if(f) h+=`<div class="card"><h2>${f.name}</h2>`;
  if(f){h+=`<label>${f.field}</label>${f.id==='dobfinder'?'<label>ডাটার ধরণ*</label><select><option>জন্মনিবন্ধন নম্বর</option><option>এনআইডি নম্বর</option></select>':''}<input id="freeIn"><p><button class="btn" onclick="showModal('যাচাই বার্তা','${f.err}')">${f.btn}</button></p><p class="muted">কোনো আসল নাম/নম্বর দিয়ে লুকআপ চালানো হয় না।</p></div>`}
 }
 else if(parts[0]==='history'){
  const hh=HISTORIES.find(x=>x.id===parts[1]);
  h+=`<div class="card"><h2>📋 ${hh.name}</h2>${tableHTML(hh.cols,hh.rows,hh.rows.length?`<button class="btn ghost" onclick="demoMsg('Edit — শুধু দেখা')">Edit</button> <button class="btn ghost" onclick="showModal('প্রিন্ট প্রিভিউ','এটি একটি নমুনা প্রিভিউ কাঠামো মাত্র। কোনো আসল কার্ড প্রিন্ট করা হয় না এবং কোনো আসল ব্যক্তিগত তথ্য এখানে নেই।')">Print</button> <button class="btn accent" onclick="demoMsg('Delete')">Delete</button>`: '')}<p class="muted">Edit = শুধু দেখা যাবে, সেভ করা হবে না। Print =  প্রিভিউ, আসল প্রিন্ট নয়। Delete = , কিছু মোছা হয় না।</p></div>`;
 }
 else if(hash==='report'){h+=`<div class="card"><h2>রিপোর্ট</h2><label>সমস্যার বিষয়*</label><input><label>সমস্যার ব্যাখ্যা*</label><textarea></textarea><p class="muted">ছবি যোগ করতে চাইলে লাইভ চ্যাট ব্যবহার করতে বলা আছে (মূল নোট)তে ছবি পাঠানো হয় না।</p><p><button class="btn" onclick="demoMsg('রিপোর্ট Submit')">Submit</button></p></div>`}
 else if(hash==='support'){h+=`<div class="card"><h2>সাপোর্ট</h2><p>মূল সাইটে সাপোর্ট বাইরের WhatsApp গ্রুপের লিংক খুলত। এখানে কোনো গ্রুপ লিংক দেওয়া হয়নি, জয়েন/মেসেজ করা হয় না — শুধু প্লেসহোল্ডার।</p><button class="btn ghost" onclick="demoMsg('সাপোর্ট প্লেসহোল্ডার')">সাপোর্ট</button></div>`}
 else if(hash==='profile'){const _pi=getProfileInfo();h+=`<div class="card"><h2>প্রোফাইল</h2><p>${esc(_pi.name)} • Verified: Yes • Balance: 10 • Joined: তারিখ</p>
 <h3>প্রোফাইল ছবি</h3><div class="photo-upload"><span class="avatar-ph photo-preview" id="photoPreviewWrap">${profilePreviewHTML()}</span><div class="photo-upload-actions"><label class="btn" for="profilePhotoInput">ছবি আপলোড করুন</label><input type="file" id="profilePhotoInput" accept="image/*" style="display:none" onchange="handleProfilePhotoFile(this)"><button class="btn ghost" id="photoSaveBtn" type="button" disabled onclick="saveProfilePhoto()">সংরক্ষণ করুন</button><button class="btn ghost" type="button" onclick="removeProfilePhoto()">ছবি সরান</button><p class="muted" id="photoMsg">ছবি বাছলে এখানে প্রিভিউ দেখা যাবে। সংরক্ষণ করুন চাপলে হোমপেজের প্রোফাইল কার্ডে এই ছবি দেখা যাবে।</p><p class="muted">ছবি শুধু এই ব্রাউজার / ডিভাইসে সংরক্ষিত হবে — অন্য ফোন / পিসিতে দেখা যাবে না, আর ব্রাউজার ডাটা মুছলে মুছে যাবে।</p></div></div>
 <h3>Profile Update</h3><label>নাম*</label><input id="profileNameInput" value="${esc(_pi.name)}"><label>ইমেল* (disabled)</label><input disabled value="demo@example.com"><label>নম্বর*</label><input id="profilePhoneInput" value="${esc(_pi.phone)}"><p><button class="btn" onclick="saveProfileUpdate()">Update Profile</button></p><p class="muted">নাম ও নম্বর আপডেট করলে প্রোফাইল হেডার, এই ফর্ম এবং হোমপেজের প্রোফাইল কার্ড — তিন জায়গাতেই নতুন নাম দেখা যাবে। এটি শুধু এই ব্রাউজার / ডিভাইসে সংরক্ষিত হবে।</p>
 <h3>Change Password</h3><label>পুরাতন পাসওয়ার্ড*</label><input type="password"><label>নতুন পাসওয়ার্ড*</label><input type="password"><label>কনফার্ম পাসওয়ার্ড*</label><input type="password"><p><button class="btn" onclick="demoMsg('Update Password')">Update Password</button></p>
 <h3>Theme Color</h3><p><span class="swatch" style="background:#ff4961" onclick="document.documentElement.style.setProperty('--accent','#ff4961')"></span><span class="swatch" style="background:#0f766e" onclick="document.documentElement.style.setProperty('--accent','#0f766e')"></span><span class="swatch" style="background:#2563eb" onclick="document.documentElement.style.setProperty('--accent','#2563eb')"></span> <span class="muted">বর্তমান অ্যাকসেন্ট: #ff4961</span></p>
 <h3>Cards Lists (All Time)</h3><p>NID: 1, Smart NID: 3, BRN: 1, Server Copy: 0, OTP Server Copy: 0, Sign to Server Copy: 0, Tin: 0, NID Correction Form: 0</p>
 <h3>লগআউট</h3><p><a class="btn accent" href="#/logout">লগআউট</a></p><p class="muted">লগআউট পেজটি প্রোটোটাইপ — এতে কোনো সার্ভার লগআউট হয় না, শুধু লগআউট পেজ দেখায়।</p></div>`}
 else if(hash==='devices'){h+=`<div class="card"><h2>ডিভাইস</h2>${tableHTML(['SL','IP','DEVICE ID','PLATFORM','SESSION','ACTIVED','CREATED','ACTION'],[['1','•••.•••','-ID','Android','Expired','—',''],['2','•••.•••','-ID','Linux / Chrome','Expired','—',''],['3','•••.•••','-ID','Android','Active','—',''],['4','•••.•••','-ID','Linux / Chromium','Current','—','']],'<button class="btn ghost" onclick="demoMsg(\'সেশন রিমুভ\')">Remove</button>')}<p class="muted">কোনো আসল IP / ডিভাইস ID এখানে নেই, কোনো সেশন সরানো হয় না।</p></div>`}
 else if(hash==='logout'){h+=`<div class="card"><h2>লগআউট</h2><p> লগআউট করা হয় না — এই পেজ শুধু কাঠামো দেখায়।</p><button class="btn accent" onclick="demoMsg('লগআউট')">লগআউট</button></div>`}
 else{h+='<div class="card"><p>পেজ পাওয়া যায়নি। সাইডবার থেকে বাছুন।</p></div>'}
 m.innerHTML=h;
}
function selectOpt(el,price){document.querySelectorAll('#opts .opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');const n=$('#totalNote');if(n)n.textContent=`এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ${price} টাকা কাটা হবে।`}
function openAutoload(id){
 if(id==='brn'){showModal('Autoload Information','<label>Birth Registration Number*</label><input><label>Date of Birth*</label><input><label>Captcha Text*</label><input><p><button class="btn ghost" onclick="showModal(\'\',\'Calculate, কিছু লোড করা হয়নি।\')">Calculate</button> <button class="btn" onclick="demoMsg(\'Load\')">Load</button></p><p class="muted">Hint: Try it yourself.</p>')}
 else{showModal('Autoload Information','<label>এনআইডি / পিন নম্বর*</label><input><label>জন্ম তারিখ*</label><input><p class="notice">১০ টাকা কাটা হবে।</p><p><button class="btn" onclick="demoMsg(\'Load\')">Load</button></p>')}
}
function randomBRN(){const code=Array.from({length:4},()=>String.fromCharCode(65+Math.floor(Math.random()*26))).join('');$('#brnOut').textContent=` কোড: ${code} •  QR লিংক: demo.nagarikseba.com/qr/${code} (আসল সরকারি লিংক নয়)`}
$('#sidebar').innerHTML=navHTML();
$('#sidebar').addEventListener('click',e=>{if(e.target.closest('a')&&window.innerWidth<=800)document.querySelector('.sidebar').classList.remove('open')});
window.addEventListener('hashchange',render);render();
/* ===== Step 2 (staging only) — API wiring, design preserved =====
   Single configurable base URL. Production: change this one value to the
   deployed API origin (see staging README deployment note). Locally it
   defaults to the Step 1 server on :3100. Token lives in sessionStorage
   (cleared on logout / tab close); profile photo stays localStorage-only
   (no photo-upload endpoint exists in Step 1) and is listed as remaining.
   No personal-data delivery: an "order" here is only a request record +
   wallet/status workflow; result_text is an admin note, never a document.
   Signature canvas is untouched and needs no backend. */
const API_BASE = window.API_BASE || localStorage.getItem('ns_api_base') || '/api';
const NS_STATE = { user: null, wallet: null, services: [], orders: [], recharges: [], logs: [] };
const nsToken = () => localStorage.getItem('ns_token') || sessionStorage.getItem('ns_token') || '';
const nsSetToken = (t, remember) => {
  if (!t) { localStorage.removeItem('ns_token'); sessionStorage.removeItem('ns_token'); return; }
  if (remember) { localStorage.setItem('ns_token', t); sessionStorage.removeItem('ns_token'); }
  else { sessionStorage.setItem('ns_token', t); localStorage.removeItem('ns_token'); }
};
async function nsCall(path, method, body) {
  // Step 20: same-origin /api proxy + one retry on network failure only
  // (HTTP errors are not retried). A transient network blip must not
  // surface as "Failed to fetch" on the first attempt.
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(API_BASE + path, { method: method || 'GET',
        headers: { 'Content-Type': 'application/json', ...(nsToken() ? { Authorization: 'Bearer ' + nsToken() } : {}) },
        body: body ? JSON.stringify(body) : undefined });
      let j = {}; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
      return j;
    } catch (e) {
      // Only a thrown fetch/network error is retried; a server error
      // thrown above (j.error / HTTP status) must not be retried, so
      // distinguish by re-throwing non-network errors immediately.
      if (e && e.message && (e.message.startsWith('HTTP ') || /^[a-z_]+$/.test(e.message))) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}
async function nsRefresh() {
  try { const s = await nsCall('/services'); NS_STATE.services = s.services || []; } catch (e) {}
  if (!nsToken()) { NS_STATE.user = null; NS_STATE.wallet = null; NS_STATE.orders = []; NS_STATE.recharges = []; NS_STATE.logs = []; return; }
  try { const m = await nsCall('/me'); NS_STATE.user = m.user; NS_STATE.wallet = m.wallet_bdt; } catch (e) { NS_STATE.user = null; }
  try { NS_STATE.orders = (await nsCall('/orders')).orders || []; } catch (e) {}
  try { NS_STATE.recharges = (await nsCall('/recharges')).recharges || []; } catch (e) {}
  try { NS_STATE.logs = (await nsCall('/me/login-logs')).login_logs || []; } catch (e) {}
  nsSyncPrices();
}
function nsSyncPrices() {
  if (!NS_STATE.services.length) return;
  const byId = {}; NS_STATE.services.forEach(s => byId[s.id] = s);
  SERVICES.forEach(s => { const a = byId[s.id]; if (a && a.base_price_bdt != null) s.cost = a.base_price_bdt; });
  ORDERS.forEach(o => { const a = byId[o.id]; if (!a) return; if (a.base_price_bdt != null) o.cost = a.base_price_bdt; if (a.options) o.options = a.options; });
}
function nsOrderPayload(def) {
  const card = document.querySelector('#main .card') || document;
  const vals = [...card.querySelectorAll('input,select,textarea')].map(el => ({ label: el.closest('label') ? '' : '', value: el.value || '' }));
  // Map values to the page's field labels in order (inputs are rendered in field order).
  const fields = (def.fields || []).map((f, i) => ({ field: f, value: (vals[i] && vals[i].value) || '' }));
  return { fields };
}
let NS_SEL = null;
const _origSelectOpt = selectOpt;
selectOpt = function (el, price) { NS_SEL = el.textContent.trim(); _origSelectOpt(el, price); };
const _origGetProfileInfo = getProfileInfo;
getProfileInfo = function () { if (NS_STATE.user) return { name: NS_STATE.user.name, phone: NS_STATE.user.phone }; return _origGetProfileInfo(); };
const _origSaveProfileUpdate = saveProfileUpdate;
saveProfileUpdate = async function () {
  if (!nsToken()) return _origSaveProfileUpdate();
  const nameEl = document.getElementById('profileNameInput'), phoneEl = document.getElementById('profilePhoneInput');
  const name = nameEl ? nameEl.value.trim() : '', phone = phoneEl ? phoneEl.value.trim() : '';
  if (!name || !phone || phone.replace(/\D/g, '').length < 10) { showModal('প্রোফাইল আপডেট', 'দয়া করে নাম ও সঠিক নম্বর (কমপক্ষে ১০ ডিজিট) লিখুন।'); return; }
  try { const m = await nsCall('/me', 'PUT', { name, phone }); NS_STATE.user = m.user; render(); showModal('প্রোফাইল আপডেট হয়েছে', 'সার্ভারে সংরক্ষিত হয়েছে — হোমপেজের প্রোফাইল কার্ডে নতুন নাম দেখা যাবে।'); }
  catch (e) { showModal('প্রোফাইল আপডেট', 'সংরক্ষণ হয়নি: ' + e.message); }
};
activityLogsHTML = function () {
  if (NS_STATE.logs.length) return '<ul>' + NS_STATE.logs.map(l => `<li>${esc(l.created_at || '')} — ${esc(l.ip || '—')} — ${esc((l.user_agent || '').slice(0, 60))}</li>`).join('') + '</ul>';
  return '<p class="muted">এখনো কোনো লগইন রেকর্ড নেই</p>';
};
ordersLogsHTML = function () {
  const count = (id, st) => NS_STATE.orders.filter(o => o.service_id === id && o.status === st).length;
  return '<div class="orders-logs">' + ORDERS.map(o => `<section class="ol-section"><h4 class="ol-head">${ico(o.id)}<span>${o.name}</span></h4><div class="ol-grid">` + OL_STATUS.map(s => `<div class="ol-tile ol-${s[0]}"><span class="ol-circle"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">${s[2]}</svg></span><span class="ol-label">${s[1]}</span><b class="ol-count">${count(o.id, s[1])}</b></div>`).join('') + `</div></section>`).join('') + '</div>';
};
async function nsOrderSubmit(kind, id) {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'অর্ডার করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const def = kind === 'service' ? SERVICES.find(x => x.id === id) : ORDERS.find(x => x.id === id);
  if (!def) return;
  let option_name = null;
  if (kind === 'order' && def.options) { const sel = document.querySelector('#opts .opt.sel'); const txt = sel ? sel.textContent.trim() : ''; option_name = txt.replace(/\s*\(.*$/, ''); }
  if (kind === 'service' && id === 'sc') { const sel = document.getElementById('apiSel'); option_name = sel && sel.value === '5' ? 'API ৫' : 'API ৩'; }
  try {
    const r = await nsCall('/orders', 'POST', { service_id: id, option_name, payload: nsOrderPayload(def) });
    NS_STATE.wallet = r.wallet_bdt; await nsRefresh(true); render();
    showModal('অর্ডার সফল', `অর্ডার #${r.order.id} — ${r.order.amount_bdt} টাকা কেটেছে, স্ট্যাটাস: ${r.order.status}।`);
  } catch (e) { showModal('অর্ডার হয়নি', e.message === 'insufficient_balance' ? 'ব্যালান্স কম — রিচার্জ করুন।' : e.message); }
}
async function nsRechargeSubmit() {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'রিচার্জ করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const amt = +document.getElementById('amt').value, method = document.getElementById('rchMethod').value,
    sender = document.getElementById('rchSender').value, trxid = document.getElementById('rchTrx').value.trim();
  if (!amt || amt < 100 || !trxid) { showModal('যাচাই', 'সর্বনিম্ন রিচার্জ 100 টাকা, আর TrxID লাগবে।'); return; }
  try { const r = await nsCall('/recharge/request', 'POST', { method, sender_number: sender, trxid, amount_bdt: amt }); await nsRefresh(true); render(); showModal('রিচার্জ অনুরোধ', `অনুরোধ #${r.recharge.id} — ${r.recharge.amount_bdt} টাকা, স্ট্যাটাস: pending। অ্যাডমিন approve করলে ব্যালেন্স যোগ হবে।`); }
  catch (e) { showModal('রিচার্জ হয়নি', e.message === 'trxid_exists' ? 'এই TrxID আগেই ব্যবহার হয়েছে।' : e.message); }
}
async function nsZammpayStart() {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'রিচার্জ করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const amt = +document.getElementById('amtAuto').value;
  if (!amt || amt < 100) { showModal('যাচাই', 'সর্বনিম্ন রিচার্জ 100 টাকা।'); return; }
  try {
    const r = await nsCall('/recharge/zammpay/initiate', 'POST', { amount_bdt: amt });
    sessionStorage.setItem('ns_zamm_trx', r.zammpay_trx);
    location.href = r.payment_url;
  } catch (e) {
    showModal('অটো পেমেন্ট শুরু হয়নি', e.message === 'zammpay_not_configured' ? 'অটো পেমেন্ট এখনো চালু হয়নি — ম্যানুয়াল পেমেন্ট ব্যবহার করুন।' : e.message);
  }
}
async function nsZammpayPoll(cancelled) {
  const trx = sessionStorage.getItem('ns_zamm_trx');
  const el = document.getElementById('nsZammStatus');
  if (!trx) { if (el) el.textContent = 'এই পেমেন্টের তথ্য পাওয়া যায়নি — রিচার্জ ইতিহাস দেখুন।'; return; }
  if (cancelled) { if (el) el.textContent = 'পেমেন্ট বাতিল হয়েছে — কোনো টাকা কাটা হয়নি, ব্যালেন্স যোগ হয়নি।'; sessionStorage.removeItem('ns_zamm_trx'); return; }
  for (let i = 0; i < 12; i++) {
    try {
      const r = await nsCall('/recharge/zammpay/status?trx_id=' + encodeURIComponent(trx));
      if (r.status === 'Completed' && r.credited) { if (el) el.textContent = `পেমেন্ট সফল — ৳ ${r.recharge.amount_bdt} ব্যালেন্সে যোগ হয়েছে। নতুন ব্যালেন্স: ৳ ${r.wallet_bdt}`; NS_STATE.wallet = r.wallet_bdt; sessionStorage.removeItem('ns_zamm_trx'); await nsRefresh(true); return; }
      if (r.status === 'Completed' && !r.credited) { if (el) el.textContent = 'পেমেন্ট সম্পন্ন দেখাচ্ছে কিন্তু অ্যামাউন্ট মেলেনি — সাপোর্টে জানান, ম্যানুয়ালি যাচাই করা হবে।'; sessionStorage.removeItem('ns_zamm_trx'); return; }
      if (r.status === 'Canceled') { if (el) el.textContent = 'পেমেন্ট বাতিল হয়েছে — ব্যালেন্স যোগ হয়নি।'; sessionStorage.removeItem('ns_zamm_trx'); return; }
    } catch (e) { if (el) el.textContent = 'যাচাইয়ে সমস্যা হয়েছে: ' + e.message; return; }
    await new Promise((res) => setTimeout(res, 3000));
  }
  if (el) el.textContent = 'পেমেন্ট এখনো Pending — SMS যাচাই হতে কিছু সময় লাগতে পারে। কিছুক্ষণ পর রিচার্জ ইতিহাস দেখুন।';
}
function nsLoginLogoHTML() {
  return '<div class="ns-login-logo"><img class="ns-logo-lockup" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCAMIA4QDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7+ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo74pOM0ALRSEc0cUALRSYFGBQAtFJxRkZxmgBaKMijIoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKO4oAT+KoZru3tgPPmjjJ6b2AzU/evnb9qbT7lPC2m69azTR/Z5vLfynK9ehOO1XCPM7HFmGLeEoSrJXse/rqFoygi5hI/3x/jUiXETdHU/Q5r82/7T1NSMarejPbzm/wAauQ+KfFFvxb+JdSiA4+Wdv8a7PqL7nxceO6b+Kmfo15qhckilEgK5HP0r8/LX4o/ES0IaDxhqIwc/O+7+ddDY/tBfFCywf7ct7oDtcW4bP5EVMsFJbHZT43wktJxaPuMNxml4NfJGmftVeKIVVdY8P6ddAdWt5HiY/hyK7fSf2qvCU5VdX0fU7HIxvG2Vc+nBz+OKxeGmj1aHE+AraKdj3/A96UYHauC0L4xfDvxCwSx8TWSSnH7qd/Lbn6120VzDMgkhkWRCMhkOQaycGtz2KOKo1lenJMnyBQGB9abnIz/Kl5xUm6Y6ikzgc0A57GgYtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABR3FFFACd64f4r+HR4n+E2t6asYaU27SRcZ+ZRkV3B4OajlQPG6kAgjGD3pxdmmYYmiq1KVOXVH5oMhRgkq7XX5WHoRwaaMcnFdz8WvDLeFPi1qumNGy27v9qgcjG6NuT7cHNcMOOD35r3qcuaKZ+B4zDvD1pUpbpiZyehpcAHO2kDZPSnZq7nKxpGDkD8KTcyj7o59zTieKbn2oGmHBxuCnHYqP/110mhePfFvhiYNoviC8t0znyvMLJ+TE1zXPPFGOMYqZRUt0dFHF1qL5qcmj6L8H/tR6ja3Edp4v0v7VEcD7Za/KV+q4/rX0D4V+IvhLxlaCbQdYguH/igJCyJ9VNfnsrEDlSR2GSKntby5srtLuzuJLe4Q5SaI7WX6EVxzwaldxPq8s4wxND3a3vRP0sEisBjmnZ9q+SPh5+0nqGltDpXjNHvLRVCi/QHzEAGAW9frX1Houu6Xr+lx6hpF9Fd28gyrxNkf/WrgqUZQdrH6HlucYfHxTpS17GpnnGKWk+lISc4xWR6w6iiigAooooAKKKKACiiigAoooOe1ABRSc+1HNAC0UmSKN1AC0Um6gEmgBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBpGWoIBJIp1NOMmgD52/ai8KLe+G7DxXDExexcxTle8bev418qH7wDHP0r9GvFWgWvibwhqGh3sayRXULRkNnGSODx6HBr89dc0e70HxJe6LfxFJbWVoiT3AJAb8QM16mDqXjys/LONMudOusRFaMzRjtTj0pqHavPWjNdh8K9NAzRRRTQIUYo2nGQOKStDTprNJDHqELNbuPmeP/AFie69uO+aZcVd2KGSO3FByemAK3dX8N3Wl6db6pbyxX2l3OfKvYASg9fMHVTWCQwAJHWlcqdKUHqKHdSCTn3Pcen0rr/AXxG8Q/D7XUuNJmeW0yPtFg3KSc9h2PvXIZB6jPtTSpDZOc0pRUlZm+FxdTDTVSm7M/QfwB8QtF+IHhqLU9IuVDjie3Y/NG3df/AK9dgDkjnrX53eBvGur+BvFMWsaXK67WHnQAjbMndSP6jmvu3wX4v0vxp4Vttd0q4WSCZeU/ijbupryK9B03dbH63w9n0cxp8k9Jr8TpBnfzTqPfNHeuY+mCiiigAooooAKKTn1o5xyaADJz7UmTS5GMZqOVxGpJcDHrRa4m7atjwSe9Lk1zGs+PfCGgAHV/EFjbE5wrzDJI68VweqftI/DfT2K217cXzYPEERI/M1oqU30OGtmeFo/HUR7EW56UoOe1fNt9+1jpSuyab4XvJfQzOEyfpXP3n7VviVwRYeFbCP086dmP4gCrWGm+h5lTijL6e9S/ofWPXpRknpXxzJ+0/wDEFmzHZaLGTzt8tzj2616h8D/ib42+IWtaj/bRsFsrSNMfZ4iMu3bJpToSgrseD4lwmLqqjSbb9D3fPTFLSDoMUvesT6EKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACk7mlooAQgEHivln9pzwD5V1B4702DCt/o16qgAE/wADn1OeM19TZySKyPEehWPiPw1d6LqEW+2uYzG4+ta0ZuEkzy84wEcdhpUpfI/N87lfBUUV0HjDwpeeC/GF94e1DJa3f90+P9bH/C1YIbCkV7UJKSufhuKoToVHTqLVDaKXBxmkqzBCgZBoDHGcZwe9ApwUFSaBnUeD/GVx4a1F47i0i1DSLr5L3T5xujnU98HgN6Gun8bfDO1Xw4njjwJJLqHh+f55YScyWmOqnPYV5gpxz2r0n4Q/EabwR4me1vm83Qr9tt1DJyqHpvA96wqXXvRPay6rSr/7NiNE9n2PNChz8uCOxHINIpw2G5+te2/GT4SxaHjxh4TAl0C6HmvDENwt93zblx/C2c14oR82QQQeRV06imrnHmGBqYOo6dQa24HjJNer/A/4jSeBvGaWF9MRpGosFlTccRueFYDp1xk15TjLU5RkFGO1Twx7gdzRUipx5RYDGzwlaNWn0P0tgmSaJZUbcrLuDA8EdsVMOuc14t+zx4+PijwING1CYNqWljyW55kj/hb8OBXtKkHpXiVIckmj9ywGMji6Ea0NmKDnNLRSZ5xUHaHXIpOnegAAk1Bd3ltZ2r3N1MkUSD5nkYKB9SelFn0FKSirt6ExYAc5rnfE/jnw34QsTc6/qcNqMEhWOWb2UdzXhHxK/aOaKaTRvAmx8Aq+osML6fIP61856nqupaxfyajq19Ld3Tn5pJTkmuylhJS1kfF5vxfQwzdPD6yPozxb+1J80lt4O0jfg4F1d9OvUKOteM6/8V/H/iSR/wC0/El4sTHPkWzmBB+CkZ61xoY7d1JgNyxrujh4R2R8HjeIsbi2+abS7IR2Mspll/eO3JZ+SfxNOyyjAXGaTavakIFbpWPFlUlLVtjtzY24pM4UqVGRSYpcfLimQKpJKgV9lfs3eHjpfwjjv5kxLqEp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KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEIFHFLRQA09aCMj3pcD0o4FAhuzPeopbS3mB8yGN/8AeUGp8ikz7U02hShGXxK5Sg0rToLgTw2MEci9HWMAj8abrOnwapoN5p0yB454XjKnvkYq+MYzSSDK59utCbvczdGHI4JWTPzc1vT5tJ1+90qT71tcPGfwP/6q1fAXiSXwj8RNJ16EkLBOFmH96Njhh/X8K3/jhpa6T8c9cgjVVSYpchV4A3j/AOtXnSkHAxnnn6f5Ir2Yrnpn4bXUsFjXb7LPrb9prUEn+DWnPBIGguL+EgjkOpBIr5Lbjk16z4o8bWniH9mLw7pN5OW1SzvPLMbHJIjHBPthhXkzqyptPUHn61OHjyxsd3EmKji8RGpF7pANhbNMbG44NLgHjIBpBsZ9qFSe+WFbKSZ4CozeyYnB6UhB3ZxxWxpvhjxJq0gXTfD2pXOTgeVbtjn3NeieH/2d/iJrWDe21vo8OcFrklmA9cDrUyqxjuztoZVi6ztCm2eSIMnJDAe3Ndl4M+HHizxzdrDo2mt5B+/dyqUROR69etfSng/9mvwhocUdxrkkmuXanJE2FiB/3Bwfxr2ax0+x0+zjtLG2it4UXCxxKAoH4VyVcYton2GWcFym1LGOy7I82+GHwX0HwJbreShb/VyoD3TA4XGeFHQdeuK9SCKO3SnDH5UAgnpXBOcpO7P0LCYOlhYclFWQDByBSqMCgDHalqTqCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACg9KKKAE7U2TG3J6U49O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BgfQU/t1oIBFYGlgwD0NBGe9AAFLQAYooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApMDPSlooAMCjAoooAMCjApM8kUAHuaAEI9DQAcc0ZAByazNY8Q6R4f0uXUdb1K20+1jBLTXEgVRgZ/Gmk5OyE2luafGMZxR0718/eLP2vPhZoDPBpMl74guV4AsY8R593bpXkWsftxeJZJ3TQ/BGmQJn5Wvbh2fH+6vFejQyfGVleMNDnli6Ud2fb24etGfevz+f9tf4omTK6F4fA9NkvH45rSsf23PiDEQ194U0C4TuEeSM/rXU+HcalpEj69R7n3eSKT8a+SNB/bk0aWRU8TeCL20ycebY3CzqB/ukA+tereHv2nPg74ikSFPEo0+5b/ljfxmEj056frXFVyvFUvips1hiaUtmexHOOKKzNK1vStZtRc6TqlrfxEbg9vKrqB9RWmjBl4INcLTTszZNPYAD3p2BSZB5BpDkmkMdgUYFIM96WgAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKMCiigAwKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKT+KgA2/MTmmkhc04nGa+c/2lPj2vw90g+E/DFyh8TXqEF1IP2KM/xn0Y9hW2Gw08RUVKnuzOrNQjzMu/G79pbQfhor6FogTV/EZBxEp/dW3vKa+FPG3xF8ZfELXW1XxRrM945/1casVhjHoqg4I9yM1z93cy3t1LdXVw008xLPJJ3JOST7k81COY9x4wM81+kZbk1HCR1V5dzwcRipVX5ACxXOBj0px3NHnAIqfTtM1LVtSGn6XY3F9etwttbxNJI3/AVBNe1eF/2T/jF4jtI7m90200SJxuX+0JQHx2+ReR+Nd+Ix+Hw2lSVjCNCpPZHhnlsRyT9KACD0Bx6ivqyD9h7xe8Ye48ZaOj90EDnH41V1D9iTx5Cm/T/E+iXRAOUZXj+nOK4Vn+CvbnNvqNW2x8wb3J3enFI2WXcyqfYgGvYPEX7Lnxo0KNpB4WTVIFG4vp1wJj9Nhw2eOwxXlmseH9d0G48jW9E1HSphwYr23aFvyb1rsp4/DV/gmjN0akd0SaL4l8R+GtSTUfD2uajpVyvIe1mKg/Vc4P5V7/4D/bH8eaEYrfxZa2viG2HBdf3Vyff0NfNig/eDA59KV946EnNZ4jLcPil+8j8xwxE6b0Z+m/w+/aI+GnxASKCy1ldO1JyF/s/UP3UuScAelereYjIGVgR14NfjgrtG25WHHIPp717j8Kv2mfHfw8MenapdyeINEGAbe9OZYlx0jf09jXyuO4XlBOeHd12PSo5inpUR+kGeRS965jwF4wtvHfgHTfFVlZXVnb3se9IrlCrD356j0NdRjnNfJuLi3F7npp3V0FFHc0UhhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUdqACjIpMijj0oAXIoyKTij8KLgLkUZFJ+FL+FK4BkUZFH4Un4UwFyKMik/Cl/Ci4BkUZFH4UfhRcAyKMik/CjigBcijIpPwpfwouAZFGRR+FH4UXAMijNJkelAIoAWijPOKM0AGaMikJGelHHpQAuRRkUnHpRkUALRSFgKMjFAC5FGRScelHFABkZFH8X4UcelH4UAYvivXbXwz4L1TX72QRw2Ns87Mc4wF9q/KLxZ4o1Pxf401HxVqczvcX8zS7HOdi5+UD2xX6EftX6jc6d+y7rrWzFWuJIbdiP7ryAH9K/OFgDJtIwBxX2vCmGi4yrPfY8bM6juoiLsOVIxzxXoXwi+EXiH4u+MhpemN9l062Ob7UGH+pXPGPVvQfnXnYzlj6AkV+mP7OPg6w8I/s/eH/s8Si51G2S+upccyPIu4ZPtXrZ9mMsHQXL8UvwOfB0FVlZm78N/g/wCCvhpoMdl4d0iJZsAy3kyh5ZW7sSemfau/VRv3bTz604cY4o5LYr82qVZ1Zc03dnvwgoqyFxz04owB2pMGjBqLlCMvOFyPftWZqmgaPrFs9pqul2l7buMNHPErL+HFamDml74xTU2tUxNX0Z89+O/2Rfhn4rSS60W2k8N6gSWWayP7sn3TpXyh8Sf2bfiR8O2kujp51zSFJLXtim5gM8EoDuz9BX6Zc56U1o1KkFAwPUHkV6+CzzE4Zq8uZeZyVcFTqdLH44Bf3o25O0/MCCMfWvQvgx8OdQ+J/wAVLDQIopEsEIub+bbxHGpzyffAGOvNfb/xS/Zi8BfEMTahZ2iaBrbKcX1kuA5xwHToRn0q3+z/APBh/hL4PuodTa2n1q9nL3NzbnKlRwoGfbkivfxHEtOphXyK03ocVLASjUtLY9Y0vTbTSdIttNsYFhtreMRRxqMBVAq9nn2o/lQOuMV8S5Xd2ewlZWQZ5pcik/Cjj0ouMXIoyKT8KPwpXAXIoyKTj0o49KdwFyKMik/Cj8KV0AuRRkUnHpRx6U7gLkUZFH4UnHpRcBcijIpOPSjj0ouAuRRkUnHpRx6UXAXIozScelH4UrgLRSA5paYBRRRQAUUUUAFFFITigBaMikJFGR6UALkUZFJx6UcelAC5FGRSfhRx6UXAXIoyKTI9KOPSi4C5FGRSZHpRx6UXAXIoyKTj0o49KLgLkUZFJ+FH4UXAXIoyKT8KX8KLgGRRkUnHpRx6UXAXIoyKPwpOPSi4C5FGRSZHpRxQAuRRkUnFH4UALkUZFH4Un4UrgLkUZFJx6UcelFwFyKMik49KOPSncBcijIpMj0oyPSgBcijIpMijI9KAFooziigAooooAKQ4xS9qaOmM0AIzbRk00SKT94fia83+PvinW/BfwC13xN4dvfsmo2aI0UuxXxlwCMMCOhr4h/4am+N0Zx/wmETdjusIu3GeBXp4DKa2Ni50tkc1bFRpOzP0n3A9CD9KXJr82v8Ahqr43DH/ABVcH/gDHUi/tW/G0L/yM9sfrYxmvQ/1XxfkY/2hTP0iyfWjJ9q/N8ftX/G0Lj/hJbMn1NglNP7V/wAbSpH/AAk1qD6ixj/wo/1XxfdfeH9oUz9HzMoOCRS7/wDbX86/Nk/tV/G/P/I2wf8Agvh/wp3/AA1T8bv+hrg/8AYv8KP9WMX5C/tCmfpIHyeGU/jTsn1Ffm1/w1V8bh/zNcH/AIAxf4Uo/at+N2MHxVbfX7BHR/qxi/IP7Qpn6SZPtSFiP/rV+bn/AA1b8bs4Pim2x/14R/4Uf8NWfG4H/ka4P/AGL/ChcL4t9V94f2jSP0j3GjJ9q/Ns/tWfG/PHi23/APACL/Cmn9qv43hv+Rstj9bGMfyo/wBV8X5B/aNI/SfcfUUm41+bn/DVvxu2f8jVbZ/68Y6P+GrfjhjjxZb/AE/s+H/Cl/qxi+6D+0KZ+kIlBONw/OnZbGSRX5t/8NV/G7/oa4P/AAAh/wDiaG/aq+NpXH/CWQKfX7DEf6Uf6s4vyD+0aZ+kbNheooU5Hf8AGvzb/wCGqfjdJhP+EuhAyMkWEP8A8TX2N+zb428R+P8A4G2viHxRfC8v2u5ojIIwnyq2BwK4Mdk9bBxVSraxrRxUasrI9hJwelB5prORztyO59Kz9a1/SPD2jzarrWoW9lZQqWeeZ9qgV5tm9EjqbS3NEsB1IFJv7AH8q+O/iL+2ksV5Lpvw40lLpAxT+07vIUnuVTHI6YOa+fvEHx7+LXiOeRrzxzqUCuf9VZsIUXtwAMj869vC8PYqsuZ6LzOOpjqcPM/UXJHX+VIJM9AT9K/JuP4kfEGE5j8eeIge+69dq7/wn+1N8XfDcqx3GuprdsuB5WpR72I9A4wR+VdNThbExV4STM1mMHuj9J+KRmCivn/4U/tWeDPiBdRaLrKjw9rjEKsFy+YpCTgBHIGT+Fe/JIsqqyMrKcEEdxXgV8PUoS5aisztp1IzV4grlmxg49T3p/4ivgb4qftH/F7wx8bfEugaN4lhh0+yvDBDE1nE20AA53EZ71yX/DV/xuJ/5Gq3GeOLGL+or16PDmKqwU01ZnNPHU4ycWfpIWC9SKUMDyCMV+a7ftV/HHd/yN0B/wC3CH/ClP7Vnxv28eLYf/ACH/4mtf8AVfF90R/aNM+3Pj54Zl8X/s++JtFtkD3JtfOhXGcsh3f0r8wJCeCykNjBB7HvXrzftS/G6WFkk8XxHdwR9ghwR3H3e9eSXVzPfXst7dSK88zmSQqgUFicngcD8K+lyHA18DGVOrszz8ZWjWacSEDcSBxkY5r9KP2a/HVh4x+AukQQSqbzSoVsLqLILIUGFOB2Ir82OpyeK6zwJ8TfGnw2u7u58HawLB7wKJw0QkD7enB4zXRnmVvHUVGGjROEr+xlqfq+GwvJpvmDP3hX5vr+1Z8btuD4tt//AAXw/wDxNNb9qv43kceLIPr9gh/+Jr5L/VfF91956P8AaNPsfpKHz0NGTX5tj9qz43gf8jVB+NhD/wDE0D9q3434P/FVwf8AgBD/APE0f6r4vuvvH/aFM/STJ9RRk1+ba/tWfHAD/kbbc/XT4f8A4ml/4at+N5/5mq2+v2CL+go/1XxfdfeH9oUz9ITKoOCwz9aUPmvze/4at+N+P+Rptv8AwAh/wpv/AA1f8cO3iy2H/cPh/wDiaP8AVfGd194/7Qpn6S545/nTfMXs1fm4/wC1X8bSw2+K4B/24x/4UjftWfG7Hy+LLf6/2fD/APE1S4WxndfeJ5jTR+kgck8frSl9o5Ir82h+1b8cNuD4stj/ANw+EfyFK37VnxuKgDxXbg+1hF/UUnwvi11X3i/tGmfpGr7icEcU7J9RX5sH9qr43Aj/AIq2A/8AbhEP5Cnr+1b8bcf8jVB/4Axf1Wl/qxi+6D+0aZ+kmT6ijJ9a/Nz/AIau+NuP+RotvxsIv6CkP7VvxuK4Him2B9fsMf8AhR/qvi+6+8f9o0z9I85or82x+1X8bh/zNduf+3GOkP7V3xuP/M023/gDH/hR/qvi+6D+0aZ+kuTigtgZJ4r82f8Ahqz43k/8jdD/AOAEP/xNL/w1V8b88+L4f/BfD/8AE0/9VsX3X3h/aEOx+kRlUd/5U5XDdCK/NsftVfG7PPi2DH/XhD/hS/8ADVfxu/6GuD/wBiH8hR/qvi/IX9o0z9Jcn1FJk5r82v8Ahqz43Dg+KoD7mxjpP+Gqvjf0/wCEugH/AG4Rf1Bo/wBV8X5D/tGmfpNk0Zr82f8Ahqv44Bv+RvgP/bhD/wDE0H9qv43n/mboh/24w/8AxNH+rGL8g/tGmfpN2pN49RX5sn9qr43n/mbov/AGH/4mg/tU/HDIH/CXQj3+wQ//ABNH+rGL8g/tCB+k24/SlDcgZr82k/aq+N2Pm8WQsP8ArxiH8hX1p+zB8QfFXxH+GN9rHizUVvLuC/a2V1iVBtCg9B9f0rixuTV8HD2lS1jaji41Xyo9z74pabnk8UoHXmvIR1C0UUUwCiikJ44oACcCk6rmgH5eRTZJQinpxyRnpSAVjtHIzQHB4714f8WP2mvBfw4L6baOut61tOLW2kGyP/fbt24r5Z1n9rj4x3+qPcafqlnpMD8rax2qS7B7sw5/IV62DyTFYlc0FZeZyVMZTpuzP0X/ABFGcHGRX5sj9qv44L18WW7fWwi/oKd/w1b8buv/AAlluPYafCf5iu7/AFYxnkY/2jTP0iMgBwSKaZhmvzcb9qz44Hp4ttx/3D4f/iaZ/wANUfG//ocIv/ACH/4mj/VfF90H9o0+x+k3mp/eFHnDNfm1/wANVfG//oboP/ACH/Ck/wCGqPjeR/yN8Q/7cYf/AImj/VjF+Qf2jT7H6T+YuM5FIZV9QfpX5tD9qr44AYPi6E/9uEP+FB/ap+N+P+RuhH0sIf8A4mj/AFYxfkH9o0+x+kwlB6Z/KnB8+31r81x+1T8b/wDob4v/AABh/wDiacP2qfjd/wBDfF/4Awn+lH+q+L7oP7Rpn6TbvcUu4+or82f+Gq/jeRn/AIS6Ef8AbhD/APE00ftV/HANn/hL4P8AwXw//E0f6r4vuvvD+0afY/SjJ9RRk+or82h+1b8bT18VQfX7DF/hSH9qr42t08WxL/25R/4Uf6r4vuh/2hTP0k3qBncPzoDjsRX5sn9qr43kY/4S6H/wBh/+Jpf+GqfjeFx/wl0P1+wQ/wDxNH+q+L7oP7Rpn6Tbj60u41+bQ/aq+OGMf8JdD/4AQ/8AxNIf2qvjeOT4uix/14Q//E0f6r4vuvvD+0KZ+k2TSZOe1fm0f2rfjbjA8WQ/jYw//E00ftWfG/8A6G6E/wDbhD/8TR/qvi+6D+0KfY/SfJ74ppmAODX5sn9qr44H/mcIvwsYf/iaX/hqj43YB/4S+M/9uMP/AMTR/qxi/If9oUz9KNxx1FJk+or82j+1V8bcceLIT/25R/4UD9q343Ac+K7c/wDbjH/hQuF8W+q+8X9o0j9Jcn1FDMFXJIr82v8Ahqz43Ec+K7cf9uMf+FI37VfxuJ48WQD/ALcYj/Sj/VbF90L+0aZ+kYlUnhhTwQehFfmv/wANU/G//ob4R/24Q/4Ug/ap+OGfm8XQn0/0GIfyFH+q+L8g/tGmfpT+NNLhTgsK/Nv/AIaq+N3/AENkP/gFH/hSj9qr43Ef8jZAP+3CI/0o/wBWMX3Qf2jTP0i81c0u8Fc5yPavza/4ap+N2/P/AAl8RHp9gh/+Jr239mH4z/ET4ifFLU9H8W64t7axWH2lEWBEwQ2OwrmxWQ4jD03VqWsjSnjIVJKKPrwfdpaap+QY5pc814p2i0UUUAB6U0d6celN7c0AeN/tS8fsq+Kyenkx/wDoxa/NVvml3YA5P86/Wj4geCdN+Inw+v8Awhq9xcw2V8qrI9sQHGGBGCQfSvCH/Yk+HTgA+IvEeAc8PF17/wANfTZDm9HA0nCp1Z5uMws6srxPhDGcdKGIXAxX3ev7EPw3x83iHxGf+2sf/wART/8AhiT4bjpr/iL8ZYz/AOy173+tWD7v7ji/s+qfBe8elG4f3a+9P+GJPhv/ANB/xD/38i/+Ipf+GJPhv/0H/EX/AH8j/wDiKP8AWrB/0hLL6p8E5X+7S5PoK+9P+GJPhv8A9B/xF/38j/8AiKD+xJ8OCOPEPiL/AL+Rf/EUv9acH/SH/Z9U+CycDOBS5BTpzX3gP2Ifhupz/wAJB4jPp+9j/wDiazPE/wCx14A0TwZqur2uu6801paSzoJGjKkqpPICj0q6fE2Ek7K/3CeAqpXPiMnK4UDPvRnA6CgMGQFWDH1APoOvbvTQNzAKOeT+Qr6KLTVzie4ZUAhhyelNDJnkV9RfAb9mrwl8VfhUvijXNY1i1uftcsAjttirtUjHUHmvTj+w/wDDw/8AMzeIv++ov/ia8GvxHhKNR05bryOyGBqSSkj4PyN+QOKeuc5IGK+6Zf2J/h5BESfEviAhQWwzRDPt92vh/VrZNO16909JHkjt55IVd8bmCsQCccZ47V14HN6ONbVHoZ1sPOl8SKxz2ApjsC3TinjPO30719Cfs8/ALw58XvDGs6prmralaNaXiwIloEAA256sOa3xeNp4Sn7WpsRTpupLlifPMTfMABxmv0O/Y6YD9mKz/wCv+5H/AI/WBH+xJ8Po3B/4SXxERnkbof8A4mva/ht8PdG+F3gVPDOiXtxPYxSvNvumUsCxy2SAK+NzvOKGMoqFLe56mEw1SnPmkbPivxTpHg3wpeeIdevI7aytIy8jHv7D3NfnD8Z/jZrfxb8RzNLNLa6DE2LXTQSo25yHk55Y/gMdq679qT4xy+NvH8/hPR7stoGlOUcJjbcT/wARJH3lAAwOlfPe9mGT19T1r0cgyeNOmq9VavYxxuJ53yxeg4sCTkZJ/DH4Dim7iDnGW96lhguJ50ht4GmmchUjRSWYnsAK+hfAX7IHj3xVZw6n4i1C38OWkwDKkieZOR/u9B6819BisfRwsV7WVjhpUZ1PhR86ly3DKB9KUAdWFfbTfsMeGzZY/wCE+1kTY5b7LCR+WK8q8f8A7JHxA8J20l9oU8fiWxQE7bdBHcAf7p4NcNDP8HVlyKX3ms8HUirtHz6rAYfLFl+7zgj6HqK+qv2dv2nL3StStfBHxCvGubGV1hstRlOWhJ6K56Feg6d6+VZopLe4e3mVkkT5XWVCmxv7pHrTFJVt2ACCCMDoexrqxmBo46lyyXoyKVWVGV0d78apFm/aH8Zyoysp1N9rDkONo5HtXnwVt2SBVu5uZby4e5upHlmdtzOxyScY6/hVZuvPTtXRh6XsqcafYzlLmk2IxKjkDn0pobHUc17P+zt8JNC+L3jPV9I1/UL+0js7FbiJrQoCWMgU53A54r6Pb9iL4dNyviPxEvp88R/9krzcXn2GwtR0qm6N6eEqVI80T4KUsXyRipBwcnpX3d/wxD8PwDnxR4hP4w//ABFfK/xt8B6b8M/jFd+EdKurq4tILeGQTXIG75kzyR71eCzrD4yp7OluFXC1KS5pHnbc9KjYqHBGcZp68PjNehfBDwPpHxJ+NGmeDtZmuo7S6hneSW24PyoSMHtXo4jERo03UnsjCEHN8qPOyQW+Wncsu0bc194t+xD8NiPk8Q+I1/7axn/2Smp+w/8ADkNn/hI/Ef8A38i/+Jrwf9aMH/SOv6hVPg8hl5IBoU+wFfeg/Yj+G4GD4h8Rk/8AXSL/AOIpp/Yi+G7HnxD4i/7+R/8AxNL/AFowf9IP7Pq9j4O3KOuPwpQQRkYx7194f8MQfDXt4h8RD/trH/8AEUh/Yh+G2f8AkY/EY/7aR/8AxFH+tGD/AKQf2fV6nwh/3zTW46ba+8R+xB8N+v8AwkniT/v7H/8AEUg/Ye+G4P8AyMfiQ/8AbSP/AOJqlxRg11f3D/s+qfBokQKR3pykFcY5r7puv2Jvh3b2ctyuv+IXaNC4Vnjw2BnBwua+G54vs91JExYhJXi3MMFsE9h9K9PAZrRx11Sexz1sPKl8RGODkgUAnPAH40fNtJXGfevoj9nX4B+GvjD4V1rUtf1LU7R7K9WCNbTavG0k5JBzW2Ox1PCU/aVNiKVKVR8sT52wwPzAfhRvVeCK+8x+xH8OgTnxF4ix2+eL/wCIoP7EPw3br4h8RZ/66Rf/ABFeL/rRg11f3HT9Qq9j4NDBhkYoyfQV94f8MQfDbv4g8Rn/ALax/wDxNPX9iX4bqoH9v+Ij9ZY//iaX+tGD/pFfUKvY+DcOecLTdyelfen/AAxJ8Nif+Rh8Rf8Af2P/AOIpv/DEHw37eIvEX/fyL/4iq/1pwfn9wvqFU+DAwzyBTsgn7vFfeI/Yk+HCnnxB4ib/ALaRf/E1IP2KfhtjB13xEf8AtrH/APEU/wDWnB+f3B/Z9U+DGKlQFHNHboK+l/2hP2dvCXwn+GVv4j8PajqtxdS3iWzLeOjIFKsxIAA5+UD8a+Z3GGbB4DECvXwWPp4yn7Snsc1WlKm+WQhOFO4DPamg5TtnNPbiINkA9Oe3vX2v4f8A2Nvh9rvhXTNXl8Qa/HLd2kUzLG0YUFkBOAQT1NZY7NKOCSdXqOlQlV0ifEqlQcNTuM9OO1fd6/sRfDYRgP4g8Rlu58yL/wCIqT/hif4cbQv9v+IuP+mkX/xFea+KMI+/3G/9n1UfBeefuikLHPIr70P7E3w5/wChg8RD/gcX/wATSn9iT4bn/mYPEWf+ukX/AMRU/wCtGDXV/cP+z6h8GbkMLYHzdRX3n+xId3wR1cEdNYf/ANFrQv7Efw2Xn+3/ABEf+2sf/wATXr3wr+FeifCbwxcaFoN5e3NvcXBuXa6wW3kAHkD0AryM6zmhjaHJSvc6sJhZ0p3kd72NC9KXjOKBXyaPVFooooAQnjikBO05oGcmgkhTk0rgyOSVI4md2UBRuYk4Cj3r4z/aD/aemmurrwX8O9Q8mJCY73VIhkuQeUjOcDpg5B4zWz+1l8czodq3w28MXe2/u0/4mFxG3zQxEY2AjoxHfqK+JjKWkc/3mLH6+v1r67IMlVT/AGitt0PKxmLt7kB7kPO8xyzuxZ2c7i5Pck5pDuA56Z4pEOQd2eemB39/avSvhn8EvHPxVuA+hWIttLQgSaldAqinODtHVq+yrYinhoc0nZHlRhOpKy1PNRk9QMUh4cYAIr7o0r9iLwT/AGXEuteKNYuLwD949qUjjJ9gQTXlX7RH7P8A4Q+EPgPTdW0DUNUuJ7q98hheSIyldhPGAPQV5tDiHC16qowbu/I3ngqkI8zPm4ZJzgYoxz0FKRtABY/iMUcH7pr2bpnMMYkdFFIR8wODjvV7T206HUQ2q281xbd0gmETfmQa+gfhZ8LP2d/ibcLp9r4w8UaZq5wDpt9LAjkn+423D/zrhxmOjhY8807GlOk6jsj5xLJnjNKCh6Hn3r7y/wCGJfhiHKjxD4kB7KZov/iKQ/sQ/DVjx4g8Rj382P8A+IryVxRhOrf3HT9QqnwccD0NNyc52jFfeq/sRfDVf+Zg8R595Y//AIinH9iX4ccY8Q+IR/20i5/8cqv9acH3f3D+oVex8FdWzilPXgCvdf2jPgx4e+D97ocHh+/vbpb+OVpPtjAsCvTGAABXhORuwPpXtYPFQxVNVqezOWpTdOXKxT0xjmmOTjAArW8P2MWqeMNL0id2jivL2G3Z0GWAZsHAr7d/4Ym+HLAsNf8AEQyem+Pj/wAdrlx2cUcE1Gr1LpYedVXifBxPGcLQGJ6qK+8F/Ye+HAbJ8R+Iv+/kf/xNSj9iX4bg/wDIweIiPTzI/wD4ivOfFGD/AKRr/Z1U+C93otNLnuor73/4Ym+G5H/Id8RD382P/wCJpD+xH8Nj18QeIv8Av7H/APEUv9aMH5/cP+z6p8Ebz2TNKGyOUwfevvb/AIYj+Go/5mHxEP8AtrH/APEUn/DEfw2zn/hIvEZ/7ax//EU/9aMH0v8AcP8As6qfBW7j7ozQrkHlRX3qf2I/hvuz/wAJB4i/7+Rf/EUh/Yl+G235vEHiL8JYv/iKP9aMH3f3C+oVUfBgYhiSopceoFdx8XvBth4D+L+s+FtLnnks7GRVR7jBYjYDye5zXEDl+BkenrX0FGtCrBVI7M45xcXZkZKhwecd6N4JwoH416r8A/hhpXxa+Js/hnWdQurO3SxkuC9oBv3AgAZIwOtfTH/DDfw/xj/hKvEQ/GH/AOIry8bnmGwtV0qjd15G9LCVKkeaJ8KlcqORmkYEY24PrX3WP2Hfh6pyfFXiMjpjdF/8RXzT8fvhbpHwk+JFr4e0O+vruCWxS4eS7ZCdxZhxtAx0owed4fF1PZUnqOrhalOPNI8pIbHGKUNiLDD5qbuHXvXZ/CjwhYePfjToHhDVJ54La/ldJJIMBsCJmGCenIFenWrKjBznsjngud2RxycEHj8a+mP2Jzu+OWsggcaTjj/rpXrK/sP/AA4zlvEXiIn2kjA/9BrvfhX+z14T+Evie61vQdS1W5ubiD7M32t0YBM56ADvXyGZ59hsTh5Uqe7PTw+CqQqKTPYUGFpe9IPu807FfGHsBRRRQAUHpRRQAn5UnfNO4pCR6UtAEox6UYoyKAD60c9qMjGSab5kZ43rn60WYrruO5o57mjII9aMqaNhh1rmviCF/wCFWeI+B/yDbj/0Wa6THNc58QuPhR4k/wCwZcf+izWlL+JH1RFT4WfkspO3qf8AIFNGQrY9DTk/1Q/z2FInX8DX7FBXgj5aS95n6E/saf8AJuIz21O4Az6ZFfQpA6nFfPH7GR/4x0Yf9RS4/mK+iG4Ffk+Zf71U9T6bD/w4kNyoNnLgDlD/ACr8g9fy3jLVQ53f6ZN1/wB81+vtxxZyn/YP8jX5DeIQP+Ev1TA/5fJf/QzX0PCf8Sp6HBmauomcOCR2wa+4f2HBn4d+KPQakoH/AHxXw8PvH6GvuH9hs/8AFvPFH/YRX/0CvY4mf+xP1OXAfxUfVjfdxXh/7T3xOf4f/B6e2sJ2j1fVibW38s4ZFIO5x9MAfjXt7/6snOOOtfnb+1v4l1bWf2gZtHu4Jrex0q2WK0WT+Mty7/jxXxuTYRYnFJS2Wp6uLqckHY8DO7J8xg7HksTk5PJ/WjGEJOT3IHYe1N2kMCacWzmv1FJR02Pnbq7Z9T/s1aX8K/COmL46+IfiXRodalP+iWdxLuNsnG18dmJ3Z+gr6nsfjV8JdQnFvZeP9FaRj90zBP8A0KvyvIQjdsX/AL5FKW3IGKqfTIzXzmN4eWLqOrUqO53Usc6cbJH7BWOoWGoWa3em3cF7bv0mt3V1P4irpUMvFfk94F+JfjX4fa3HqPhjXbm3C8vaO7NBIPRoycfiBX6BfA3466L8XPD3lOq2PiC1X/SrAn/x9PVTXy+Z5HWwXvbx7no4fGRq6Wszmfjz+znpHxD0e68Q+GLaHT/E9uhdHVNsd3gZ2OO7dga/P6/tLrT9SuNNvbaW2uYJCkkcgw6EHGD/AEr9hmA25AzXxd+2L8JEtZY/ifoVsq+Y622qIihRz92XjqclRn3rv4ezeUKioVXeL2MMfhE1zx3PkTI24JyaY4+YntSKrbsGlzlyPSvvbanjrc+ov2Hjn4s+IgeR/ZK/+jhX3cMAcV8J/sP/APJWfEX/AGCV/wDRwr7sHQV+Z8Q/77L5H0GB/hCnGK/N/wDayk3ftSa1GD0tLX/0VX6QHHNfmx+1c+P2rtf/AOve2/8ARVb8MK+L+TM8x/hnjAz5nvmvav2TUP8Aw1boZJP/AB7XX/oBrxVPv17j+yUv/GVOjk9rO5/9Fmvsc4a+pVPQ8vDfxYn6OigY9qUEYFJnnpX5afSAfpRj2oK5NKeKQCYP0ozgZrL13xBo/hvSJtX1zU4LCziXLyzuFUf4mvk34nftpwwzTaT8MNNE7j5f7U1BTHGfUxjvg114bA18S7UomNWvCkveZ9d32qWGm2bXeo3kFpbr1lncIo/EmvFfGX7WHwm8JyvaWmpS69eglTBpybhkHH3jxXwT4t+Ivjfx3qRvPFXiO81Bz/yweTZEv0iHH6VzSEldigBfQDA/KvqsJwqlZ15fJHm1Myf2D6l8T/tr+LdTt5oNB8K2OmQOpTdczGaTBGOCvGa+XpJZJp5ZZigkkdpHUDgFjnApgbcc4HWnN8xzX02Fy+hhF+4Vjz6ledV3mCdMHpX3H+w4T/wrbxR3A1VR/wCQxXw2PuGvuH9hk/8AFvfFeT/zFU/9FCvJ4mS+p/NHTl/8Q+raOKXPFIDk1+dnvhx6UYo285o4AyaQByOppGO1Sc/rXE/ED4seBvhppf2vxTrMcEjDMVrH880vsq96+OfiP+2J428QtNY+DbceHbFht81l33JyMdeg/DmvQweWYjFu1OOnc56uIhTWr1PtjxR4/wDB/gyya48TeIbHTlC52yyDefovU18++MP21fBulvLb+DdEvdekU4+0yt5MI/E8mviHUNT1LVNQkvtU1K5vruRtzzXUjSOT6fMTioC7kB25xxzzX1eF4XpQV67uebVzKX2ND1z4qftD+Lfizoceh61p2n2OnJMLlIrZSXLAFQCx6j5jx64ryHBxjvnJpSzEc9O1HT8a+lw+FpYWHs6asjzp1ZVJc0mBJA3Lt6bSD3r1Hw/+0b8X/Dltb2dl4unltYFCR211EJVVQMAA+mB0ryxgc49aaUPU80VsLSxKtVinYqFSUG+Vn1Z4U/ba8V6fPHD4x8NWepW+cNPYkwyD3wflNfRvgD9oj4Z/EHy7XTdZFnqbgf6BqBEMm7HIHY/UV+Y24rGcDg9QOlEcrxSq8fynsV4xXhYrhvDVb+z0Z108fUj8R+x6MGX0NKQSwOfwr4C+Cn7VXiHwpf23h7x3PLrOiEhVvpCfOtQTj5ieWA9+wr7v0rVLDWtJt9U0u7jubO4QSQzRHKupr4rG5fVwUuWpt3PXo141VdMv5GaXg9qbjLA07viuI3AAZpaKKACkzyRS00n5sUAHQEmuG+LPj20+G/wp1TxRcHdLFGUtoyeXlb7oH8/wruG4BNfCX7ZvxBk1Tx/Y+A7Kdvsmlr59zhjhp36AjvgV3ZXhHisRGn06mGIq+yhc+Z9X1S/1nW7vWdVuGudQvJTLNK7bixbk8+wqltYrkE/T19qcUy2R0HIFaGgaJqPiHxJZaJpcfmXl5MsMK/7RPB/Dr+FfqbcaFPtFHztnOWh6d+z58Gb74teN/Mv1kt/Ddg26+kx/rjkYiU9iec/Sv0h0XRtL0LR4NI0ayhs7O2UJHDEu0KMf55rnPhf8P9M+G/w40/wvpsagQx5nlwN0sh5Zie/OetdqAAOAK/M82zKeNrN391bHv4WgqUb9QwPSvmP9tHRNa1z4b+H4NH0y7v2j1BnkW1i8xkGw84FfTm4ZxikZVZhkVw4XEPDVY1V0NqtP2kXFn493lhc2MrR6hZ3Vs+cbLuJoz+vFVgjJzswK/XTWvCPhnxDZSWuueH9N1CJxgrc2yP8AkSMivnv4jfsd+DdctpbrwNK/h7UDllhDF7cn6H7o9hX2eF4qp1Go1lbzPJqZc4/AfBzSMGySc/WpLa6ntLuK5hllhmgcSRSwna8bA5DKexBre8Z+APFXw/8AE8nh/wAWaYba4JOyQHMcwzwYz3z1rnyCjcHmvp6dSnXgmneLPOnFweujPvb9mD48SeNtNXwT4suAPENnH+5mZ9322MDOQe7ADJ+hr6XHqDkV+Qfh/XtT8M+I7LXNId4r2xlE8LRsUOV5IyOxGQR3BIr9VPh74stfG/w20jxRaMPLvrdZSB2bHzD881+fcQZZ9Uq+0j8Mj3MDifaR5XudPjvS4NBx60gYdAc188tTuPjL9ugZ1TwfkcGOcEfiv+NfH3BIxX2D+3Q2NU8HD1juP5rXx8P4a/S+HdcHE+fx38Zm/wCCkP8AwtHw2Qeuq23/AKGK/W9cBMACvyT8Df8AJVPDY/6ilt/6GK/Wxen418/xWl7aHoduWL3WKetHFBPNBGVr5U9QPpQc0DGMVBdXVvaW73NzMkMUYLM7thQPUmkld2Qm7asnqCe5hgjeWaaOKNBlndgAvua+cvif+154O8KPLpfg+P8A4SDUkyrXCZFrE3oX79/yr5F+IHxn+InxHmxr/iKZbPOVsbNzFD1zg7SN3XvXtYLIsTidWrI5K2MhT21Pu3xp+0z8JvBZkguPEUepXi8fZtOHmtn0yOBXhHin9uHVpp5IfCPg6K2hydlzqUm4sPXaOlfI/mESEINmeuBto3HO0cY44r6nD8NYanb2mrPOnj6ktIm74v8AFmreOvG9/wCKNYaA3t24dxEpVcAY79u1YidTnoetNclhgk9MHmhD+8r6GnTjTjyRWiOKTbd2fRX7GLA/tEz/APYHl/8AQhX6DYGOgr89v2MW/wCMjJx/1CJv/QhX6FcYr844jX+2y+R72A/hIacfSvgX9tYD/heenY76Sn/obV995B4xXwH+2quPjrpx7HSI/wD0N6OHP9+XoxZh/BZ81YHpXqn7ObH/AIan8GDPW7kH/kCSvLK9T/Z1OP2pPBf/AF+v/wCiXr7zMnbC1PQ8ShpUR+nopOM9BzSgjJFB61+TWPp0OooopjCiiigAoopDnHFACmkOMc0detRzOsaM8jBUUEkk4AHegDP13XdK8O6JcavrN9BY2Vuu6SedgqgenPU+1fIPxI/bRvGvJ7D4babEkKkoNTv0Lbj6rH6fWvNv2j/jRffEXxvcaFpF9LF4ZsGaJEibi4cHDMfUZXj8a8JZiZNwOFPQelfaZPw9HkVXEK7fQ8bFY5t8tM7bX/i38S/FFxJJrHjbWZg55iinaGMewUHArnh4j8QwuHi13VkPqLxyf/QqyurbQ2fp/nilwo43CvqYYOhFWjBL5HnuvNvVnoXh342fFXwtLG2k+NtXaMceRdS/aEx9G6V774F/bYuo5ksviFogkiOM3+nLyOeSUr5B54CNk+gpvzbyAxGe69R71yYnJsJXVnHXujSGLqU3oz9b/CXjPw3428PRa54Z1W1v7KRc7onBZD6MAcqfY1F8Q8H4U+JB3/sy44/7ZmvzH+HHxK8U/DLxdFrnhu9dEDKLi0kYmK5TuGXsT6ivv7Sfij4f+Kv7Pev6zokuLhNMnjubOTiSCTyzkH2PY18VmGTVcDVjLeN1qevSxUasLdT8z4xiP/PoKcoO08UR4aMEdMZz+Ao3YB9ga/R6bvBHhSXvM/Qj9jMj/hnh+f8AmJz/ANK+hz0FfOn7GLZ/Z6l/7C1x/Svos1+U5l/vVT1PpcP/AA0Q3P8Ax5S/7h/lX5C6/wD8jRqX/X1L/wChmv16uf8AjzlH+wf5V+Q3iEY8V6mP+nuX/wBDNfQcJ/xKnocGZ/DEzh1P0NfcP7Dbf8W98Uf9hFf/AECvh4dT9K+4P2GwR8P/ABVkddSX/wBAr1+Jf9zfqcuX/wAVH1eRkV5X8a/gronxb8Im3m2WmtW4LWV/tyyHB+Rv9k55HsK9V9MUhyRnpX59RqzozU4OzPcnBSVmfkT4r8K634K8UXfhzxDaGzvbU4ZGBAYZwHQnqprGAfIUg/lX6cfGT4F+HPi7oqLd7bHV4f8AUanGvzpnAIP94YHAql8O/wBm34aeA7eGZ9Ih1jVlA36hfJvYkDsvQCvtKXFEFRXOryPIllzc7x2PzqtPCXinUIvO0/w3rN3H/ft7GWQfmqms++0+/wBMuvI1KzubKfGfKuYmif8A75YA1+wUNvDbRBLe3jhQDAWNAv6CvG/2kPh54f8AFvwU13Ubuxtk1LTbVry2vAoVlZBnBPcYqMPxU6lWMJwsmy6mXcsW0z82jwAc8mum+H/jLUfAfxG0vxVpc2JLOUZX/npGT8yH261y38COM8qDz1p4T5sDuMV9XXpRrUnF7M8yneEk0fr7oup2esaDZ6rYMGtbuFJ4SpzlWG7tVXxl4ds/FfgLV/Dt6m6G/tXt2B9xx+uK4f8AZv1J9W/Zf8IXkp3Otl5JP+4xUfyr1RxkcjNfkk4+yrO3R6H0sfegr9T8ftS0+fSNcvtHuY/LmtJ3gkBGCCh2gEfQVSOSOnAruPi/DHB+0B4ziQcf2tMc/jXEZ+RhX6zg6jqUYTe9j5uorTaR9Q/sPsP+Ft+Ihkf8ghf/AEcK+7Acivg39h4/8Xh8Q4/6BA/9HLX3ihylfnfEP+/S+R7mB/hDz3+lfmz+1h/ydZrv/Xrbf+i6/SY9/pX5tftXg/8ADVOvcf8ALtbD/wAhV0cL/wC9v0ZGY/wzxVP9bXt/7JL5/ap0getldf8AoJrxBP8AWCva/wBklW/4as0U46Wl2f8Ax019hnC/2Kp6HlYZ/vYn6SDt9KaVHc4p38IzUc8gjiLOQFA5LHAH1r8tPpRzHAA4+teF/GX9pTwt8MYpdJ0949b8RbciyhIKR/8AXRh936HrzXmP7QH7US28lz4L+HN1vcbor3Vo+fL7FI89TnHPpXxtdXE9zcSXFzdTXE0p3PJK25mPqTX1GU8PTr2q1tI9jzcTjlD3YnV+PfiZ4s+JXiCTUvFWpPKpOYbQNmGAZOFC9O55rjju346D8P6UKRjrkDqfSg43KA3ynpjvX29GlToR5KaskePOpKb11AbSxBYccdacCuCWdQBxknFet/DL9nX4gfE0x3tvb/2Rozf8xK/TGV/6ZoeT+Ir6/wDh7+yr8MvBMUVze2LeIdTUDddaiNwzjnCdMZrysdn+HwrsnzS8jqo4OdRa6HwX4e+H3jbxaT/wj/hbVdRQfenggZY8epkIwR9DXOyxtHcNC6bXjLLIWbcdynGB7V+vwsLOx0x4LG2itogp+SFAi9PQCvyJ1PaNbvQo48+T/wBDaoyfOKmYTmpKyQYrCqilqVV+6f8APavuT9hwg/DzxUAQcaqn/ooV8NA4Qn/PSvt79hjP/CA+LuOuqp/6KFTxN/ub9UPAfxT6y/hpOOpoNc94y8Y6D4G8K3HiDxFex2lpbjJLH5nPZVHcn0r87jGU3yxV2e83ZXZr3+oWWnWE19fXcNvbRLvkmlcKiKO5J4FfIHxm/a8MLT+H/hiiMxJjk1eZcqh9Yx/WvGfjP+0D4l+KuqywW00+m+HYyRb2UTbDL23SHvn07V48x4HzYAr7TKOHEv32JXyPIxOPv7sCfUdU1TWNVm1LWtQn1C/nYtLPctlmJOSQe3JqurMfvcY9aMA9V4PQ+tWNP02+1PVIrDT7aa6u5iBFBCpZ3JOBgD379K+s9yjHTRHmPmmyuMEhs4PbmrNraT3c6w28bzSscLHGpZmPoAOa+lfhr+xx4p19IdS8fXx0KzYhjZW+GuJF9Gbov1FfWvgj4O/D/wCH9pHD4d8O2cUg+9cyoJJXPruPSvAxvEuHoe7SV2dtHATnrLQ/NfV/h1430DwrF4i17wzqGlabNKIY5rtfL3sQSBtIB5CnnpXL7gE2gHI6mvv79tJR/wAKAs9xGP7Vhx6/devgB+pAHp/KvQyXMJ42h7SatqY4miqMuVDyAFBBAPZ+oX8K+jpP2M/HN34ZtdX0TX9KuxPbpMlvKCjfMobr07182ysVgYAZBHNfrn4L/wCSd6Fkf8w63/8ARS15/EWY1sI4Ok7XNsDQjVvzH5feNPhJ8R/h/cFfFfha6gtQf+P23XzbfP8AvAcfjXGY+XKsrcZJX0r9h73TrPUbSS11C2iubaQbWilQMpH0NfGf7Sf7Ntjoml3nxB8B2pgtkYzajp6chAOTJGPT1Fc2WcSqtNUq6s31NMRgORc0D5FRmV+G/Kvpj9lP41y+EvE8XgHXrpRouoyhbN3IVbaZj0JPADHqa+ZjjiRTlSN2fY0+Cea3nWe3m2SIwZHH8LA8H86+gx2DhjKLhJa9DioVZU5Jn7GRurKCvfr7U8AA15p8CvHi/EP4H6LrrOXu1j+y3n+zNH8rZ9z1r0vjNflNWm6c3B7o+ljLmVxaKQEkmlqCgpCPmzS96T1oAqX91DZWM13csFhhRpZGJwAo5JP4Zr8lfG3iK48WfEfXPE07DOoXskwHtkgfoBX6Y/HHWH0L9n7xVfRuEk+wPGjH+8/y4/8AHjX5YlSGCt1AxzX2PClD46vXY8nMp6qIqcsS2B9a+pP2LfBI1X4j6l40u4v3elQeRAwHAlkBDf8AjpNfLaEbiX7c4r9C/wBjnQDpP7ONpqUsTJNq1zJdFj/EoOFP5V6vEeIdLCOK6nNgKalUufQoAHbpSg5JooAxX5ye9YMc5pDknOKdSZFAxoJ9DS4zxS5HrRzuoA4b4o/DPQ/id4EudB1aJRKVLWtzj5oJOzL6V+YPibw5qfhPxjf+HNYjMN7ZTNDJkFd49RnqD61+uzY2nPFfCX7afhSPTviJofi62h2x6nG9vO2MAyIP545r6fhrHyp1/YSfus83MKCcec+X8AIy8nj+E4NfTnwL/aH0r4YfA/UtH1e3nvr2C/Y2FpHxlXXcWLegPWvmI5ycdPWjew4Br7LG4CnjKap1NjyaNWVJ80T3DxR+1d8XvEd+z6frEfh62DEpb2EYY4/2ndTn6VW0H9qT4zaDei4m8RjWowRuttQjXBHsVUYrxjJY8NzRh/X8qw/sjCKHJyI0+tVb3bPaPjv8aLL4yaP4cuU0yayv7FZYrqBuUbcFwyn0zn8q8XLFpCzEkk8/WjcwG3cPwNJg8ZrrwuGp4amqdPYyqVHUlzM6DwS+Pih4aHH/ACFbb/0MV+ty/d/GvyN8Fg/8LT8NnH/MWtv/AEIV+uKcrg+tfGcV/wAan6Hq5Y/dY4gE8mgjCYzSN0z2rwz47ftDaV8L7J9F0YQ6j4kmjzHbhsrbj+/J6Dr+OK+bw+HqYiap01ds9GpOMFdnafE/4s+E/hb4eN9r94hupP8Aj2sIWHnTHtx1A9T0FfAnxX+P3jX4o3zwXNy+k6KCdmmWx4Pu7dziuF8S+J9f8Wa/c6z4g1KW9vJnLF5GJAHoo/hArCzzjOT6V99leQUsKlOrrI8TE41zdo7Cl8ABe3FB5PJ7ZPtQcGPcpwO5rtfh/wDCvxt8TNVWz8K6Q08Cn97eykxwx/Vj14xwK9ytWp0I3qOyOKMHN6as4nbyQCMAZzWxoPhPxJ4ovFtfDug6jqkrfdNnA0gH1fG1fzr7g+G37Hfgvw6Ib/xncv4h1EHf5LLstoz6Kvf6nrX0TpOh6RolktppGm2tjCi7VS3jCAD8K+WxfFMIvloK56VPLX9s/JDXtA1jwz4iuNC16ye1v4VHmQyuGK5GdrehrOJGTz2r1n9pdQv7UHir/rvH/wCixXkY6N9K+mwlZ1qEast2jgqQ5JNdj6K/Y0bP7R8o/wCoVP8AzWv0Mr88f2Mv+TkJT6aVP/Na/Q6vz/iP/fZeh7eA/hIQ9a+Af21/+S7acP8AqEx/+htX361fAX7a4H/C99O9f7Ij/wDQ3pcOf76vRhj/AOEz5rHSvUP2eT/xlF4L/wCvx/8A0TJXl46V6j+zwM/tReDR3+2N/wCiZK+8zL/dp+h4dD+JE/T9O/1px60i9TSnrX5OfUi0UUUAFFFFABQelFB6UANHvXjv7TfjS48Gfs/arNYzNDe6hixgkXqm4Hcfb5Qa9hr5c/bhlf8A4VT4fg+YRvqvzf8Afp67ctpqrioQe1znxMmqTaPhbPLjJY7up/l/M/jTSoI46DrSqRkAep/nTmGGGOlfrUY2SSR83e+p3fwt+EfiT4t+KX0jQ2ht7eBQ9xe3BwkA+g5cnsK+rtN/Yj8BQ6cian4j8Q3d0VxJNHMsa7vULjgVB+xTLpo+GmuxR7ftq3wefaPmKY+XPt1r6oRsryD9e1fnucZviViZQhLlSPZwmFpuHMz4w8Z/sQTRWzXPgXxVJO4/5ctX6P8A9tF6fjXy34r8H+IvBXiWTQ/Eelz2N7H0jdciQeqHow+lfrsOlcB8T/hV4a+KXhCTSPENohlAJt7tBiW3fHBVuuM4OKMv4kr0pqNZ80R18BGavDRn5WA/ewQVxyR/L611ngjx5rvgXVLm50abNvd2z2lxbSHKSRspXp6gnP4U34h/D3X/AIa+PLrwtr8bO0RL29zjCXEZ/jX3HeuVIwpwa+7h7LF001rFnjPmpysOiBAxwCeSB0HTpQcbSO+DSqpUZzQeenatkraCP0C/YvU/8M9TH/qLXH9K+jTXzp+xef8AjHmYf9RWf+lfRZr8nzL/AHqp6n02H/hoiuTizlPoh/lX5Ca/IJPFWqOuf+PuX/0M1+vV1/x4zf8AXNv5GvyC1jJ8UaoD1N3Kf/HzX0PCXx1H6HBmfwxKa/eNfcf7D4/4t74p/wCwkp/8cr4bHDH6V9xfsPH/AIoHxUvpqKf+gV6/Ey/2N+py5f8AxT6vHQU35u1OHQUg61+cnvh25pMUpAPWms2z3PpSACcD3xXzl+1v8SbXw38JZfCFpOp1TWwsRj7pBn52J7cV2/xi+OfhP4UaFIb25ivNZdf9F02NwWdu27+6Mivzo8b+Mdd8feMbzxN4ku3uLu56KTxCvQRr/sjAr6LIcpniKqrTVoo8/GYlQXKtznWXGMjCjgA9cUibt5JBOATgdeKCzM2WbJNd38HPAN58SPjBpPh+GJzaiRLi7lA4jiU5Jb2OMV99iqyoUZVJaJHi0k5SSR+hnwB0ebQf2cfCWmzxeXILFZSuem8lufzFekvnHFQ2dulraR20MaxwRAJGi/wqBjFTt94V+R1Z89Ry7s+nirRSPyq+Muf+GhvGv/YWm/pXC/wt9K774zjH7QfjQ+urTf0rgQeCPWv1jL/93p+h81V/iM+nf2HB/wAXh8RH/qED/wBHLX3gowuK+Ef2HlK/F7xFnvpA/wDRy194DpX59xC/9tl6I9vA/wAJCnv9K/Nv9q1h/wANU66P+mFr/wCiq/SQ/wBK/NX9q8n/AIat1/8A6423/oqunhf/AHt+jIzH+Gjxpf8AWV7j+yTj/hqjSD/05XX/AKCa8NQ/PXtn7JLH/hqrRVOfmsrr9FNfX5x/udT0PJw38ZH6SDoK80/aBTUn/Zs8Yf2RdS212mnO6SRHDAAgkA/TNelryAayPFOnRat4M1XS5lVkurOWEhunzIRX5jRly1IvzPo6ivFo/IJnZ3ZgWweeuc8Dn60Kdq885qe7h+wahdaeykNbzPG31Bx/Sq/LYHWv16k7wTR8tPd3Nfw94b13xb4gh0Lw7pc+o3kxG2GCMnZk43u3RV+vpX3D8HP2UNB8Kxw6148EGsauMOtrj9xAe2R/Ea+Pvh58UvFvwu1s6j4Xu4YzIQJoZog6yL6Z6ivsr4YfteeC/FckOkeL4R4e1RztV2bdbynPG1uoPrkDBr5jP5Y7akvc8j0cD7LeW59GwwRwW6wwxRxog2qqLgKPYVMvT1qvbXsF7apc2ssc0TjKyRsGVh6gjirAHevg3e+u57Ss1oQ3YP2KbA/gP8q/H/UAw1m93Yz58n/obV+wN4cWExwfuH+Vfj/qDB9XvXHGZ5OD/vNX2HCnx1Dy8z2RWAyjZ/zxX3F+w0oHw+8Vkf8AQVT/ANFCvh5BlG+h/lX3D+w2f+Le+LP+wqn/AKKFetxN/ub9UcuA/in1aTgV8TftzSX6eJ/Ca/aZRZPbTEQbjsMisfnx6gEflX2we1fKP7cujib4deGtcVRm11FoHPfbIh/qK+OySUY4yHN3PWxabpux8Ouu1ygJIH8R/i96Q4J28/lSuQABnnAyaF3H0wK/Uj5w9P8AhP8AAvxp8VtQVtMt3sNFVts2p3CYUf7gP3vwr72+GHwS8EfC7S1TQtNjn1A8TandKHnl+p/h+gr45+Fn7VnjDwFZ2eg6tZWus6HbIsSRKohmiQDACsOCcDvX2P8ADr44/D34m2oHhzWkW+H39OuiI7hf+A55/Cvgc/njnNqorQ8j2MF7G2+p6QOD9386dwelJvBwO57UYwa+WR6Z82ftrsf+FA2IH/QWh/8AQXr4E7fl/Kvvn9tlgvwFsevOqxf+gSV8DN8uc+uPyFfonCz/ANk+Z4WYr96JNxbMf9mv1z8FZPw60E/9Q23/APRS1+RcxzasPVTX65+BmDfDbw+Rn/kG2/8A6KWuDi7/AJd/M3yxbm8Sc4xVW/s7e/spbO7gSe3mUpLG4yGU9V/GrRPNZWv+INM8N+HbzWtYuVtrK0QyyyucAAfzNfFwbcko7nqy0TuflL480KPwv8UPEHh6H/VWN/PCg/2Q3Fc903bOcc81teMddbxP8Q9d8QucDUb6a5UHqFZ8qD74rFAwWz0wea/X8Kpexgpbny9Rpydj7h/Yd1OSTwD4n0cuSltfpLGD0HmJk/rX1hj88V8i/sM2rjwt4t1D/llJdwRr65WPmvrrtX5nnCX1ypbufQ4Rt0lcBS0gpa8w6Q70h6Gl70h6GgDxP9q25Nv+zBrYUkNK8MYx7uK/N5x+9Iav0X/a6DH9l7VXX+CeBj9N4r86GYGUn3r77hX/AHZ+p4eZfxEM24jc452n+Vfqb8D9OGlfs9+ELNUChdLhY4/vMMn+dflp/A5H901+rvwskWX4KeFGTlTpVvz/AMAFc/Fj9ymjTLV7zOx70vej2ppOCK+JPYFJ+bFGBmjj0rP1nWtL0HR7jVtYu4rSzt0Mks0rYVAKaTbshNpasv8AyjmlyMV88eAP2oNG8c/G658JpaLZaVKgXTbuZgHnlH3gwBIAI+73xjODX0IrAj3rWvh6lBqNRWZMKkZ/COyClfKX7b623/Cs/DZYgTnVmKD28s7v6V9WE4HSvgX9sLx7aeJfidY+FtLuFmttFjYzEEEee5+YDHoK9DI6M6mMhy9DnxskqTTPmxs7yoocAx8Zz0pWBGccn2qzp2n3urahb6Zp0LT3d1IsMCL1Z2OAP5n8K/T5tRTk9kfPrVpI7X4VfB3xV8WdZmsdAMdtbW+PtV5cA7I8nGB6t3x6V6L45/Y/8f8AhHw/JrGiavY+IUgRnkhhjMMoA67QfvH/AAr7J+D/AMO7H4ZfC/T/AA7aon2kIJLyYDmaYjkk+3Su9MfBAwAeMYz9a/P8VxHXddum/dXQ9qngI8mu5+OfC7ldWR1YqyOuGUjqD70qk8A177+1r8OrDwZ8ZYtV0qKOCz16JrpokGBHKpw3tgjaeO+a8AXsMGvtsDiliqCqrqeTVp+zk4nR+Cdp+KPhoD/oK23/AKGK/W5Pu/nX5IeCfl+KXho/9RW2/wDQxX63r0/E18dxX/Gh6Hp5Z8LY2UFoSoYqSMZHUV+Sfjk38fxP8Qxalcyz3keozxySu2SVDnC+4r9bj92vy+/aI0gaF+074stdgCTXC3UZXptkTP55BqeFZJYlp72KzFPkVjzEHqc5qa0tZ7y+itbS3lnnmbZHDEu5nY9AAOtVwPmJB/Ctrw54i1jwh4htte0K5S3v7Zt0UjxiQA/Q195VUuVuKuzxo2vqfT/wZ/ZEur5IPEPxOZ4oSA6aRCQGYHP+s9BwOK+xtF0LSPD+kRaZoum29jaQrtSGBAoAr5L+G37Z0Je3034k6UkKthTqlmcjPPLqSCO33Qe9fVnh3xVoHivS01Lw9q1rqFswzvgcHHfBHUHp1r8zzZ411L4m9vwPoMMqXL7hsDgcgfhTjnqOtIMMM0vavGXkdR+Y37SrZ/ag8Vbv+e8f/osV5KvJI9a9Z/aTG/8Aai8WAcf6Qn/osV5MvDmv1fLf91p+h8zWfvyPor9jEf8AGRk5H/QJnP5stfoX3r88/wBjA4/aMnX/AKhEw/Jlr9DO9fC8Rf77I9vAfwUI1fAP7bGP+F76bjr/AGTHn/vt6+/Wr4C/bWH/ABfjTj/1CY//AENqOHP9+Xowx/8ACZ81jpXqX7O/y/tS+Cyf+fx//RL15cK9O/Z7OP2ovBh/6fWH5wvX3mY/7tU9DxMOv3kT9Qk5pT1psfSnHrX5OfTi0UUUAFFFFABSHpS0h4FACAZr53/bJ8PXOsfAFdRt1LDSr1LmUBcnYVKk/gWFfRI6Vl+IdGsvEXhu90TUo1e0u4WhlUgHgjGefQ4NdGFr+wrRq9mZ1Yc8HE/IfaAARj/H3pCCffPeu6+LPw21f4X/ABAvND1GFjbsxezuSMJNH/vdNwyPzrgg2M4zj9a/WsPXjWpKpTejR8zODg+WS2Oo8E/EDxT8O/Ea6z4V1R7O4xteM/NHKP8AaXvX21+z7+0D4h+K/iO60TVvDlnb/YrXz5b6CQ/Men3cYGfrX5+qBu5yRgmvvr9jnwRLoXwjuPFF9A0dxrc5eEOACIE4HvyQ36V8zxJSoRo+0lH32d+AnNy5b6H0omcZNKR2zR2xQvTJr4LRntnj37Qvwjs/iZ8M52ggX+29NRrixmC5ZiBkxk56GvzWmgeC5aGWPy5EJDoTyrA4wfev2Jk/1ZHGPevzm/ar+Hkfgf43SapY223TdcU3keBgJL0cDFfYcL5i4T+rTenQ8nMcOre0ijw3g85x7U3ON3HamqcnvmnsO3sa+4Z5C2P0B/YvOf2epuP+Ytcf0r6NNfOn7F6gfs8z/wDYWuP6V9FmvybM/wDeqnqfT4f+GiG5/wCPKX/cb+VfkJri7fFepH/p7l/9DNfr5c/8eUv+4f5V+Qmv/wDI0aj/ANfUv/oZr6DhL+JU9DgzPZGeO59jX2/+w7/yIviv/sIJ/wCgCviAd/oa+3/2Hv8AkRfFf/YRj/8AQBXscSv/AGN+pyZf/GR9YjoKSlHQUlfnJ9ADNjtXyx+0t+0N4q+H2uHwf4a0l7GeaIONXuBkMp4PlLjkg8ZzX1QRlhzXkvx4+D9l8VfhzLZxqItasgZtOueCVcc7Tnsa68vnSjXi66vEyrqTg+Xc/NPUdRvtW1i41PV7ye+vJzulluHLsx9ye3tVJjg4z+HpVvU9Lv8ASddutM1OB7W8tZDFNFKMFWHXP8/xq14d8O6x4r8S22i+HtOmv7ydwqxxLuwP7xP8IHvX6mqlKnT500oHzfLOTempSsLK61LVIdPsLOa7u53EcUMQyZGPQCv0f/Z1+C0Pwr8Bm51ONH8R6kokvZAMbB1EY5PTvWR8BP2cdM+GcC+IvEAjv/E8yfe4ZLMY5VOOvvX0EAFWvhc9zn63L2VJ+6vxPZwWE9n78txe9I3WlxlqRvvCvmj0D8qvjK+79oHxkcf8xab+Yrg88ZrufjBz+0D4zz/0FZv51wxGBX65l/8Au8PQ+XrfxGfUP7EBz8XvEH/YIH/o5a+7lPyivhD9h/8A5K/4hH/UIH/o5a+716AV+f8AES/22Xoj28D/AAh57/SvzY/at/5Oq17/AK42v/oqv0mPevzZ/atI/wCGqte/6423/oqt+F/97+TIzH+GjxZR+8zXt/7JMf8AxlXozf3bK7/H5f8A69eIj79e4/skt/xlTpXA/wCPK7/9BFfYZx/udT0PKwv8VH6PdV9KZKAybCAQeDTuqikOT1r8tPpWflH8WvDt94c+MXiS3udPniha/meKSRCiMpbjB/GuI6cqePUciv171rwp4c8R2r2+uaJY38bggieEMfzrwDx9+xx4G1xJbvwldz+Hrwgny+JLdz2yCNwxz0I619rgOJ6SiqdaPzPGr5fK7lE+AiQTgnPvUi7QuM59Ce30r0f4j/Aj4j/DN2uNZ0U3el5+XUrEGWPH+0o5H/1680DhlIADAd1b+lfU0MTRrxvTaZ506U6b1PW/hZ8ffHHwvvIreyvW1HRv49OvHJQD0Rudn6191/Cj46eDPitpIbR7oW+qxgfaNLnYCaM45I6blznB7jmvy9XCqVbDD1q3pGq3+h63Bquj309hewHMdxA2GH1PcexrxsyyKlik509JHTh8dKm7S2P1+upQ1hMMZzG3T6V+P9/kaxdDHHnv/wChtX3h8Cf2l7Dx7pw8K+Mp4LPxEsJEc/KxXoA6jJ4b2r4V1IBdbvY8EH7RJtz3AkYGuDhzDTw9apTqLU6MfVVSMXEpj/VMc19v/sMAj4f+LDnOdVT/ANFCvh8nqPr/ACr7i/YZ/wCSfeLP+wqn/ooV38TP/Y36oxwH8U+rvSvEf2rdEm139mfWY7a3aae1kiuY1VdzHa3OB9K9uxxmopYUuIWilRXRhgq6hgfwNfn1Cq6NRVF0Z7lSHPFo/HZ0+dozG4dSdyEYZfqDUbHadofA9cV+pXjP4F/DHx3ZPHrnhe0FwRxc2y+TIp9cr1/GvmD4h/sX+INOSa98AasuqwocrZXuFmx6bxgH8q+9wXEtCt7tT3WeLWwE4ax1PlJcFue3f1qxb3NzZXcd5aXcsF1GQyTRsUdCOQVYcjnHXNXdd8OeIfDGtyaN4i0S60q/QlfKuVxnBxkHow9CKy2wW5yMelfQqVOvD3Wmjhs4S13Pqr4P/tfanowttD+IyyajYDES6rGMSxe7jHz/AF4r7W0TXdK8RaLBqujX8F7ZzANHNC4YH/A+1fkB/tty/TceTXpfwl+Nfij4Ua4s+mSG70pzi50uVzskHqnPyuOo7Z65r5bNuHYTTq4fSXVHo4bHNPlnsfWH7bWP+FB2P/YVi/8ARclfAsn33/3jX2N+0p8SfDfxO/ZY0bxB4cvFkik1SJZoWOJYH8uTKsvb618dOTzwOWOa7eG6cqeGcZqzTMsdJSqXQkgzAef4T/Kv1y8ELt+GugD0023/APRS1+RFwSkW4E/dNfrr4Iff8M9Ab1023/8ARS15vFu1P5m+WPVnzX8c/wBpjxr8OPjJf+EdDsNKltoIopFknjLMS6Z557GvmX4hfGv4gfE4CPxNrOLQHK2NovlQ/iuTmup/azbH7V2tnGSLe0GD/wBc68SVhyQuT6V6eT5fh1Qp1uRczRz4qvPncb6CsmOetCEBiGbcO/HWlCHyyd2AO7HGa9//AGcfgHqnxA8T2/ifXrSS28NWUqSAyLg3jKc7ACPu+pr08djaeFpOpN2fY56FGU5cqR9V/syeCJfBH7P2l297Fsv9QLX9wNuCC54B+g4r2fHNRQwJDAkUY2qgACjoMDAqXjNflVes61SVSW7Z9LThyRUQHUiloorIsO9J60vek70AeSftKaVJrH7MvimCMHdDbC5wBnOxgcflmvzILB2DA4yM1+v+v6TFrvhjUNGn/wBVeW8lu+fRgV/rmvyS17SptC8S6hot3GyT2VxJAQR2U4B/EV9rwlXTU6L9Tx8yhqpGeh3MecZr9MP2aPEMfiL9mfwvcxn5re2+xSDdkh42IP8ASvzPAHzHJB7Yr6+/Yn8dRWl3q3w7vZVDTO17Y88McfvFX8s13cTYZ1cOqi6GOXzUaln1PtENz0pc5pAwJ4I44NJnDV+ebnvFXVNUstH0i51PUZ0gtbaMyyyOcBVHU1+dXx5+Pup/FPXpdM02SS28MW8mLeEHH2kgn94/TI6YHbHfNfofrmkWHiDw9eaNqkAmtLuIwyoe6mvzQ+N3wj1X4S+OZ7OeOSXRLmTfYXpGQVJOEbHAIx+or6LhyOGlWftfi6Hn49z5Pd2PPLPUJ7HU4L21maKeGVZY5E+Uqw759a+1Phj+2N4Vk0C20v4irc6dqMKCM3yJ5sc+BjcQvK59Oa+HXbBxtxj1pQwZvm4x0xxX2WOyujjklUWq6nk0MRKl8J9n/Fn9sfSH0G50n4Yxzz3Tja+qXCFI4gePlXGW/SvjW4uri4upJri4aaaRzI8r8s7H7xJ96iZgrKyEh16Pnn86aNu84Qt7DqaeAy6jgVy0931FWryrP3h6vljz7Zr6k/Y7+F7a54wuPiJqduHstMJgsiy5V5sDLD/d9fevDPhf8N9f+KXji38P6FBiPcGu7w/ct06k/XjA9yK/TzwX4Q0jwR4M07w1ocAhtLOPYAoxvPdj7k814vEeaqnT+r03q9zswOGblzs6BE2DBIPf8e9OA96PqaXtXwdj29j4v/brdRqfhBSucxXBz9CtfHzcEL6cZr69/bsGdZ8HDJ/1Nz/6EtfIPV/xr9L4e/3KJ89jv4zOg8FNj4oeGvbVLc/+Piv1xT7v41+Rng35fib4cYf9BO2/9GCv1yT7v4mvnuKv41P0O7LPgYpPy+tfAv7ZHh66t/jjBrUdjM1td6eivOsZ2q6E9T7g199EcYqnqGlabqtubfUrC2u4iMFJ4w4x+NeJluOeBrKta52V6PtY8p+PibGBZHBIPO3nH1pC+Ryc9sV+jXjz9lT4ZeLBJdabZSeHr9jnz7ADax9GQgjB9q+WfiL+yv8AEjwVFPqGm2kfiHTEyTNZHEiL1y0Z5P4V91g+IcNiLKb5WeLVwU6fmeG8DBXGfXHSuh8G+O/FHw/8QprHhXV57GcMDJGGJilHo6dD6Vz0iSwzNBLEyOvDCQGMg+m081GeCACGB59x7V7NSFKvCz1RyRlKm/M/Q34LftQ+HPiC0Wg+JTDomvn5UV3xDc+hRsDB9q+g1fcuccV+OaymORGjZkdGDq6nkEdCPSvrX9n79qKbT57bwX8R71ns2Kw2WsSnmNuySnuPevic24ddK9bD7dj18Lj1Jcszx/8AaUx/w1D4rIP/AC3T/wBFivJh1P0r1X9oyWOf9pnxRcQSJJFLLG6SKcqwKDoRXlZGHxX1mWp/Vad10PNrazbR9BfsZZX9pSQZzu0m4P8A48tfoj3r88P2Mxn9pRj/ANQm5H/jy1+h9fC8R/77L0PawH8FDWr4C/bWb/i/GnjHTSI//Q3r7+NfAH7a4/4vzp59dJj/APQ3pcOf78vRjx38JnzZnivTv2fP+ToPBf8A1/Mf/IL15h2Fem/s+H/jKHwX/wBfrf8Aol6+8zH/AHap6HiUP4kT9RUGOKU9aRTkmlPWvyc+nFooooAKKKKACiiigBDSOAcZp1IelAHJ+Ofh94X8f+Hn0bxRpkd5bMMK+MPH7q3UV8keNv2KfEtjcSXHgLXLS/tD8y2l/lJV9t/fj1r7i470hUV24TMsThX+6enYwq4eFX4j83tD/Zg+K8njvTdM1vwzJa6fLcKLm9SVWWOMHJxj19a/RTRdKtdF0G00qziEdvaxLDGo7ADH/wBeruwHIJyD2pwAA9qvH5nWxzTq9BUMPGjsIRleKd2oHSivPOgY2ChHavn39rrwb/wkPwEm1i3TzL3RbhLoNj/lmSFk/DaSf1r6D6VyvxLtIL34P+J7eeNZI30u4VlboRsJrowlWVKvCcd7oyrRUoNH5N4yqyKMAgHFOJBHvikQHyVy2SBj9BQGXOCOa/XVLmSZ8w9GfoJ+xif+Mepv+wtcf0r6KNfOv7GHP7PMx/6itx/Svoo1+UZn/vVT1PpsP/DRDdH/AEKb/cP8q/IbXxjxXqQ/6e5f/QzX683Q/wBCl/3D/KvyF8QNjxZqQPUXcv8A6Ga+g4S/iVPQ4Mz2Rnjqa+4f2HgP+EA8Ut3OpIP/ABwV8Ohhk/Svt/8AYaYn4f8AirJ/5iS/+gCvX4j/ANyfqcmX/wAY+sh0FIBk0o6Cgda/Oj6ADjIpGAPXmnYBpDjNAHzh8cv2Yovif4zs/Eehajb6TdSER6gZUysqgnDqB/Hyc564FenfDH4PeD/hboK2egWWbtlxcX8vM0x7nPYew7V6ARznOKB8q9K6ZY2vOmqMpe6jNUYKXMlqAVUUADAAwBQQCtH3lpwGBXMaCDrSN1FKOtI3UUgPyo+MIx+0B4yPrqs3864bGRXc/F8g/H/xmD/0FZv51xHG08V+uZf/ALvD0Pl638Rn0/8AsQAf8Lf8Q/8AYHH/AKOWvu5elfBn7EDk/GPxAM8f2QP/AEctfeSfcFfAcRf79L0R7eA/hDj3r80/2rWJ/av8Qg9obb/0VX6WHv8ASvzY/avWMftUa+2MEwWxJ/7ZVtwt/vfyZGY/w0eLry1e4/skj/jKjSv+vK7/APQRXhwYb691/ZH2n9qXS+efsN3/AOgivr83/wByqeh5WF/io/RsdqTGeDSjt9KTk9K/Lj6UUgYppCseaUnHavOPi78YfDnwk8InVNXJnvJARbWEJHmSn/AZGfrV06cqklCCu2TKSirs9AuLa2uYWhuI0eNxho2GVYehHevnn4q/sneC/Gay6r4VRPD2tAFl8hf3Epx0KdBn1r528Qftc/F7UtTebTdRstFgJ+W3ggWUgdslu9dX8N/2yfFVl4hgs/iHbwajpUrBHvLaMJLESfvEDjaO4619BSyjMMKvbU+nQ4JYmhVfLI8E8efDvxb8N/ET6N4t05rZyxEVwgLRT/7rehrlCSr4dMH09K/V7xB4Z8GfFjwAlrqVtb6ppd7FvhnXllyOGVh0NfAHxt+A/iH4T6xJdQI+oeG5SRa3wXJi54WX6DjNe9lWfRxH7qvpM48RgnD3obHklpcS2lylxBI8UqOHR0OCrA5yPQ015GebzGZmbJJLHJ560w7gxBFOGwLgnJNfRuKT0OC7tYTkgmvuD9hZifAfi4HoNVT/ANF//Wr4hUqUI6V9wfsMhR4B8WFep1RM/wDfs18/xN/ub9UduA/in1h2o460fw0DpX51Y98TIzSbMtnnNOwB2oJAp2A5vxb4F8LeN9HbTfE+jW2oQnp5i/Mv0bqK+J/jJ+yb4h8KGfXvAfmazpKAs9m3NxCBycf36++wQ1MZAUOeeK78FmdfByvB6djnq4eFVa7n44sJVkeGaMxzRNseNgQUPoc9/amsqshVlzmv0Q+Nn7M+hfEWyuNa8PRwaT4mVSyzRptiuD2WQdOfUCvgnxH4a1vwn4judC8QafLZ39uSrxOuOc/eB7qR0r9ByzOKeNiknaXY8TEYWdJ+RnR3En2WW2MsnlSsryJu4Zl6MR6jpn0JqJuST600e4p25SMY6V6sYpbHM3cbNHugI7YOfyr9cvBCBPhroCr/ANA236/9clr8kXZVgAPfP8q/XDwYB/wrrQcdP7Ot/wD0UtfHcWbUvmeplnU+XPjv+zT8QfiH8btR8W+H30wWVzFAiiecq+UXByMcVwFl+xZ8UJXJu9V0C0U8gGRnP6Cvv4rnGT0o246814VDPsXRpqnBqyOyWCpylzM+Z/h9+x14O8N3cOp+LNSn8RX0eCse3yrcfVRyfxr6RsdOs9OsYrOytoreCEbY4olCqg9ABU5A6EcU4kV59fF1cS+arK50U6UafwoTgNS4+bNGASDS1gaBRRRQAU0j5806k53H0oARhlT+XFfnn+114DuPC/xoPiO3gb+z9cHm7wMhJgMEfj6V+hmQa80+N/w1tvih8LLzQlVRqEP+kWcp6pIBxj69K9LKMb9UxKm9mc+Ko+0hY/Lk7Q59a1PD/iHUvDHiK017SLp7a9s5FkiZT1x1X6MMg/Wq2paVqOjavPpur2klpfW8rRzROMbGHXHt6VACApAAJIxX6fJU61Oz1iz55twlp0P04+C/xq0D4seFUuLWaK31iFQL3Tyw3I/cj1FepqQ2QWBIr8hNB17VfDOsw6xoN9Lp99B9yaJiDj0PY9B1zX0P4W/bS8eaXaLDruh6drhAAM3mmGT6kgYP5V8NmPDdWE3PD6p9D1qGPi42mfe2K5nx14G0Dx94RudA8Q2qz28qHa+cNE3ZlPY1558C/j3F8aLjWIV8PPpD6YsZcNcCYSb88jHTGO9ezj51BI98V85OFTDVbS0kj0IyjUjpsfmt8Uv2bvHvw5uZrq006XW9DViY7u0HmOq9fnUcjHTPfGa8aYLG+2U+Wf8ApoAhH1BOR+Nfsc0UbKysoIbgjHX61yuq/DH4ea5M0ureC9Du5WJZnks03Me5JA5r6XCcUVIR5a0bnnVMuTd4s/JoEZ2BkLHpsG7+teu/DD9nX4hfEa7ilOnS6NpDlQ9/dptO0nkqh5zjtX6DaX8Lvh3o0m/TPBWhW7eq2aE/qDXWrEiIFVVAHQAYAoxXFNSceWlGwUsuUdZM4b4Y/C7wx8L/AApDo3h+1G7YBPdScyTN3JPp7V3WFBo4B5pcAtmvl51JVJOU3dnpRioqyEx3pR0oPSgdKko+LP26Ru1zwf8A9crgfqtfH/cZ9a+w/wBuYga54Pz/AM85/wCa18fEruFfpfDv+5wPnsd/GZveDQD8SvDx/wColbf+jBX64rwv41+R3gth/wALN8OD11S3/wDQxX65L92vnuK/41P0O7LfhYvek46Uv8VGBnNfKnpiHmkMY+n0p9Nz2pAeR/E/9njwB8S7OWW602PTtUOSl/aDY2445cD73T+dfDfxU+BPjb4VXrS6lam90hz8mp26ZQDOPmA6HjpX6gcfSqmo6XYarps1hqVtFdW0y7JIpVDKwPtXsZdndfBtK94+ZyV8LCrtufjyWBUEDK9j6+9IQjkh1yvof0r6h/aA/ZhvPCjz+K/AVvPeaKzb7rT4xuktOOSnqp6+1fLzCRT8wH4DFfoWCx9HG0+an80eHVoypSsye6uprqTzJ5XlfAG6Q7jgDAH0wKh+85IpFIB+alVgM49K7UuhkfQn7Gn/ACci3/YJuf8A0Ja/Q+vzz/Y0C/8ADR0uOo0q4x/30tfoZ3r824j/AN9l6I9/AfwkNavgP9tbn48af/2CI/8A0N6+/Gr8/wD9tRj/AML8sMnj+yIv/Q3pcOf78vRhj/4TPm7Ar039n0f8ZQ+DMf8AP63/AKJevMwQRXpn7Pp/4yi8FD11Aj8PKb/E193mH+7VPQ8Oh/EifqInelPWkXqaU9a/KD6kWiiigAooooAKKKKACiiigBDj0o49KWigBMj0pe1FFABR2oooAb1Brm/iF/ySnxIR/wBAy4/9FmukAxmsfxVpMuueCtV0eCRElvbSS3Vn6AspHP51VN8s02TNXTsfkOivsz2x/QUBGMbEDpX09/wxL8Qt5x4k0NQcjDBifzoj/Yi8frLl/FGhgYxwrf57V+lRz3BJK89jwJYOrd6Hs/7F+7/hny4z21a44/Kvo2vKvgF8MtW+FPwxfw1rN9a3k5unuBJbggYbtzXqhGa/PsdUjUxE5xd02e5Qi401Fle7z9klx/cP8q/IXW1d/F2pjGf9Ll/9DNfr5cR+Zaywg4LoVBPbIxXw7q37FXjm/wBdvL2LxLoiRzzvKqyI24BmJAPvzXscO46jhJzdZ2ucmOoyqJcqPlcIyk5A6V9w/sORlfh/4oGP+Yiv/oArz5f2I/iAP+Zo0Ej/AK5tX0P+z18INZ+EXhfVtM1jUbS8lvbsTq1spAAC4r0s8zXDYnDOnSldmGDw04VLyWh7T6CgdaPQUvevij1wowPSiigBDil6iiigAooooAQUjdc0oGFprLu74+lJg9j8pvi8GHx/8aMen9rTD9a4jaxGa+wfHf7IfjfxT8UNd8SWWv6NDBqF29wiTKxYA+uK50fsRfEDGT4o0EfRXH8q/R8JnWDhQjGU9UjwqmFqOTaQ79h9Afi74hbA40gf+jlr7vAxjFfOX7PPwA8R/CLxhquq67q1hex3lmtugtQ3ykOG5z9K+jFyRk4/CvjM6xEK+KlVpu6PTwkHCnaQ485r82f2sEZv2rdcUAY+zWv/AKKr9JSMgjFfKnxr/Zg8UfEj4x3vi7Sda0y2t7mKJPLuQxIKKR2rbIsVTw2J56rsrMnGU5VIWifDiofM5Fe3/sjyY/ap0dcdbS7H/jprrl/Yj+IO7nxLoHT0kr0P4K/sv+LPhr8YNP8AFup65pNxbW0MkJit1YE7xjivpcxzfCVcNOnGd20efh8JUjNSkj6vBHA70UoGABSYxzXwJ7g1iMYJr83v2rvEF5q/7Seq2kzMYdNjS2hUsSE+UFto7Z+XOOuBX6QvkDjr0FfAP7YfgS+0T4wnxfDbNJpmrQq7ybTtjkTCsCegJyMA+le7w5KCxa5+xw49P2eh83oOc52k+lALIwK54Oc+/rTmVhIc8Z6A8YpuWVlVRlmOAP77E4Ar9Ik1FNvY8G3Y/QL9jTxLPrXwJuNKumY/2TfvbRFmJ+RhvUD2GTxXvWt6JpfiLQZ9H1qxgvbO4TbLBOoYN+Brx/8AZT8C3Xgr4EwzanC0OoavO1/LEykFFI2oCD0O0frXuikMOlfk+Y1I/W5zpdz6WhF+zSkfmp8evgPqfwn8SHUtOElz4VumCW9zK2TbseBG5P6N3rxkKQ+3aK/XfxL4Y0vxZ4WvvD+t2wnsb2ExSI3VcgjIPrzXxrqX7EfittYum0nxNpSWW8/ZvPVmkCZ4Vq+qyjiCnycmJlZo87E4F816aPlURsY2wBX29+wwCPAPi0H/AKCif+gGuA/4Yj8fqnHinQTyDho3r6E/Z1+D+tfCDw1rWma3fWd3Nf3i3KtbZwAFx3qM9zTDYnC8lKV3dDweHqU6l5LQ9sz1oHSjsRQBgV8WeuLRgUUUAGAOgppKgc06g9KAEyCucV5H8b/gjonxZ8LsRGltr1tGfsV+oAOeoR+5U9Oeletk4XpSnlaujWnRmqlPdEygpLlZ+P8Ar+ga14X8U33hzXbV7XULJ9ksTjH/AAIHuprNUMQeBmv0g+PfwAsPi3Y21/p7W+n6/Adi3cgOHj5+Q499p/Cvn0/sRfEEk48T6Ao642Nmv0HBcRYepSTqytI8OrgakZe5sfMcyN5Ocdj/ACr9cfA+T8NtALf9A23/APRS18VP+xJ8QTGFfxJoTKM5AVge3+FfcPh3T5dK8Ladpkzq8lrbRwMy9CVUDj8q8PiLH0MUoKi72udmAozp35kaRIwOKXI9KPvClHAxXy56QnB7UuBRRQAUUUUAFFFFABRRRQAgA9KayqfmHB9RT6TNAHzT+0b+zsnj2zm8X+D4I4fEUSbprcKAt6oGR/wMdq+Db6zvNO1GbTr+3ltbu3kMckMi4cEevoK/YV03R8da8n+KnwE8EfFO283UraWx1dQBHqdoAJV5/i7EHp+NfSZPn0sL+6raxPOxeC9p70Nz8zRuxgjHvTWf5sYyR617546/ZK+Jvhd5JtCtl8SWCn5TZlRMBz95G69O1eLah4T8VabMYtS8MaxYyAlcT2Trkj0O3Br7ShmWGrLmhM8meHnHRo+p/wBhlydf8Xqw/wCXe3P/AI8a+1BgLnFfFv7D9lfW2veLmurS4gUwW6qZYmTJ3E4GRX2kvQ/WvzzO2pYyck7nu4JNUkmLkbc0mc84FOHSjtXlHUNz7CgHIzinUUAJgEg4paKKAEPSgUEZFA6UAfFX7de7+3PBoHeK4/mtfIZRgRkV+h37SHwJ8RfGHUNCn0LUtOtF09JFf7UDk7vTHavDB+xJ8Rid7eI/D5JP+3X3OS5phaGGjTqzSaPGxeFqTqOUUeA+DVdfif4aOOP7Vtv/AEMV+uKH5K+H9C/Y28faV4t0rV5vEeiMlnexXDoquchTnjNfb8YKxDdgt3x614/EONpYqpGVJ3VjpwFKdOL5yTvS0mPmzS188egFGB6UUUAIQPSm5UnBAp9JjnNAEU0McqOkiBkZSrKR94HrXxD+0z+zquhpd/EDwPZObEtvvtPiUDyCeskajjb6joOTX3EG+bFQ3NulxC8UsayRupV43GVYHqDXbgcdUwdVVIfMxr0Y1Y2Z+ObIQwI2sD0K8gj1HtQFYkjA5FfZfxD/AGMr/WPHl5qXg3V7DT9LuHM32a63MUdiSduOgyeK5Jf2I/iIpP8AxU+gY+klffU+IMHOF5Tt5HiSwVVOyRjfsZKV/aOcHvpNxz/wJa/Q4cAV8wfAP9m/xL8K/ig/ifWdY027iazktRHaqwIJIOefpX0/6Cvis7xNPEYp1KTuj1sHCUKaUgPWvgH9tZP+L8acwAIbSIx/4+9ffjDB+tfM37Qf7O3in4s/EOz17QtV060hhsltmS73ckEnjH1pZLiYYfFKpUdkh4ynKdNqO58E+U4GccV6X+z+rf8ADT/gl8Y/4mP/ALTNeoL+xD8Q8c+JtBB9g5rsvhh+yZ4x8FfFzQfFep69pE8GnXJneOBDuPyFe/1r63G5zhJ0ZwjO7aPKpYOrGak0fYUedmT6U40icL1/Sl7V+envi0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAB6UnvS0UAJgdcUYHpSYOaMGgBe9A5oxg0tACEA8UYBGMUfSkIOOKAFwB0FGABgCkwaUZ70AHcCloyKMigAooyKMigAooyKMigAooyKMigAPSk9DS5FGRQAmB1xRtGc4pOc0UALgHtR3zSd+KXIoABnvRgYxilyKafagBcD0owAMAUlA96AF6YFKaKKACsLxX4U0Pxj4cn0LxDp0V9YTjEkMg/UHsRW4c9qKak4u63E0mrM+Q9a/Ye0ibU5ZvDvjO60+1Zspb3FqsxQem49a7T4b/sleBfBeqpq+t3EviLUYmDRPcRiOKIjoQg4Jr6IwPSjHtXfUzXFzhySm7GCw1JO9hiRpGgVFAUDAA7U45xwKM8cUueK85HRYFJIowDzijtxSHrTAXA9KMdqSlGBQAdzS0ZFGRQAUUhYCjIoAWiiigAPSkOR0paMigBO3NG0ZzSc556UnOaAHYHXFHvSc5pcigBR0ooyKMigAooyKMigAooyKMigAooyKMigAooyKMigAooyKMigBM+1HvilyKTnPtQAhUEggc1BNbQyt+9gjk/3kB/nU+DmjkUXa2Bq5DFa28JLQ28UbHglFA/kKmUALgdBS5oBovcNhaKTIoyKAFooyKMigAooyKMigAxSZO6lyKTigAx2owPSk7UUALgDtR0HFIOvNLkUALRRRQAUUUUAFFFFACd80gJzTqT1xQAEA9RRgelIQccUYNAC4GMCg57UAHvS0AJ3zRgDt1pabg0ALtGc4owM5xSYNHOaAF9TS9qKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKQnFAC0VBLcQwuolmRM9AzYzTRe2xPF1F/wB9CnZkOpBOzZZoquLu3P8Ay8R/99Cg3cIGfPT8xRyvsL2sP5kWKKrfa4OvnJj/AHhSi6hIyJ4/zFFmHtYfzIsUVB9qg/57p+dN+2W+f+PiP/voUcrD20O6LNH4VX+2W3/PzH/30KPtlv8A8/EZ/wCBCjlYe1h/MixRVb7VEzbUlVj6Aj/GvLtL+NVnffGq98AXGmG2a3kaJb0zAo7AZ6Y4+maai2Y1sZRpW55JXPWqKqpeQMgPmoP+BA077VB/z3T8xS5WbKtDuixRVc3cAP8Ar0/76FKLqAjP2iP/AL6FHKw9rDuT0VW+22wzm5iP/AxUkcwdFYEMGGQQcgj1osylOLdkyWkJwKM/LmjPHSkUGfag01nKngA/jUTXUUZIklVc9MsBQtROSjuycikA5qAXkBP/AB8R/wDfQoN7bDgzx5/3h/jT5WR7WHcs9KKrC9tv+fmL/voUouoj/wAtV/MUWYe1h3RYoqv9rt84FxH/AN9Cl+0w/wDPZPzosx+1h3RPRUP2iI9JkP40w3cC9ZkH/AhRZi9rDuizRVX7db7sfaI/++h/jS/bIWO1JEZsdAwosw9rDuWM80ZFeRT/ABqt7X47t8PLrTDCm8RC+eUbdxTcPlx36da9Uiu7eVgiTws5GQiuDTcWtWY0cZSrNxhLbQs5wM0tNUgrmnHpUnUFFITgdKhkuY4pAskiKW+6CwBP0oE5JK7J6KrfbLfOTcIo92FL9st+1zGfowp2ZHtYdyxRVcXcB6Tx/mKPtcH/AD3j/MUWfYPaw/mRYoqubuDtOh/4EKT7XF/z2j/76FFmHtYfzIs0VX+1wY/16fmKb9ttsZNxGP8AgQo5X2D20P5kWT0pKgW8tmOBcRH/AIEKDcxnIWVGOOgNHKw9rDuWBxS5ryfQPjTZ6t8X77wLcaabSS3keNbppwVkZeoxtHPtmvTlvYGOBcRZxyAwpuDW6MaOMo1k3GS00LX4UVB9qhJ4lT86PtMOf9en50rM29rDuieioPtUPaeP8xTfttuCQZ0+u4UcrD20P5kWaM84qJJlkUFGDAjIYcgin54pGi1FJwKM0mfakaRVUksoA9TQDdh9JnnGDVNdSs3m8tLuFn/uK4J/nVkSBjjI9smhq25CqRl8LuPIo59K8l8S/HDTPC/xlt/At/pcu2YxA33nBUjLjIyu3n869SS8gkK+XNGwbkYYc/SqcWjGli6VRyjGWq0ZYyPSlrybxT8aLTwt8X7LwVeaWXS58r/S/OChA5xnbjnH1r1AXkGP9fH/AN9ChwkugqWMo1HKMZarcs0fhVf7XD2njP4ij7XCPvSxgeu4UuVm3tYd0WKKqNf2icvdxKPdx/jUiXUMy7oZkkXuUOaLMaqwbsmT59qKjMqhSWYADnOaiivLeYkQ3EUuOuxwxFIbkk7N6k560Yry3xV8adN8K/FSz8GXens5uRGTeeeFVN5wMrt5/OvS47qGQLsmjYt0AYc1Tg1qYU8ZSqScISTa3LOaKQdB3pak6QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKRvu5paQ/doA8Z+PPgzxT4n0SzuPD16tstkHluGMxjJUKT1FfHX9t6lJKU/4SDUEUOVMhuHYDHUnHOK/SS4tobq3e3nRZIpFKujchgexrzHxD+z/8M9bhb/iQixlwcT2UhiYE/Tr9K6qFZRVmfI55kNbF1FWw87M+bPDPw38ZeM7IT+G/HWmahgZ8salIJB9VIyK6Rf2e/i9t51qAHvi/krmvGXgjxL8CvHFlq2l38s9mSZIrlMqZQuCY3GeTg8V7b4q/aV8PeHbSyi0/TptVvp7WO4eNJgiQ7hnaxP8AF1rWUpbxPEwuHwnvU8bJwlHz3PDfHPw88ffD7SrW913W5GjuJ/JHkXbsRxnvV3wp8IfiZ4w8JWviPSdaH2S6DGMSX8qt8rFTkD3U1qfGD4raJ8TfhxpDafFNaX1rflp7SU5IXZ1B7jJ/Svd/2d1B/Z38Pc5+Wbuf+e8maUpyjHmaFg8DhsXj5UqdRuNr7nh3/DPnxh/6DkQH/YRlpD+z38YiMnXIv/BjJX13d3trYWj3N5PHDCgy8kj7VUe5zXhfjr9prw9ozPY+Fbf+17vkCZn2QA/73eohVnLZHsYvKcvwcb1aj+88xl/Z6+Lsa721u0XHY6hJx+leeabpHivUviCngy11aYak1wbcF7tghIBJ5HsDXWS+IPjV8V5c6fJqclo/DC0XyLcA9SDzms34XWN1p37Smg2V9kXkOovHMCckERODk1urpXZ8vWjTnXpxpqSjJ2u2dVefCb4y+DbY+IrXUTNJa/vNttdPI2Ac/dPUcV52r6x46+JyPaBbfVtTuRkmQr8+ME+xr9CmiWSEq4yrAgg8gj0r4j8OWsVr+2RBa28axxJrDKAB0GCaijWu27Hq5zk0aE6MYzfLJq9zeH7PvxgZ939sQKD2N9IKkb9nv4tt11m2/wDA6SvrwD5FJJ5HNcz4v8e+GPBGnG717UooBjKx7vnb6DNZKvJvRHuVchwdGHPUm0vU+ZW/Z3+LZGF1uD/wNkrl/Gvwr8f+BvDp1fW9bjaFWCkQ3rlj+Gea7Txh+014h1q8/srwNYGzSQ7UlKebNJ9F/h9q858U+GPidd+G5fGXjeLURah1A+2y/MuehCcVvDmb94+XzB4XkawvPK32r6I1fAnwx8f+P/D8msaDrTLAkrQ/v7pwcgexr7H8FaXqei+BNI0nVphNeW9ssc0gOckV5P8AsqKT8Jb4sc/8TGT27CveQOMnrXLXl71j67h3BQp4aFe7u13HgcUjkAc0m45xXnPxr8dnwJ8Mbq9tpAuoXJ+y2vGcO38WPasox5nY9zE144elKrLZHB/Gj9oCPwneTeGfCbR3GrqMT3BG5LbPQcdWz2rxvTvAfxp8d2Mvie7ub1YJFMgmu7kwlhyflQdBXTfs8fDGPxhrFz458Rxm7t45z5Im5Ms2cs7H+IYyBX1yLaI2xheFdhXZtI42+ldMpxp6JHydDB183TrVpOMfso/NsapqSSmNtcvEw5Qu1y5AIODnFd34c+HPjDxpb+Z4c8b6bcn+KNr+VJB/wE819TeIvgZ8OPEEb+foEVrM2f3tmxiYe/HHU18y+Pvh7r/wN8aWOvaNqc0tnI58i5BKsG/55v61tGtGastzxMTk2JwEva15OVPyZrp+zn8YfLDHXLYe32+Suf8AG3wx+IvgHw/Hq2t64zQNII/3F3IeT9TXtviH9pbQdC0fTUsrKTVr+4t1lmWOQIkTY5BP1zXn3xT+MOhfEz4QR21tbvZajBeo8lnKclhjqpHWpjKd7SRvjqeXxozlSqvmt36mF4M+F3xJ8c+E49e0jxBJ9lkZkHm3bjODj1rfH7PXxaEZI1u33ds30let/s0pn4E2W5VGLiYgDgda9cuLq3tbV7m4lSKJBlndtqj8SaznWalZI9bAZFQq4WFWrN3a11PkYfs/fF8ddbt/+A30gNMk/Z7+LWwtJr8Sj3v5D/WvTPHv7Sfhnw+s1h4bQa1qC/KXRiIIz7sep9hXiEviv43/ABYu2iso9SltiS22yXyYFHTlu/WtIym9WeZjKeApvkouVSXk9jlZ9D8VW/xBHg7+25n1AzCEEXbbCT6HPNehXXwc+M/hyzOsW2pSubcGTFvds7YHsTg1xXhXTNU0P4/6RpWrqVvYNTjWQN82CR696+/jGGhwe+c/4UVqnLbQzyLKo42FSU5STi9NT88tU1XWPHPxEiuZG8nVL2aKHIcgpIAFzn14r6J+FPwl+IXhX4kwaxrmpxzWCxsGT7Q78n2NeSeINNtrH9sL7FawrFbjXYCFXjG7BP619xogAGPXNZ4iporI6uHMrU6tWdSTbjL7x0QxGMnNOPSk4AxTq5D74aeVrxn46eCvFHiiws7rQL5bWOyV5Ji0pjyMdsV7ORgGopoI54GimRZI2BDKwyCDVQdnc5cbhViaTpt2ufm6dX1bzSj67fRhThnE7lVPPXHbiu88O/Dnxn41sluPDnjfTr4AcxrqMgkH1UjI6V9Pa78DfhvrMUizeHo4HbpLauY3B55GPrXzZ4z8Ga18CPiBZa1pmoTyWMjl4pRkGRVILRuB1OGGD9a71Vi1aK1PzrEZJiMBL2laTlBvvsbUf7PPxc2gnW7fP/X9JXMeOvh74++HukW2oa7rTmGebyh9nunbHGe5r3Txd+0n4d8NpZ29hp1xql1Nbxzv5cgWOPcM7SxP3vavK/jN8VtG+JXw20s6bHLa3cF8TPaSnLAbOoPoTSjKd9Ub4+hl8aMvY1W5JdzN8KfB/wCJnjHwlaeItM11Ra3YLRCS9cNgEjkfUGtf/hnj4xZyNagx/wBhCSvdv2fo1H7P3h1snBhbuevmPXol/qVlpdg93qFxFbQIMtLKwVR+JrKdaSk0kevg8gw88NCtUk1da6nyJ/wzv8YOp1i1/wDA6Skl/Z5+LUcZeTXLZVxk51CTj9K9B8cftQaJpLPZeFLQanPtOLqZjHCD6+9eUjVPjb8XJTLaDUZLKQ4/cZtrYKe+TyRWkHN6s8vFUsBBuFBynLyZxOl6N4r1X4hJ4Ns9Xn/tB52hVpLtxGSoJPIPoDXfX3wo+NPgi1PiaC/aT7IPMZbK6eWQr3wrcEdKwfhRY3elftNaLp96wFxDfvFIoO7DBGB5r7raJZLZlk+ZSuCDznNKtU5WkLI8rjjKM6spSTW2ux+fFpHrfj34pK+nOtrqmp3BcnzSg3kfNj8hXpKfs8/FwlT/AGxD777+Qmsjwjaw2X7ZMdraxLHDHqsqqgHCjB6V9s9O3HTrRWrOKSSLyLJqeKjU9rJ6S7nyIP2evi4Pu67Co9Fv5QKZL+z18Wz/AMxq3J/vG+kP9a+k/GXxF8J+BrJrjX9VigOAUhDbpH/4CP5186+L/wBpTxP4guG0vwJprWSu2FmdfNmkH+yv8JpQqVJdDox+Cy3CaTqScuyZxfjL4V/ETwVoL6vrGtRNbqQu2G9kLk+wJ5pvgb4bfETx7ocuraDqxNukjRZlvHByB9ap+JfC/wAULnw9J4u8XrqDWhdWH22Q7xu5GE7fSvoX9llCvwrvgOANQkwMY7Crm3GFzycvwyxOYKm+aMbXWp6p4L0q/wBE8CaVpWqSCS7t4FjlcMTlvrXR4O3jGaFXA+Y5oPBwK4G9bn6dThyRUUYXinxTong/w3c65rt4tvawjJJ6sewA7k18neIPid8RvjB4pbRfB8V3aWW4hIrYlcKeA0rds+ldJ+1DYeL59YtLt0km8PKAsSQoTtl/2wM7u+PSuK8JfEvxj8MdCtY7XwlbWtjM255Z7V1e7b3kPf8ACuulTio8y3PiM3zCrUxH1ed4U1u11Ndv2efiva2P2+DVIDdD5/LS7kEh+hzitDwP8afF/gTxH/wjXxGhu5LMSbDc3PMkPQZH95OOv1r2yL4w+F1+E9r421CZLWKVSgt85YzDrGvrz3r5k1rVvF/x8+IpXTNLjRIUaOFQuFiTniVvXn+VVFud1JGGLjSwbhLA1HKb6XvoWPj/ADpqXxujvbOYSw3lhbS28qHAbnaGz+NXpPgt8bYdPW/ttQndgoZPKv2DEduD0rzC4ttS0zxba6TqolM1jcR22yXJ2hZM4Gf4c9PbFforYqDpcJHUxrz+Ap1p+zikjDJsCszr1qtVuMr9Gfnp4n1nxF4g8TWcWu7xq9osdiWckMSjYBJ9c16fH8APjEYgP7agYnqDqEuKzPjfYQWX7S6rbRhFke3lYDoWLDJr7SjG2AEjPfAJpVajjFNGuU5RHEV68a0n7r6M+NtS+BvxP0ixm1HUPEVna20ALPK9/IABivMtNk8Ta1ry6RpV5ql/dM5RY4JpHyP73XhfevYP2lPHV3rXjSH4faRKzwQMguUUnE0rEbVPPIzjivavg58LNN8BeEreSW3V9auU33Vywy3POwHsB6UOryxvIz/slYrGOhh5NRju7nhtj+z38Vr+3V7zVIbMEZ8ua7kZv0NUNT8OfGD4J3EPiCK/lns/MCv5UpeLA/56A9AeelfaTYRASQAOua8R/aL8Z6BY/DC/8OPd28uoagBFHbq/zDkEsfQD+tZwqubtY9bHZPQwdB1Y1GpLbXc8f8VfFvxp8VvFNj4Z8K/abO3mVVMMJKs7Yy7Mey5OBj0qa9+FXxn8F2MfiPT9RuJGh/eyw21wWZQOSMHqK5T4JeLNL8K/GCwv9YIjtrqN7YXD8eUT0z7dK+5oJbXUrJZbeaK4ikTh0bcrA1pVl7NpJaHm5Ph/7UpSrVqj9ottT8/PHXjW98beKLPXLuER3y20dvKBlVaVTgHnkdc17d8PPhF8UtL8d6NrmqaqH06JvNljF45yCMjg15l8dvDum6F8eruysY1jt7r7PcbB0VnIDY9BxX3JpSY0S0Gf+WSdO/yilVnaKsXkmWOpjarrSfNB9C8pygzTqbxnFOriP0AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkP3aWkP3aAI2IVMn0qlaavpupXUsFlew3DwMBJ5bhtp98VNqFqt5pk9q7OqyxmMshwwBGMg9jXxhPq3i/4A/FHUfLR7izuXZ83BOy5QkYIP94evvWlOCloeRmeZPBcspR0e9j2X9p8afJ8H9lxKq3K3cbW+T8xIPOPwryr4AfCay8Z6hceJPElgLrS4HMcMcw4mfruP06VzeqeIfHPx48fWuliLEauNkELExW6n7zn1bHGa+zPBfhWw8HeC7LQLBAIoEwTjlmPUn6muiUnThy3PncNh4ZvmDxUo+4tvM+Yf2h/hh4e8Gtp+veHLVbNLqQwyWqE7S2Mg8n9K9x+ABH/DPugepWY/nM9cJ+1kR/whGh5/5/2P5Rmu6+AJ/wCLAaCPabn/ALbPUzk3TVzowNCFHOKipqycT55/aF8ReLZ/ijf+H9U1CVNKiCvaWsJ2KyN0JIxk+xJFdT8FfAPwo1RYZr7WrfWtVUbmspD5aofaPIzXuvjL4Y+D/Hex9f0xZZ0GFnQlXA+orwjxt+zRqmjIdY8CX8115J3LayORKuOflfrVQnFxtszjxmU4uhjJYpx9pHe3Y+orSxsLGyWCwtoYIR0SFQqj8BXxh4XG79tJQTn/AInlx/6DJ/gK7j4VfHrU9P1ceDfiIZ1nDBI7ycYkRicBJAec+9cP4WIf9tCOaM5R9bndSOjKY36fnRCDV7hmWPoYv6u6Ss1LVdj7Y48sj2r4l0XK/toRk/8AQbYfoa+2f+WZ/GvirRSp/bPiHU/2038jUYfqz0+IvioL+8fWHj681jT/AIbateaA4jv4bZniYruwQPT1r4R06ePxd4zil8c+JpYYZWzLeSqZT1PAXovOe1folLFHJCySIGVl2kEdRXi3ij9mjwFrXn3GmJPpV1IxfdA+U3Hn7nSihUjG6YcQZViMXyTou6W67m/8M/BHw20jRI7rwktjqDvy18WE0jEH1PTHTAxWN+0wpHwGu8Hg3MPP/Aq8N1Twt8TfgN4kXWNJunm0wffniy0Eg9JF6Ke2a7Px/wDFPS/iT+zdeEIttqcM8BuLTduwd3LKe496tRbndbHA8fSWDqYWpD2c7bdzrf2UufhNfhuf+JlJ/IV711FeC/sqMG+E99t6f2nLz/wEV71/DWFf4mfQ5E/9hpegjEAZNfKP7W+oSnV9A0sykRiGacp23ZABr6uIBxXyn+1tpR/tnw9qrn5PKkg57nqKeG+Mw4lu8DK3dHuPwe0mHRfgt4etIIhGDarI4Hdm5JruWIGTnHGSc1w3wh1iDWPg3oN1ExOLVYmz6rwa7S6gFxbSQsflkQqccHnjipqP3mmehgWvqsORaJFW11rS769mtLO/tp7mADzY4nDFM+teTftMpYS/BO4F26LMlzE0G7qzA84/CvFvED+LPgJ8YLrULCOSfTbti4muCxW4QkkKzd2Bz17YrI1vxd45+PXjLT9Lis0ESMu20gJaOH1kf14/KtoU+Rqdz5rMM69vSnhnB870SNz4B/Cqz8Za5ceINfs/O0iybakTg7Z5D9OoFb37Qvws8O+GNJg8UeHbdbAvOttcQRZCknowyeMe2K+jfBPhSx8GeCLHQbBVCW8YVmAGXfux9ST3ry79qXaPhHbbuc6hH1/3Wpqq51Lk18lo4XKpKUfftd+po/s1E/8ACiLUnki4mx+deQftKa/4xX4hSaBd3ssOhPCJIIYztEnrnA559a9h/ZoIb4E2uOP9Jm/9CrtfGXw68KeOYol1/TUnkiUpHMp2ugPYNU8yjUbZ2PA1MZlVOlSlZ2R85fBLwJ8KdSMN1ruuRalqpyw064PkpGfZSfmr6ssbCwsbIW2n2cNtCo+VIVCrj6Cvmnxv+zJPYwNqngbUHkkiIcWVw/zN67ZOoYdqpfDL45a/4W1keD/iIJzCreUt1c5EtuegVieWH+1TmvaaxZx5bX/sxqhi6Sjf7Xc5bXU/4zUxxj+2E4H0r7VBHkE+ma+KtTuIbn9skXEbB1k1aNkZehXaMEV9qjhMeuaVfSx1cNyTeIa7nxR4pbP7axXt/btt/IV9trjHHavhrxI5P7achJOf+EggH8q+5F45pV+hpw6/frv+8OPbilG7vTSwB5OPxpcgiuc+nQp5WmyHah5Ax3JxTu1VdTtFv9KuLN3dFmjKbkbay5HUHsaaFJ2TsQ2Wq6bqUky2N7BcmBtknlOG2N6cV5B+05a2M3wgUzyxrcx3SPbhvvMe4H4V4wmteMP2ffiZqUDQtc6dcOZCLg4W6UkYcHuw6Z9zWRrvirxr8ePHllpFvAViWUeVDCd0Vv0y7e4HeuqFLlak3ofGZjnSxFCWFcH7R6W/U3/gH8J7PxprFz4j8Q2Pn6TaHZFFJkiaTH8hVz9or4aeH/Br6dr3h60W1W7l8mS3QnbuAznk19OeBvCdh4N8FWmg2AHlwL8z5yZHPLMfqa8U/a02p4P0ALxi9Y/jtpxqudQjE5NRwmUvmj76W56F8A3D/s/eHypz+7ft/wBNXr5t+P2v+LZfivqWg61qUrWELCS1tIztQxN90nGMkcdc19H/ALP/AD+z14cx3hkJP/bV62vGXwq8FeOJ1utf0lJrpV2i4VijgDtuHaojNQqu6O6vgKuNy2nTpSs7HinwS8DfCG+iW4k1m31/Vo8F7ec7FjPtGTz+tfS8Nta2tksVpDHHCowqRqFA/AV8s+Nf2atW0JjrHgLUJ7poD5i2kj7ZVxzlJOueOKt/C348axYa3/whvxBM5l3iKO6nUiSNj0WTPJ/3jV1IqfvRZyZbiVl1qGJpKL/m7nDeCxn9sxcnP/E6uG/HBr7ZGPKI9h/KviXwEwk/bHikzuDavcupHTBVsV9uADYeO1RX3idXDLUqVVrq2fF3hvA/bTP/AGF5P5GvqX4k3mvaf8MdXvfDLiPUYrcvGzDOMdcD1xXy14adT+2e4wM/2zKP0NfZ7wxzQtFMoaN1Ksp6EGnWdmmTw/D2lKvFO15M/OvSmtfFfjmKXxv4jubWKRh5186mUnnoB/COtfafw58G/DXSNFhuvCENlfMV5vfMEztz1yc4/DFc34m/Zs8A6z502mwTaVdOSwaGQ7M/7nSvFdU8I/E34DeIRrWj3xn0sv8ANcxKTG691kj6A9RmrclNWTseXhsJVyio6mIp88X9rdo9y/aSXHwLuthIP2mLmsz9lo5+Ft/uOf8AiYyfyFcd45+LWl/En9my9dI0t9Vhli+0WZO4r8wy4P8Ad9DXYfsskP8AC3UMf9BGT+QqXFxpandQxNLE5xCpSenKe8DlcmkYZ+lKPu0N0rkPsyGWFJYyJEVwexGa8P8A2mNZ0Ww+Ez6RO8f267kQW8WMsMHJb24r3XjHTpXnvxM+E3h74kWkJvy1pewn5LyEYkC/3c9ce1aU5Wldnm5phZV8NKnTS5mfIngPwF4p+J+oW2lWs0w0i1c77pz+7hB6hR03HHXrX2n4J8CaD4H8MxaRo1oiIoBkmI+eZu7Mepq14T8JaL4Q8OQ6No1nHbwRAZ2qMu3die5NdAMEE4q6tZz0ODJsjp4GCc9Z9z4r+PUEcP7Sb+UgUSC0d8dz8q5/IV9mWQxpsI/6Zj+VfHPx9Zf+GkVX/YtP/QhX2Naf8g2L/rmP5U63wI5si/3vE+p8ZfHlz/w0uOfum1A/76FfZhYLp5k/uqTXxf8AHY/8ZPEHpm1/9Cr7QCb7Mp2K1VZ+7EjJU3icVbufEvwytIvF37VUc+op9oVr24u23k87AwU8ehxX3AihThRj1r4i+HN1H4I/arNvqeI401C5s2b+6HyV/UivtxDlQ24EHpU4hbGnDFlCrf4uZ3OQ+KWk6xrnwv1PTdBZ1v5ExEySbCDn1r5w8Nfs0eNNa1uK58Z3yW1oApmbzTNLIO4BPSvsHAJpAgDZHFZwqOCsj08bk9DGVI1Kutuh4D8SP2c9O1+yguvCTpYX1tAsPlSL+7nC5wSex9x6CmfAz4beOvB3iq/m8VNKlp5IWBFuTJGGz2GfSvoHaucjg+tGxRzgU/atqzM45FhaddYimuVrotj4o/aPOP2iGAxj7NaH/wAeFfZ2nAf2RbAdPLX+Qr4y/aMKD9ohi3/Pvaf+hivs/TxnTIMcfIv8q0q/Ajz8k/37E+pZI+anUn8VLXMfVBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUHpRRQA0jmszWNC0bXLT7NrGl2t/Dn/V3EQcZ9ea1aPwp3a2InBTVpK6MTRfDHh/w/EYtF0ey09D1FvCqZ/Eda2OBwKcRkij+LpQ23uEKcaa5YKyPnT9rHH/CHaDyB/pr9T/0zNdz+z4MfADQif8Apt/6Oeu81rw5ofiGBINa0y2vo0O5VmQMFPqKtaXpljpGnR2Om20dvbR52RRjCrkknA+pNaOacOU8mllkoY6WKb0asW+/tTSAwIp5JoUnuKyPZPFPjd8HrTxno0niDSYFh12zjLq6jHnqBnafrXzf8JklT9oDw6k+RMt8yyKTypCNmvvplDLyPwrAj8FeFodYGqw6HYx3gYuJ0iAcE9Tn8TXRCtZWZ8xmPDsMRiYYmno07s3P+WZ+lfE2g7F/bQRmdT/xOm7+xr7ZKjGa5uPwF4Rg8Rf25FoNkt+XMn2gRjfuPfNTTqKN0d2aZdPFum4v4Xc6UH06AV4J+0f4/wDFfhGDSrHw3dtp6XQd5bxR02/w+1e9geg61ma34b0PxFaC11zTbe+hByEnQMM1nCSTuzrx+HqV6Dp0pWfc8p+BHifV/Hnw3voPFgN8sU3kLPMnMykck9jjp+FeGfGz4TSeAddOo6OhbQr6QlEBP+jPnJX6elfZ2maPYaNpyWGlWcNpbLnEcQ2qOc8Ck1TRtM1vT2tNWs4ruBjnypkyK1jW5ZXR5OJyH61g40qrvUS3PFv2Vxt+FuoYIOdSkI+m0V710WsrRtA0jQLRrbR9PgsombeUhXaCa1AOlZVJc7bPWy7CywuHjRbu0g/DvXCfFjwDF8QvAFzo6yeTeJia2lx911zgH2Peu9PTimtkpj1ojLlaaN8Th4YinKnPZnw/4M+InjP4K6vd6BqWjs1qJcS2szFQjD+KNuhBFd3bftQ6lqvjPTLK20GCDT5rhY5vnMshU98DpivovWfC3h3X1VNZ0m2vtvTz4g2PxqlpPw/8GaFdi50nw5p9pN/z0jhAYfQ9q2dWElqtT5yhlGOoS5KVX3L7Gvc2GnazZhL+yguomGQk8YYcj0NRaT4e0TQ42XSNKs7LJJPkwhOpyelaiqF4yTTwc9qx5nsfSKjBtSaV+9hnRc9ce1eFftTjd8JLTkD/AImEZ5P+y1e8dQazNY0HSNeshaaxp8F7CG37Jk3DNFOXLJMwzDCvFYeVFO1zyz9mdSnwMtxn/l5lP617J0FZ+k6Pp2i2C2Wl2MVpADxFEMKK0ugFOcuaTZWBw7w9CFJ9FYYVUnpXk3xl+Eun+O/Dj39hFFb67bKWguAOXAB+Q/WvXDnFMdNxAPIPUYpRm4u6Hi8JTxVN06i3Pzy8EW9zb/GXQra8QxXMOpIkqueVYEgjn/PNfoSObdsEdDWC/gbwpJrg1iXQbE32/wAz7QYhu3eua6FUG3Ax+ArSpV57XPKyXKJZdCcG7pnxD4lx/wANoy4Zf+Q/bnqPQV9tudsLOqksFP6Vz83gPwhJrx1qXQLNr8yCU3Hlgvu9c10m5UjySAPypVJ89rG2WZdLCOrKT+J3PiHxf8ZviVZfFTUprbxFPbQWd1JFHY7AItquQNyHk8Ac96+wfBuuN4k8DaVrjxeS17bJMV9yK+dfi8PDXxH+JFl4S8FWNtc6w84N7qlsoZUUdQxHXFfS2iaXBpHh+x0q34itIkjT6KMVpVcXBWODJadeGKrc8+aHQ1D0pGGR0zTqK5j6gy9W0LSdbtvs2rada3sX9y4iEgH59Ki0fwzoGgxmLRtGsrBe4t4VTP1I61sZ9qOpHFO72MnRg5c9tRoAHGMV85ftagf8IloHIH+mN1P+zX0f3rH1vw1oXiONIta0y2vUjO5BMgYA1dOXK7nJmeEli8PKjF2ucV8AFx+z74cH/TB//Rr16VjPXkVV0zTLHSNNisNNto7a2iBEcUYwqjJPA+pNXeQBgVM5c0mzbCUHRowpvohhUFeRXjfxs+Edr4u0WbXtIiSHWraMvuUYMwAztNezgk9RTWUMmGHHpRCbg9CcbgqeMpOlUR8G/BeJ4/2iNAikBSUTyeYhOSCEbOa+7+cN9KxIPBnha21waxb6FZRX2SftEcQD8jB5+lbpUYweaupU52mcGTZVLL6UqTd7s+J/DKg/toBg6nGsyk8/7LV9sKPl5rAi8FeFrfWv7Xt9BsVvt5fz1iAfJ6nNdAAB2pVKnPY0yrLnglNSd+Z3PAf2jviD4p8JDSrDw7evpq3IeSW8UenAXJ6VqfAfxPrHj34aXtv4sX7YYJvs6zTLzOhXJJ7Hrj8K9U1zwzoXiS0Fprmm299Cp3Kk67gDU2k6Lpmh6cunaVZRWtsvSOJdoHOf60+dW8yFl1Z411pzvBrbofGfxs+Eh+H2ujUdFU/2BfOcIM/6O+c7foa9h/ZWRk+GWo5/6CL/AMhXt2paPpusWRtdSsobqHOfLmUMKj0nQtK0Kza10ewgs4mbcUhTauap1rx5WcmGyCOHx/1qm9H0NMcKKXuKToAKWsD6UQ8UhGTTqKAGEYHFKO9L3pD1oA+Lfj+M/tKDBH3LT/0Ja+yrP/kGQ/8AXMfyrL1Dwj4a1XUjf6ho1lcXOB++kiDPx05raRQsYVVAAGABWs5qSSPHy/LpYatVqt/Gz4m+N5X/AIakcb1z5lpwSP7wr7VRSYAB1xWFqHgXwhqut/2vqOgWNxfDH+kSRgtx710aqAvrmipPmSQZflssLVq1JP43c+XP2h/hRqk2vr4+8M2sk7EL9shhXLqQRiRR3OcZ9s1i+Gv2nNe0LQhpWuaPBf3FuPLWcy+UTj+8pr68kRXQggY965TUfhv4G1e6NxqHhnTZpScljCAT9fWrVZWtI4cVktaNaVfBVOVy3R578FfjLqXxE1vU9O1fT1t5Yx51s0CEx+VnGC3rmvbU5AbGMjNZmj+H9G0KD7No+nW1lFjG2GMLn8utaorGbTd0e3gqVWlSUa0uaXcTOaD0pcfNmjrnNSdVtLHxL+0UM/tFnDL/AKqzGM/7VfZ+mnGk256/u1/kKydT8F+F9Z1P+0dU0Oyurr5f30sQZvl5HPtW7EgjiCqAABgAdq1nUTikeRgculhsRUqt35yT+KloNFZHsBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABzSc5paKAGlaUDApeaKADtRRRQAhzjpSAH0p1JzQAmD6UuB6UtHNACYNBFLRzQFhu3ijBx0p1FArDcEjpQBinUUBYKQ5xxS0UDG4PpQRmnUc0CsNAx2pR0paKAsFJilooGJjpxS0UUABpCPrS0UAIAaMUc0tArCYGelRTRrIhR1BU8MD3GMVLzR9aBtXVmcr4a8A+F/Cc1xNomlRW8tw7SSy/eYknJ5Pua6hVGOBT/wFJjjim3ciFKEFywVkLRRRSLCjmiigBO9IRznFOo5oAbjjpTh0oooAKTmlooAbj2oxz0peaWgLCY56Uc56UvNFADce1Lj2peaKAG80YI96dRQAUUUUAFFFFABSEHNLRQA3HPSnUnNLQFhpHtS84GKOaWgBDkjpSYp1JzQAY5oGcml5ooAKTnJ9KWigBuOaU5xwKOaWgLBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAHPrRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//Z" alt="নাগরিক সেবা"></div>';
}
function nsSlideTo(mode) {
  var card = document.getElementById('nsSlideCard');
  if (card) card.classList.toggle('ns-slide-signup', mode === 'signup');
  try { if (location.hash !== '#/' + mode) history.replaceState(null, '', '#/' + mode); } catch (e) {}
}
function nsSlideTogglePass() { var p = document.getElementById('suPass'); if (p) p.type = (p.type === 'password' ? 'text' : 'password'); }
async function nsSlideSignup() {
  var name = document.getElementById('suName').value.trim(), email = document.getElementById('suEmail').value.trim(),
    phone = document.getElementById('suPhone').value.trim(), password = document.getElementById('suPass').value;
  try { await nsCall('/auth/signup', 'POST', { name: name, email: email, phone: phone, password: password }); showModal('সাইনআপ সফল', 'এখন লগইন করুন।'); location.hash = '#/login'; }
  catch (e) { showModal('সাইনআপ হয়নি', e.message); }
}
function nsLoginPortalHTML(mode) {
  mode = mode || 'login';
  if (mode === 'forgot') return '<div class="ns-login-wrap"><div class="card ns-login-card">' + nsLoginLogoHTML() +
    '<p class="ns-login-sub">পাসওয়ার্ড ভুলে গেছেন?</p>' +
    '<p class="muted">ইমেইল বা রেজিস্টার্ড ফোন নম্বর লিখুন। কোনো রিসেট ইমেইল পাঠানো হয় না — আপনার অনুরোধ অ্যাডমিনের কাছে টিকিট হিসেবে যাবে, অ্যাডমিন যোগাযোগ করে রিসেট করবেন।</p>' +
    '<label>Email / ফোন নম্বর*</label><input id="authEmail" placeholder="youremail@gmail.com বা 01XXXXXXXXX">' +
    '<p><button class="btn ns-login-btn" onclick="nsDoForgot()">অনুরোধ পাঠান</button></p>' +
    '<p class="ns-login-foot"><a href="#/login"><b>লগইনে ফিরুন</b></a></p><p class="muted" id="authMsg"></p></div></div>';
  var signup = (mode === 'signup');
  return '<div class="ns-slide-page">' +
    '<div class="ns-slide-brand">' + nsLoginLogoHTML() + '</div>' +
    '<div class="ns-slide-card' + (signup ? ' ns-slide-signup' : '') + '" id="nsSlideCard">' +
    '<form class="ns-slide-form ns-slide-form-login" onsubmit="event.preventDefault();nsDoLogin();">' +
    '<h2>লগইন করুন</h2><p class="ns-slide-sub">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>' +
    '<label>Email / মোবাইল নম্বর*</label><input id="authEmail" type="text" autocomplete="username" placeholder="youremail@gmail.com বা 01XXXXXXXXX">' +
    '<label>পাসওয়ার্ড*</label><div class="ns-slide-passwrap"><input id="authPass" type="password" autocomplete="current-password" placeholder="পাসওয়ার্ড"><button type="button" class="ns-slide-eye" onclick="nsToggleDesignPass()" aria-label="পাসওয়ার্ড দেখান/লুকান">👁</button></div>' +
    '<div class="ns-slide-row"><label class="ns-slide-remember"><input id="authRemember" type="checkbox"> আমাকে মনে রাখুন</label><a href="#/forgot">পাসওয়ার্ড ভুলে গেছেন?</a></div>' +
    '<button class="ns-slide-btn" type="submit">লগইন</button>' +
    '</form>' +
    '<form class="ns-slide-form ns-slide-form-signup" onsubmit="event.preventDefault();nsSlideSignup();">' +
    '<h2>অ্যাকাউন্ট তৈরি করুন</h2><p class="ns-slide-sub">আপনার তথ্য দিয়ে নিবন্ধন করুন</p>' +
    '<label>নাম*</label><input id="suName" type="text" autocomplete="name" placeholder="আপনার নাম">' +
    '<label>Email*</label><input id="suEmail" type="text" autocomplete="email" placeholder="youremail@gmail.com">' +
    '<label>ফোন*</label><input id="suPhone" type="text" autocomplete="tel" placeholder="01XXXXXXXXX">' +
    '<label>পাসওয়ার্ড* (কমপক্ষে ৮ অক্ষর)</label><div class="ns-slide-passwrap"><input id="suPass" type="password" autocomplete="new-password" placeholder="পাসওয়ার্ড"><button type="button" class="ns-slide-eye" onclick="nsSlideTogglePass()" aria-label="পাসওয়ার্ড দেখান/লুকান">👁</button></div>' +
    '<button class="ns-slide-btn" type="submit">রেজিস্ট্রেশন</button>' +
    '</form>' +
    '<div class="ns-slide-panel">' +
    '<div class="ns-slide-panel-view ns-slide-panel-loginview"><h2>হ্যালো, নাগরিক!</h2><p>নাগরিক সেবায় স্বাগতম। এখনো অ্যাকাউন্ট নেই? নিচের বোতামে চাপ দিয়ে দ্রুত নিবন্ধন করুন।</p><button type="button" class="ns-slide-panel-btn" onclick="nsSlideTo(\'signup\')">রেজিস্ট্রেশন করুন</button></div>' +
    '<div class="ns-slide-panel-view ns-slide-panel-signupview"><h2>স্বাগতম ফিরে আসার জন্য</h2><p>আগেই অ্যাকাউন্ট আছে? লগইন করে আপনার ড্যাশবোর্ডে ফিরে যান।</p><button type="button" class="ns-slide-panel-btn" onclick="nsSlideTo(\'login\')">লগইন করুন</button></div>' +
    '</div></div></div>';
}

function nsToggleDesignPass() { const p = document.getElementById('authPass'); if (p) p.type = (p.type === 'password' ? 'text' : 'password'); }
async function nsDoLogin() {
  const identifier = document.getElementById('authEmail').value.trim(), password = document.getElementById('authPass').value;
  const rememberEl = document.getElementById('authRemember');
  const remember_me = !!(rememberEl && rememberEl.checked);
  if (!identifier || !password) { showModal('লগইন হয়নি', 'ইমেইল/ফোন নম্বর ও পাসওয়ার্ড লিখুন।'); return; }
  const btn = [...document.querySelectorAll('.ns-slide-btn')].find(b => b.textContent.trim() === 'লগইন');
  if (btn) { btn.disabled = true; btn.textContent = 'লগইন হচ্ছে…'; }
  try { const r = await nsCall('/auth/login', 'POST', { identifier, password, remember_me }); nsSetToken(r.token, remember_me); await nsRefresh(); location.hash = '#/dashboard'; render(); }
  catch (e) { if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = 'লগইন'; } showModal('লগইন হয়নি', e.message === 'invalid_credentials' ? 'ইমেইল/ফোন নম্বর বা পাসওয়ার্ড ভুল।' : e.message); }
}
async function nsDoForgot() {
  const identifier = document.getElementById('authEmail').value.trim();
  if (!identifier) { showModal('পাসওয়ার্ড রিসেট', 'ইমেইল বা ফোন নম্বর লিখুন।'); return; }
  try { await nsCall('/auth/forgot-password', 'POST', { identifier }); showModal('পাসওয়ার্ড রিসেট', 'অনুরোধ জমা হয়েছে। কোনো রিসেট ইমেইল পাঠানো হয়নি — অ্যাডমিন আপনার অনুরোধ দেখে যোগাযোগ করবেন।'); }
  catch (e) { showModal('পাসওয়ার্ড রিসেট', e.message); }
}
async function nsDoSignup() {
  const name = document.getElementById('authName').value.trim(), email = document.getElementById('authEmail').value.trim(),
    phone = document.getElementById('authPhone').value.trim(), password = document.getElementById('authPass').value;
  try { await nsCall('/auth/signup', 'POST', { name, email, phone, password }); showModal('সাইনআপ সফল', 'এখন লগইন করুন।'); location.hash = '#/login'; }
  catch (e) { showModal('সাইনআপ হয়নি', e.message); }
}
const _origRender = render;
render = async function () {
  const hash = location.hash.replace('#/', '') || 'dashboard';
  if (hash === 'login') { try { await nsRefresh(); } catch (e) {} document.querySelector('#main').innerHTML = nsAuthHTML(); return; }
  if (hash === 'logout') {
    if (nsToken()) { try { await nsCall('/auth/logout', 'POST', {}); } catch (e) {} nsSetToken(''); NS_STATE.user = null; NS_STATE.wallet = null; }
    document.querySelector('#main').innerHTML = '<div class="card"><h2>লগআউট</h2><p>সার্ভার সেশন শেষ হয়েছে।</p><p><a class="btn" href="#/login">আবার লগইন</a></p></div>'; return;
  }
  try { await nsRefresh(); } catch (e) {}
  if (hash === 'recharge/zammpay-success' || hash === 'recharge/zammpay-cancel') {
    document.querySelector('#main').innerHTML = '<div class="card ns-rch"><h2>রিচার্জ যাচাই</h2><p id="nsZammStatus" class="muted">পেমেন্ট যাচাই হচ্ছে…</p><p><a class="btn" href="#/recharge">রিচার্জ পেজে ফিরুন</a></p></div>';
    nsZammpayPoll(hash === 'recharge/zammpay-cancel'); return;
  }
  _origRender();
  // Dashboard: real balance (prototype hard-coded ৳ ১০).
  const bal = document.querySelector('.bal-amount');
  if (bal && NS_STATE.wallet !== null) bal.textContent = '৳ ' + NS_STATE.wallet;
  if (!nsToken()) { const card = document.querySelector('.profile-card'); if (card && !document.getElementById('nsLoginBtn')) { const a = document.createElement('a'); a.id = 'nsLoginBtn'; a.className = 'btn'; a.href = '#/login'; a.textContent = 'লগইন / সাইনআপ'; a.style.margin = '10px'; card.appendChild(a); } }
  const parts = hash.split('/');
  if (hash === 'recharge') {
    const btn = [...document.querySelectorAll('#main .btn')].find(b => b.textContent.trim() === 'Recharge');
    if (btn && !document.getElementById('rchMethod')) {
      const wrap = document.createElement('div');
      wrap.innerHTML = '<label>পেমেন্ট মাধ্যম*</label><select id="rchMethod"><option>bKash</option><option>Nagad</option><option>Rocket</option><option>Bank</option></select><label>যে নম্বর থেকে পেমেন্ট*</label><input id="rchSender" placeholder="01XXXXXXXXX"><label>Transaction ID*</label><input id="rchTrx" placeholder="TrxID">';
      btn.parentNode.insertBefore(wrap, btn); btn.setAttribute('onclick', 'nsRechargeSubmit()');
    }
    // Compact history: one small row per recharge (no wide tables,
    // no Search/pagination chrome). Auto rows show as ZammPay অটো.
    const hist = document.getElementById('nsRchHist');
    if (hist) hist.innerHTML = NS_STATE.recharges.length ? NS_STATE.recharges.slice(0, 30).map((r) => `<div class="ns-rch-row"><span class="ns-rch-amt">৳ ${r.amount_bdt}</span><span class="ns-rch-meta">${r.channel === 'zammpay' ? 'ZammPay অটো' : esc(r.method)} · ${esc(r.trxid)}</span><span class="ns-rch-st ns-st-${esc(r.status)}">${esc(r.status)}</span><span class="ns-rch-date">${esc((r.created_at || '').slice(0, 10))}</span></div>`).join('') : '<p class="muted">এখনো কোনো রিচার্জ নেই</p>';
  }
  if (parts[0] === 'service' || parts[0] === 'order') {
    const card = document.querySelector('#main .card');
    if (card && !document.getElementById('nsOrderBtn')) {
      const b = document.createElement('p'); b.innerHTML = `<button class="btn" id="nsOrderBtn" onclick="nsOrderSubmit('${parts[0]}','${parts[1]}')">অর্ডার করুন (ব্যালেন্স থেকে কাটবে)</button> <span class="muted">এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না</span>`;
      card.appendChild(b);
    }
    if (parts[0] === 'order') {
      const tbl = document.querySelector('#main table');
      const mine = NS_STATE.orders.filter(o => o.service_id === parts[1]);
      if (tbl && mine.length) tbl.innerHTML = '<tr><th>NO</th><th>COST</th><th>STATUS</th><th>CREATED</th></tr>' + mine.map(o => `<tr><td>${o.id}</td><td>${o.amount_bdt}</td><td>${esc(o.status)}</td><td>${esc(o.created_at || '')}</td></tr>`).join('');
    }
  }
  if (parts[0] === 'history') {
    const tbl = document.querySelector('#main table');
    const mine = NS_STATE.orders.filter(o => o.service_id === parts[1]);
    if (tbl && nsToken()) tbl.innerHTML = '<tr><th>ID</th><th>AMOUNT</th><th>STATUS</th><th>CREATED</th></tr>' + (mine.length ? mine.map(o => `<tr><td>${o.id}</td><td>${o.amount_bdt}</td><td>${esc(o.status)}</td><td>${esc(o.created_at || '')}</td></tr>`).join('') : '<tr><td colspan="4">এই সার্ভিসে এখনো কোনো অর্ডার নেই</td></tr>');
  }
};
// Sidebar: add a Login entry (Account section) once, if not logged in.
(function () {
  const sc = document.querySelector('.sidebar-scroll');
  if (sc && !document.getElementById('nsSidebarLogin')) { const a = document.createElement('a'); a.id = 'nsSidebarLogin'; a.href = '#/login'; a.innerHTML = '<span>লগইন</span>'; sc.appendChild(a); }
})();
nsRefresh().then(() => render()).catch(() => {});
/* ===== Step 3 (staging only) — notices, password change, devices =====
   Appended after the Step 2 patch. Design/layout/Bengali text preserved;
   only the previously notice-only / sample-data spots below call the API.
   No personal-data delivery. */
async function nsLoadNotices() {
  try { const s = await nsCall('/notices'); NS_STATE.notices = s.notices || []; } catch (e) { NS_STATE.notices = []; }
}
async function nsChangePassword() {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'পাসওয়ার্ড বদলাতে প্রথমে লগইন করুন।'); return; }
  const pw = [...document.querySelectorAll('#main input[type="password"]')];
  const oldP = pw[0] ? pw[0].value : '', nw = pw[1] ? pw[1].value : '', cf = pw[2] ? pw[2].value : '';
  if (!oldP || !nw || nw !== cf) { showModal('পাসওয়ার্ড পরিবর্তন', 'পুরাতন ও নতুন পাসওয়ার্ড ঠিকভাবে লিখুন, নতুন দুটো মিলতে হবে।'); return; }
  try { await nsCall('/auth/change-password', 'POST', { old_password: oldP, new_password: nw }); showModal('পাসওয়ার্ড পরিবর্তন', 'পাসওয়ার্ড বদলে গেছে। অন্য ডিভাইসের সেশন বাতিল হয়েছে।'); }
  catch (e) { showModal('পাসওয়ার্ড পরিবর্তন', e.message === 'invalid_old_password' ? 'পুরাতন পাসওয়ার্ড ভুল।' : e.message); }
}
async function nsRevokeDevice(id) {
  try { await nsCall(`/me/devices/${id}/revoke`, 'POST', {}); render(); }
  catch (e) { showModal('ডিভাইস', 'সরানো যায়নি: ' + e.message); }
}
const _renderStep2Client = render;
render = async function () {
  await _renderStep2Client();
  const hash = location.hash.replace('#/', '') || 'dashboard';
  if (hash === 'dashboard' && nsToken()) {
    await nsLoadNotices();
    const main = document.querySelector('#main');
    if (main && NS_STATE.notices.length && !document.getElementById('nsNotices')) {
      const d = document.createElement('div'); d.id = 'nsNotices'; d.className = 'card';
      d.innerHTML = '<h3>নোটিশ</h3>' + NS_STATE.notices.map(n => `<p><b>${esc(n.title)}</b> — ${esc(n.body)}</p>`).join('');
      main.prepend(d);
    }
  }
  if (hash === 'profile' && nsToken()) {
    const btn = [...document.querySelectorAll('#main .btn')].find(b => b.textContent.trim() === 'Update Password');
    if (btn) btn.setAttribute('onclick', 'nsChangePassword()');
  }
  if (hash === 'devices' && nsToken()) {
    try {
      const s = await nsCall('/me/devices');
      const card = document.querySelector('#main .card');
      if (card && s.devices) {
        const t = document.createElement('div');
        t.innerHTML = '<h3>আসল ডিভাইস / সেশন</h3><table><tr><th>IP</th><th>ডিভাইস</th><th>অবস্থা</th><th>অ্যাকশন</th></tr>' + s.devices.map(d => `<tr><td>${esc(d.ip || '—')}</td><td>${esc((d.user_agent || '').slice(0, 50))}</td><td>${d.revoked_at ? 'বাতিল' : (d.current ? 'বর্তমান' : 'সক্রিয়')}</td><td>${d.revoked_at ? '—' : `<button class="btn ghost" onclick="nsRevokeDevice(${d.id})">Remove</button>`}</td></tr>`).join('') + '</table>';
        card.appendChild(t);
      }
    } catch (e) {}
  }
  // Order-closed message: if an order attempt fails with orders_closed, nsOrderSubmit already shows the API message.
};
/* ===== Step 4 (staging only) — UID, real counts, tickets, server photo =====
   Appended after the Step 3 patch. Design/layout/Bengali text preserved
   except the spots below, which now use the API instead of placeholders.
   - UID comes from the server (/me.uid, format BD-######, unique).
     The QR button only DISPLAYS that UID; it is NOT an encoded QR code.
   - Dashboard service-card "কার্ড তালিকা" counts and Profile Cards Lists
     come from /me/order-stats when logged in. When logged out they show
     a login prompt, not sample numbers. The "$ X কার্ড খরচ" price display
     is deliberately untouched (server-copy $1 vs 25/10 is still open).
   - Report/Support now create real tickets via /tickets. Live Chat is
     still only a notice — no chat backend is faked here.
   - Profile photo: when logged in, save/remove go to /me/photo on the
     server (validated image, max 512KB decoded; the staging client
     already downscales to max 512px JPEG before upload, so no server
     resize is needed in this build). When logged out, the old
     localStorage-only behaviour is kept as fallback.
   - Autoload / captcha / BRN-random are deliberately left as
     placeholders: they belong to personal-data services and must not
     deliver real personal data.
   No personal-data delivery. */
NS_STATE.photoData = NS_STATE.photoData || '';
NS_STATE.photoFetched = false;
NS_STATE.stats = null;
NS_STATE.tickets = [];
async function nsTicketSubmit(kind) {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'টিকিট করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const subj = document.getElementById('nsTicketSubject'), bod = document.getElementById('nsTicketBody');
  const subject = subj ? subj.value.trim() : '', body = bod ? bod.value.trim() : '';
  if (!subject || !body) { showModal('টিকিট', 'বিষয় ও ব্যাখ্যা দুটোই লিখুন।'); return; }
  try { const r = await nsCall('/tickets', 'POST', { kind, subject, body }); NS_STATE.tickets.unshift(r.ticket); render(); showModal('টিকিট জমা হয়েছে', 'টিকিট #' + r.ticket.id + ' — স্ট্যাটাস: open। অ্যাডমিন জবাব দিলে এখানেই দেখা যাবে।'); }
  catch (e) { showModal('টিকিট হয়নি', e.message); }
}
const _origSaveProfilePhoto4 = saveProfilePhoto;
saveProfilePhoto = async function () {
  if (!nsToken() || !__pendingPhoto) return _origSaveProfilePhoto4();
  try { await nsCall('/me/photo', 'POST', { data_uri: __pendingPhoto }); NS_STATE.photoData = __pendingPhoto; __pendingPhoto = ''; render(); showModal('ছবি সংরক্ষণ করা হয়েছে', 'প্রোফাইল ছবি সার্ভারে সংরক্ষিত হয়েছে।'); }
  catch (e) { showModal('ছবি আপলোড', 'সার্ভারে সংরক্ষণ হয়নি: ' + e.message); }
};
const _origRemoveProfilePhoto4 = removeProfilePhoto;
removeProfilePhoto = async function () {
  if (nsToken() && NS_STATE.photoData) { try { await nsCall('/me/photo', 'DELETE'); } catch (e) {} NS_STATE.photoData = ''; }
  try { localStorage.removeItem(PHOTO_KEY); } catch (e) {}
  __pendingPhoto = ''; render();
  showModal('ছবি সরানো হয়েছে', 'প্রোফাইল ছবি সরানো হয়েছে। এখন আবার জেনেরিক আইকন দেখা যাবে।');
};
const _origProfileAvatarHTML4 = profileAvatarHTML;
profileAvatarHTML = function () {
  if (NS_STATE.photoData) return '<span class="avatar-ph avatar-photo"><img src="' + NS_STATE.photoData + '" alt="প্রোফাইল ছবি"></span>';
  return _origProfileAvatarHTML4();
};
const _origProfilePreviewHTML4 = profilePreviewHTML;
profilePreviewHTML = function () {
  if (NS_STATE.photoData) return '<img id="photoPreviewImg" src="' + NS_STATE.photoData + '" alt="প্রোফাইল ছবি">';
  return _origProfilePreviewHTML4();
};
const _renderStep3Client = render;
render = async function () {
  const hash = location.hash.replace('#/', '') || 'dashboard';
  const parts = hash.split('/');
  if (nsToken() && !NS_STATE.photoFetched) {
    try { const ph = await nsCall('/me/photo'); NS_STATE.photoData = ph.data_uri || ''; } catch (e) { NS_STATE.photoData = ''; }
    NS_STATE.photoFetched = true;
    try { NS_STATE.stats = await nsCall('/me/order-stats'); } catch (e) { NS_STATE.stats = null; }
    try { NS_STATE.tickets = (await nsCall('/tickets')).tickets || []; } catch (e) { NS_STATE.tickets = []; }
  }
  if (!nsToken()) { NS_STATE.photoData = ''; NS_STATE.photoFetched = false; NS_STATE.stats = null; NS_STATE.tickets = []; }
  await _renderStep3Client();
  const main = document.querySelector('#main');
  if (!main) return;
  // UID + QR display (server UID only; never the old #BD-982410 sample).
  const uidEl = document.querySelector('.profile-uid');
  if (uidEl && NS_STATE.user && NS_STATE.user.uid) uidEl.textContent = 'UID: #' + NS_STATE.user.uid;
  else if (uidEl && !nsToken()) uidEl.textContent = 'UID: লগইন করুন';
  const qrBtn = document.querySelector('.qr-btn');
  if (qrBtn && NS_STATE.user && NS_STATE.user.uid) qrBtn.setAttribute('onclick', "showModal('QR কোড','UID: #" + NS_STATE.user.uid + " — এই বোতামটি শুধু UID দেখায়; এটি এনকোড করা QR কোড নয়।')");
  else if (qrBtn && !nsToken()) qrBtn.setAttribute('onclick', "showModal('লগইন প্রয়োজন','UID দেখতে প্রথমে লগইন করুন।')");
  // Guest balance: login prompt instead of the sample ৳ ১০.
  if (!nsToken()) {
    const bal = document.querySelector('.bal-amount');
    if (bal) bal.textContent = 'লগইন করুন';
  }
  // Dashboard service-card counts: real order counts when logged in.
  if (hash === 'dashboard') {
    const cards = document.querySelectorAll('#service-cards .svc-card');
    cards.forEach((card, i) => {
      const svc = SERVICES[i]; if (!svc) return;
      const spans = card.querySelectorAll('.svc-body span');
      if (spans.length < 2) return;
      if (nsToken() && NS_STATE.stats) spans[1].textContent = (NS_STATE.stats.by_service[svc.id] || 0) + ' কার্ড তালিকা';
      else if (!nsToken()) spans[1].textContent = '— কার্ড তালিকা';
    });
  }
  // Profile page: real balance/UID header, real Cards Lists, server-photo note.
  if (hash === 'profile') {
    if (nsToken() && NS_STATE.user) {
      const firstP = document.querySelector('#main .card p');
      if (firstP && firstP.textContent.indexOf('Balance: 10') !== -1) firstP.textContent = NS_STATE.user.name + ' • Verified: Yes • Balance: ' + (NS_STATE.wallet != null ? NS_STATE.wallet : '') + ' • UID: #' + (NS_STATE.user.uid || '');
    } else if (!nsToken()) {
      const firstP = document.querySelector('#main .card p');
      if (firstP) firstP.textContent = 'লগইন করলে আপনার আসল প্রোফাইল দেখা যাবে।';
    }
    const heads = [...document.querySelectorAll('#main h3')].find(h => h.textContent.indexOf('Cards Lists') !== -1);
    if (heads && heads.nextElementSibling && heads.nextElementSibling.tagName === 'P') {
      if (nsToken() && NS_STATE.stats) {
        const by = NS_STATE.stats.by_service || {};
        const m = [['NID', 'nid'], ['Smart NID', 'snid'], ['BRN', 'brn'], ['Server Copy', 'servercopy'], ['OTP Server Copy', 'sc'], ['Sign to Server Copy', 'ssc'], ['Tin', 'tin'], ['NID Correction Form', 'ncf']];
        heads.nextElementSibling.textContent = m.map(([label, id]) => label + ': ' + (by[id] || 0)).join(', ');
      } else if (!nsToken()) {
        heads.nextElementSibling.textContent = 'লগইন করলে আপনার আসল কার্ড তালিকা দেখা যাবে।';
      }
    }
    if (nsToken()) {
      const note = [...document.querySelectorAll('#main p.muted')].find(p => p.textContent.indexOf('শুধু এই ব্রাউজার') !== -1);
      if (note) note.textContent = 'লগইন থাকলে ছবি সার্ভারে সংরক্ষিত হবে, তাই একই অ্যাকাউন্টে অন্য ডিভাইসেও দেখা যাবে।';
    }
  }
  // History when logged out: login prompt instead of sample rows.
  if (parts[0] === 'history' && !nsToken()) {
    const tbl = document.querySelector('#main table');
    if (tbl) tbl.outerHTML = '<p class="muted">লগইন করলে আপনার আসল হিস্ট্রি দেখা যাবে। <a href="#/login">লগইন</a></p>';
  }
  // Report / Support tickets (Live Chat untouched — still only a notice).
  if ((hash === 'report' || hash === 'support') && !document.getElementById('nsTickets')) {
    const kind = hash === 'report' ? 'report' : 'support';
    const d = document.createElement('div'); d.id = 'nsTickets'; d.className = 'card';
    if (!nsToken()) {
      d.innerHTML = '<h3>আমার টিকিট</h3><p class="muted">টিকিট করতে প্রথমে <a href="#/login">লগইন</a> করুন।</p>';
    } else {
      const mine = (NS_STATE.tickets || []).filter(t => t.kind === kind);
      d.innerHTML = '<h3>আমার টিকিট</h3><label>বিষয়*</label><input id="nsTicketSubject" placeholder="বিষয়"><label>ব্যাখ্যা*</label><textarea id="nsTicketBody" placeholder="ব্যাখ্যা"></textarea><p><button class="btn" onclick="nsTicketSubmit(\'' + kind + '\')">জমা দিন</button></p>' +
        '<h3>আগের টিকিট</h3>' + (mine.length ? '<ul>' + mine.map(t => '<li>#' + t.id + ' — ' + esc(t.subject) + ' — ' + esc(t.status) + '</li>').join('') + '</ul>' : '<p class="muted">এখনো কোনো টিকিট নেই।</p>');
    }
    main.appendChild(d);
  }
};
/* ===== Step 5 (staging only) — FIX: hashchange was bound to the ORIGINAL
   prototype render before the Step 2-4 patches reassigned render().
   So every sidebar click ran the prototype (sample data, demoMsg
   modals, old logout page, #/login -> "page not found") and none of
   the API wiring. Re-bind hashchange to the final patched render.
   Also: remove/replace the remaining demo buttons that would still
   show "currently not on" modals, and make the closed-order banner
   follow the real server setting. No design/Bengali/price change
   except the notes below. Personal-data services stay order-request
   only: no document is ever delivered, no external lookup is called.
   Live Chat stays a notice only. Server-copy $1 dashboard display
   is deliberately untouched (price question still open). */
try { if (typeof _origRender === 'function') window.removeEventListener('hashchange', _origRender); } catch (e) {}
window.addEventListener('hashchange', function () { render(); });
/* Honest replacements for lookup-style helpers (never fake a result). */
openAutoload = function (id) {
  showModal('অটোলোড', '<p>স্বয়ংক্রিয় লুকআপ এখানে চালু নয় — কোনো আসল তথ্য লোড করা হয় না, কোনো টাকা কাটা হয় না।</p><p>তথ্য লিখে "অর্ডার করুন" বোতামে ক্লিক করলে শুধু একটি অর্ডার অনুরোধ রেকর্ড হবে, অ্যাডমিন সেটি দেখে স্ট্যাটাস আপডেট করবে।</p>');
};
randomBRN = function () {
  showModal('বার কোড / QR', '<p>এখানে কোনো আসল জন্মনিবন্ধন কোড বা QR লিংক তৈরি হয় না। নকল কোড দেখানো হয় না।</p><p>তথ্য লিখে অর্ডার করুন — সেটি শুধু একটি অনুরোধ রেকর্ড।</p>');
};
const _origSaveProfileUpdate5 = saveProfileUpdate;
saveProfileUpdate = async function () {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'প্রোফাইল আপডেট করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  return _origSaveProfileUpdate5();
};
function ns5Note(text) { const s = document.createElement('span'); s.className = 'muted'; s.textContent = text; return s; }
const _renderStep4Client = render;
render = async function () {
  const hash = location.hash.replace('#/', '') || 'dashboard';
  const parts = hash.split('/');
  if (hash === 'logout' && !nsToken()) {
    document.querySelector('#main').innerHTML = '<div class="card"><h2>লগআউট</h2><p>আপনি লগইন করা নেই।</p><p><a class="btn" href="#/login">লগইন / সাইনআপ</a></p></div>';
    return;
  }
  let orderOpen = true;
  try { orderOpen = !!(await nsCall('/settings')).order_open; } catch (e) {}
  await _renderStep4Client();
  const main = document.querySelector('#main');
  if (!main) return;
  const btns = [...main.querySelectorAll('button')];
  const replaceBtnWithNote = (btn, note) => { const p = btn.parentNode; if (p) { p.replaceChild(ns5Note(note), btn); } };
  /* Service pages: Save & Print is not a real delivery — remove it. */
  if (parts[0] === 'service') {
    btns.forEach(b => { if (b.textContent.trim() === 'Save & Print') replaceBtnWithNote(b, 'Save & Print এখানে নেই — নিচের "অর্ডার করুন" দিয়ে অর্ডার করুন।'); });
    /* Step 9: original file inputs are KEPT and wired in the Step 9
       wrapper below — clicking the existing upload control actually
       uploads. They are no longer replaced with a note. */
    /* Captcha reload (ncf) has no real captcha system. */
    btns.forEach(b => { if (b.textContent.indexOf('Reload Captcha') !== -1) b.setAttribute('onclick', "showModal('ক্যাপচা','ক্যাপচা সিস্টেম এখানে চালু নয় — তথ্য লিখে অর্ডার করুন, অ্যাডমিন যাচাই করবে।')"); });
  }
  /* Order pages: banner + note must follow the real server setting. */
  if (parts[0] === 'order') {
    main.querySelectorAll('.closed').forEach(d => { d.textContent = orderOpen ? 'অর্ডার গ্রহণ চালু আছে।' : '⚠ নতুন অর্ডারের অনুরোধ বর্তমানে বন্ধ আছে।'; if (orderOpen) d.className = 'notice'; });
    main.querySelectorAll('p.muted').forEach(p => {
      if (p.textContent.indexOf('সাবমিট বোতাম নেই') !== -1) p.textContent = orderOpen ? 'অর্ডার গ্রহণ চালু আছে — "অর্ডার করুন" দিয়ে অর্ডার করুন।' : 'অর্ডার গ্রহণ বন্ধ থাকায় অর্ডার করা যাবে না — অ্যাডমিন চালু করলে আবার করা যাবে।';
      if (p.textContent.indexOf('মোট দাম “?”') !== -1) p.textContent = 'এই সার্ভিসের মূল্য নির্ধারণ করা হয়নি — অ্যাডমিন মূল্য বসালে অর্ডার করা যাবে।';
    });
    const total = document.getElementById('totalNote');
    if (total && total.textContent.indexOf('?') !== -1) total.textContent = 'এই সার্ভিসের মূল্য নির্ধারণ করা হয়নি — অ্যাডমিন মূল্য বসালে অর্ডার করা যাবে।';
  }
  /* Recharge: Delete / Delete All have no API endpoint — remove them. */
  if (hash === 'recharge') {
    btns.forEach(b => { const t = b.textContent.trim(); if (t === 'Delete' || t === 'Delete All Recharge History') b.remove(); });
  }
  /* History: replace the prototype Edit/Print/Delete note. */
  if (parts[0] === 'history') {
    main.querySelectorAll('p.muted').forEach(p => { if (p.textContent.indexOf('Edit =') !== -1) p.textContent = 'এখানে আপনার আসল অর্ডার ইতিহাস দেখা যাবে; অর্ডার স্ট্যাটাস অ্যাডমিন আপডেট করবে।'; });
    btns.forEach(b => { const t = b.textContent.trim(); if (t === 'Edit' || t === 'Print' || t === 'Delete') b.remove(); });
  }
  /* Report / Support: original demo Submit / placeholder buttons removed;
     the Step 4 ticket form below is the real one. */
  if (hash === 'report') btns.forEach(b => { if (b.textContent.trim() === 'Submit') b.remove(); });
  if (hash === 'support') btns.forEach(b => { if (b.textContent.trim() === 'সাপোর্ট') b.remove(); });
  /* Profile: prototype logout note + guest password button. */
  if (hash === 'profile') {
    main.querySelectorAll('p.muted').forEach(p => { if (p.textContent.indexOf('প্রোটোটাইপ') !== -1 && p.textContent.indexOf('লগআউট') !== -1) p.textContent = 'লগআউট চাপলে সার্ভার সেশন শেষ হবে।'; });
    if (!nsToken()) btns.forEach(b => { if (b.textContent.trim() === 'Update Password') b.setAttribute('onclick', "showModal('লগইন প্রয়োজন','পাসওয়ার্ড বদলাতে প্রথমে লগইন করুন।');location.hash='#/login';"); });
  }
  /* Devices: remove the sample table when logged in (real table is appended by Step 3). */
  if (hash === 'devices' && nsToken()) {
    main.querySelectorAll('table').forEach(t => { if (t.textContent.indexOf('•••.•••') !== -1) t.remove(); });
    main.querySelectorAll('p.muted').forEach(p => { if (p.textContent.indexOf('কোনো আসল IP') !== -1) p.textContent = 'উপরে আপনার আসল ডিভাইস / সেশন দেখা যাবে।'; });
  }
  /* Dashboard service cards are <article> with no link — make them open their service page. */
  if (hash === 'dashboard') {
    const dcards = document.querySelectorAll('#service-cards .svc-card');
    dcards.forEach((card, i) => { const svc = SERVICES[i]; if (!svc) return; card.style.cursor = 'pointer'; card.onclick = () => { location.hash = '#/service/' + svc.id; }; });
  }
  /* Dashboard Orders Logs muted "সব ০" text when logged in. */
  if (hash === 'dashboard' && nsToken()) {
    main.querySelectorAll('p.muted').forEach(p => { if (p.textContent.indexOf('সব ০') !== -1) p.textContent = 'নিচে আপনার অর্ডারের আসল সংখ্যা দেখা যাবে।'; });
  }
  /* Free tools. */
  if (parts[0] === 'free') {
    if (parts[1] === 'signature' && !document.getElementById('nsSigCanvas')) {
      const card = main.querySelector('.card');
      if (card) {
        const d = document.createElement('div');
        d.innerHTML = '<h3>আপনার স্বাক্ষর আঁকুন</h3><canvas id="nsSigCanvas" width="320" height="140" style="border:1px solid #ccc;border-radius:8px;background:#fff;touch-action:none"></canvas><p><button class="btn ghost" id="nsSigClear">মুছুন</button> <button class="btn" id="nsSigDl">PNG ডাউনলোড</button></p><p class="muted">স্বাক্ষর শুধু আপনার ডিভাইসে আঁকা ও ডাউনলোড হয় — সার্ভারে পাঠানো হয় না।</p>';
        card.appendChild(d);
        const cv = document.getElementById('nsSigCanvas'), ctx = cv.getContext('2d');
        ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#111';
        let drawing = false, last = null;
        const pos = e => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [t.clientX - r.left, t.clientY - r.top]; };
        const start = e => { drawing = true; last = pos(e); e.preventDefault(); };
        const move = e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; e.preventDefault(); };
        const end = () => { drawing = false; };
        cv.addEventListener('mousedown', start); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
        cv.addEventListener('touchstart', start, { passive: false }); cv.addEventListener('touchmove', move, { passive: false }); cv.addEventListener('touchend', end);
        document.getElementById('nsSigClear').onclick = () => ctx.clearRect(0, 0, cv.width, cv.height);
        document.getElementById('nsSigDl').onclick = () => { const a = document.createElement('a'); a.download = 'signature.png'; a.href = cv.toDataURL('image/png'); a.click(); };
      }
      btns.forEach(b => { if (b.textContent.trim() === 'Make Signature') b.setAttribute('onclick', "showModal('স্বাক্ষর','উপরে ক্যানভাসে স্বাক্ষর আঁকুন, তারপর PNG ডাউনলোড করুন।')"); });
    } else if (parts[1] === 'tininfo' || parts[1] === 'dobfinder') {
      btns.forEach(b => {
        if (b.textContent.trim() === 'Find Tin Info' || b.textContent.trim() === 'Find Birth Date') {
          b.setAttribute('onclick', "showModal('অনুসন্ধান','এই তথ্য অনুসন্ধান এখানে চালু নয় — কোনো আসল টিন / জন্ম তথ্য দেখানো হয় না। অনুমোদিত উৎস ছাড়া লুকআপ করা যাবে না।')");
        }
      });
    }
  }
};
/* ===== Step 6 (staging only) — REAL Live Chat + honest form summaries =====
   Live Chat: #/livechat, GET/POST /chat/messages, polled every 5s while
   open. No bot, no fake messages, no WhatsApp link invented.
   Quick Access Live Chat tile now links to #/livechat (was a notice).
   NID / birth-registration create forms: NO official document is ever
   generated — no government logo, seal, card or certificate layout.
   The order flow saves the entered application data as an order record
   (POST /orders, Step 2/5), and the service page now shows a plain,
   clearly-marked summary note: this is NOT a government NID / birth
   certificate, only the user's own application record. Excluded services
   (IMEI, location, call list, biometric) are untouched by this patch. */
NS_STATE.chat = [];
async function nsChatLoad() {
  if (!nsToken()) return;
  try { NS_STATE.chat = (await nsCall('/chat/messages')).messages || []; } catch (e) {}
}
async function nsChatSend() {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'চ্যাট করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const el = document.getElementById('nsChatInput'); const body = el ? el.value.trim() : '';
  if (!body) return;
  try { await nsCall('/chat/messages', 'POST', { body }); if (el) el.value = ''; await nsChatLoad(); render(); }
  catch (e) { showModal('চ্যাট', 'মেসেজ যায়নি: ' + e.message); }
}
function nsChatHTML() {
  if (!nsToken()) return '<div class="card"><h2>লাইভ চ্যাট</h2><p class="muted">চ্যাট করতে প্রথমে <a href="#/login">লগইন</a> করুন।</p></div>';
  const list = (NS_STATE.chat || []).map(m => `<p><b>${m.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}</b>: ${esc(m.body)} <span class="muted">${esc(m.created_at || '')}</span></p>`).join('') || '<p class="muted">এখনো কোনো মেসেজ নেই — নিচে লিখে পাঠান, অ্যাডমিন জবাব দেবে।</p>';
  return `<div class="card"><h2>লাইভ চ্যাট</h2><p class="muted">এটি ইন-অ্যাপ চ্যাট — কোনো বট নয়, অ্যাডমিন সরাসরি জবাব দেবে। WhatsApp লিংক এখানে নেই।</p><div id="nsChatList">${list}</div><label>মেসেজ*</label><textarea id="nsChatInput" placeholder="লিখুন…"></textarea><p><button class="btn" onclick="nsChatSend()">পাঠান</button> <button class="btn ghost" onclick="nsChatLoad().then(render)">রিফ্রেশ</button></p></div>`;
}
const _renderStep5Client = render;
render = async function () {
  const hash = location.hash.replace('#/', '') || 'dashboard';
  if (hash === 'livechat') {
    await nsChatLoad();
    document.querySelector('#main').innerHTML = nsChatHTML();
    if (window.__nsChatTimer) clearInterval(window.__nsChatTimer);
    window.__nsChatTimer = setInterval(async () => { if ((location.hash.replace('#/', '') || '') === 'livechat') { await nsChatLoad(); const l = document.getElementById('nsChatList'); if (l) l.innerHTML = (NS_STATE.chat || []).map(m => `<p><b>${m.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}</b>: ${esc(m.body)} <span class="muted">${esc(m.created_at || '')}</span></p>`).join('') || '<p class="muted">এখনো কোনো মেসেজ নেই।</p>'; } else { clearInterval(window.__nsChatTimer); } }, 5000);
    return;
  }
  await _renderStep5Client();
  const main = document.querySelector('#main');
  if (!main) return;
  // Quick Access Live Chat tile -> real chat page.
  const qaChat = [...main.querySelectorAll('.qa-tile.qa-chat')];
  qaChat.forEach(t => {
    const a = document.createElement('a'); a.className = t.className; a.href = '#/livechat'; a.innerHTML = t.innerHTML;
    t.replaceWith(a);
  });
  // Step 8: the Step 6 bottom honest note is superseded by the single
  // disclaimer inside the top document-upload section (Step 7, moved to
  // the top by Step 8 below). Do not append a second copy here.
  // Order-success modal already says "no personal document" (Step 2); nothing to fake here.
};

/* ===== Step 7 (staging only) — Document upload + CLIENT-SIDE auto-fill =====
   What this does (and does not do):
   - Upload: on service pages, the file field actually works. The user
     picks an image (JPG/PNG/GIF/WebP) or PDF (checked by magic bytes,
     max 5 MB for reading). A preview/filename is shown. When the user
     presses "অর্ডার করুন", the file is attached to that order record
     only (payload.documents via POST /orders) — images are downscaled
     in-browser so the whole order JSON stays under the API's 200 KB
     body limit (total attachments capped at ~150 KB; a file too large
     to attach is stored as metadata only, with that stated clearly).
     No file is sent to any external service, and no file is stored
     outside the order record.
   - Auto-fill: the "ডকুমেন্ট থেকে তথ্য বসান" button reads ONLY the
     file the user already selected, IN THIS BROWSER ONLY (Tesseract.js
     for images, pdf.js for PDFs, both loaded as libraries from a CDN;
     the document itself is never uploaded anywhere). Matches are
     filled ONLY into empty fields, ONLY as suggestions (NID/BRN
     number, date of birth, blood group), never auto-submitted, never
     presented as verified. If OCR finds nothing, the user is told to
     fill manually. No charge for upload/OCR itself; money is deducted
     only by the existing POST /orders flow when "অর্ডার করুন" is
     pressed.
   - NOT built: no server-side Autoload lookup by NID/phone/identifier,
     no government/external lookup, no official document generation
     (no logo, seal, card/certificate layout, no official-looking PDF).
     The Step 6 short disclaimer is left unchanged. Excluded services
     (IMEI, location, call list, biometric) are order pages and are
     not touched by this service-page-only patch. */
var NS_DOCS = {};
function nsDocSvcId() { var h = (location.hash.replace('#/', '') || '').split('/'); return (h[0] === 'service') ? h[1] : null; }
function nsDocMagic(buf) {
  var b = new Uint8Array(buf);
  if (b.length > 3 && b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'jpeg';
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'png';
  if (b.length > 3 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'gif';
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';
  if (b.length > 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'pdf';
  return null;
}
function nsBufToB64(buf) {
  var bytes = new Uint8Array(buf), out = '', i, chunk = 0x8000;
  for (i = 0; i < bytes.length; i += chunk) out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(out);
}
function nsDownscaleImage(buf, type) {
  return new Promise(function (resolve) {
    var url = URL.createObjectURL(new Blob([buf], { type: 'image/' + (type === 'jpeg' ? 'jpeg' : type) }));
    var img = new Image();
    img.onload = function () {
      var widths = [800, 640, 480, 320], best = null, fits = null;
      widths.forEach(function (w) {
        var scale = Math.min(1, w / img.width), cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.round(img.width * scale)); cv.height = Math.max(1, Math.round(img.height * scale));
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        var d = cv.toDataURL('image/jpeg', 0.72);
        if (!best) best = d;
        if (!fits && d.length <= 110 * 1024) fits = d;
      });
      URL.revokeObjectURL(url);
      resolve(fits || null);
    };
    img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}
async function nsDocOnPick(input, label) {
  var svc = nsDocSvcId(); if (!svc) return;
  var key = svc + '|' + label, prev = (input.nextElementSibling && input.nextElementSibling.classList && input.nextElementSibling.classList.contains('nsDocPrev')) ? input.nextElementSibling : input.parentNode.querySelector('.nsDocPrev');
  var file = input.files && input.files[0];
  if (!file) { delete NS_DOCS[key]; if (prev) prev.textContent = ''; return; }
  if (file.size > 5 * 1024 * 1024) { showModal('ফাইল বড়', 'ফাইলটি ৫ MB-এর বেশি — ছোট ফাইল বাছুন।'); input.value = ''; return; }
  var buf;
  try { buf = await file.arrayBuffer(); } catch (e) { showModal('ফাইল', 'ফাইলটি পড়া যায়নি।'); input.value = ''; return; }
  var magic = nsDocMagic(buf);
  if (!magic) { showModal('ফাইল', 'শুধু ছবি (JPG/PNG/GIF/WebP) বা PDF বাছুন।'); input.value = ''; return; }
  var doc = { filename: file.name, type: magic, size: file.size, buf: buf, dataUri: null };
  if (magic === 'pdf') {
    if (file.size <= 100 * 1024) doc.dataUri = 'data:application/pdf;base64,' + nsBufToB64(buf);
  } else {
    doc.dataUri = await nsDownscaleImage(buf, magic);
  }
  NS_DOCS[key] = doc;
  if (prev) {
    prev.textContent = 'যুক্ত হয়েছে: ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)' + (doc.dataUri ? ' — অর্ডারের সাথে সংযুক্ত হবে।' : ' — ফাইলটি বড় হওয়ায় শুধু নাম/তথ্য সংরক্ষিত হবে, ফাইলটি সংযুক্ত হবে না।');
    if (magic !== 'pdf') {
      var im = document.createElement('img'); im.src = URL.createObjectURL(new Blob([buf])); im.style.cssText = 'display:block;max-width:160px;max-height:120px;margin-top:6px;border:1px solid #ddd;border-radius:8px';
      prev.appendChild(im);
    }
  }
}
function nsDocAttachments() {
  var svc = nsDocSvcId(), out = [], total = 0;
  Object.keys(NS_DOCS).forEach(function (k) {
    if (svc && k.indexOf(svc + '|') !== 0) return;
    var d = NS_DOCS[k], e = { label: k.split('|').slice(1).join('|'), filename: d.filename, type: d.type, size: d.size, attached: false };
    if (d.dataUri && total + d.dataUri.length <= 150 * 1024) { e.data = d.dataUri; e.attached = true; total += d.dataUri.length; }
    else if (d.dataUri) { e.note = 'বড় ফাইল — সংযুক্ত হয়নি, শুধু নাম সংরক্ষিত'; }
    out.push(e);
  });
  return out;
}
function nsDocLoadScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="' + src + '"]')) return resolve();
    var s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
  });
}
function nsBnToAscii(s) { return (s || '').replace(/[০-৯]/g, function (c) { return '০১২৩৪৫৬৭৮৯'.indexOf(c); }); }
function nsDocPreprocessImage(buf, type) {
  return new Promise(function (resolve) {
    var url = URL.createObjectURL(new Blob([buf], { type: 'image/' + type }));
    var img = new Image();
    img.onload = function () {
      try {
        var target = img.width < 1600 ? 1600 : img.width;
        if (target > 3000) target = 3000;
        var scale = target / img.width;
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
        var ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        var id = ctx.getImageData(0, 0, cv.width, cv.height), d = id.data;
        for (var i = 0; i < d.length; i += 4) {
          var g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          var v = (g - 128) * 1.4 + 128;
          if (v < 0) v = 0; if (v > 255) v = 255;
          d[i] = d[i + 1] = d[i + 2] = v;
        }
        ctx.putImageData(id, 0, 0);
        cv.toBlob(function (b) { URL.revokeObjectURL(url); resolve(b); }, 'image/png');
      } catch (e) { URL.revokeObjectURL(url); resolve(null); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}
async function nsDocReadText(doc) {
  if (doc.type === 'pdf') {
    await nsDocLoadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    var pdfjs = window.pdfjsLib; if (!pdfjs) throw new Error('pdf.js missing');
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    var pdf = await pdfjs.getDocument({ data: doc.buf }).promise, txt = '';
    for (var p = 1; p <= Math.min(pdf.numPages, 3); p++) {
      var page = await pdf.getPage(p), tc = await page.getTextContent();
      tc.items.forEach(function (it) { txt += it.str + (it.hasEOL ? '\n' : ' '); });
      txt += '\n';
    }
    return txt;
  }
  await nsDocLoadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
  if (!window.Tesseract) throw new Error('tesseract missing');
  var blob = new Blob([doc.buf], { type: 'image/' + doc.type });
  try {
    var pre = await nsDocPreprocessImage(doc.buf, doc.type);
    if (pre) blob = pre;
  } catch (e) { /* fall back to the original image */ }
  var res = await window.Tesseract.recognize(blob, 'eng+ben');
  return (res && res.data && res.data.text) || '';
}
/* Step 10 — label-based OCR parsing. Only the user's own uploaded file,
   read in this browser. A value is used ONLY if a recognised label
   (Bengali or English) is followed by a plausible value on the same
   line or the next line; anything not found or low-confidence is left
   empty and reported as not found, never guessed. Nationality is
   never invented: an ID card does not state it, so nationality fields
   are always left for the user to fill by hand. */
function nsDocCleanValue(v) {
  if (!v) return '';
  v = v.replace(/^[:;।\-–—\s]+/, '').replace(/\s+/g, ' ').trim();
  // Only strip a label when it is followed by a colon — otherwise a
  // value such as "FATHER NAME" would be wrongly stripped to "NAME".
  v = v.replace(/^(নাম|পিতা|মাতা|Name|Father|Mother|ID NO|NID|জন্ম তারিখ|Date of Birth)\s*:\s*/i, '');
  return v.trim();
}
function nsDocIsNameValue(v, bn) {
  if (!v || v.length < 2 || v.length > 80) return false;
  var digits = (v.match(/\d/g) || []).length;
  if (digits > v.length * 0.3) return false;
  if (bn) return /[\u0980-\u09FF]/.test(v);
  return /[A-Za-z]/.test(v) && /[A-Za-z]{2,}/.test(v);
}
function nsDocParseDate(v) {
  v = nsBnToAscii(v || '');
  var months = { jan: '01', january: '01', feb: '02', february: '02', mar: '03', march: '03', apr: '04', april: '04', may: '05', jun: '06', june: '06', jul: '07', july: '07', aug: '08', august: '08', sep: '09', sept: '09', september: '09', oct: '10', october: '10', nov: '11', november: '11', dec: '12', december: '12' };
  var m = v.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m && months[m[2].toLowerCase()]) return m[3] + '-' + months[m[2].toLowerCase()] + '-' + m[1].padStart(2, '0');
  m = v.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[0];
  m = v.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
  if (m) return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
  return '';
}
function nsDocParseText(text) {
  var slots = {};
  var lines = (text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l; });
  var labelDefs = [
    ['পিতার নাম', 'fatherBn'], ['মাতার নাম', 'motherBn'],
    ['Father Name', 'fatherEn'], ['Mother Name', 'motherEn'],
    ['নাম', 'nameBn'], ['পিতা', 'fatherBn'], ['মাতা', 'motherBn'],
    ['জন্মস্থান', 'birthplaceBn'], ['স্থায়ী ঠিকানা', 'addressBn'], ['ঠিকানা', 'addressBn'],
    ['জন্ম তারিখ', 'dob'], ['লিঙ্গ', 'genderBn'],
    ['Name', 'nameEn'], ['Father', 'fatherEn'], ['Mother', 'motherEn'],
    ['Place of Birth', 'birthplaceEn'], ['Permanent Address', 'addressEn'],
    ['Date of Birth', 'dob'], ['Gender', 'genderEn'],
    ['ID NO', 'id'], ['ID No', 'id'], ['NID', 'id'],
    ['Birth Registration Number', 'brn'], ['জন্ম নিবন্ধন নম্বর', 'brn'],
    ['Blood Group', 'blood'], ['রক্তের গ্রুপ', 'blood']
  ];
  function takeValue(slot, raw) {
    if (slots[slot]) return;
    var v = nsDocCleanValue(raw);
    if (slot === 'dob') { var d = nsDocParseDate(v); if (d) slots[slot] = d; return; }
    if (slot === 'id' || slot === 'brn') {
      var digs = nsBnToAscii(v).replace(/[^0-9]/g, '');
      if (digs.length >= 10 && digs.length <= 17) slots[slot] = digs;
      return;
    }
    if (slot === 'genderBn' || slot === 'genderEn') {
      if (/male|পুরুষ/i.test(v)) { slots.genderEn = 'Male'; slots.genderBn = 'পুরুষ'; }
      else if (/female|মহিলা/i.test(v)) { slots.genderEn = 'Female'; slots.genderBn = 'মহিলা'; }
      return;
    }
    if (slot === 'blood') { var b = (v.match(/(AB|A|B|O)[+-](?![A-Za-z])/) || [])[0]; if (b) slots[slot] = b; return; }
    if (slot === 'nameBn' || slot === 'fatherBn' || slot === 'motherBn' || slot === 'birthplaceBn' || slot === 'addressBn') {
      if (nsDocIsNameValue(v, true)) slots[slot] = v;
      return;
    }
    if (slot === 'nameEn' || slot === 'fatherEn' || slot === 'motherEn' || slot === 'birthplaceEn' || slot === 'addressEn') {
      if (nsDocIsNameValue(v, false)) slots[slot] = v;
      return;
    }
    if (v && v.length >= 2 && v.length <= 100) slots[slot] = v;
  }
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var usedSpans = [];
    for (var j = 0; j < labelDefs.length; j++) {
      var lab = labelDefs[j][0], slot = labelDefs[j][1];
      if (slots[slot]) continue;
      var idx = line.indexOf(lab);
      if (idx === -1) continue;
      var overlaps = usedSpans.some(function (sp) { return idx < sp[1] && (idx + lab.length) > sp[0]; });
      if (overlaps) continue;
      usedSpans.push([idx, idx + lab.length]);
      var rest = line.slice(idx + lab.length);
      if (!/^[\s:;।\-–—]/.test(rest) && rest !== '') continue;
      labelDefs.forEach(function (ld) {
        if (ld[0] === lab) return;
        var cut = rest.indexOf(ld[0]);
        if (cut > 0 && /^[\s:;।\-–—]/.test(rest.slice(cut + ld[0].length))) rest = rest.slice(0, cut);
      });
      var val = nsDocCleanValue(rest);
      if (!val && i + 1 < lines.length) {
        var nxt = lines[i + 1];
        var isLabel = labelDefs.some(function (ld) { return nxt.indexOf(ld[0]) !== -1; });
        if (!isLabel) val = nxt;
      }
      takeValue(slot, val);
    }
  }
  return slots;
}
function nsDocFieldMap() {
  var card = document.querySelector('#main .card'), map = {};
  if (!card) return map;
  card.querySelectorAll('label').forEach(function (lab) {
    var inp = lab.nextElementSibling;
    if (inp && (inp.tagName === 'INPUT' || inp.tagName === 'SELECT' || inp.tagName === 'TEXTAREA')) map[lab.textContent.trim()] = inp;
  });
  return map;
}
async function nsDocAutoFill() {
  var btn = document.getElementById('nsDocFillBtn'), st = document.getElementById('nsDocFillStatus');
  var docs = Object.keys(NS_DOCS).filter(function (k) { var svc = nsDocSvcId(); return !svc || k.indexOf(svc + '|') === 0; }).map(function (k) { return NS_DOCS[k]; });
  if (!docs.length) { showModal('ডকুমেন্ট', 'আগে ফাইল বাছাই থেকে একটি ডকুমেন্ট বাছুন।'); return; }
  if (btn) btn.disabled = true;
  if (st) st.textContent = 'পড়া হচ্ছে… (ফাইলটি শুধু এই ডিভাইসে পড়া হচ্ছে, কোথাও পাঠানো হচ্ছে না)';
  var text = '', lastErr = null;
  for (var i = 0; i < docs.length && !text.trim(); i++) {
    try { text = await nsDocReadText(docs[i]); } catch (e) { lastErr = e; }
  }
  if (btn) btn.disabled = false;
  if (st) st.textContent = '';
  if (!text.trim()) { showModal('ডকুমেন্ট থেকে পড়া যায়নি', 'এই ডকুমেন্ট থেকে কোনো লেখা চেনা যায়নি বা পড়া যায়নি। দয়া করে তথ্য হাতে লিখুন। কোনো টাকা কাটা হয়নি।'); return; }
  var flat = text.replace(/\s+/g, ' ');
  var slots = nsDocParseText(text);
  var numSeq = function () {
    var out = [], m, re = /[০-৯\d][০-৯\d ]{8,22}[০-৯\d]/g;
    while ((m = re.exec(flat)) !== null) { var d = nsBnToAscii(m[0]).replace(/ /g, ''); if (d.length >= 10 && d.length <= 17) out.push(d); }
    return out;
  };
  var nums = numSeq();
  if (!slots.id && nums.length) slots.id = nums[0];
  if (!slots.brn && nums.length) slots.brn = nums[nums.length - 1];
  if (!slots.dob) {
    var dm = flat.match(/(\d{1,2})\s+(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|Dec|December)\s+(\d{4})/i);
    if (dm) slots.dob = nsDocParseDate(dm[0]);
    else {
      var dateMatch = flat.match(/(\d{4})-(\d{2})-(\d{2})/) || flat.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
      if (dateMatch) slots.dob = nsDocParseDate(dateMatch[0]);
    }
  }
  if (!slots.blood) slots.blood = (flat.match(/(AB|A|B|O)[+-](?![A-Za-z])/) || [])[0] || '';
  var map = nsDocFieldMap(), filled = [];
  var fillIfEmpty = function (test, val) {
    if (!val) return;
    Object.keys(map).forEach(function (lab) {
      if (test(lab) && map[lab] && !map[lab].value) { map[lab].value = val; filled.push(lab); }
    });
  };
  var svc = nsDocSvcId();
  fillIfEmpty(function (l) { return l === 'নাম (বাংলা)*' || l === 'নাম*'; }, slots.nameBn);
  fillIfEmpty(function (l) { return l === 'নাম (ইংরেজী)*' || l === 'Name'; }, slots.nameEn);
  fillIfEmpty(function (l) { return l === 'নাম*' && !slots.nameBn; }, slots.nameEn);
  fillIfEmpty(function (l) { return l === 'ব্যক্তির নাম'; }, slots.nameBn || slots.nameEn);
  fillIfEmpty(function (l) { return l.indexOf('পিতার নাম') !== -1; }, slots.fatherBn);
  fillIfEmpty(function (l) { return l === 'Father Name'; }, slots.fatherEn);
  fillIfEmpty(function (l) { return l.indexOf('মাতার নাম') !== -1; }, slots.motherBn);
  fillIfEmpty(function (l) { return l === 'Mother Name'; }, slots.motherEn);
  fillIfEmpty(function (l) { return l.indexOf('জন্মস্থান (ইংরেজী)') !== -1 || l === 'Place of Birth'; }, slots.birthplaceEn);
  fillIfEmpty(function (l) { return l.indexOf('জন্মস্থান') !== -1 && l.indexOf('ইংরেজী') === -1; }, slots.birthplaceBn);
  fillIfEmpty(function (l) { return l.indexOf('লিঙ্গ (ইংরেজী)') !== -1 || l === 'Gender*'; }, slots.genderEn);
  fillIfEmpty(function (l) { return l.indexOf('লিঙ্গ') !== -1 && l.indexOf('ইংরেজী') === -1 && l.indexOf('সকল') === -1; }, slots.genderBn);
  fillIfEmpty(function (l) { return l.indexOf('স্থায়ী ঠিকানা') !== -1 || l === 'Permanent Address'; }, slots.addressBn || slots.addressEn);
  fillIfEmpty(function (l) { return l === 'ঠিকানা*'; }, slots.addressBn || slots.addressEn);
  if (svc === 'brn') fillIfEmpty(function (l) { return l.indexOf('Birth Registration Number') !== -1; }, slots.brn);
  fillIfEmpty(function (l) { return l.indexOf('এনআইডি নম্বর') !== -1 || l.indexOf('NID') !== -1 || l.indexOf('এনআইডি / ভোটার') !== -1; }, slots.id);
  fillIfEmpty(function (l) { return (l.indexOf('জন্ম তারিখ') !== -1 || l === 'Date of Birth*') && l.indexOf('Word') === -1; }, slots.dob);
  fillIfEmpty(function (l) { return l.indexOf('রক্তের গ্রুপ') !== -1 || l.indexOf('Blood Group') !== -1; }, slots.blood);
  var targets = ['নাম', 'পিতার নাম', 'মাতার নাম', 'জন্মস্থান', 'জন্ম তারিখ', 'এনআইডি নম্বর', 'Birth Registration Number', 'Date of Birth', 'Father Name', 'Mother Name', 'Place of Birth', 'Gender', 'লিঙ্গ', 'ঠিকানা', 'স্থায়ী ঠিকানা', 'Permanent Address', 'রক্তের গ্রুপ'];
  var notFound = [];
  Object.keys(map).forEach(function (lab) {
    if (filled.indexOf(lab) !== -1) return;
    if (map[lab].value) return;
    if (targets.some(function (t) { return lab.indexOf(t) !== -1; })) notFound.push(lab);
  });
  var hasNationality = Object.keys(map).some(function (lab) { return lab.indexOf('জাতীয়তা') !== -1 || lab.indexOf('Nationality') !== -1; });
  if (!filled.length) { showModal('ডকুমেন্ট থেকে পড়া যায়নি', 'লেখা পড়া গেছে, কিন্তু এই ফর্মের কোনো খালি ঘরের সাথে মেলানো তথ্য পাওয়া যায়নি। দয়া করে তথ্য হাতে লিখুন। কোনো টাকা কাটা হয়নি।'); return; }
  var msg = 'এই ঘরগুলোতে ডকুমেন্ট থেকে পড়া তথ্য সাজেশন হিসেবে বসানো হয়েছে (যাচাই করা হয়নি): ' + filled.join(', ') + '। সব তথ্য দেখে ঠিক করে নিন, তারপর "অর্ডার করুন" চাপুন। এখনো কিছু জমা হয়নি, কোনো টাকা কাটা হয়নি।';
  if (notFound.length) msg += ' পাওয়া যায়নি — হাতে লিখুন: ' + notFound.join(', ') + '।';
  if (hasNationality) msg += ' জাতীয়তা ডকুমেন্টে উল্লেখ থাকে না, তাই জাতীয়তার ঘর হাতে লিখতে হবে।';
  showModal('সাজেশন বসানো হয়েছে — যাচাই করুন', msg);
}
var _nsOrderPayload7 = nsOrderPayload;
nsOrderPayload = function (def) {
  var p = _nsOrderPayload7(def);
  p.documents = nsDocAttachments();
  return p;
};
/* ===== Step 9 (staging only) — NO separate upload section; wire the EXISTING controls =====
   User feedback on Step 8: do NOT create a separate titled
   "ডকুমেন্ট আপলোড (ঐচ্ছিক)" section at the top (or bottom). The
   upload option that ALREADY exists on the page must work.
   - Pages with an original file input (nid: "এনআইডি ছবি*" / "স্বাক্ষর",
     snid: same, ssc: "এনআইডি ছবি*"): those original inputs are kept
     (Step 5 no longer replaces them). Their demo onclick is removed,
     they accept image/PDF, show preview/filename via nsDocOnPick, and
     attach to the order payload via the existing POST /orders flow.
     No second file input is created for them. The "ডকুমেন্ট থেকে তথ্য
     বসান" button is placed immediately after the last original input.
   - Pages with no original input but an Autoload button (brn): NO
     titled section. A small file picker + the auto-fill button are
     placed INLINE inside the same <p> as the existing
     "এনআইডি অটোলোড করুন / স্বয়ংক্রিয়ভাবে ডেটা লোড করুন" button.
     The Autoload button itself is unchanged (its honest modal still
     says server lookup is not on; it is NOT turned into a lookup).
   - Pages with neither (brni, sc, tin, ncf, vuk): NO titled section.
     A small inline picker row (label + file input + preview + the
     auto-fill button, no heading) is placed just before the existing
     "অর্ডার করুন" paragraph, inside the existing card.
   - Auto-fill stays a button press, client-side only (Tesseract.js /
     pdf.js in this browser, user's own file only, suggestions into
     empty fields only, never auto-submitted, never a server lookup).
   - Disclaimer: the single copy on the "অর্ডার করুন" paragraph
     (Step 2, small plain "muted" text) is the ONLY copy on a service
     page. No second disclaimer is added here, so the page shows it
     exactly once, readable, not hidden, no heading, no box.
   - No government logo/seal/official layout/document generation.
     Excluded services (IMEI, location, call list, biometric) untouched. */
var _renderStep6Client = render;
render = async function () {
  await _renderStep6Client();
  var main = document.querySelector('#main'); if (!main) return;
  var hash = location.hash.replace('#/', '') || 'dashboard', parts = hash.split('/');
  if (parts[0] !== 'service') return;
  var def = (typeof SERVICES !== 'undefined') ? SERVICES.find(function (x) { return x.id === parts[1]; }) : null;
  if (!def) return;
  var card = main.querySelector('.card'); if (!card) return;
  var oldSec = document.getElementById('nsDocSection'); if (oldSec) oldSec.remove();
  main.querySelectorAll('span.muted').forEach(function (sp) { if (sp.textContent.indexOf('ফাইল আপলোড এই ফর্মে') !== -1) sp.remove(); });
  var svc = parts[1];
  Object.keys(NS_DOCS).forEach(function (k) { if (k.indexOf(svc + '|') === 0) delete NS_DOCS[k]; });
  function nsWireInput(inp, label) {
    if (inp.dataset.nsWired) return;
    inp.dataset.nsWired = '1';
    inp.removeAttribute('onclick');
    inp.setAttribute('accept', 'image/*,application/pdf');
    inp.addEventListener('change', function () { nsDocOnPick(inp, label); });
    var prev = document.createElement('span'); prev.className = 'muted nsDocPrev';
    inp.parentNode.insertBefore(prev, inp.nextSibling);
  }
  function nsWireFillBtn(btn) { if (btn) btn.addEventListener('click', nsDocAutoFill); }
  var existing = Array.prototype.slice.call(card.querySelectorAll('input[type="file"]'));
  if (existing.length) {
    existing.forEach(function (inp, i) {
      var labEl = inp.previousElementSibling;
      var lab = (labEl && labEl.tagName === 'LABEL') ? labEl.textContent.trim() : ((def.uploads && def.uploads[i]) || 'ডকুমেন্ট (ছবি/PDF)');
      nsWireInput(inp, lab);
    });
    var last = existing[existing.length - 1];
    var anchor = last.nextSibling; // the preview span just inserted after it
    var row = document.createElement('p');
    row.innerHTML = '<button class="btn ghost" id="nsDocFillBtn" type="button">ডকুমেন্ট থেকে তথ্য বসান</button> <span class="muted" id="nsDocFillStatus"></span> <span class="muted">বাছা ফাইলটি শুধু এই ডিভাইসে পড়া হয়, কোথাও পাঠানো হয় না; তথ্য শুধু সাজেশন হিসেবে খালি ঘরে বসবে — যাচাই করে তারপর অর্ডার করুন। আপলোড / তথ্য-পড়ার জন্য কোনো টাকা কাটা হয় না।</span>';
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(row, anchor.nextSibling);
    else card.appendChild(row);
    nsWireFillBtn(document.getElementById('nsDocFillBtn'));
    return;
  }
  var autoBtn = Array.prototype.slice.call(card.querySelectorAll('button')).find(function (b) { return b.textContent.indexOf('অটোলোড করুন') !== -1; });
  if (autoBtn && autoBtn.parentNode) {
    var pp = autoBtn.parentNode;
    var picker = document.createElement('span');
    picker.innerHTML = ' <input type="file" class="nsDocInput" accept="image/*,application/pdf"> <span class="muted nsDocPrev"></span>';
    pp.appendChild(picker);
    var inpA = picker.querySelector('input');
    nsWireInput(inpA, 'ডকুমেন্ট (ছবি/PDF)');
    var fbSpan = document.createElement('span');
    fbSpan.innerHTML = ' <button class="btn ghost" id="nsDocFillBtn" type="button">ডকুমেন্ট থেকে তথ্য বসান</button> <span class="muted" id="nsDocFillStatus"></span>';
    pp.appendChild(fbSpan);
    nsWireFillBtn(document.getElementById('nsDocFillBtn'));
    return;
  }
  var orderBtn = document.getElementById('nsOrderBtn');
  var row2 = document.createElement('p');
  row2.innerHTML = '<label>ডকুমেন্ট (ছবি/PDF)</label> <input type="file" class="nsDocInput" accept="image/*,application/pdf"> <span class="muted nsDocPrev"></span> <button class="btn ghost" id="nsDocFillBtn" type="button">ডকুমেন্ট থেকে তথ্য বসান</button> <span class="muted" id="nsDocFillStatus"></span>';
  if (orderBtn && orderBtn.parentNode && orderBtn.parentNode.parentNode) orderBtn.parentNode.parentNode.insertBefore(row2, orderBtn.parentNode);
  else card.appendChild(row2);
  var inpB = row2.querySelector('input');
  nsWireInput(inpB, 'ডকুমেন্ট (ছবি/PDF)');
  nsWireFillBtn(document.getElementById('nsDocFillBtn'));
};

/* ===== Step 8 (staging only) — SUPERSEDED by Step 9: no #nsDocSection is
   created any more, so this wrapper returns early (sec missing) and does
   nothing. Kept only so the render chain stays intact. Original Step 8
   comment below is historical. =====
/* ===== Step 8 (staging only) — Upload section to the TOP, ONE disclaimer =====
   What this does (and does not do):
   - Moves the whole Step 7 document-upload section (#nsDocSection:
     file input(s), preview, "ডকুমেন্ট থেকে তথ্য বসান" button and its
     explanatory note) from the bottom of each service form to the TOP,
     immediately after the page title / price note and before the main
     data fields. Pages that already had a top upload field (nid/snid/
     ssc) do NOT get a second section: the prototype top inputs were
     already replaced by the Step 5 patch and removed by Step 7, so the
     moved Step 7 section IS the single top upload area for that page.
   - De-duplicates the disclaimer: the single kept copy is the one
     inside #nsDocSection itself (small plain text, class "muted", no
     heading, no box, readable, not hidden). Every other element on
     the rendered service page whose text is exactly that disclaimer
     is removed (order-button span, Save & Print note, Step 6 note —
     the last three were also removed at source, so this is a safety
     net, not a second copy). The disclaimer text itself is read from
     the kept paragraph, not hard-coded again here.
   - Order pages are untouched by this wrapper: their single
     disclaimer remains the order-button span from Step 2.
   - Preserved: file type/size checks, preview, client-side auto-fill
     from the user's own uploaded file only (no server lookup), order
     submission with the file attached to the order payload, prices,
     and the order button. No government logo, seal, official card/
     certificate layout, or official document generation. Excluded
     services (IMEI, location, call list, biometric) are order pages
     and are not touched. */
var _renderStep7Client = render;
render = async function () {
  await _renderStep7Client();
  var main = document.querySelector('#main'); if (!main) return;
  var hash = (location.hash.replace('#/', '') || 'dashboard'), parts = hash.split('/');
  if (parts[0] !== 'service') return;
  var card = main.querySelector('.card'); if (!card) return;
  var sec = document.getElementById('nsDocSection'); if (!sec) return;
  // Move to the top: right after the title / price note, before fields.
  var notice = card.querySelector('p.notice');
  if (notice) {
    if (notice.nextSibling) card.insertBefore(sec, notice.nextSibling);
    else card.appendChild(sec);
  } else {
    var h2 = card.querySelector('h2');
    if (h2 && h2.nextSibling) card.insertBefore(sec, h2.nextSibling);
    else card.insertBefore(sec, card.firstChild);
  }
  // De-duplicate: keep only the disclaimer inside the moved section.
  var discP = sec.querySelector('p.muted');
  var disc = discP ? discP.textContent.trim() : '';
  if (discP) discP.className = 'muted';
  var honest = document.getElementById('nsHonestNote'); if (honest) honest.remove();
  if (disc) {
    Array.prototype.slice.call(main.querySelectorAll('span, p')).forEach(function (el) {
      if (sec.contains(el)) return;
      if (el.textContent.trim() === disc) el.remove();
    });
  }
};

/* ===== Step 11 — Reference inner-page restyle (visual only) =====
   Runs LAST in the render chain. Adds body.ns-inner-page for every page
   except the dashboard (dashboard/homepage top untouched), table chrome
   (Show entries / Search / Showing / pagination), 2-column service
   form grids, teal marquee pricing strips, profile section cards, and
   dashed-teal dropzone styling for the EXISTING upload controls (Step 9
   wiring untouched — no separate titled upload section is re-added).
   No price, API, order-flow or functionality change. No government
   logo/seal/official layout/document generation. Disclaimer stays
   exactly once per document page (Step 2/9 copy, small plain text). */
var _renderStep8Client = render;
render = async function () {
  await _renderStep8Client();
  var hash = (location.hash.replace('#/', '') || 'dashboard'), parts = hash.split('/');
  var main = document.querySelector('#main'); if (!main) return;
  if (hash === 'dashboard') { document.body.classList.remove('ns-inner-page'); return; }
  document.body.classList.add('ns-inner-page');
  var card = main.querySelector('.card');
  /* Required-field stars in red (labels only, fresh DOM each render). */
  main.querySelectorAll('label').forEach(function (l) {
    if (!l.dataset.nsStar && l.textContent.indexOf('*') !== -1) { l.dataset.nsStar = '1'; l.innerHTML = l.innerHTML.replace('*', '<span class="req-star">*</span>'); }
  });
  /* Price banners: light blue (other .notice banners stay pale yellow). */
  main.querySelectorAll('p.notice').forEach(function (p) { if (p.textContent.indexOf('কাটা হবে') !== -1) p.classList.add('banner-price'); });
  /* Primary buttons full-width on forms (table + ghost buttons excluded). */
  main.querySelectorAll('button.btn, a.btn').forEach(function (b) {
    if (b.closest('table') || b.classList.contains('ghost')) return; b.classList.add('btn-full');
  });
  /* Table action colours + chrome (Show / Search / Showing / pagination). */
  main.querySelectorAll('table').forEach(function (tbl) {
    if (tbl.dataset.nsChrome) return; tbl.dataset.nsChrome = '1';
    tbl.querySelectorAll('.btn').forEach(function (b) {
      var t = b.textContent.trim();
      if (t === 'Delete' || t === 'Remove') b.classList.add('btn-del');
      else if (t === 'Edit') b.classList.add('btn-edit');
      else if (t === 'Print' || t === 'Download') b.classList.add('btn-dl');
    });
    var wrap = document.createElement('div'); wrap.className = 'table-wrap';
    tbl.parentNode.insertBefore(wrap, tbl); wrap.appendChild(tbl);
    var top = document.createElement('div'); top.className = 'tbl-top';
    top.innerHTML = '<span>Show <b>10</b> entries</span><span>Search: <input type="text" class="nsTblSearch" placeholder=""></span>';
    wrap.parentNode.insertBefore(top, wrap);
    var bottom = document.createElement('div'); bottom.className = 'tbl-bottom';
    var info = document.createElement('span'); info.className = 'nsTblInfo';
    var pg = document.createElement('div'); pg.className = 'nsTblPg';
    bottom.appendChild(info); bottom.appendChild(pg);
    wrap.parentNode.insertBefore(bottom, wrap.nextSibling);
    var allRows = Array.prototype.slice.call(tbl.querySelectorAll('tr')).slice(1);
    var emptyRow = allRows.length === 1 && (/No data available/i.test(allRows[0].textContent) || /এখনো কোনো অর্ডার নেই/.test(allRows[0].textContent) || /এই সার্ভিসে এখনো/.test(allRows[0].textContent));
    var page = 1, query = '';
    function filtered() { if (emptyRow) return []; if (!query) return allRows; return allRows.filter(function (r) { return r.textContent.toLowerCase().indexOf(query) !== -1; }); }
    function draw() {
      var rows = filtered(), total = rows.length, pages = Math.max(1, Math.ceil(total / 10));
      if (page > pages) page = pages;
      allRows.forEach(function (r) { r.style.display = 'none'; });
      if (emptyRow) { allRows.forEach(function (r) { r.style.display = ''; }); info.textContent = 'Showing 0 to 0 of 0 entries'; }
      else {
        var from = total ? (page - 1) * 10 + 1 : 0, to = Math.min(page * 10, total);
        rows.slice((page - 1) * 10, page * 10).forEach(function (r) { r.style.display = ''; });
        info.textContent = 'Showing ' + from + ' to ' + to + ' of ' + total + ' entries';
      }
      pg.innerHTML = '';
      function pgBtn(label, p, dis, act) { var b = document.createElement('button'); b.type = 'button'; b.className = 'pg-btn' + (act ? ' active' : ''); b.textContent = label; b.disabled = !!dis; b.onclick = function () { page = p; draw(); }; pg.appendChild(b); }
      pgBtn('Previous', Math.max(1, page - 1), page <= 1 || emptyRow, false);
      for (var i = 1; i <= pages; i++) pgBtn(String(i), i, false, i === page);
      pgBtn('Next', Math.min(pages, page + 1), page >= pages || emptyRow, false);
    }
    top.querySelector('.nsTblSearch').addEventListener('input', function (e) { query = e.target.value.trim().toLowerCase(); page = 1; draw(); });
    draw();
  });
  /* Service pages: teal marquee pricing strip + 2-column form grid. */
  if (parts[0] === 'service' && card) {
    var price = card.querySelector('p.notice.banner-price');
    if (price && !price.classList.contains('marquee-strip')) { var pt = price.textContent.trim(); price.classList.add('marquee-strip'); price.innerHTML = '<marquee scrollamount="4">' + esc(pt) + '</marquee>'; }
    var kids = Array.prototype.slice.call(card.children), grid = document.createElement('div'); grid.className = 'form-grid'; var firstField = null;
    kids.forEach(function (el, idx) {
      if (el.tagName !== 'LABEL') return;
      var nx = kids[idx + 1]; if (!nx || ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(nx.tagName) === -1) return;
      if (!firstField) firstField = el;
      var field = document.createElement('div'); field.className = 'field';
      if (el.textContent.indexOf('নাম') !== -1 || /Name/i.test(el.textContent)) field.classList.add('field-full');
      var prev = (nx.nextElementSibling && nx.nextElementSibling.classList && nx.nextElementSibling.classList.contains('nsDocPrev')) ? nx.nextElementSibling : null;
      field.appendChild(el); field.appendChild(nx); if (prev) field.appendChild(prev);
      grid.appendChild(field);
    });
    if (grid.children.length && firstField && firstField.parentNode) firstField.parentNode.insertBefore(grid, firstField);
    /* Upload dropzones: wrap EXISTING file inputs only (Step 9 controls). */
    card.querySelectorAll('input[type="file"]').forEach(function (inp) {
      if (inp.closest('p') && inp.closest('p').textContent.indexOf('অটোলোড করুন') !== -1) return; /* brn inline picker: dashed CSS only */
      if (inp.parentNode.classList && inp.parentNode.classList.contains('ns-upload-box')) return;
      var box = document.createElement('div'); box.className = 'ns-upload-box';
      var noimg = document.createElement('div'); noimg.className = 'ns-noimg'; noimg.textContent = 'NO IMAGE';
      var reset = document.createElement('button'); reset.type = 'button'; reset.className = 'ns-reset'; reset.textContent = '✕ রিসেট';
      var prev2 = inp.parentNode.querySelector('.nsDocPrev');
      inp.parentNode.insertBefore(box, inp);
      box.appendChild(noimg); box.appendChild(inp); if (prev2) box.appendChild(prev2); box.appendChild(reset);
      function upd() { noimg.style.display = (inp.files && inp.files.length) ? 'none' : 'block'; }
      inp.addEventListener('change', upd); upd();
      box.addEventListener('click', function (e) { if (e.target === box || e.target === noimg) inp.click(); });
      reset.addEventListener('click', function (e) { e.stopPropagation(); inp.value = ''; inp.dispatchEvent(new Event('change')); upd(); });
    });
  }
  /* Order pages: teal marquee strip mirroring the price note. */
  if (parts[0] === 'order' && card) {
    var total = document.getElementById('totalNote'), h2 = card.querySelector('h2');
    if (total && h2 && !document.getElementById('nsOrderMarquee')) {
      var mq = document.createElement('div'); mq.className = 'marquee-strip'; mq.id = 'nsOrderMarquee';
      mq.innerHTML = '<marquee scrollamount="4">' + esc(total.textContent.trim()) + '</marquee>';
      h2.parentNode.insertBefore(mq, h2.nextSibling);
      if (!window.__nsSelWrapped && typeof selectOpt === 'function') {
        window.__nsSelWrapped = true; var _sel11 = selectOpt;
        selectOpt = function (el, price) { _sel11(el, price); var m = document.getElementById('nsOrderMarquee'); if (m) m.innerHTML = '<marquee scrollamount="4">' + esc('এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ' + price + ' টাকা কাটা হবে।') + '</marquee>'; };
      }
    }
  }
  /* Recharge: centred heading, history headings already teal via CSS. */
  if (hash === 'recharge' && card) card.classList.add('recharge-page');
  /* Free services: full-width button (btn-full already added above). */
  if (parts[0] === 'free' && card) card.classList.add('free-page');
  /* Profile: split the single card into top + section cards, pair
     Profile Update / Change Password side by side, Cards Lists as
     label-left / teal-count rows. Profile Completion is NOT re-added. */
  if (hash === 'profile' && card && !card.classList.contains('prof-container')) {
    card.classList.add('prof-container');
    var nodes = Array.prototype.slice.call(card.childNodes), top = document.createElement('div'); top.className = 'prof-top';
    var sections = [], cur = null;
    nodes.forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === 'H3') { cur = document.createElement('div'); cur.className = 'prof-section'; cur.appendChild(n); sections.push(cur); }
      else if (cur) cur.appendChild(n); else top.appendChild(n);
    });
    card.innerHTML = ''; if (top.childNodes.length) card.appendChild(top);
    sections.forEach(function (s) { card.appendChild(s); });
    var upd = sections.find(function (s) { return s.textContent.indexOf('Profile Update') !== -1; });
    var pwd = sections.find(function (s) { return s.textContent.indexOf('Change Password') !== -1; });
    if (upd && pwd) { var pair = document.createElement('div'); pair.className = 'prof-pair'; upd.parentNode.insertBefore(pair, upd); pair.appendChild(upd); pair.appendChild(pwd); }
    var clHead = sections.find(function (s) { var h = s.querySelector('h3'); return h && h.textContent.indexOf('Cards Lists') !== -1; });
    if (clHead) { var p = clHead.querySelector('p'); if (p) { var list = document.createElement('div'); list.className = 'cards-list'; p.textContent.split(',').forEach(function (part) { var kv = part.split(':'); if (kv.length < 2) return; var row = document.createElement('div'); row.className = 'cl-row'; var lab = document.createElement('span'); lab.textContent = kv[0].trim(); var cnt = document.createElement('b'); cnt.textContent = kv.slice(1).join(':').trim(); row.appendChild(lab); row.appendChild(cnt); list.appendChild(row); }); if (list.children.length) p.parentNode.replaceChild(list, p); } }
  }
};

/* ===== Step 13 — Login portal gate (client only) =====
   Unauthenticated users land on the login portal for ANY route, not on
   the dashboard. Public routes: #/login, #/signup, #/forgot (forgot is
   part of the login flow, otherwise its link would be dead). After login
   -> #/dashboard; after logout -> #/login. No Google OAuth button: login
   is email/phone + password against our own API. Disclaimer, prices,
   inner-page design and homepage colours are untouched by this step. */
var _renderStep11Client = render;
render = async function () {
  var hash = location.hash.replace('#/', '') || 'dashboard';
  var main = document.querySelector('#main');
  if (hash === 'logout') {
    if (nsToken()) { try { await nsCall('/auth/logout', 'POST', {}); } catch (e) {} nsSetToken(''); NS_STATE.user = null; NS_STATE.wallet = null; }
    location.hash = '#/login'; return;
  }
  if (hash === 'login' || hash === 'signup' || hash === 'forgot') {
    if (nsToken()) {
      try { await nsRefresh(); } catch (e) {}
      if (NS_STATE.user) { location.hash = '#/dashboard'; return; }
      nsSetToken('');
    }
    document.body.classList.remove('ns-inner-page');
    document.body.classList.add('ns-login-portal');
    if (hash === 'login') document.body.classList.add('ns-design-login-page'); else document.body.classList.remove('ns-design-login-page');
    if (main) main.innerHTML = nsLoginPortalHTML(hash);
    return;
  }
  if (!nsToken()) {
    document.body.classList.remove('ns-inner-page');
    document.body.classList.add('ns-login-portal');
    document.body.classList.add('ns-design-login-page');
    if (main) main.innerHTML = nsLoginPortalHTML('login');
    return;
  }
  try { await nsRefresh(); } catch (e) {}
  if (!NS_STATE.user) {
    nsSetToken('');
    document.body.classList.remove('ns-inner-page');
    document.body.classList.add('ns-login-portal');
    document.body.classList.add('ns-design-login-page');
    if (main) main.innerHTML = nsLoginPortalHTML('login');
    return;
  }
  // Step 36: unhide the app chrome ONLY after the dashboard is painted.
  // Removing it before the render chain finished showed the sidebar /
  // topbar around the login card for 1-2s while data was still loading.
  await _renderStep11Client();
  document.body.classList.remove('ns-login-portal');
  document.body.classList.remove('ns-design-login-page');
};

/* ===== Step 22 — আমার তথ্য (RESTRICTED own-record only) =====
   Only a logged-in, admin-verified user sees ONLY their own record.
   No search by name, no area search, no match list, no public portal,
   no charge. Step 1: verified status + whether a record exists
   (masked, no full NID). Step 2: user enters their OWN NID to confirm.
   Step 3: only their own plain summary (disclaimer comes from the API
   response, so this file keeps exactly one disclaimer literal). */
async function nsMyInfoLoad() {
  if (!nsToken()) return;
  try { window.__nsMyInfo = await nsCall('/me/my-record'); }
  catch (e) { window.__nsMyInfo = { error: e.message }; }
}
function nsMyInfoHTML() {
  const d = window.__nsMyInfo || {};
  if (d.error) return '<div class="card"><h2>আমার তথ্য</h2><p>তথ্য আনা যায়নি: ' + esc(d.error) + '</p></div>';
  if (!d.verified) return '<div class="card"><h2>আমার তথ্য</h2><p>অ্যাডমিন ভেরিফিকেশন বাকি আছে। ভেরিফাই হওয়ার পর এখানে আপনার নিজের তথ্য দেখা যাবে।</p></div>';
  if (!d.has_record) return '<div class="card"><h2>আমার তথ্য</h2><p>ভেরিফাইড। তবে আপনার জন্য কোনো রেকর্ড নেই — অ্যাডমিন রেকর্ড যোগ করলে এখানে দেখা যাবে।</p></div>';
  const m = d.masked_summary || {};
  if (window.__nsMyInfoStep === 3 && window.__nsMyInfoSummary) {
    const s = window.__nsMyInfoSummary;
    return '<div class="card"><h2>আমার তথ্য</h2><p class="muted">' + esc(s.disclaimer || '') + '</p><p>নাম: ' + esc(s.full_name || '') + '</p><p>আইডির শেষ ৪ সংখ্যা: ••••' + esc(s.nid_last4 || '') + '</p><p>এলাকা: ' + esc(s.area_text || '') + '</p><p>নোট: ' + esc(s.notes || '') + '</p><button class="btn" onclick="nsMyInfoDownload()">সারাংশ ডাউনলোড (টেক্সট)</button> <button class="btn ghost" onclick="nsMyInfoBack()">ফিরে যান</button></div>';
  }
  if (window.__nsMyInfoStep === 2) {
    return '<div class="card"><h2>আমার তথ্য — নিশ্চিত করুন</h2><p>আপনার নিজের নম্বরটি লিখুন। এটি শুধু আপনার ভেরিফাইড রেকর্ডের সাথে মেলানো হবে, অন্য কারো তথ্য খোঁজা হবে না।</p><label>আপনার নিজের নম্বর*</label><input id="nsMyNid" placeholder="আপনার নিজের নম্বর"><button class="btn" onclick="nsMyInfoConfirm()">তথ্য দেখুন</button> <button class="btn ghost" onclick="nsMyInfoBack()">ফিরে যান</button></div>';
  }
  return '<div class="card"><h2>আমার তথ্য</h2><p>ভেরিফাইড। আপনার জন্য একটি রেকর্ড আছে।</p><p>নাম: ' + esc(m.full_name || '') + '</p><p>আইডির শেষ ৪ সংখ্যা: ••••' + esc(m.nid_last4 || '') + '</p><p>এলাকা: ' + esc(m.area_text || '') + '</p><button class="btn" onclick="nsMyInfoStep2()">তথ্য দেখুন</button></div>';
}
function nsMyInfoStep2() { window.__nsMyInfoStep = 2; render(); }
function nsMyInfoBack() { window.__nsMyInfoStep = 1; window.__nsMyInfoSummary = null; render(); }
async function nsMyInfoConfirm() {
  const el = document.getElementById('nsMyNid'); const nid = el ? el.value.trim() : '';
  if (!nid) { showModal('নিশ্চিত হয়নি', 'আপনার নিজের নম্বরটি লিখুন।'); return; }
  try { const r = await nsCall('/me/my-record/confirm', 'POST', { nid }); window.__nsMyInfoSummary = r.summary; window.__nsMyInfoStep = 3; render(); }
  catch (e) { showModal('নিশ্চিত হয়নি', e.message === 'nid_mismatch' ? 'আপনার নিজের নম্বরের সাথে মেলেনি।' : e.message); }
}
function nsMyInfoDownload() {
  const s = window.__nsMyInfoSummary; if (!s) return;
  const text = ['নাগরিক সেবা — আমার তথ্য (সারাংশ)', s.disclaimer || '', '', 'নাম: ' + (s.full_name || ''), 'আইডির শেষ ৪ সংখ্যা: ••••' + (s.nid_last4 || ''), 'এলাকা: ' + (s.area_text || ''), 'নোট: ' + (s.notes || '')].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = 'amar-tothyo.txt'; a.click();
}
const _renderStep22Client = render;
render = async function () {
  await _renderStep22Client();
  const hash = location.hash.replace('#/', '') || 'dashboard';
  if (hash !== 'myinfo') return;
  const main = document.querySelector('#main'); if (!main) return;
  if (!nsToken()) return; // login gate inside the wrapped render already showed the portal
  await nsMyInfoLoad();
  main.innerHTML = nsMyInfoHTML();
};

/* ===== Step 34 — Sidebar by category (accordion) =====
   Presentation only: no route, page, price or API call changes.
   The old flat sections (সার্ভিস / অর্ডার সার্ভিস / বিনামূল্যে
   সার্ভিস) are replaced by topic groups. Every link below is built
   from the existing SERVICES / ORDERS / FREES / HISTORIES tables by
   id, so no route string is retyped and nothing can be lost.
   ড্যাশবোর্ড + রিচার্জ stay pinned on top, outside any group.
   Free tools keep a small "ফ্রি" pill. One group opens at a time;
   navigating to a link (sidebar, dashboard card, direct hash) opens
   that link's group automatically. */
const NS_CAT_SVC = (id) => { const s = SERVICES.find(x => x.id === id); return s ? ['service/' + id, s.name, false] : null; };
const NS_CAT_ORD = (id) => { const o = ORDERS.find(x => x.id === id); return o ? ['order/' + id, o.name, false] : null; };
const NS_CAT_FREE = (id) => { const f = FREES.find(x => x.id === id); return f ? ['free/' + id, f.name, true] : null; };
const NS_CATS = [
  { id: 'nid', head: '🪪 জাতীয় পরিচয়পত্র', items: ['nid', 'snid', 'ncf'].map(NS_CAT_SVC).concat(['nidcard', 'smartcardpdf', 'smartnidcard', 'sign', 'servercopy'].map(NS_CAT_ORD)).concat(['sc', 'ssc'].map(NS_CAT_SVC)).concat(['nidpsset', 'namethikananid', 'nid2allnumber'].map(NS_CAT_ORD)) },
  { id: 'brn', head: '👶 জন্ম নিবন্ধন', items: ['brn', 'brni'].map(NS_CAT_SVC).concat(['newbdris'].map(NS_CAT_ORD)).concat(['dobfinder'].map(NS_CAT_FREE)) },
  { id: 'tin', head: '🧾 টিন ও ভাতা', items: ['tin'].map(NS_CAT_SVC).concat(['tincertificate'].map(NS_CAT_ORD)).concat(['tininfo'].map(NS_CAT_FREE)).concat(['vuk'].map(NS_CAT_SVC)) },
  { id: 'mobile', head: '🛂 পাসপোর্ট ও মোবাইল তথ্য', items: ['passport', 'location', 'number2imei', 'i2an', 'calllist', 'biomatic', 'info', 'pinset'].map(NS_CAT_ORD) },
  { id: 'free', head: '✍️ বিনামূল্যে টুলস', items: ['signature'].map(NS_CAT_FREE) },
  { id: 'history', head: '🕘 হিস্টোরি লিস্ট', items: HISTORIES.map(h => ['history/' + h.id, h.name, false]) },
  { id: 'help', head: '💬 হেল্পলাইন', items: [['report', 'রিপোর্ট', false], ['support', 'সাপোর্ট', false]] },
  { id: 'account', head: '👤 অ্যাকাউন্ট', items: [['profile', 'প্রোফাইল', false], ['myinfo', 'আমার তথ্য', false], ['devices', 'ডিভাইস', false], ['logout', 'লগআউট', false]] },
];
const NS_BN_DIG = (n) => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
function nsCatLinkHTML(r, l, free) {
  const k = r.split('/').pop();
  return `<a href="#/${r}" data-r="${r}">${ico(k)}<span>${l}</span>${free ? '<span class="ns-free">ফ্রি</span>' : ''}</a>`;
}
navHTML = function () {
  let h = '<div class="sidebar-scroll">';
  h += `<a href="#/dashboard" data-r="dashboard">${ico('dashboard')}<span>ড্যাশবোর্ড</span></a>`;
  h += `<a href="#/recharge" data-r="recharge">${ico('recharge')}<span>রিচার্জ</span></a>`;
  NS_CATS.forEach(c => {
    h += `<div class="ns-cat" data-cat="${c.id}"><button type="button" class="ns-cat-head" aria-expanded="false"><span class="ns-cat-title">${c.head}</span><span class="ns-cat-count">${NS_BN_DIG(c.items.length)}টি</span><span class="ns-cat-chev">›</span></button><div class="ns-cat-body">${c.items.filter(Boolean).map(i => nsCatLinkHTML(i[0], i[1], i[2])).join('')}</div></div>`;
  });
  h += '</div>';
  h += `<div class="sidebar-logout"><a href="#/logout" data-r="logout">${ico('logout')}<span>লগআউট</span></a></div>`;
  return h;
};
function nsCatSetOpen(id) {
  document.querySelectorAll('.ns-cat').forEach(g => {
    const open = g.dataset.cat === id;
    g.classList.toggle('open', open);
    const b = g.querySelector('.ns-cat-head'); if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
function nsCatOpenActive() {
  const a = document.querySelector('.sidebar a.active');
  if (!a) return;
  const g = a.closest('.ns-cat');
  if (g) nsCatSetOpen(g.dataset.cat);
}
document.querySelector('#sidebar').innerHTML = navHTML();
(function () {
  const sc = document.querySelector('.sidebar-scroll');
  if (sc && !document.getElementById('nsSidebarLogin')) { const a = document.createElement('a'); a.id = 'nsSidebarLogin'; a.href = '#/login'; a.innerHTML = '<span>লগইন</span>'; sc.appendChild(a); }
})();
document.querySelector('#sidebar').addEventListener('click', e => {
  const head = e.target.closest('.ns-cat-head');
  if (!head) return;
  const g = head.closest('.ns-cat');
  nsCatSetOpen(g.classList.contains('open') ? null : g.dataset.cat);
});
const NS_PREV_RENDER_34 = render;
render = async function () { await NS_PREV_RENDER_34(); nsCatOpenActive(); };
nsCatOpenActive();

/* ===== Step 35 — Activity Logs: last 3 only =====
   Display only: the API still returns the user's own login logs,
   but the dashboard card now shows only the 3 newest (by
   created_at, newest first). No "see more", no older entries.
   Still real logins only — no demo/sample entries are added. */
activityLogsHTML = function () {
  if (!NS_STATE.logs.length) return '<p class="muted">এখনো কোনো লগইন রেকর্ড নেই</p>';
  const last3 = NS_STATE.logs.slice().sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))).slice(0, 3);
  return '<ul>' + last3.map(l => `<li>${esc(l.created_at || '')} — ${esc(l.ip || '—')} — ${esc((l.user_agent || '').slice(0, 60))}</li>`).join('') + '</ul>';
};

/* ===== Step 36 — Speed + no sample flash + no login peek =====
   Root causes found (client only, no API/price/route change):
   1. EVERY navigation ran nsRefresh() twice (gate wrapper + Step 2
      wrapper), each doing 5 SEQUENTIAL API calls, and login did it
      a 3rd time — ~15 round trips per login, ~10 per click.
   2. The very first paint (prototype render at script load) drew the
      sample user (নমুনা ব্যবহারকারী, ৳ ১০, UID #BD-982410) before
      the API answered, so a refresh visibly "changed account".
   3. The gate removed the login-portal chrome class BEFORE the
      dashboard painted, so the sidebar/topbar showed around the
      login card for 1-2s (fixed by the gate edit above).
   Fix: one shared in-flight refresh, 5 calls in PARALLEL, 30s cache
   keyed by token (mutations force a fresh fetch), and a neutral
   loading card as the last synchronous paint of script load, so the
   browser's first paint can never show sample data. */
let NS_RF_PROMISE = null, NS_RF_AT = 0, NS_RF_TOKEN = null;
nsRefresh = async function (force) {
  const tok = nsToken();
  if (NS_RF_PROMISE && !force) return NS_RF_PROMISE;
  if (NS_RF_PROMISE && force) { try { await NS_RF_PROMISE; } catch (e) {} }
  const fresh = Date.now() - NS_RF_AT < 30000 && tok === NS_RF_TOKEN && (NS_STATE.user || !tok);
  if (!force && fresh) return;
  NS_RF_PROMISE = (async () => {
    try {
      const [svc, me, ord, rch, logs] = await Promise.all([
        nsCall('/services').catch(() => null),
        tok ? nsCall('/me').catch(() => null) : Promise.resolve(null),
        tok ? nsCall('/orders').catch(() => null) : Promise.resolve(null),
        tok ? nsCall('/recharges').catch(() => null) : Promise.resolve(null),
        tok ? nsCall('/me/login-logs').catch(() => null) : Promise.resolve(null),
      ]);
      if (svc) NS_STATE.services = svc.services || [];
      if (!tok) { NS_STATE.user = null; NS_STATE.wallet = null; NS_STATE.orders = []; NS_STATE.recharges = []; NS_STATE.logs = []; }
      else {
        if (me) { NS_STATE.user = me.user; NS_STATE.wallet = me.wallet_bdt; } else NS_STATE.user = null;
        if (ord) NS_STATE.orders = ord.orders || [];
        if (rch) NS_STATE.recharges = rch.recharges || [];
        if (logs) NS_STATE.logs = logs.login_logs || [];
      }
      nsSyncPrices();
      NS_RF_TOKEN = tok; NS_RF_AT = Date.now();
    } finally { NS_RF_PROMISE = null; }
  })();
  return NS_RF_PROMISE;
};
// Last synchronous paint of script load: neutral loading card only.
// The sample dashboard painted earlier in this script is replaced
// before the browser's first paint, so it is never seen.
(function () {
  const m = document.querySelector('#main');
  if (m) m.innerHTML = '<div class="card"><h2>লোড হচ্ছে…</h2><p class="muted">আপনার ড্যাশবোর্ড আনা হচ্ছে, একটু অপেক্ষা করুন।</p></div>';
  const hash = (location.hash || '').replace('#/', '') || 'dashboard';
  if (!nsToken() || hash === 'login' || hash === 'signup' || hash === 'forgot') {
    document.body.classList.add('ns-login-portal');
    document.body.classList.add('ns-design-login-page');
  }
})();

/* ===== Step 37 — Activity Logs moved off the dashboard =====
   User instruction only: the dashboard Activity Logs card is gone.
   It now lives in the sidebar, in the 👤 অ্যাকাউন্ট group, directly
   above লগআউট (second-to-last item of the menu). Nothing else
   changes: same card, same list, same last-3-only rule (Step 35),
   same real logins only. New route #/activity-logs renders the
   same card on its own page. */
(function () {
  const acc = NS_CATS.find(c => c.id === 'account');
  if (acc) {
    const li = acc.items.findIndex(i => i && i[0] === 'logout');
    const entry = ['activity-logs', 'Activity Logs', false];
    if (li >= 0) acc.items.splice(li, 0, entry); else acc.items.push(entry);
  }
  document.querySelector('#sidebar').innerHTML = navHTML();
  const sc = document.querySelector('.sidebar-scroll');
  if (sc && !document.getElementById('nsSidebarLogin')) { const a = document.createElement('a'); a.id = 'nsSidebarLogin'; a.href = '#/login'; a.innerHTML = '<span>লগইন</span>'; sc.appendChild(a); }
})();
const NS_PREV_RENDER_37 = render;
render = async function () {
  await NS_PREV_RENDER_37();
  const hash = (location.hash || '').replace('#/', '') || 'dashboard';
  if (hash !== 'activity-logs' || !nsToken()) return;
  const main = document.querySelector('#main');
  if (main) main.innerHTML = `<div class="card"><h3>Activity Logs</h3>` + activityLogsHTML() + `</div>`;
};
