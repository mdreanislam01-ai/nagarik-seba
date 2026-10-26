/* Nagarik Seba Admin — DESIGN-ONLY demo. No live backend, no real money or data movement. */
const $=s=>document.querySelector(s);
function showModal(t,h){$('#modalTitle').textContent=t;$('#modalBody').innerHTML=h;$('#modalBack').classList.add('open')}
function closeModal(){$('#modalBack').classList.remove('open')}
function demo(w){showModal('নোটিশ',`<p><b>${w}</b> — এই অপশনটি বর্তমানে চালু নয়।</p>`)}

const ICONS={
 dashboard:'🏠',recharge:'💳',report:'🚩',support:'💬',profile:'👤',devices:'📱',logout:'🚪',
 nid:'🪪',snid:'💳',brn:'👶',brni:'🏛️',sc:'🖥️',ssc:'✍️',tin:'📄',ncf:'✏️',vuk:'🎗️',
 sign:'✍️',servercopy:'🖥️',nidcard:'🪪',smartcardpdf:'📕',biomatic:'👆',tincertificate:'📄',location:'📍',number2imei:'📱',nid2allnumber:'🔢',info:'ℹ️',nidpsset:'🔑',namethikananid:'🏠',newbdris:'👶',passport:'🛂',calllist:'📞',i2an:'📲',pinset:'🔒',smartnidcard:'💳',
 signature:'✒️',tininfo:'🔍',dobfinder:'🎂',
 history:'📋'
};
function ico(k){return `<span class="ico">${ICONS[k]||'📄'}</span>`}
Object.assign(ICONS,{dashboard:'📊',users:'👥',services:'🛠️',orders:'🧾',recharges:'💰',notices:'📢',toggle:'🔀',reports:'📈'});
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
window.addEventListener('hashchange',render);render();
