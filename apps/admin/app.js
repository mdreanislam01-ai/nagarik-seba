/* Nagarik Seba Admin — DESIGN-ONLY demo. No live backend, no real money or data movement. */
const $=s=>document.querySelector(s);
function showModal(t,h){$('#modalTitle').textContent=t;$('#modalBody').innerHTML=h;$('#modalBack').classList.add('open')}
function closeModal(){$('#modalBack').classList.remove('open')}
function demo(w){showModal('নোটিশ',`<p><b>${w}</b> — এই অপশনটি বর্তমানে চালু নয়।</p>`)}

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
Object.assign(ICONS,{dashboard:S(P.chart),users:S(P.users),services:S(P.tools),orders:S(P.receipt),recharges:S(P.money),notices:S(P.mega),toggle:S(P.toggle),reports:S(P.chart)});
const NAV=[['dashboard','অ্যাডমিন ড্যাশবোর্ড'],['users','ব্যবহারকারী'],['services','সার্ভিস ও মূল্য'],['orders','অর্ডার'],['recharges','রিচার্জ অনুমোদন'],['notices','নোটিশ'],['toggle','অর্ডার চালু / বন্ধ'],['reports','রিপোর্ট']];
const PRICES=[['এনআইডি ক্রিয়েট',5],['স্মার্ট এনআইডি ক্রিয়েট',10],['জন্মনিবন্ধন ক্রিয়েট',5],['মিনিস্ট্রি ডাটা',100],['সার্ভার কপি (API ৩)',25],['সার্ভার কপি (API ৫)',10],['সাইন টু সার্ভার কপি',5],['টিন সার্টিফিকেট ডাউনলোড',40],['এনআইডি সংশোধন ফর্ম',25],['ভাতা ফর্ম ডাউনলোড',10],['সাইন কপি অর্ডার',234],['সার্ভার কপি অর্ডার',60],['এনআইডি কপি অর্ডার',320],['স্মার্ট কার্ড PDF',350],['বায়োমেট্রিক (GP)',60],['টিন সার্টিফিকেট অর্ডার',12],['লোকেশন',168],['নাম্বার টু IMEI',168],['এনআইডি টু অল নাম্বার',312],['INFO Bkash',605],['INFO Nagad Personal',605],['INFO Rocket',550],['INFO Bkash Agent',700],['INFO Bkash Merchant',700],['INFO Nagad Agent',2500],['এনআইডি পাসওয়ার্ড সেট',50],['নাম-ঠিকানা দিয়ে এনআইডি',350],['নতুন জন্ম নিবন্ধন নরমাল',800],['নতুন জন্ম নিবন্ধন পসিবল',800],['নতুন জন্ম নিবন্ধন মিনিস্ট্রি',1000],['নতুন জন্ম নিবন্ধন CTG নরমাল',2000],['পাসপোর্ট SB MRP',450],['পাসপোর্ট SB E',600],['কললিস্ট ৩ মাস',1200],['কললিস্ট ৬ মাস',1500],['IMEI টু অ্যাক্টিভ নম্বর',600],['পিন রিসেট','— (মূল সাইটে অপশন ছিল না)'],['অরিজিনাল স্মার্ট কার্ড নতুন',3300],['অরিজিনাল স্মার্ট কার্ড রি-প্রিন্ট',3500]];
let orderOpen=false;
function render(){
 const hash=location.hash.replace('#/','')||'dashboard';
 document.querySelectorAll('.sidebar a').forEach(a=>a.classList.toggle('active',a.dataset.r===hash));
 let h='';
 if(hash==='dashboard'){h+=`<div class="card"><h2>অ্যাডমিন ড্যাশবোর্ড</h2><div class="grid"><div class="card"><div class="stat">৩</div><div class="muted"> ব্যবহারকারী</div></div><div class="card"><div class="stat">০</div><div class="muted">নতুন অর্ডার</div></div><div class="card"><div class="stat">০</div><div class="muted">অপেক্ষমাণ রিচার্জ</div></div><div class="card"><div class="stat">${orderOpen?'চালু':'বন্ধ'}</div><div class="muted">অর্ডার গ্রহণ</div></div></div><p class="notice">মূল অডিটের অমিল: ড্যাশবোর্ড নোটিশে “অর্ডার চালু” লেখা থাকলেও অর্ডার পেজে বন্ধের ব্যানার ছিল। এই টগলটি সেই নিয়ন্ত্রণের ।</p></div>`}
 else if(hash==='users'){h+=`<div class="card"><h2>ব্যবহারকারী</h2><table><tr><th>নাম</th><th>ইমেইল</th><th>ভেরিফাইড</th><th>ব্যালান্স</th></tr><tr><td>নমুনা ব্যবহারকারী ১</td><td>demo1@example.com</td><td>হ্যাঁ</td><td>$ 10</td></tr><tr><td>নমুনা ব্যবহারকারী ২</td><td>demo2@example.com</td><td>হ্যাঁ</td><td>$ 0</td></tr></table><p class="muted">আসল ইমেইল / ফোন নম্বর এখানে নেই।</p></div>`}
 else if(hash==='services'){h+=`<div class="card"><h2>সার্ভিস ও মূল্য (সম্পাদনা)</h2><table><tr><th>সার্ভিস</th><th>মূল্য (টাকা)</th><th>অ্যাকশন</th></tr>`+PRICES.map((p,i)=>`<tr><td>${p[0]}</td><td><input value="${p[1]}" style="width:110px"></td><td><button class="btn ghost" onclick="demo('মূল্য সংরক্ষণ')">সংরক্ষণ</button></td></tr>`).join('')+`</table></div>`}
 else if(hash==='orders'){h+=`<div class="card"><h2>অর্ডার</h2><table><tr><th>NO</th><th>সার্ভিস</th><th>COST</th><th>STATUS</th><th>SYNC</th></tr><tr><td>—</td><td> অর্ডার নেই</td><td>—</td><td><select><option>Pending</option><option>Received</option><option>Completed</option><option>Refunded</option></select></td><td>—</td></tr></table><p><button class="btn" onclick="demo('অর্ডার স্ট্যাটাস পরিবর্তন')">স্ট্যাটাস সংরক্ষণ</button></p></div>`}
 else if(hash==='recharges'){h+=`<div class="card"><h2>রিচার্জ অনুমোদন</h2><table><tr><th>SL</th><th>NUMBER (মাস্ক)</th><th>TRXID (মাস্ক)</th><th>AMOUNT</th><th>STATUS</th><th>ACTION</th></tr><tr><td colspan="6">No data available in table</td></tr></table><p class="muted">অনুমোদন করলে কোনো আসল টাকা যোগ হবে না মাত্র।</p></div>`}
 else if(hash==='notices'){h+=`<div class="card"><h2>নোটিশ</h2><label>নোটিশ শিরোনাম</label><input placeholder=" নোটিশ"><label>নোটিশ লেখা</label><textarea placeholder=" লেখা"></textarea><p><button class="btn" onclick="demo('নোটিশ প্রকাশ')">প্রকাশ</button></p><p class="muted">বর্তমান  নোটিশ: সার্ভার আপডেটের জন্য গ্রুপ নোটিশ ও রিপোর্ট-সংক্রান্ত বার্তা (কাঠামো মাত্র)।</p></div>`}
 else if(hash==='toggle'){h+=`<div class="card"><h2>অর্ডার চালু / বন্ধ</h2><p>বর্তমান  অবস্থা: <b>${orderOpen?'চালু':'বন্ধ'}</b></p><p><button class="btn" onclick="orderOpen=!orderOpen;render();showModal(' টগল','অর্ডার গ্রহণ এখন '+(orderOpen?'চালু':'বন্ধ')+'। ক্লায়েন্ট সাইটে এটি সরাসরি যায় না, কারণ লাইভ ব্যাকএন্ড নেই।')">টগল করুন</button></p><p class="muted">মূল সাইটে অর্ডার পেজে বন্ধের ব্যানার ছিল, ড্যাশবোর্ডে চালুর বার্তা ছিল — এই টগল সেই দুই বার্তাকে এক জায়গা থেকে নিয়ন্ত্রণের নকশা।</p></div>`}
 else if(hash==='reports'){h+=`<div class="card"><h2>রিপোর্ট</h2><div class="grid"><div class="card"><div class="stat">৫</div><div class="muted">মোট  কার্ড (NID ১ + Smart NID ৩ + BRN ১)</div></div><div class="card"><div class="stat">০</div><div class="muted">মোট অর্ডার</div></div><div class="card"><div class="stat">০</div><div class="muted">মোট রিচার্জ</div></div></div></div>`}
 else{h+='<div class="card"><p>পেজ পাওয়া যায়নি।</p></div>'}
 $('#main').innerHTML=h;
}
$('#sidebar').innerHTML='<h3>অ্যাডমিন</h3>'+NAV.map(([r,l])=>`<a href="#/${r}" data-r="${r}">${ico(r)}<span>${l}</span></a>`).join('')+'<h3>লিংক</h3><p class="muted">ক্লায়েন্ট: nagarikseba.com (ডোমেইন এখনো কেনা হয়নি)<br>অ্যাডমিন: admin.nagarikseba.com</p>';
$('#sidebar').addEventListener('click',e=>{if(e.target.closest('a')&&window.innerWidth<=800)document.querySelector('.sidebar').classList.remove('open')});
window.addEventListener('hashchange',render);render();
