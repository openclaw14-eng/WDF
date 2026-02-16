-- ============================================================================
-- Add category column to vendors table for proper categorization
-- ============================================================================

-- Add category column if it doesn't exist
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'venue';

-- Create index for fast category filtering
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);

-- Update existing records - set default category for any NULL values
UPDATE public.vendors SET category = 'venue' WHERE category IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.vendors.category IS 'Vendor category: venue, photography, videography, flowers, catering, music, dress, makeup, cake, invitations, transport, decoration';
