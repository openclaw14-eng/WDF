import httpx

SUPABASE_URL = "https://gqlprwursgbgkfkwzkyb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1NzEzNSwiZXhwIjoyMDg2MzMzMTM1fQ.Nv1_gzB0Q5PrdiBO9Bn1CwQCLXh5BsivrG22HbN6wqU"

with open("supabase_schema_update.sql", "r") as f:
    sql = f.read()

# Execute SQL via RPC
r = httpx.post(
    f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
    headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    },
    json={"query": sql}
)

print(f"Status: {r.status_code}")
print(f"Response: {r.text}")
