// ফাইল পাথ: api/birth.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { ubrn, dob } = req.body || {};

  if (!ubrn || !dob) {
    return res.status(400).json({ success: false, message: 'UBRN এবং জন্ম তারিখ আবশ্যক।' });
  }

  // Vercel Environment Variable অথবা আপনার দেওয়া API Key
  const API_KEY = process.env.MY_API_KEY || 'vbn_634795dcf8e9fe08d63a35da4f82a80bf4cde62b3ce9766a';

  let cleanUbrn = String(ubrn).trim();
  let cleanDob = String(dob).trim();
  let altDob = cleanDob;

  // DD/MM/YYYY ফরম্যাটকে YYYY-MM-DD ফরম্যাটেও ব্যাকআপ হিসেবে রাখা
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDob)) {
    const [dd, mm, yyyy] = cleanDob.split('/');
    altDob = `${yyyy}-${mm}-${dd}`;
  }

  async function callBirthApi(dobValue) {
    const params = new URLSearchParams();
    params.append('ubrn', cleanUbrn);
    params.append('dob', dobValue);

    const response = await fetch('https://my-api.top/api/v1/birth', {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    return await response.json();
  }

  try {
    let data = await callBirthApi(cleanDob);

    // যদি প্রথম ফরম্যাটে ডাটা না আসে এবং চার্জ না কাটে, তবে বিকল্প তারিখ ফরম্যাটে চেষ্টা করবে
    if (!data.success && (!data.charged || data.charged === 0) && altDob !== cleanDob) {
      data = await callBirthApi(altDob);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।'
    });
  }
}
