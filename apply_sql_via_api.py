import httpx

SUPABASE_URL = "https://gqlprwursgbgkfkwzkyb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU"

# Split SQL into statements
sql_statements = """
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS price_numeric INTEGER;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS location TEXT GENERATED ALWAYS AS (COALESCE(city, address)) STORED;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS capacity TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.vendors RENAME COLUMN is_premium TO premium;
UPDATE public.vendors SET published = TRUE WHERE published IS NULL;
UPDATE public.vendors SET verified = FALSE WHERE verified IS NULL;
UPDATE public.vendors SET review_count = 0 WHERE review_count IS NULL;
UPDATE public.vendors SET images = '[]'::jsonb WHERE images IS NULL;
UPDATE public.vendors SET facilities = '[]'::jsonb WHERE facilities IS NULL;
UPDATE public.vendors SET styles = '[]'::jsonb WHERE styles IS NULL;
UPDATE public.vendors SET faqs = '[]'::jsonb WHERE faqs IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_premium ON public.vendors(premium) WHERE premium = TRUE;
CREATE INDEX IF NOT EXISTS idx_vendors_published ON public.vendors(published) WHERE published = TRUE;
"""

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Try to use pg_net extension or direct SQL via query parameter
# Try using the SQL endpoint
statements = [s.strip() for s in sql_statements.strip().split(';') if s.strip()]

print(f"Executing {len(statements)} SQL statements...")

for stmt in statements:
    r = httpx.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec",
        headers=headers,
        json={"query": stmt}
    )
    status = "OK" if r.status_code == 200 else f"FAIL ({r.status_code})"
    print(f"  {status}: {stmt[:60]}...")
