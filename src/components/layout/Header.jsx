import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { VENDOR_CATEGORIES } from '../lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="text-xl font-bold text-gray-900">Weddingfinder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {VENDOR_CATEGORIES.slice(0, 6).map(cat => (
              <NavLink 
                key={cat.id}
                to={`/?category=${cat.id}`}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${isActive ? 'text-rose-500' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 touch-manipulation">
              <Heart className="w-5 h-5" />
            </button>
            <button 
              className="md:hidden p-2 text-gray-600 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 py-4 px-4 bg-white">
          <nav className="flex flex-col gap-2">
            {VENDOR_CATEGORIES.map(cat => (
              <NavLink 
                key={cat.id}
                to={`/?category=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-rose-50 text-rose-500' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
