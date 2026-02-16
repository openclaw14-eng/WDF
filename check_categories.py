import httpx
SUPABASE_URL = 'https://gqlprwursgbgkfkwzkyb.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU'
headers = {'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'}

# Check website coverage
r = httpx.get(f'{SUPABASE_URL}/rest/v1/vendors?select=website', headers=headers)
total = len(r.json())
with_website = len([v for v in r.json() if v.get('website')])
print(f'Total vendors: {total}')
print(f'With website: {with_website}')
print(f'Without website: {total - with_website}')

# Check venue with website
r2 = httpx.get(f'{SUPABASE_URL}/rest/v1/vendors?select=name&eq.category=venue&not.website.is.null', headers=headers)
print(f'Venue with website: {len(r2.json())}')
