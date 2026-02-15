import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import VendorCard from '../components/VendorCard';
import { getVendors, getFeaturedVendors, VENDOR_CATEGORIES } from '../lib/supabase';

const MOCK_VENDORS = [
  { id: 1, name: 'Beachclub The Sunset', slug: 'beachclub-the-sunset', category: 'venue', location: 'Ameland, NL', rating: 4.8, review_count: 127, price: 'Vanaf €15.660', premium: true, verified: true, images: [], published: true },
  { id: 2, name: 'Anna Photography', slug: 'anna-photography', category: 'photography', location: 'Amsterdam, NL', rating: 4.9, review_count: 89, price: '€2.500', premium: true, verified: true, images: [], published: true },
  { id: 3, name: 'Floral Dreams', slug: 'floral-dreams', category: 'flowers', location: 'Utrecht, NL', rating: 4.7, review_count: 54, price: '€1.200', premium: false, verified: true, images: [], published: true },
  { id: 4, name: 'Grand Hotel Delft', slug: 'grand-hotel-delft', category: 'venue', location: 'Delft, NL', rating: 4.6, review_count: 203, price: 'Vanaf €25.000', premium: true, verified: true, images: [], published: true },
  { id: 5, name: 'DJ Marcel', slug: 'dj-marcel', category: 'music', location: 'Rotterdam, NL', rating: 4.5, review_count: 67, price: '€800', premium: false, verified: false, images: [], published: true },
  { id: 6, name: 'Sweet Surrender Cake', slug: 'sweet-surrender-cake', category: 'cake', location: 'Den Haag, NL', rating: 4.9, review_count: 112, price: '€450', premium: true, verified: true, images: [], published: true },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (category === 'all' && !search && !location) {
          setVendors(MOCK_VENDORS);
          setFeaturedVendors(MOCK_VENDORS.filter(v => v.premium));
        } else {
          const filters = {
            category: category === 'all' ? null : category,
            search: search || null,
            location: location || null,
            minPrice: minPrice ? parseInt(minPrice) : null,
            maxPrice: maxPrice ? parseInt(maxPrice) : null,
            rating: rating ? parseFloat(rating) : null,
          };
          const data = await getVendors(filters);
          setVendors(data.length > 0 ? data : MOCK_VENDORS.filter(v => {
            if (category !== 'all' && v.category !== category) return false;
            if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (location && !v.location.toLowerCase().includes(location.toLowerCase())) return false;
            return true;
          }));
        }
      } catch (err) {
        setVendors(MOCK_VENDORS.filter(v => {
          if (category !== 'all' && v.category !== category) return false;
          if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
          return true;
        }));
      }
      setLoading(false);
    }
    loadData();
  }, [category, search, location, minPrice, maxPrice, rating]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getFeaturedVendors(4);
        setFeaturedVendors(data.length > 0 ? data : MOCK_VENDORS.filter(v => v.premium).slice(0, 4));
      } catch {
        setFeaturedVendors(MOCK_VENDORS.filter(v => v.premium).slice(0, 4));
      }
    }
    loadFeatured();
  }, []);

  const updateFilter = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = search || location || minPrice || maxPrice || rating || (category !== 'all');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-rose-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Vind jouw perfecte wedding vendor
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Ontdek de beste leveranciers voor jouw droombruiloft. Van locaties tot bloemen, wij helpen je de perfecte match te vinden.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    placeholder="Zoek op naam..."
                    className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="Locatie (stad of regio)"
                    className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 px-6 flex items-center justify-center gap-2 rounded-xl border-2 touch-manipulation transition-colors ${
                    showFilters ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Categorie</label>
                      <select
                        value={category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="all">Alle categorieën</option>
                        {VENDOR_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. prijs</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        placeholder="€0"
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Max. prijs</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        placeholder="€50.000"
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. rating</label>
                      <select
                        value={rating}
                        onChange={(e) => updateFilter('rating', e.target.value)}
                        className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">Alle ratings</option>
                        <option value="4.5">4.5+ sterren</option>
                        <option value="4.0">4.0+ sterren</option>
                        <option value="3.5">3.5+ sterren</option>
                      </select>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 touch-manipulation"
                    >
                      <X className="w-4 h-4" />
                      Filters wissen
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {VENDOR_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', category === cat.id ? 'all' : cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                  category === cat.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {category === 'all' && !search && featuredVendors.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Uitgelichte vendors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category === 'all' ? 'Alle vendors' : VENDOR_CATEGORIES.find(c => c.id === category)?.label || 'Vendors'}
              {vendors.length > 0 && <span className="ml-2 text-lg font-normal text-gray-500">({vendors.length})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen vendors gevonden</h3>
              <p className="text-gray-600 mb-4">Probeer andere filters of zoekcriteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-rose-500 text-white font-medium rounded-full hover:bg-rose-600 transition-colors"
              >
                Filters wissen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
