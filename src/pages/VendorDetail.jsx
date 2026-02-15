import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Globe, ChevronRight, Star, Loader2 } from 'lucide-react';
import HeroImageGallery from '../components/HeroImageGallery';
import VendorBadgeBar from '../components/VendorBadgeBar';
import QuickInfoCard from '../components/QuickInfoCard';
import ContactCTA from '../components/ContactCTA';
import FAQAccordion from '../components/FAQAccordion';
import ReviewSection from '../components/ReviewSection';
import SimilarVendors from '../components/SimilarVendors';
import { getVendorBySlug, getReviews, getSimilarVendors } from '../lib/supabase';

export default function VendorDetail() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarVendors, setSimilarVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVendorData() {
      setLoading(true);
      setError(null);
      
      try {
        // Load vendor
        const vendorData = await getVendorBySlug(slug);
        if (!vendorData) {
          setError('Vendor niet gevonden');
          setVendor(null);
        } else {
          setVendor(vendorData);
          
          // Load reviews
          try {
            const reviewsData = await getReviews(vendorData.id);
            setReviews(reviewsData);
          } catch (err) {
            console.error('Error loading reviews:', err);
            setReviews([]);
          }
          
          // Load similar vendors
          try {
            const similarData = await getSimilarVendors(vendorData.id, vendorData.category, 3);
            setSimilarVendors(similarData);
          } catch (err) {
            console.error('Error loading similar vendors:', err);
            setSimilarVendors([]);
          }
        }
      } catch (err) {
        console.error('Error loading vendor:', err);
        setError('Er is een fout opgetreden bij het laden van deze vendor.');
      }
      
      setLoading(false);
    }
    
    if (slug) {
      loadVendorData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Laden...</span>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Vendor niet gevonden'}</h2>
          <Link to="/" className="text-rose-500 hover:text-rose-600 font-medium">
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <HeroImageGallery 
        images={vendor.images?.length ? vendor.images : (vendor.image_url ? [vendor.image_url] : [])}
        vendorName={vendor.name}
        category={vendor.category}
      />

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <Link 
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar overzicht
        </Link>

        <div className="bg-white rounded-t-2xl shadow-sm p-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
          
          <VendorBadgeBar 
            verified={vendor.verified}
            premium={vendor.premium}
            since={vendor.since}
            rating={vendor.rating}
            reviewCount={vendor.review_count}
          />

          <p className="mt-4 text-gray-600 leading-relaxed">
            {vendor.description || 'Geen beschrijving beschikbaar.'}
          </p>

          <QuickInfoCard 
            price={vendor.price}
            capacity={vendor.capacity}
            location={vendor.location}
          />

          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Contactgegevens</h3>
            <div className="space-y-2 text-sm">
              {(vendor.address || vendor.city) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.address || vendor.city}</span>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${vendor.phone}`} className="hover:text-rose-500">{vendor.phone}</a>
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${vendor.email}`} className="hover:text-rose-500">{vendor.email}</a>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${vendor.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-rose-500">
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {(vendor.facilities?.length > 0 || vendor.styles?.length > 0) && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Faciliteiten & Sfeer</h3>
              <div className="flex flex-wrap gap-2">
                {[...(vendor.facilities || []), ...(vendor.styles || [])].map((item, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <ContactCTA 
              vendorId={vendor.id}
              vendorName={vendor.name}
              vendorEmail={vendor.email}
            />
          </div>

          {vendor.faqs?.length > 0 && (
            <div className="mt-6">
              <FAQAccordion faqs={vendor.faqs} />
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewSection 
              vendorId={vendor.id}
              reviews={reviews}
              averageRating={vendor.rating}
              reviewCount={vendor.review_count}
              onReviewAdded={(newReview) => setReviews([newReview, ...reviews])}
            />
          </div>

          {/* Similar Vendors */}
          {similarVendors.length > 0 && (
            <div className="mt-8">
              <SimilarVendors vendors={similarVendors} />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link 
              to={`/?category=${vendor.category}`}
              className="flex items-center justify-center gap-1 text-rose-500 font-medium touch-manipulation hover:text-rose-600"
            >
              Bekijk meer {vendor.category}s
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
