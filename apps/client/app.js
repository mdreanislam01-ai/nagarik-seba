/* Nagarik Seba — DESIGN-ONLY demo. No real data service, no submission, no deduction, no real printing. */
const $=s=>document.querySelector(s);
function showModal(t,html){$('#modalTitle').textContent=t;$('#modalBody').innerHTML=html;$('#modalBack').classList.add('open')}
function closeModal(){$('#modalBack').classList.remove('open')}
function demoMsg(what){showModal('ডেমো নোটিশ',`<p><b>${what}</b> — এটি একটি ডেমো UI। কোনো আসল অর্ডার, পেমেন্ট, ডাটা লুকআপ বা প্রিন্ট করা হয়নি এবং ব্যালান্স কাটা হয়নি।</p>`)}
function toggleDark(){document.body.classList.toggle('dark');$('#darkBtn').textContent=document.body.classList.contains('dark')?'☀️ লাইট মোড':'🌙 ডার্ক মোড'}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}

const SERVICES=[
 {id:'nid',name:'এনআইডি ক্রিয়েট',title:'নতুন এনআইডি',cost:5,note:'সাইন থেকে এনআইডি মেইক ৫ টাকা করে কাটবে, অটো এনআইডি ১০ টাকা কাটবে।',autoload:true,fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','পিতার নাম*','মাতার নাম*','জন্মস্থান*','জন্ম তারিখ*','রক্তের গ্রুপ','প্রদানের তারিখ*','ঠিকানা*'],uploads:['এনআইডি ছবি*','স্বাক্ষর']},
 {id:'snid',name:'স্মার্ট এনআইডি ক্রিয়েট',title:'নতুন স্মার্ট এনআইডি',cost:10,note:'ছবির ব্যাকগ্রাউন্ড সঠিকভাবে না সরলে আসল ছবি ডাউনলোড করে remove.bg-এর মতো টুল ব্যবহারের পরামর্শ (ডেমো লিংক সক্রিয় নয়)।',autoload:true,fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','পিতার নাম*','মাতার নাম*','জন্মস্থান*','জন্মস্থান (ইংরেজী)*','লিঙ্গ (ইংরেজী)*','জন্ম তারিখ*','রক্তের গ্রুপ','প্রদানের তারিখ*','ঠিকানা*'],uploads:['এনআইডি ছবি*','স্বাক্ষর']},
 {id:'brn',name:'জন্মনিবন্ধন ক্রিয়েট',title:'নতুন জন্মনিবন্ধন',cost:5,note:'জন্মনিবন্ধন মেক ৫ টাকা করে কাটবে।',autoload:'brn',fields:['Register Office Address*','Upazila / Pourashava / City Corporation','Zila*','Birth Registration Number*','Gender*','Date of Registration*','Date of Issuance*','Left Bar Code*','QR Link*','Date of Birth*','Date of Birth in Word','নাম*','Name','পিতার নাম*','Father Name','পিতার জাতীয়তা (বাংলাদেশী)','Father Nationality (Bangladeshi)','মাতার নাম*','Mother Name','মাতার জাতীয়তা (বাংলাদেশী)','Mother Nationality (Bangladeshi)','জন্মস্থান*','Place of Birth','স্থায়ী ঠিকানা*','Permanent Address'],uploads:[]},
 {id:'brni',name:'মিনিস্ট্রি ডাটা',title:'জন্মনিবন্ধন নম্বর তথ্য',cost:100,note:'এই সার্ভিসের খরচ ১০০ টাকা। ডেমো ব্যালান্স ($ 10) কম হলে মূল সাইটের মতো Insufficient balance দেখানো হয়।',fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','লিঙ্গ (সকল / পুরুষ / মহিলা)','জন্ম তারিখ','হুবহু মিল (না / হ্যাঁ)'],uploads:[]},
 {id:'sc',name:'সার্ভার কপি ডাউনলোড',title:'নতুন সার্ভার কপি',cost:25,note:'সার্ভার কপি ১০ টাকা (API ৫) / ২৫ টাকা (API ৩)। পিন নম্বর ও ফুল ঠিকানা আসবে — ডেমো নোট।',fields:['এনআইডি নম্বর* (১০ / ১৩ / ১৭ ডিজিট)','জন্ম তারিখ* (YYYY-MM-DD)','সার্ভারের API*','সার্ভারের ধরণ* (অরিজিনাল / নতুন / পুরাতন, QR কোডসহ বা ছাড়া)'],uploads:[],api:true},
 {id:'ssc',name:'সাইন টু সার্ভার কপি',title:'সাইন টু সার্ভার কপি',cost:5,note:'এটি প্রিন্ট করতে ৫ টাকা কাটা হবে (ডেমো নোট, আসলে কাটা হয় না)।',fields:['নাম (বাংলা)*','নাম (ইংরেজী)*','এনআইডি নম্বর*','পিন নম্বর*','জন্ম তারিখ*','লিঙ্গ (ইংরেজী)*','পিতার নাম','মাতার নাম','স্বামী/স্ত্রীর নাম','জন্মস্থান','রক্তের গ্রুপ','ধর্ম','পেশা','মোবাইল নম্বর','শিক্ষা','পিতার এনআইডি','মায়ের এনআইডি','ফর্ম নম্বর','ভোটার সিরিয়াল নম্বর','ভোটার নম্বর','ভোটার এলাকা','বর্তমান ঠিকানা','স্থায়ী ঠিকানা','সার্ভারের ধরণ*'],uploads:['এনআইডি ছবি*']},
 {id:'tin',name:'টিন সার্টিফিকেট ডাউনলোড',title:'নতুন টিন সার্টিফিকেট',cost:40,note:'টিন সার্টিফিকেট ৪০ টাকা। ডেমো ব্যালান্স কম হলে Insufficient balance দেখানো হয়।',fields:['ডাটার ধরণ* (টিন নম্বর / টিকিট নম্বর / পুরাতন টিন নম্বর / এনআইডি নম্বর / পাসপোর্ট নম্বর / মোবাইল নম্বর)','ডাটা*'],uploads:[]},
 {id:'ncf',name:'এনআইডি সংশোধন ফর্ম',title:'এনআইডি সংশোধন ফর্ম',cost:25,note:'খরচ ২৫ টাকা। ডেমো ব্যালান্স কম হলে Insufficient balance দেখানো হয়।',captcha:true,fields:['ইউজারনেম* (জাতীয় পরিচয়পত্র নম্বর অথবা ইউজারনেম)','পাসওয়ার্ড*','ক্যাপচা*'],uploads:[]},
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
 {id:'pinset',name:'পিন রিসেট',label:'নগদ / বিকাশ পিন রিসেট সার্ভিস চালু ✅',cost:null,pinMissing:true,fields:['Data* (পিন রিসেট করতে চাওয়া নম্বর ও আপনার WhatsApp নম্বর — ডেমোতে কিছু পাঠানো হয় না)']},
 {id:'smartnidcard',name:'অরিজিনাল স্মার্ট কার্ড অর্ডার',label:'১০০% অরিজিনাল স্মার্ট কার্ড — অনলাইন স্ট্যাটাস চেক দেওয়া যাবে',cost:null,options:[['নতুন স্মার্ট কার্ড প্রিন্ট',3300],['রি-প্রিন্ট স্মার্ট কার্ড',3500]],fields:['স্মার্ট কার্ড তথ্য প্রদান করুন* (Name, NID, DOB, WhatsApp নম্বর — ডেমো)','সুন্দরবন কুরিয়ার ঠিকানা* (Received নাম, Received নম্বর, জেলা, থানা, ইউনিয়ন)'],notice:'স্মার্ট কার্ড অর্ডার দিলে সময় দিতে হবে ৪/৬ দিন।'},
];
const HISTORIES=[
 {id:'nid',name:'এনআইডি লিস্ট',cols:['SL','NAME','NID','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি','••••••••••','••••-••-••','ডেমো তারিখ']]},
 {id:'snid',name:'স্মার্ট এনআইডি লিস্ট',cols:['SL','NAME','NID','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি ১','••••••••••','••••-••-••','ডেমো'],['2','নমুনা ব্যক্তি ২','••••••••••','••••-••-••','ডেমো'],['3','নমুনা ব্যক্তি ৩','••••••••••','••••-••-••','ডেমো']]},
 {id:'brn',name:'জন্মনিবন্ধন লিস্ট',cols:['SL','NAME','BRN','DATE OF BIRTH','CREATED','ACTION'],rows:[['1','নমুনা ব্যক্তি','••••••••••','••••-••-••','ডেমো']]},
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
 ['অ্যাকাউন্ট',[['profile','প্রোফাইল'],['devices','ডিভাইস'],['logout','লগআউট']]],
];
function navHTML(){
 let h='';SIDEBAR.forEach(([sec,items])=>{h+=`<h3>${sec}</h3>`+items.map(([r,l])=>`<a href="#/${r}" data-r="${r}">${l}</a>`).join('')});return h;
}
function tableHTML(cols,rows,actions){
 const head=`<tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>`;
 const body=rows.length?rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}<td>${actions||''}</td></tr>`).join(''):`<tr><td colspan="${cols.length}">No data available in table</td></tr>`;
 return `<table>${head}${body}</table>`;
}
function fieldHTML(f,i){return `<label>${f}</label><input placeholder="${esc(f)}">`}
function closedBanner(){return `<div class="closed">⚠ নতুন অর্ডারের অনুরোধ বর্তমানে বন্ধ আছে। (ডেমো — অ্যাডমিন টগল দিয়ে এটি নিয়ন্ত্রিত হবে, দেখুন apps/admin)</div>`}
function render(){
 const hash=location.hash.replace('#/','')||'dashboard';const parts=hash.split('/');
 document.querySelectorAll('.sidebar a').forEach(a=>a.classList.toggle('active',a.dataset.r===hash));
 let m=$('#main');let h=`<div class="demo-banner"><strong>ডেমো UI — কোনো আসল ডাটা সার্ভিস নেই।</strong> এই প্রোটোটাইপে কোনো আসল NID / জন্মনিবন্ধন / সার্ভার কপি / বায়োমেট্রিক / লোকেশন / কললিস্ট / IMEI / TIN তথ্য আনা, তৈরি বা প্রিন্ট করা হয় না। সব ফর্ম ডেমো-মাত্র, কোনো ব্যালান্স কাটা হয় না।</div>`;
 if(hash==='dashboard'){
  h+=`<div class="card"><h2>ড্যাশবোর্ড</h2><p class="muted">নমুনা ব্যবহারকারী • Verified ✓ • ব্যালান্স: $ 10 (ডেমো)</p>
  <div class="card"><b>Enable Notifications</b><p class="muted">Stay updated with the latest alerts and important messages.</p><button class="btn" onclick="showModal('Notifications Disabled!','You have blocked notifications. You can enable them in your browser settings. (ডেমো — কোনো পারমিশন দেওয়া হয়নি)')">Allow</button></div>
  <div class="notice">📢 <b>Important Notice:</b> সার্ভারের সকল আপডেট পেতে গ্রুপে জয়েন থাকুন ধন্যবাদ 📢 <button class="btn ghost" onclick="demoMsg('WhatsApp নোটিশ')">👆 Click Now 👆</button> <span class="muted">(ডেমো — কোনো গ্রুপে জয়েন করা হয় না)</span></div>
  <p class="notice" style="margin-top:12px">📢 সাইটে কোনো সমস্যা হলে, “রিপোর্ট অপশন” থেকে রিপোর্ট করুন। অর্ডার অপশন চালু 🔥 <span class="muted">— তবে অর্ডার পেজে বন্ধের ব্যানার আছে; এই অমিলটি অ্যাডমিন টগল দিয়ে সমাধানের জন্য রাখা হয়েছে।</span></p></div>
  <div class="card"><h3>সার্ভিস কার্ড (কার্ডে ক্লিক করলে কোথাও যায় না — মূল সাইটের মতো শুধু তথ্য)</h3><div class="grid">`+SERVICES.map(s=>`<div class="card"><b>${s.name}</b><div>কার্ড খরচ: ${s.cost}</div><div class="muted">কার্ড তালিকা: ${HISTORIES.find(x=>x.id===s.id)?.rows.length||0}</div></div>`).join('')+`</div></div>
  <div class="card"><h3>Oders Logs (মূল সাইটের বানান অপরিবর্তিত রাখা হয়নি — এখানে সঠিক লেখা: Orders Logs)</h3><p class="muted">১৮টি অর্ডার সার্ভিসের প্রতিটিতে Pending / Received / Completed / Refunded — সব ০ (ডেমো)।</p><div class="grid">`+ORDERS.map(o=>`<div class="card"><b>${o.name}</b><div class="muted">Pending 0 • Received 0 • Completed 0 • Refunded 0</div></div>`).join('')+`</div></div>
  <div class="card"><h3>Activity Logs</h3><p class="muted">১০টি ডেমো এন্ট্রি: লগইন ও কার্ড তৈরির রেকর্ড (কোনো আসল IP / ডিভাইস তথ্য নেই)।</p><p><b>Profile Completion: 100% Complete</b> — Account Created, Email verified, Phone number added, Have recharged successfully।</p>
  <h3>Quick Access</h3><p><button class="btn" onclick="location.hash='#/recharge'">রিচার্জ</button> <button class="btn ghost" onclick="showModal('লাইভ চ্যাট (ডেমো প্লেসহোল্ডার)','মূল অডিটে লাইভ চ্যাটের গন্তব্য যাচাই হয়নি। তাই এখানে কোনো চ্যাট খোলা হয় না — শুধু প্লেসহোল্ডার রাখা হয়েছে।')">লাইভ চ্যাট</button> <button class="btn ghost" onclick="location.hash='#/report'">রিপোর্ট</button> <button class="btn ghost" onclick="location.hash='#/profile'">প্রোফাইল</button></p></div>`;
 }
 else if(hash==='recharge'){
  h+=`<div class="card"><h2>রিচার্জ — অটো রিচার্জ ২৪ ঘণ্টা 🔥</h2><p class="notice">পেমেন্ট করার পর অবশ্যই সঠিক Transaction ID এবং যে নম্বর থেকে পেমেন্ট করছেন ঐ নম্বর প্রদান করবেন। ভুল তথ্য দিলে আপনার অ্যাকাউন্ট সাসপেন্ড হবে। (ডেমো নিয়ম-নোট)</p>
  <label>Amount*</label><input id="amt" placeholder="সর্বনিম্ন রিচার্জ 100 টাকা" type="number"><p><button class="btn" onclick="const v=+document.getElementById('amt').value; if(!v||v<100){showModal('যাচাই','সর্বনিম্ন রিচার্জ 100 টাকা। (ডেমো)')}else{demoMsg('রিচার্জ')}">Recharge</button></p><p class="muted">পেমেন্ট মাধ্যমের ধাপ ডেমোতে দেখানো হয়নি — কোনো পেমেন্ট করা হয় না।</p>
  <h3>রিচার্জ ইতিহাস</h3>${tableHTML(['SL','NUMBER','TRXID','AMOUNT','TYPE','DATE','ACTION'],[],'<button class="btn ghost" onclick="demoMsg(\'Delete — ডেমো\')">Delete</button>')}<p><button class="btn accent" onclick="demoMsg('Delete All Recharge History — ডেমো')">Delete All Recharge History</button> <span class="muted">(ডেমো — কিছু মোছা হয় না)</span></p>
  <h3>ডিপোজিট ইতিহাস</h3>${tableHTML(['SL','TRXID','AMOUNT','TYPE','STATUS','DATE'],[])}</div>`;
 }
 else if(parts[0]==='service'){
  const s=SERVICES.find(x=>x.id===parts[1]); if(!s){h+='<p>পাওয়া যায়নি।</p>'}
  else{
   const insufficient=[100,40,25].includes(s.cost)&&s.cost>10;
   h+=`<div class="card"><h2>${s.title}</h2><p class="notice">${s.note}</p>`;
   if(s.uploads.length) h+=s.uploads.map(u=>`<label>${u}</label><input type="file" onclick="event.preventDefault();demoMsg('ফাইল আপলোড — ডেমো')"></input>`).join('');
   if(s.autoload) h+=`<p><button class="btn ghost" onclick="openAutoload('${s.id}')">এনআইডি অটোলোড করুন / স্বয়ংক্রিয়ভাবে ডেটা লোড করুন</button></p>`;
   if(s.api) h+=`<label>সার্ভারের API*</label><select id="apiSel" onchange="document.getElementById('apiNote').textContent=this.value==='5'?'এটি প্রিন্ট করতে 10 টাকা কাটা হবে (ডেমো নোট)':'এটি প্রিন্ট করতে 25 টাকা কাটা হবে (ডেমো নোট)'"><option value="3">API ৩ (25 TK)</option><option value="5">API ৫ (10 TK)</option></select><p id="apiNote">এটি প্রিন্ট করতে 25 টাকা কাটা হবে (ডেমো নোট)</p><p><button class="btn ghost" onclick="showModal('ডেমো ছবি','মূল অডিটে এই ডেমো ছবি লোড হয়নি। এখানে কোনো আসল নমুনা ছবি দেখানো হয় না।')">ডেমো দেখুন — এখানে ক্লিক করুন</button></p>`;
   if(s.captcha) h+=`<div class="card"><b>ক্যাপচা (প্লেসহোল্ডার)</b><p class="muted">মূল অডিটে ক্যাপচা ছবি “NO IMAGE” ছিল এবং Reload-এ API ত্রুটি এসেছিল। এখানে কোনো আসল ক্যাপচা সিস্টেম নেই।</p><button class="btn ghost" onclick="showModal('Invalid response from the API!','ডেমো প্লেসহোল্ডার — মূল সাইটের ত্রুটি-বার্তার নমুনা।')">↻ Reload Captcha</button></div>`;
   if(s.id==='brn') h+=`<p><button class="btn ghost" onclick="randomBRN()">Left Bar Code / QR Link — Random (ডেমো)</button> <span id="brnOut" class="muted"></span></p>`;
   h+=s.fields.map((f,i)=>fieldHTML(f,i)).join('');
   if(insufficient) h+=`<div class="closed">Insufficient balance! You don't have enough balance to use this service.</div><p><button class="btn" onclick="location.hash='#/recharge'">Recharge Now</button></p>`;
   else h+=`<p class="notice">এটি প্রিন্ট করতে আপনার অ্যাকাউন্ট থেকে ${s.cost} টাকা কাটা হবে। (ডেমো নোট — আসলে কাটা হয় না)</p><p><button class="btn" onclick="demoMsg('Save & Print — ডেমো')">Save & Print</button></p>`;
   h+=`</div>`;
  }
 }
 else if(parts[0]==='order'){
  const o=ORDERS.find(x=>x.id===parts[1]); if(!o){h+='<p>পাওয়া যায়নি।</p>'}
  else{
   h+=`<div class="card"><h2>${o.name}</h2><p>${o.label}</p>${o.notice?`<p class="notice">${o.notice}</p>`:''}${closedBanner()}`;
   if(o.pinMissing) h+=`<p class="notice">মূল অডিটে এই পেজে Operator-এর কোনো অপশন কার্ড রেন্ডার হয়নি — শুধু “Operator*” লেখা ছিল। এখানে সেই ঘাটতিটি প্লেসহোল্ডার হিসেবে চিহ্নিত রাখা হয়েছে, মোট দাম “?” দেখায়।</p>`;
   if(o.options) h+=`<label>অপশন বাছুন</label><div id="opts">`+o.options.map(([n,p],i)=>`<span class="opt ${i===0?'sel':''}" onclick="selectOpt(this,${p})">${n} (${p} TK)</span>`).join('')+`</div>`;
   h+=o.fields.map((f,i)=>fieldHTML(f,i)).join('');
   h+=`<p class="notice" id="totalNote">এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ${o.cost??'?'} টাকা কাটা হবে। (ডেমো নোট)</p><p class="muted">অর্ডার বন্ধ থাকায় সাবমিট বোতাম নেই — ডেমোতে কোনো অর্ডার করা হয় না।</p>
   <h3>অর্ডার ইতিহাস</h3>${tableHTML(['NO','COST','STATUS','SYNC','CREATED','ACTION'],[])}${o.id==='smartnidcard'?'<p class="muted">মূল সাইটে এই টেবিলে অতিরিক্ত NAME কলাম ছিল।</p>':''}</div>`;
  }
 }
 else if(parts[0]==='free'){
  const f=FREES.find(x=>x.id===parts[1]);
  if(parts[1]==='signature') h+=`<div class="card"><h2>স্বাক্ষর তৈরি</h2><p class="muted">সঠিক ট্যাব শিরোনাম: “স্বাক্ষর তৈরি” (মূল সাইটে ভুল করে “Date of Birth Finder” দেখাত)।</p>`;
  else if(f) h+=`<div class="card"><h2>${f.name}</h2>`;
  if(f){h+=`<label>${f.field}</label>${f.id==='dobfinder'?'<label>ডাটার ধরণ*</label><select><option>জন্মনিবন্ধন নম্বর</option><option>এনআইডি নম্বর</option></select>':''}<input id="freeIn"><p><button class="btn" onclick="showModal('যাচাই বার্তা','${f.err} (ডেমো — খালি ক্লিকের যাচাই বার্তা, কোনো আসল লুকআপ চালানো হয়নি)')">${f.btn}</button></p><p class="muted">কোনো আসল নাম/নম্বর দিয়ে লুকআপ চালানো হয় না।</p></div>`}
 }
 else if(parts[0]==='history'){
  const hh=HISTORIES.find(x=>x.id===parts[1]);
  h+=`<div class="card"><h2>${hh.name}</h2>${tableHTML(hh.cols,hh.rows,hh.rows.length?`<button class="btn ghost" onclick="demoMsg('Edit — শুধু দেখা (ডেমো)')">Edit</button> <button class="btn ghost" onclick="showModal('প্রিন্ট প্রিভিউ (ডেমো)','এটি একটি নমুনা প্রিভিউ কাঠামো মাত্র। কোনো আসল কার্ড প্রিন্ট করা হয় না এবং কোনো আসল ব্যক্তিগত তথ্য এখানে নেই।')">Print</button> <button class="btn accent" onclick="demoMsg('Delete — ডেমো')">Delete</button>`: '')}<p class="muted">Edit = শুধু দেখা যাবে, সেভ করা হবে না। Print = ডেমো প্রিভিউ, আসল প্রিন্ট নয়। Delete = ডেমো, কিছু মোছা হয় না।</p></div>`;
 }
 else if(hash==='report'){h+=`<div class="card"><h2>রিপোর্ট</h2><label>সমস্যার বিষয়*</label><input><label>সমস্যার ব্যাখ্যা*</label><textarea></textarea><p class="muted">ছবি যোগ করতে চাইলে লাইভ চ্যাট ব্যবহার করতে বলা আছে (মূল নোট) — ডেমোতে ছবি পাঠানো হয় না।</p><p><button class="btn" onclick="demoMsg('রিপোর্ট Submit — ডেমো')">Submit</button></p></div>`}
 else if(hash==='support'){h+=`<div class="card"><h2>সাপোর্ট</h2><p>মূল সাইটে সাপোর্ট বাইরের WhatsApp গ্রুপের লিংক খুলত। এখানে কোনো গ্রুপ লিংক দেওয়া হয়নি, জয়েন/মেসেজ করা হয় না — শুধু প্লেসহোল্ডার।</p><button class="btn ghost" onclick="demoMsg('সাপোর্ট — ডেমো প্লেসহোল্ডার')">সাপোর্ট (ডেমো)</button></div>`}
 else if(hash==='profile'){h+=`<div class="card"><h2>প্রোফাইল</h2><p>নমুনা ব্যবহারকারী • Verified: Yes • Balance: 10 • Joined: ডেমো তারিখ • Profile Completion: 100%</p>
 <h3>Profile Update (ডেমো)</h3><label>নাম*</label><input value="নমুনা ব্যবহারকারী"><label>ইমেল* (disabled)</label><input disabled value="demo@example.com"><label>নম্বর*</label><input value="01XXXXXXXXX (মাস্ক করা ডেমো)"><p><button class="btn" onclick="demoMsg('Update Profile — ডেমো')">Update Profile</button></p>
 <h3>Change Password (ডেমো)</h3><label>পুরাতন পাসওয়ার্ড*</label><input type="password"><label>নতুন পাসওয়ার্ড*</label><input type="password"><label>কনফার্ম পাসওয়ার্ড*</label><input type="password"><p><button class="btn" onclick="demoMsg('Update Password — ডেমো')">Update Password</button></p>
 <h3>Theme Color (ডেমো)</h3><p><span class="swatch" style="background:#ff4961" onclick="document.documentElement.style.setProperty('--accent','#ff4961')"></span><span class="swatch" style="background:#0f766e" onclick="document.documentElement.style.setProperty('--accent','#0f766e')"></span><span class="swatch" style="background:#2563eb" onclick="document.documentElement.style.setProperty('--accent','#2563eb')"></span> <span class="muted">বর্তমান অ্যাকসেন্ট: #ff4961 (ডেমোতে শুধু এই পেজের চেহারা বদলায়)</span></p>
 <h3>Cards Lists (All Time — ডেমো)</h3><p>NID: 1, Smart NID: 3, BRN: 1, Server Copy: 0, OTP Server Copy: 0, Sign to Server Copy: 0, Tin: 0, NID Correction Form: 0</p></div>`}
 else if(hash==='devices'){h+=`<div class="card"><h2>ডিভাইস</h2>${tableHTML(['SL','IP','DEVICE ID','PLATFORM','SESSION','ACTIVED','CREATED','ACTION'],[['1','•••.•••','ডেমো-ID','Android','Expired','—','ডেমো'],['2','•••.•••','ডেমো-ID','Linux / Chrome','Expired','—','ডেমো'],['3','•••.•••','ডেমো-ID','Android','Active','—','ডেমো'],['4','•••.•••','ডেমো-ID','Linux / Chromium','Current','—','ডেমো']],'<button class="btn ghost" onclick="demoMsg(\'সেশন রিমুভ — ডেমো\')">Remove</button>')}<p class="muted">কোনো আসল IP / ডিভাইস ID এখানে নেই, কোনো সেশন সরানো হয় না।</p></div>`}
 else if(hash==='logout'){h+=`<div class="card"><h2>লগআউট (ডেমো)</h2><p>ডেমোতে লগআউট করা হয় না — এই পেজ শুধু কাঠামো দেখায়।</p><button class="btn accent" onclick="demoMsg('লগআউট — ডেমো')">লগআউট (ডেমো)</button></div>`}
 else{h+='<div class="card"><p>পেজ পাওয়া যায়নি। সাইডবার থেকে বাছুন।</p></div>'}
 m.innerHTML=h;
}
function selectOpt(el,price){document.querySelectorAll('#opts .opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');const n=$('#totalNote');if(n)n.textContent=`এটি অর্ডার করতে আপনার অ্যাকাউন্ট থেকে ${price} টাকা কাটা হবে। (ডেমো নোট)`}
function openAutoload(id){
 if(id==='brn'){showModal('Autoload Information','<label>Birth Registration Number*</label><input><label>Date of Birth*</label><input><label>Captcha Text* (ডেমো গাণিতিক ক্যাপচা)</label><input><p><button class="btn ghost" onclick="showModal(\'ডেমো\',\'Calculate — ডেমো, কিছু লোড করা হয়নি।\')">Calculate</button> <button class="btn" onclick="demoMsg(\'Load — ডেমো\')">Load</button></p><p class="muted">Hint: Try it yourself. (ডেমো)</p>')}
 else{showModal('Autoload Information','<label>এনআইডি / পিন নম্বর*</label><input><label>জন্ম তারিখ*</label><input><p class="notice">১০ টাকা কাটা হবে (ডেমো নোট — আসলে কাটা হয় না)।</p><p><button class="btn" onclick="demoMsg(\'Load — ডেমো\')">Load</button></p>')}
}
function randomBRN(){const code=Array.from({length:4},()=>String.fromCharCode(65+Math.floor(Math.random()*26))).join('');$('#brnOut').textContent=`ডেমো কোড: ${code} • ডেমো QR লিংক: demo.nagarikseba.com/qr/${code} (আসল সরকারি লিংক নয়)`}
$('#sidebar').innerHTML=navHTML();
window.addEventListener('hashchange',render);render();
