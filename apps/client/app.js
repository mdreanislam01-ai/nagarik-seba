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
  <div class="card"><h3>Activity Logs</h3>`+activityLogsHTML()+`</div>
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
    NS_STATE.wallet = r.wallet_bdt; await nsRefresh(); render();
    showModal('অর্ডার সফল', `অর্ডার #${r.order.id} — ${r.order.amount_bdt} টাকা কেটেছে, স্ট্যাটাস: ${r.order.status}।`);
  } catch (e) { showModal('অর্ডার হয়নি', e.message === 'insufficient_balance' ? 'ব্যালান্স কম — রিচার্জ করুন।' : e.message); }
}
async function nsRechargeSubmit() {
  if (!nsToken()) { showModal('লগইন প্রয়োজন', 'রিচার্জ করতে প্রথমে লগইন করুন।'); location.hash = '#/login'; return; }
  const amt = +document.getElementById('amt').value, method = document.getElementById('rchMethod').value,
    sender = document.getElementById('rchSender').value, trxid = document.getElementById('rchTrx').value.trim();
  if (!amt || amt < 100 || !trxid) { showModal('যাচাই', 'সর্বনিম্ন রিচার্জ 100 টাকা, আর TrxID লাগবে।'); return; }
  try { const r = await nsCall('/recharge/request', 'POST', { method, sender_number: sender, trxid, amount_bdt: amt }); await nsRefresh(); render(); showModal('রিচার্জ অনুরোধ', `অনুরোধ #${r.recharge.id} — ${r.recharge.amount_bdt} টাকা, স্ট্যাটাস: pending। অ্যাডমিন approve করলে ব্যালেন্স যোগ হবে।`); }
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
      if (r.status === 'Completed' && r.credited) { if (el) el.textContent = `পেমেন্ট সফল — ৳ ${r.recharge.amount_bdt} ব্যালেন্সে যোগ হয়েছে। নতুন ব্যালেন্স: ৳ ${r.wallet_bdt}`; NS_STATE.wallet = r.wallet_bdt; sessionStorage.removeItem('ns_zamm_trx'); await nsRefresh(); return; }
      if (r.status === 'Completed' && !r.credited) { if (el) el.textContent = 'পেমেন্ট সম্পন্ন দেখাচ্ছে কিন্তু অ্যামাউন্ট মেলেনি — সাপোর্টে জানান, ম্যানুয়ালি যাচাই করা হবে।'; sessionStorage.removeItem('ns_zamm_trx'); return; }
      if (r.status === 'Canceled') { if (el) el.textContent = 'পেমেন্ট বাতিল হয়েছে — ব্যালেন্স যোগ হয়নি।'; sessionStorage.removeItem('ns_zamm_trx'); return; }
    } catch (e) { if (el) el.textContent = 'যাচাইয়ে সমস্যা হয়েছে: ' + e.message; return; }
    await new Promise((res) => setTimeout(res, 3000));
  }
  if (el) el.textContent = 'পেমেন্ট এখনো Pending — SMS যাচাই হতে কিছু সময় লাগতে পারে। কিছুক্ষণ পর রিচার্জ ইতিহাস দেখুন।';
}
function nsLoginLogoHTML() {
  return '<div class="ns-login-logo"><span class="logo-mark"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="27" r="19" fill="#0f766e"/><circle cx="24" cy="8" r="4" fill="#f59e0b"/><path d="M24 40V22M24 30c-6-1-10-5-11-11 6 1 10 5 11 11zm0 0c6-1 10-5 11-11-6 1-10 5-11 11z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="logo-text">নাগরিক সেবা<small>nagarikseba.com</small></span></div>';
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
    '<div class="ns-slide-brand">' + nsLoginLogoHTML() + '<p class="ns-slide-tag">সবার সেবা, সবার পাশে</p></div>' +
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
  try { const r = await nsCall('/auth/login', 'POST', { identifier, password, remember_me }); nsSetToken(r.token, remember_me); await nsRefresh(); location.hash = '#/dashboard'; render(); }
  catch (e) { showModal('লগইন হয়নি', e.message === 'invalid_credentials' ? 'ইমেইল/ফোন নম্বর বা পাসওয়ার্ড ভুল।' : e.message); }
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
  document.body.classList.remove('ns-login-portal');
  document.body.classList.remove('ns-design-login-page');
  await _renderStep11Client();
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
