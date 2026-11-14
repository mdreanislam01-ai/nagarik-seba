export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { ubrn, dob } = req.body || {};
  if (!ubrn || !dob) {
    return res.status(400).json({ success: false, message: 'UBRN এবং জন্ম তারিখ আবশ্যক।' });
  }

  const cleanUbrn = String(ubrn).replace(/\D/g, '');
  const rawDob = String(dob).trim();

  // YYYY-MM-DD এবং DD/MM/YYYY দুটি ফরম্যাটই প্রস্তুত রাখা
  let isoDob = rawDob;
  let slashDob = rawDob;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDob)) {
    const [d, m, y] = rawDob.split('/');
    isoDob = `${y}-${m}-${d}`;
    slashDob = `${d}/${m}/${y}`;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDob)) {
    const [y, m, d] = rawDob.split('-');
    isoDob = `${y}-${m}-${d}`;
    slashDob = `${d}/${m}/${y}`;
  }

  const API_KEY = process.env.DOB_API_KEY || 'vbn_e20046874bca2dbc3b0c2ff62e77aebfa229150bd11af2dd';
  const BASE_URL = 'https://my-api.top/api/v1/birth';

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'x-api-key': API_KEY
  };

  // প্রোভাইডারের সম্ভাব্য রিকোয়েস্ট ধরনগুলো পর্যায়ক্রমে চেষ্টা করা
  const attempts = [
    // ১. POST (YYYY-MM-DD)
    () => fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ubrn: cleanUbrn, dob: isoDob, api_key: API_KEY })
    }),
    // ২. GET Query Params (YYYY-MM-DD)
    () => fetch(`${BASE_URL}?ubrn=${encodeURIComponent(cleanUbrn)}&dob=${encodeURIComponent(isoDob)}&api_key=${encodeURIComponent(API_KEY)}`, {
      method: 'GET',
      headers
    }),
    // ৩. GET Query Params (DD/MM/YYYY)
    () => fetch(`${BASE_URL}?ubrn=${encodeURIComponent(cleanUbrn)}&dob=${encodeURIComponent(slashDob)}&api_key=${encodeURIComponent(API_KEY)}`, {
      method: 'GET',
      headers
    })
  ];

  let lastData = null;

  for (const runAttempt of attempts) {
    try {
      const response = await runAttempt();
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        continue;
      }

      lastData = data;

      // সফলভাবে ডেটা পাওয়া গেলে রিটার্ন করা
      const payload = data.data || data.result || data;
      const hasValidRecord =
        response.ok &&
        data.success !== false &&
        data.status !== false &&
        payload &&
        typeof payload === 'object' &&
        (payload.nameBn || payload.nameEn || payload.personNameBn || payload.personNameEn || payload.name || payload.fatherNameBn || payload.motherNameBn || payload.ubrn || payload.brn);

      if (hasValidRecord) {
        return res.status(200).json({
          success: true,
          data: payload,
          charged: 2
        });
      }
    } catch (err) {
      // পরবর্তী মেথড চেষ্টা করবে
    }
  }

  return res.status(404).json({
    success: false,
    message: (lastData && (lastData.message || lastData.error)) || 'তথ্য পাওয়া যায়নি (Record not found)। UBRN ১৭ ডিজিট কি না যাচাই করুন।'
  });
}
