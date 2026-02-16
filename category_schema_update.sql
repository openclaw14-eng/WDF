-- ============================================================================
-- Weddingfinder Database Schema Update - Add Category Column
-- ============================================================================

-- 1. Add category column to vendors table
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'venue';

-- 2. Create index on category for fast filtering
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);

-- 3. Create composite index for category + published for common queries
CREATE INDEX IF NOT EXISTS idx_vendors_category_published ON public.vendors(category, published) WHERE published = TRUE;

-- 4. Update existing records with default category
UPDATE public.vendors SET category = 'venue' WHERE category IS NULL;

-- 5. Add constraint to ensure valid categories (optional but recommended)
-- Uncomment if you want strict validation:
-- ALTER TABLE public.vendors ADD CONSTRAINT chk_valid_category 
-- CHECK (category IN ('venue', 'photography', 'videography', 'flowers', 'catering', 'music', 'dress', 'makeup', 'cake', 'invitations', 'transport', 'decoration'));

-- ============================================================================
-- Backwards compatibility: Keep existing queries working
-- ============================================================================

-- Create function to auto-categorize vendors based on name/description
CREATE OR REPLACE FUNCTION auto_categorize_vendor()
RETURNS TRIGGER AS $$
BEGIN
    -- Only auto-categorize if category is null or default
    IF NEW.category IS NULL OR NEW.category = 'venue' THEN
        -- Venue keywords
        IF NEW.name ~* 'kasteel|locatie|boerderij|trouwlocatie|zaal|landgoed|kerk' 
           OR NEW.description ~* 'kasteel|locatie|boerderij|trouwlocatie|zaal|landgoed|kerk' THEN
            NEW.category := 'venue';
        -- Photography keywords
        ELSIF NEW.name ~* 'fotograaf|foto|shoot|fotografie'
           OR NEW.description ~* 'fotograaf|foto|shoot|fotografie' THEN
            NEW.category := 'photography';
        -- Videography keywords
        ELSIF NEW.name ~* 'video|film|videograaf|cinematografie'
           OR NEW.description ~* 'video|film|videograaf|cinematografie' THEN
            NEW.category := 'videography';
        -- Flowers keywords
        ELSIF NEW.name ~* 'bloem|bloemist|boeket|bloemen'
           OR NEW.description ~* 'bloem|bloemist|boeket|bloemen' THEN
            NEW.category := 'flowers';
        -- Catering keywords
        ELSIF NEW.name ~* 'catering|eten|diner|lunch|chef|buffet'
           OR NEW.description ~* 'catering|eten|diner|lunch|chef|buffet' THEN
            NEW.category := 'catering';
        -- Music keywords
        ELSIF NEW.name ~* 'band|dj|muziek|music'
           OR NEW.description ~* 'band|dj|muziek|music' THEN
            NEW.category := 'music';
        -- Dress keywords
        ELSIF NEW.name ~* 'jurk|trouwjurk|kleding|bruidsmode'
           OR NEW.description ~* 'jurk|trouwjurk|kleding|bruidsmode' THEN
            NEW.category := 'dress';
        -- Makeup keywords
        ELSIF NEW.name ~* 'make.?up|visagie|haar|makeup'
           OR NEW.description ~* 'make.?up|visagie|haar|makeup' THEN
            NEW.category := 'makeup';
        -- Cake keywords
        ELSIF NEW.name ~* 'taart|bruidstaart|gebak|cake'
           OR NEW.description ~* 'taart|bruidstaart|gebak|cake' THEN
            NEW.category := 'cake';
        -- Invitations keywords
        ELSIF NEW.name ~* 'uitnodiging|stationery|papier|kaart'
           OR NEW.description ~* 'uitnodiging|stationery|papier|kaart' THEN
            NEW.category := 'invitations';
        -- Transport keywords
        ELSIF NEW.name ~* 'auto|vervoer|limousine|wagen'
           OR NEW.description ~* 'auto|vervoer|limousine|wagen' THEN
            NEW.category := 'transport';
        -- Decoration keywords
        ELSIF NEW.name ~* 'decoratie|styling|aankleding'
           OR NEW.description ~* 'decoratie|styling|aankleding' THEN
            NEW.category := 'decoration';
        ELSE
            NEW.category := 'venue'; -- Default fallback
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-categorize on insert/update
DROP TRIGGER IF EXISTS trg_auto_categorize_vendor ON public.vendors;
CREATE TRIGGER trg_auto_categorize_vendor
    BEFORE INSERT OR UPDATE ON public.vendors
    FOR EACH ROW
    EXECUTE FUNCTION auto_categorize_vendor();
