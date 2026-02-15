import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Categorieën</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/?category=venue" className="hover:text-white transition-colors">Locaties</Link></li>
              <li><Link to="/?category=photography" className="hover:text-white transition-colors">Fotografen</Link></li>
              <li><Link to="/?category=catering" className="hover:text-white transition-colors">Catering</Link></li>
              <li><Link to="/?category=flowers" className="hover:text-white transition-colors">Bloemen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Over ons</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Leveranciers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Aanmelden</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Juridisch</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Voorwaarden</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Cookiebeleid</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="text-white font-bold">Weddingfinder</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 Weddingfinder. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
