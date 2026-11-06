export default async function handler(req, res) {
  // CORS Header setup
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

    // তোমার মূল API URL
    const targetUrl = `https://lmnxbirth-cirtificate-api-pdf.vercel.app?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`;

    // যদি API Key লাগে তবে নিচের লাইনে Key বসিয়ে দিও
    // উদাহরণ: const apiKey = "YOUR_KEY_HERE";
    const apiKey = ""; 

    const headersObj = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
       headersObj['Authorization'] = `Bearer ${apiKey}`; 
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: headersObj
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
}
