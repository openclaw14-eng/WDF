-- ============================================================================
-- Weddingfinder Database Schema Update
-- Update vendors table + create reviews table
-- ============================================================================

-- ============================================================================
-- 1. UPDATE VENDORS TABLE - Add missing columns
-- ============================================================================

-- Add columns if they don't exist
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS price TEXT,
ADD COLUMN IF NOT EXISTS price_numeric INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT GENERATED ALWAYS AS (COALESCE(city, address)) STORED,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS capacity TEXT,
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;

-- Rename is_premium to premium for consistency
ALTER TABLE public.vendors 
RENAME COLUMN is_premium TO premium;

-- Update existing records with default values
UPDATE public.vendors SET published = TRUE WHERE published IS NULL;
UPDATE public.vendors SET verified = FALSE WHERE verified IS NULL;
UPDATE public.vendors SET review_count = 0 WHERE review_count IS NULL;
UPDATE public.vendors SET images = '[]'::jsonb WHERE images IS NULL;
UPDATE public.vendors SET facilities = '[]'::jsonb WHERE facilities IS NULL;
UPDATE public.vendors SET styles = '[]'::jsonb WHERE styles IS NULL;
UPDATE public.vendors SET faqs = '[]'::jsonb WHERE faqs IS NULL;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_premium ON public.vendors(premium) WHERE premium = TRUE;
CREATE INDEX IF NOT EXISTS idx_vendors_published ON public.vendors(published) WHERE published = TRUE;

-- ============================================================================
-- 2. CREATE REVIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reviews"
    ON public.reviews FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 3. CREATE CONTACT/LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    wedding_date DATE,
    guest_count INTEGER,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_vendor ON public.contact_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created ON public.contact_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact requests are private" 
    ON public.contact_requests FOR ALL USING (false);

-- ============================================================================
-- 4. FUNCTION TO UPDATE VENDOR RATING
-- ============================================================================

CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.vendors
    SET 
        rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id))
    WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_vendor_rating ON public.reviews;
CREATE TRIGGER trg_update_vendor_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_rating();

-- ============================================================================
-- 5. SAMPLE DATA (optional - remove if not needed)
-- ============================================================================

-- Add sample reviews for testing (only if vendors exist)
DO $$
DECLARE
    v_id UUID;
BEGIN
    SELECT id INTO v_id FROM public.vendors LIMIT 1;
    
    IF v_id IS NOT NULL THEN
        INSERT INTO public.reviews (vendor_id, user_name, rating, review_text, verified)
        VALUES 
            (v_id, 'Anna & Peter', 5, 'Geweldige locatie! Perfect voor onze bruiloft. Het team was zeer behulpzaam.', true),
            (v_id, 'Mark & Lisa', 4, 'Mooie plek, goede service. Prijs was wel aan de hoge kant.', true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
