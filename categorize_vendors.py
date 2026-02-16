#!/usr/bin/env python3
"""
Categorize vendors based on their name and description.
Uses keyword matching to automatically assign categories.
"""

import httpx
import json
import time

# Supabase config
SUPABASE_URL = "https://gqlprwursgbgkfkwzkyb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU"

# Category keywords for matching (Dutch + English)
CATEGORY_KEYWORDS = {
    'venue': [
        'locatie', 'kasteel', 'boerderij', 'trouwlocatie', 'zaal', 'landgoed',
        'trouwen', 'feestlocatie', 'trouwzaal', 'evenementenlocatie', 'venue',
        'buiten trouwen', 'binnen trouwen', 'tuin', 'park', 'strand', 'boot'
    ],
    'photography': [
        'fotograaf', 'foto', 'fotografie', 'shoot', 'fotoshoot', 'bruidsfoto',
        'trouwfoto', 'reportage', 'photography', 'photographer', 'photo'
    ],
    'videography': [
        'video', 'videograaf', 'film', 'cinematografie', 'videography', 'filmer',
        'trouwfilm', 'huwelijksfilm', 'videographer'
    ],
    'flowers': [
        'bloem', 'bloemist', 'boeket', 'bloemen', 'florist', 'flowers', 'bloemwerk',
        'bruidsboeket', 'decoratie bloemen', 'corsage', 'rouwboeket'
    ],
    'catering': [
        'catering', 'eten', 'diner', 'lunch', 'chef', 'buffet', 'food', 'maaltijd',
        'restaurant', 'kok', ' barbecue', 'bbq', 'foodtruck', 'high tea', 'brunch'
    ],
    'music': [
        'band', 'dj', 'muziek', 'music', 'disco', 'feestband', 'coverband',
        'zanger', 'zangeres', 'pianist', 'ceremonie', 'feestmuziek'
    ],
    'dress': [
        'jurk', 'trouwjurk', 'kleding', 'bruidsmode', 'dress', 'bride', 'suit',
        'pak', 'trouwpak', 'bruidsjurk', 'avondjurk', 'galajurk'
    ],
    'makeup': [
        'make-up', 'makeup', 'visagie', 'haar', 'kapper', 'styling', 'haarstyling',
        'bruidstyling', 'cosmetica', 'beauty', 'visagist', 'kapsel'
    ],
    'cake': [
        'taart', 'bruidstaart', 'gebak', 'cake', 'cupcakes', 'dessert', 'patisserie',
        'bakkerij', 'zoet', 'wedding cake'
    ],
    'invitations': [
        'uitnodiging', 'stationery', 'papier', 'kaart', 'drukwerk', 'invitations',
        'menukaart', 'naamkaartjes', 'save the date', 'trouwkaart', 'geboortekaart'
    ],
    'transport': [
        'auto', 'vervoer', 'limousine', 'transport', 'oldtimer', 'trouwauto',
        'wedding car', 'bus', 'vervoer gasten', 'chauffeur', 'rolls royce'
    ],
    'decoration': [
        'decoratie', 'styling', 'aankleding', 'decoration', 'stylist', 'licht',
        'verlichting', 'tafeldecoratie', 'ballonnen', 'confetti', 'tafelstyling'
    ]
}


def get_all_vendors():
    """Fetch all vendors from Supabase."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    response = httpx.get(
        f"{SUPABASE_URL}/rest/v1/vendors?select=id,name,description,category",
        headers=headers,
        timeout=30
    )
    response.raise_for_status()
    return response.json()


def categorize_vendor(name, description):
    """
    Categorize a vendor based on name and description.
    Returns the best matching category or None if uncertain.
    """
    text = f"{name} {description or ''}".lower()
    
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword.lower() in text:
                score += 1
        scores[category] = score
    
    # Get category with highest score
    best_category = max(scores, key=scores.get)
    best_score = scores[best_category]
    
    # Only return if we have at least one match
    if best_score > 0:
        return best_category
    
    return None


def update_vendor_category(vendor_id, category):
    """Update a vendor's category in the database."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    response = httpx.patch(
        f"{SUPABASE_URL}/rest/v1/vendors?id=eq.{vendor_id}",
        headers=headers,
        json={"category": category},
        timeout=30
    )
    return response.status_code in [200, 204]


def main():
    print("=" * 60)
    print("Weddingfinder Vendor Categorizer")
    print("=" * 60)
    
    # Fetch all vendors
    print("\n1. Fetching vendors from database...")
    vendors = get_all_vendors()
    print(f"   Found {len(vendors)} vendors")
    
    # Track results
    categorized = 0
    uncertain = []
    already_categorized = 0
    failed = 0
    
    print("\n2. Categorizing vendors...")
    
    for i, vendor in enumerate(vendors):
        vendor_id = vendor['id']
        name = vendor.get('name', '')
        description = vendor.get('description', '')
        current_category = vendor.get('category')
        
        # Skip if already categorized (not 'venue' or None)
        if current_category and current_category != 'venue':
            already_categorized += 1
            continue
        
        # Determine category
        category = categorize_vendor(name, description)
        
        if category:
            # Update vendor
            if update_vendor_category(vendor_id, category):
                categorized += 1
                print(f"   [{categorized}] {name[:40]} -> {category}")
            else:
                failed += 1
                print(f"   [FAIL] {name[:40]}")
        else:
            uncertain.append({
                'id': vendor_id,
                'name': name,
                'description': (description or '')[:100]
            })
        
        # Small delay to avoid rate limiting
        if i % 10 == 0:
            time.sleep(0.1)
    
    # Print summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Total vendors:        {len(vendors)}")
    print(f"Already categorized:  {already_categorized}")
    print(f"Newly categorized:    {categorized}")
    print(f"Failed updates:       {failed}")
    print(f"Uncertain:            {len(uncertain)}")
    
    # Print uncertain vendors for manual review
    if uncertain:
        print("\n3. Vendors needing manual categorization:")
        print("-" * 60)
        for v in uncertain[:10]:  # Show first 10
            print(f"   ID: {v['id']}")
            print(f"   Name: {v['name']}")
            print(f"   Desc: {v['description']}")
            print()
        
        if len(uncertain) > 10:
            print(f"   ... and {len(uncertain) - 10} more")
        
        # Save to file
        with open('uncertain_vendors.json', 'w', encoding='utf-8') as f:
            json.dump(uncertain, f, indent=2, ensure_ascii=False)
        print(f"   Saved {len(uncertain)} uncertain vendors to uncertain_vendors.json")
    
    print("\nDone!")


if __name__ == "__main__":
    main()
