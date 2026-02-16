const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'gqlprwursgbgkfkwzkyb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU';

const KEYWORDS = {
  venue: ['locatie', 'kasteel', 'boerderij', 'trouwlocatie', 'zaal', 'landgoed', 'venue'],
  photography: ['fotograaf', 'foto', 'fotografie', 'shoot', 'fotoshoot'],
  videography: ['video', 'videograaf', 'film'],
  flowers: ['bloem', 'bloemist', 'boeket', 'bloemen'],
  catering: ['catering', 'eten', 'diner', 'lunch', 'chef', 'buffet'],
  music: ['band', 'dj', 'muziek'],
  dress: ['jurk', 'trouwjurk', 'kleding', 'bruidsmode'],
  makeup: ['make-up', 'makeup', 'visagie', 'haar', 'kapper'],
  cake: ['taart', 'bruidstaart', 'gebak', 'cake'],
  invitations: ['uitnodiging', 'stationery', 'kaart', 'drukwerk'],
  transport: ['auto', 'vervoer', 'limousine', 'trouwauto'],
  decoration: ['decoratie', 'styling', 'aankleding']
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

async function categorizeVendors() {
  console.log('Fetching vendors...');
  const { body: vendors } = await request('GET', '/vendors?select=id,name,description');
  console.log(`Found ${vendors.length} vendors`);
  
  let updated = 0;
  for (const v of vendors) {
    const cat = categorize(v.name, v.description);
    const res = await request('PATCH', `/vendors?id=eq.${v.id}`, { category: cat });
    if (res.status === 204) {
      updated++;
      console.log(`${v.name.substring(0,40)} -> ${cat}`);
    }
  }
  
  console.log(`\nUpdated ${updated}/${vendors.length} vendors`);
  return updated;
}

categorizeVendors().catch(console.error);
