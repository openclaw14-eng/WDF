import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

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

export async function getVendors({ category, search, location, minPrice, maxPrice, rating }) {
  let query = supabase
    .from('vendors')
    .select('*')
    .eq('published', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (location) {
    query = query.ilike('location', `%${location}%`);
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

  const { data, error } = await query.order('premium', { ascending: false }).order('rating', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getVendorBySlug(slug) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error) throw error;
  return data;
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
  return data || [];
}

export async function getCategoriesWithCounts() {
  const { data, error } = await supabase
    .from('vendors')
    .select('category')
    .eq('published', true);
  
  if (error) throw error;
  
  const counts = {};
  data?.forEach(vendor => {
    counts[vendor.category] = (counts[vendor.category] || 0) + 1;
  });
  
  return VENDOR_CATEGORIES.map(cat => ({
    ...cat,
    count: counts[cat.id] || 0
  }));
}
