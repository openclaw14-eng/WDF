import { Users, MapPin, Euro } from 'lucide-react';

function getPriceDisplay(price) {
  if (!price || price === 'N/A') return null;
  if (price.toString().startsWith('Vanaf')) {
    return { text: price, class: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  }
  const numPrice = parseInt(price.toString().replace(/[^0-9]/g, ''));
  if (numPrice <= 5000) return { text: '€', class: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  if (numPrice <= 10000) return { text: '€€', class: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  if (numPrice <= 20000) return { text: '€€€', class: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { text: '€€€€', class: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
}

export default function QuickInfoCard({ price, capacity, location }) {
  const priceDisplay = getPriceDisplay(price);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="grid grid-cols-3 gap-3">
        {priceDisplay && (
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl ${priceDisplay.bg} border ${priceDisplay.border}`}>
            <Euro className={`w-5 h-5 mb-1 ${priceDisplay.class}`} />
            <span className={`text-sm font-semibold ${priceDisplay.class}`}>{priceDisplay.text}</span>
          </div>
        )}
        
        {capacity && (
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 border border-purple-200">
            <Users className="w-5 h-5 mb-1 text-purple-700" />
            <span className="text-sm font-semibold text-purple-700">{capacity}</span>
          </div>
        )}
        
        {location && (
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 border border-rose-200">
            <MapPin className="w-5 h-5 mb-1 text-rose-700" />
            <span className="text-sm font-semibold text-rose-700 truncate max-w-full">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
