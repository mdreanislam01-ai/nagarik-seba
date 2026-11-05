import { createClient } from '@supabase/supabase-js';

// Vercel থেকে Environment Variables অটোমেটিক লোড হবে
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * NID Data Fetcher with Supabase Caching
 */
export async function getNidDataWithCache(nid, dob) {
  try {
    // 1. Check Cache First (Last 24 hours)
    const { data: cachedData, error } = await supabase
      .from('nid_cache')
      .select('*')
      .eq('nid_number', nid)
      .gte('cached_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cachedData && !error) {
      console.log("Serving from Supabase Cache");
      return cachedData.data_json;
    }

    // 2. If not in cache, fetch from Government API
    // Note: তোমার ব্যবহৃত Government API URL এখানে বসাতে হবে
    const govApiUrl = `https://service.nidw.gov.bd/bangladesh/address/api/v1/nid/${nid}?dob=${dob}`;
    
    const response = await fetch(govApiUrl);
    
    if (!response.ok) {
      throw new Error(`Gov API Error: ${response.status}`);
    }

    const govData = await response.json();

    // 3. Save to Supabase for future use
    await supabase
      .from('nid_cache')
      .upsert({ 
        nid_number: nid, 
        dob: dob, 
        data_json: govData,
        cached_at: new Date().toISOString()
      });

    console.log("Fetched from Gov & Saved to Cache");
    return govData;

  } catch (err) {
    console.error("Cache/Gov Fetch Error:", err);
    
    // Fallback: Try to serve old cache even if it's expired
    const { data: fallbackData } = await supabase
      .from('nid_cache')
      .select('*')
      .eq('nid_number', nid)
      .order('cached_at', { ascending: false })
      .limit(1)
      .single();

    return fallbackData ? fallbackData.data_json : null;
  }
}
