import { Shield, Star, Award } from 'lucide-react';

export default function VendorBadgeBar({ verified = false, premium = false, since, rating, reviewCount }) {
  const badges = [];

  if (verified) {
    badges.push({
      icon: Shield,
      label: 'Geverifieerd',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    });
  }

  if (premium) {
    badges.push({
      icon: Award,
      label: 'Premium',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    });
  }

  if (since) {
    badges.push({
      label: `Actief sinds ${since}`,
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
    });
  }

  if (rating) {
    badges.push({
      icon: Star,
      label: `${rating}/5`,
      sublabel: reviewCount ? `${reviewCount} reviews` : '',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      filled: true,
    });
  }

  return (
    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {badge.icon && (
              <badge.icon className={`w-4 h-4 ${badge.filled ? 'fill-current' : ''}`} />
            )}
            <span>{badge.label}</span>
            {badge.sublabel && (
              <span className="text-xs opacity-75">({badge.sublabel})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
