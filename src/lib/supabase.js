import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqlprwursgbgkfkwzkyb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHByd3Vyc2diZ2tma3d6a3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTcxMzUsImV4cCI6MjA4NjMzMzEzNX0.anon_placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const VENDOR_CATEGORIES = [
  { id: 'venue', label: 'Locaties', icon: '🏰' },
  { id: 'photography', label: 'Fotografen', icon: '📷' },
  { id: 'videography', label: 'Videografen', icon: '🎥' },
  { id: 'flowers', label: 'Bloemen', icon: '💐' },
  { id: 'catering', label: 'Catering', icon: '🍽️' },
  { id: 'music', label: 'Muziek', icon: '🎵' },
  { id: 'dress', label: 'Bruidsjurk', icon: '👗' },
  { id: 'makeup', label: 'Make-up', icon: '💄' },
  { id: 'cake', label: 'Taart', icon: '🎂' },
  { id: 'invitations', label: 'Uitnodigingen', icon: '💌' },
  { id: 'transport', label: 'Vervoer', icon: '🚗' },
  { id: 'decoration', label: 'Decoratie', icon: '🎀' },
];

// Map database vendor to frontend format
function mapVendor(v) {
  return {
    id: v.id,
    name: v.name,
    slug: v.slug,
    category: v.category || 'venue',
    description: v.description || '',
    location: v.location || v.city || v.address || 'Nederland',
    city: v.city,
    address: v.address,
    rating: v.rating || 0,
    review_count: v.review_count || 0,
    price: v.price || 'Prijs op aanvraag',
    price_numeric: v.price_numeric,
    premium: v.premium || false,
    verified: v.verified || false,
    images: v.images?.length ? v.images : (v.image_url ? [v.image_url] : []),
    image_url: v.image_url,
    facilities: v.facilities || [],
    styles: v.styles || [],
    faqs: v.faqs || [],
    capacity: v.capacity,
    phone: v.phone,
    email: v.email,
    website: v.website,
    published: v.published !== false,
  };
}

export async function getVendors({ category, search, location, minPrice, maxPrice, rating }) {
  let query = supabase
    .from('vendors')
    .select('*')
    .eq('published', true)
    .not('website', 'is', null);

  // Category filter using dedicated category column
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (location) {
    query = query.or(`city.ilike.%${location}%,address.ilike.%${location}%`);
  }

  if (minPrice) {
    query = query.gte('price_numeric', minPrice);
  }

  if (maxPrice) {
    query = query.lte('price_numeric', maxPrice);
  }

  if (rating) {
    query = query.gte('rating', rating);
  }

  const { data, error } = await query
    .order('premium', { ascending: false })
    .order('rating', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(mapVendor);
}

export async function getVendorBySlug(slug) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error) throw error;
  return data ? mapVendor(data) : null;
}

export async function getFeaturedVendors(limit = 6) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('published', true)
    .eq('premium', true)
    .order('rating', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []).map(mapVendor);
}

export async function getSimilarVendors(vendorId, category, limit = 3) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('id', vendorId)
    .limit(limit);
  
  if (error) throw error;
  return (data || []).map(mapVendor);
}

// Reviews API
export async function getReviews(vendorId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function addReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Contact API
export async function submitContactRequest(contactData) {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert(contactData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
