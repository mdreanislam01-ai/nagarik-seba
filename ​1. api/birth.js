// ফাইল পাথ: api/birth.js
module.exports = async function handler(req, res) {
  // CORS Header সেট করা যাতে আপনার ডোমেইন থেকে কখনো ব্লক না হয়
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // নিরাপদে Body পার্স করা
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { ubrn, dob } = body || {};

  if (!ubrn || !dob) {
    return res.status(400).json({ success: false, message: 'UBRN এবং জন্ম তারিখ আবশ্যক।' });
  }

  // আপনার API Key
  const API_KEY = process.env.MY_API_KEY || 'vbn_634795dcf8e9fe08d63a35da4f82a80bf4cde62b3ce9766a';

  const cleanUbrn = String(ubrn).trim();
  const cleanDob = String(dob).trim();

  // যদি DD/MM/YYYY দেয়, তবে YYYY-MM-DD ফরম্যাটও ব্যাকআপ হিসেবে তৈরি রাখা
  let altDob = cleanDob;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDob)) {
    const parts = cleanDob.split('/');
    altDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  // API কল করার ফাংশন (প্রথমে POST, কাজ না হলে GET)
  async function fetchFromMyApi(targetDob) {
    const params = new URLSearchParams();
    params.append('ubrn', cleanUbrn);
    params.append('dob', targetDob);

    // ১. প্রথমে POST রিকোয়েস্ট চেষ্টা করা
    let response = await fetch('https://my-api.top/api/v1/birth', {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    // যদি সার্ভার POST সাপোর্ট না করে (404/405 দেয়), তবে GET রিকোয়েস্ট পাঠানো
    if (response.status === 405 || response.status === 404) {
      const getUrl = `https://my-api.top/api/v1/birth?${params.toString()}`;
      response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': API_KEY,
          'Accept': 'application/json'
        }
      });
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return { success: false, message: 'API সার্ভার থেকে সঠিক রেসপন্স আসেনি।', raw: text };
    }
  }

  try {
    // প্রথম চেষ্টা (ইউজারের দেওয়া জন্ম তারিখ ফরম্যাট দিয়ে)
    let data = await fetchFromMyApi(cleanDob);

    // যদি ডাটা না পাওয়া যায় এবং কোনো টাকা না কাটে, তবে বিকল্প তারিখ ফরম্যাট (YYYY-MM-DD) দিয়ে চেষ্টা করা
    if (!data.success && (!data.charged || data.charged === 0) && altDob !== cleanDob) {
      data = await fetchFromMyApi(altDob);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({
      success: false,
      message: 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।'
    });
  }
};
