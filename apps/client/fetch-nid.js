import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://msaxqcgkfmjcldmihyvf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_fwr-UaCeYUoxbTqDr-mcxw_j7EYwiRL';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nid, dob } = req.body;

  if (!nid || !dob) {
    return res.status(400).json({ error: 'NID and DOB are required' });
  }

  try {
    // 1. Check if data already exists in your database
    const { data: existingData, error: fetchError } = await supabase
      .from('nid_data')
      .select('*')
      .eq('nid', nid)
      .limit(1);

    if (existingData && existingData.length > 0) {
      console.log('Data found locally');
      return res.status(200).json({ data: existingData[0], source: 'local' });
    }

    // 2. Fetch fresh data from Smart Seba (via Proxy)
    // আমরা servercopy.work ব্যবহার করছি কারণ এটি smart-seba ডাটা ফেচ করে
    const proxyUrl = `https://servercopy.work/nid.php?key=2a3b267ca79e6abc23fb675a0e381656&nid=${nid}&dob=${dob}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const smartSebaData = await response.json();

    // 3. Save to Supabase
    const { data: savedData, error: saveError } = await supabase
      .from('nid_data')
      .insert([{ 
        nid: nid, 
        dob: dob, 
        data: JSON.stringify(smartSebaData), // Raw data store korar jonno
        created_at: new Date().toISOString()
      }])
      .select();

    if (saveError) throw saveError;

    return res.status(200).json({ data: savedData[0], source: 'fresh_fetch' });

  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Failed to fetch or save data', details: error.message });
  }
}
