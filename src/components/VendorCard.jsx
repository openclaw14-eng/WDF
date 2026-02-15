import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, Award } from 'lucide-react';

function getFallbackImage(category, index = 0) {
  const seeds = {
    venue: ['wedding1', 'venue1', 'castles'],
    photography: ['wedding2', 'photo1', 'couple'],
    flowers: ['wedding3', 'flowers1', 'bouquet'],
    catering: ['wedding4', 'food1', 'catering'],
    music: ['wedding5', 'music1', 'band'],
    dress: ['wedding6', 'dress1', 'weddingdress'],
    makeup: ['wedding7', 'makeup1', 'bride'],
    default: ['wedding8', 'vendor1', 'event']
  };
  const categorySeeds = seeds[category] || seeds.default;
  return `https://picsum.photos/seed/${categorySeeds[index % 3]}/600/400`;
}

function getPriceDisplay(price) {
  if (!price) return null;
  const priceStr = price.toString();
  if (priceStr.startsWith('Vanaf')) return priceStr;
  const numPrice = parseInt(priceStr.replace(/[^0-9]/g, ''));
  if (numPrice <= 5000) return '€';
  if (numPrice <= 10000) return '€€';
  if (numPrice <= 20000) return '€€€';
  return '€€€€';
}

export default function VendorCard({ vendor }) {
  const imageUrl = vendor.images?.[0] || getFallbackImage(vendor.category);
  const priceDisplay = getPriceDisplay(vendor.price);

  return (
    <Link 
      to={`/vendor/${vendor.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {vendor.premium && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
            <Award className="w-3 h-3" />
            Premium
          </div>
        )}
        {vendor.verified && (
          <div className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full">
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-rose-500 transition-colors">
            {vendor.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{vendor.location}</span>
        </div>

        <div className="flex items-center justify-between">
          {vendor.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
              {vendor.review_count && (
                <span className="text-sm text-gray-500">({vendor.review_count})</span>
              )}
            </div>
          )}
          {priceDisplay && (
            <span className={`text-sm font-semibold ${
              priceDisplay === '€' ? 'text-green-600' :
              priceDisplay === '€€' ? 'text-yellow-600' :
              priceDisplay === '€€€' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {priceDisplay}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
