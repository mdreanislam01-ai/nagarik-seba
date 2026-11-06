export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { brn, dob } = req.query;

    if (!brn || !dob) {
      return res.status(400).json({ error: 'Missing brn or dob parameters' });
    }

    // API URL তৈরি করা
    const targetUrl = `https://lmnxbirth-cirtificate-api-pdf.vercel.app?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`;

    // প্রথমে JSON আনার চেষ্টা করা হবে
    let data;
    let contentType = '';

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // JSON চাওয়া হচ্ছে
          'Content-Type': 'application/json'
        }
      });

      contentType = response.headers.get('content-type') || '';
      
      if (response.ok) {
        // যদি HTML বা PDF ফিরে আসে, তবে text হিসেবে পড়া যাবে না ভালোভাবে
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // যদি PDF বা HTML আসে, তবে URL itself রিটার্ন করা হলো
          data = { pdfUrl: targetUrl };
        }
      } else {
         throw new Error(`API Error: ${response.status}`);
      }
    } catch (e) {
      // JSON ফেইল করলে, সরাসরি PDF URL ফিরিয়ে দেওয়া হলো
      data = { pdfUrl: targetUrl };
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
                         }
