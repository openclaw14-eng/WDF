const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'gqlprwursgbgkfkwzkyb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU';

const KEYWORDS = {
  venue: ['locatie', 'kasteel', 'boerderij', 'trouwlocatie', 'zaal', 'landgoed', 'venue', 'boerderij'],
  photography: ['fotograaf', 'foto', 'fotografie', 'shoot'],
  videography: ['video', 'videograaf', 'film'],
  flowers: ['bloem', 'bloemist', 'boeket'],
  catering: ['catering', 'eten', 'diner', 'lunch', 'chef'],
  music: ['band', 'dj', 'muziek'],
  dress: ['jurk', 'trouwjurk', 'kleding'],
  makeup: ['make-up', 'makeup', 'visagie', 'haar'],
  cake: ['taart', 'bruidstaart', 'gebak'],
  invitations: ['uitnodiging', 'kaart'],
  transport: ['auto', 'vervoer', 'limousine'],
  decoration: ['decoratie', 'styling']
};

function categorize(name, description) {
  const text = `${name} ${description || ''}`.toLowerCase();
  let bestCat = 'venue';
  let bestScore = 0;
  
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    const score = words.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }
  return bestCat;
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      path: `/rest/v1${path}`,
      method: method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null }));
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function uploadVendors() {
  // Load JSON files
  const detailed = JSON.parse(fs.readFileSync('../vendors_detailed.json', 'utf8'));
  
  console.log(`Found ${detailed.length} vendors in vendors_detailed.json`);
  
  // Get existing vendors from Supabase
  const { body: existing } = await request('GET', '/vendors?select=name');
  const existingNames = new Set(existing.map(v => v.name.toLowerCase()));
  console.log(`Existing vendors in DB: ${existingNames.size}`);
  
  // Filter new vendors
  const newVendors = detailed.filter(v => !existingNames.has(v.name.toLowerCase()));
  console.log(`New vendors to upload: ${newVendors.length}`);
  
  // Upload in batches
  let uploaded = 0;
  let failed = 0;
  
  for (const v of newVendors.slice(0, 100)) { // Limit to 100 for now
    const vendor = {
      name: v.name,
      slug: slugify(v.name),
      city: v.city,
      address: v.city,
      description: v.description || `${v.name} in ${v.city}`,
      category: categorize(v.name, v.description),
      price_numeric: v.price || null,
      rating: v.rating || null,
      review_count: v.reviews || 0,
      capacity: v.capacity || null,
      published: true,
      verified: true,
      premium: false
    };
    
    const res = await request('POST', '/vendors', vendor);
    if (res.status === 201) {
      uploaded++;
      console.log(`[${uploaded}] ${v.name} -> ${vendor.category}`);
    } else {
      failed++;
      console.log(`[FAIL] ${v.name}: ${res.status}`);
    }
    
    // Small delay
    await new Promise(r => setTimeout(r, 50));
  }
  
  console.log(`\nUploaded: ${uploaded}`);
  console.log(`Failed: ${failed}`);
}

uploadVendors().catch(console.error);
