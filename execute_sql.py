import httpx
import time

SUPABASE_URL = "https://gqlprwursgbgkfkwzkyb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Read and split SQL into statements
with open("supabase_schema_update.sql", "r") as f:
    sql_content = f.read()

# Split on semicolons but keep statements intact
statements = [s.strip() for s in sql_content.split(';') if s.strip()]

print(f"Found {len(statements)} SQL statements")
print("=" * 60)

# Execute via pg_execute function if available, or use individual REST calls
# We'll try to create the tables and columns via REST API

# First, let's check current tables
r = httpx.get(f"{SUPABASE_URL}/rest/v1/", headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
print(f"Schema endpoint: {r.status_code}")

# Try to create reviews table directly
reviews_table = {
    "id": "uuid DEFAULT gen_random_uuid() PRIMARY KEY",
    "vendor_id": "uuid REFERENCES vendors(id) ON DELETE CASCADE",
    "user_name": "text NOT NULL",
    "user_email": "text",
    "rating": "integer CHECK (rating >= 1 AND rating <= 5)",
    "review_text": "text NOT NULL",
    "created_at": "timestamp with time zone DEFAULT now()",
    "verified": "boolean DEFAULT false"
}

# Let's use the SQL endpoint if available, otherwise create via REST
# Try direct SQL execution via the query parameter

sql_body = sql_content.replace('\n', ' ')

# Try POST to /rest/v1/ with sql
r = httpx.post(
    f"{SUPABASE_URL}/rest/v1/sql",
    headers=headers,
    json={"query": sql_body}
)

print(f"\nSQL execution status: {r.status_code}")
print(f"Response: {r.text[:500] if r.text else 'OK'}")

if r.status_code == 404:
    print("\nSQL endpoint not available. Trying alternative methods...")
    
    # Try to create reviews table via RPC
    r2 = httpx.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=headers,
        json={"query": "CREATE TABLE IF NOT EXISTS public.reviews (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE, user_name text NOT NULL, rating integer CHECK (rating >= 1 AND rating <= 5), review_text text, created_at timestamptz DEFAULT now())"}
    )
    print(f"RPC attempt: {r2.status_code}")
    print(f"Response: {r2.text[:300]}")
