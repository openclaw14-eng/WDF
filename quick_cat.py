import httpx
import json

SUPABASE_URL = "https://gqlprwursgbgkfkwzkyb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU"

KEYWORDS = {
    'venue': ['locatie', 'kasteel', 'boerderij', 'trouwlocatie', 'zaal', 'landgoed', 'venue', 'kasteel'],
    'photography': ['fotograaf', 'foto', 'fotografie', 'shoot', 'fotoshoot'],
    'videography': ['video', 'videograaf', 'film', 'videography'],
    'flowers': ['bloem', 'bloemist', 'boeket', 'bloemen'],
    'catering': ['catering', 'eten', 'diner', 'lunch', 'chef', 'buffet'],
    'music': ['band', 'dj', 'muziek'],
    'dress': ['jurk', 'trouwjurk', 'kleding', 'bruidsmode'],
    'makeup': ['make-up', 'makeup', 'visagie', 'haar', 'kapper'],
    'cake': ['taart', 'bruidstaart', 'gebak', 'cake'],
    'invitations': ['uitnodiging', 'stationery', 'kaart', 'drukwerk'],
    'transport': ['auto', 'vervoer', 'limousine', 'trouwauto'],
    'decoration': ['decoratie', 'styling', 'aankleding']
}

headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}

# Get vendors
r = httpx.get(f"{SUPABASE_URL}/rest/v1/vendors?select=id,name,description", headers=headers)
vendors = r.json()
print(f"Got {len(vendors)} vendors")

# Categorize each
updated = 0
for v in vendors:
    text = f"{v.get('name','')} {v.get('description','')}".lower()
    
    best_cat = 'venue'
    best_score = 0
    for cat, words in KEYWORDS.items():
        score = sum(1 for w in words if w in text)
        if score > best_score:
            best_score = score
            best_cat = cat
    
    # Update
    r2 = httpx.patch(
        f"{SUPABASE_URL}/rest/v1/vendors?id=eq.{v['id']}",
        headers={**headers, "Content-Type": "application/json"},
        json={"category": best_cat}
    )
    if r2.status_code in [200, 204]:
        updated += 1
        print(f"{v['name'][:40]} -> {best_cat}")
    else:
        print(f"FAIL: {v['name'][:40]}")

print(f"\nUpdated {updated}/{len(vendors)} vendors")
