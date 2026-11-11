module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const ubrn = body.ubrn || req.query.ubrn;
  const dob = body.dob || req.query.dob;

  if (!ubrn || !dob) {
    return res.status(200).json({ success: false, message: 'UBRN এবং জন্ম তারিখ প্রদান করা হয়নি।' });
  }

  const API_KEY = process.env.MY_API_KEY || 'vbn_634795dcf8e9fe08d63a35da4f82a80bf4cde62b3ce9766a';
  const cleanUbrn = String(ubrn).trim();
  const cleanDob = String(dob).trim();

  // তারিখের বিভিন্ন ফরম্যাট তৈরি করা (যাতে প্রোভাইডারের সার্ভার যেকোনো একটি লুফে নেয়)
  let altDob = cleanDob;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDob)) {
    const p = cleanDob.split('/');
    altDob = `${p[2]}-${p[1]}-${p[0]}`; // YYYY-MM-DD
  }

  async function callProviderApi(targetDob) {
    try {
      // পদ্ধতি ১: JSON ফরম্যাটে রিকোয়েস্ট পাঠানো (প্রোভাইডারদের সাইটে এটিই বেশি ব্যবহৃত হয়)
      let response = await fetch('https://my-api.top/api/v1/birth', {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ubrn: cleanUbrn, dob: targetDob })
      });

      let text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        json = null;
      }

      // যদি JSON এ সফল না হয়, তবে ফর্ম-ইউআরএল-এনকোডেড (Form URL Encoded) ফরম্যাটে ট্রাই করবে
      if (!json || (!json.success && json.message)) {
        const params = new URLSearchParams();
        params.append('ubrn', cleanUbrn);
        params.append('dob', targetDob);

        response = await fetch('https://my-api.top/api/v1/birth', {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: params.toString()
        });
        text = await response.text();
        try {
          json = JSON.parse(text);
        } catch (e) {
          json = { success: false, message: 'Invalid JSON response', raw: text };
        }
      }

      return json;
    } catch (err) {
      return { success: false, message: 'Fetch Error: ' + err.message };
    }
  }

  try {
    let result = await callProviderApi(cleanDob);
    
    // প্রথম ফরম্যাটে না আসলে বিকল্প তারিখ ফরম্যাট দিয়ে চেষ্টা করবে
    if (!result.success && (!result.charged || result.charged === 0) && altDob !== cleanDob) {
      result = await callProviderApi(altDob);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(200).json({ success: false, message: 'Server Error: ' + error.message });
  }
};
