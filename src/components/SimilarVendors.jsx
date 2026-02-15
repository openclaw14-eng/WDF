import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Crown } from 'lucide-react';

export default function SimilarVendors({ vendors }) {
  if (!vendors || vendors.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vergelijkbare vendors</h3>
      <div className="space-y-3">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            to={`/vendor/${vendor.slug}`}
            className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {vendor.image_url || vendor.images?.[0] ? (
                <img
                  src={vendor.image_url || vendor.images[0]}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  🏰
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-medium text-gray-900 truncate">{vendor.name}</h4>
                {vendor.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                {vendor.premium && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{vendor.location}</span>
              </div>
              {vendor.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({vendor.review_count})</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
