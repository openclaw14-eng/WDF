import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Globe, ChevronRight } from 'lucide-react';
import HeroImageGallery from '../components/HeroImageGallery';
import VendorBadgeBar from '../components/VendorBadgeBar';
import QuickInfoCard from '../components/QuickInfoCard';
import ContactCTA from '../components/ContactCTA';
import FAQAccordion from '../components/FAQAccordion';
import { getVendorBySlug } from '../lib/supabase';

const MOCK_VENDORS = {
  'beachclub-the-sunset': {
    id: 1,
    name: 'Beachclub The Sunset',
    slug: 'beachclub-the-sunset',
    description: 'Laid-back beachclub op Ameland met uitzicht op de Noordzee. Perfect voor strandbruiloften. Geniet van een romantische ceremonie op het strand gevolgd door een gezellige receptie en feest in onze sfeervolle beachclub. Ons team staat klaar om jouw dag perfect te maken.',
    images: [],
    category: 'venue',
    verified: true,
    premium: true,
    since: 2019,
    rating: 4.8,
    review_count: 127,
    price: 'Vanaf €15.660',
    capacity: '50-150 gasten',
    location: 'Ameland, NL',
    address: 'Hollum, Ameland',
    phone: '0612345678',
    email: 'info@beachclubthesunset.nl',
    website: 'www.beachclubthesunset.nl',
    facilities: ['Rolstoeltoegang', 'Wi-Fi', 'Valetparking', 'Speeltuin', 'Zeezicht', 'Romantisch'],
    styles: ['Zomers', 'Ontspannen'],
    faqs: [
      { question: 'Wat is de capaciteit?', answer: 'Wij kunnen tot 150 gasten ontvangen voor een bruiloft.' },
      { question: 'Is er accommodatie?', answer: 'Wij hebben 12 kamers beschikbaar voor jouw gasten.' },
    ]
  },
  'anna-photography': {
    id: 2,
    name: 'Anna Photography',
    slug: 'anna-photography',
    description: 'Ervaren bruidsfotograaf gespecialiseerd in romantische en natuurlijke trouwfoto\'s. Ik volg jullie dag op een onopvallende manier vast, zodat jullie kunnen genieten van elk moment.',
    images: [],
    category: 'photography',
    verified: true,
    premium: true,
    since: 2017,
    rating: 4.9,
    review_count: 89,
    price: '€2.500',
    capacity: 'Onbeperkt',
    location: 'Amsterdam, NL',
    address: 'Herengracht 100, Amsterdam',
    phone: '0623456789',
    email: 'anna@annaphotography.nl',
    website: 'www.annaphotography.nl',
    facilities: ['Tweede fotograaf', 'Photo booth', 'Drone shots', 'Album inbegrepen'],
    styles: ['Natuurlijk', 'Romantisch', 'Documentair'],
    faqs: [
      { question: 'Wat is inclusief?', answer: 'Alle foto\'s digitaal + 300 bewerkte foto\'s + 30x20cm album.' },
    ]
  },
  'grand-hotel-delft': {
    id: 3,
    name: 'Grand Hotel Delft',
    slug: 'grand-hotel-delft',
    description: 'Luxueus historisch hotel in het hart van Delft. Perfecte combinatie van klassieke elegantie en moderne faciliteiten voor uw droombruiloft.',
    images: [],
    category: 'venue',
    verified: true,
    premium: true,
    since: 2015,
    rating: 4.6,
    review_count: 203,
    price: 'Vanaf €25.000',
    capacity: '20-300 gasten',
    location: 'Delft, NL',
    address: 'Markt 1, Delft',
    phone: '0634567890',
    email: 'events@grandhoteldelft.nl',
    website: 'www.grandhoteldelft.nl',
    facilities: ['Luxueuze suites', 'Catering inbegrepen', 'Parkeerplaats', 'Wi-Fi', 'Airco'],
    styles: ['Klassiek', 'Chic', 'Elegant'],
    faqs: []
  },
  'floral-dreams': {
    id: 4,
    name: 'Floral Dreams',
    slug: 'floral-dreams',
    description: 'Creatief bloemisterij gespecialiseerd in bruidsboeketten en bruiloftdecoraties. Wij maken jouw bloemen droomwerkelijkheid.',
    images: [],
    category: 'flowers',
    verified: true,
    premium: false,
    since: 2020,
    rating: 4.7,
    review_count: 54,
    price: '€1.200',
    location: 'Utrecht, NL',
    address: 'Lange Nieuwstraat 50, Utrecht',
    phone: '0645678901',
    email: 'info@floraldreams.nl',
    website: 'www.floraldreams.nl',
    facilities: ['Bruidsboeket', 'Taartdecoratie', 'Ceremonie decoratie', 'Bloemenboog'],
    styles: ['Romantisch', 'Seizoensgebonden', 'Gedurfd'],
    faqs: []
  },
  'dj-marcel': {
    id: 5,
    name: 'DJ Marcel',
    slug: 'dj-marcel',
    description: 'Professionele bruiloft DJ met 10 jaar ervaring. Ik zorg voor een onvergetelijke sfeer en weet exactly hoe ik uw gasten op de dansvloer krijg.',
    images: [],
    category: 'music',
    verified: false,
    premium: false,
    since: 2014,
    rating: 4.5,
    review_count: 67,
    price: '€800',
    location: 'Rotterdam, NL',
    address: 'Witte de Withstraat 100, Rotterdam',
    phone: '0656789012',
    email: 'marcel@djmarcel.nl',
    website: 'www.djmarcel.nl',
    facilities: ['Geluid & licht', 'Microfoon', 'Playlist consult', 'Mood lighting'],
    styles: ['Pop', 'Soul', 'Disco', 'Nederlands'],
    faqs: []
  },
  'sweet-surrender-cake': {
    id: 6,
    name: 'Sweet Surrender Cake',
    slug: 'sweet-surrender-cake',
    description: 'Gespecialiseerd in ambachtelijke bruidstaarten. Elke taart wordt met de hand gemaakt en is een uniek kunstwerk.',
    images: [],
    category: 'cake',
    verified: true,
    premium: true,
    since: 2018,
    rating: 4.9,
    review_count: 112,
    price: '€450',
    location: 'Den Haag, NL',
    address: 'Prinsegracht 20, Den Haag',
    phone: '0667890123',
    email: 'hello@sweetsurrender.nl',
    website: 'www.sweetsurrender.nl',
    facilities: ['Proefproces', 'Levering', 'Opzetten', 'Dieetopties'],
    styles: ['Minimalistisch', 'Romantisch', 'Gedurfd'],
    faqs: []
  },
};

export default function VendorDetail() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getVendorBySlug(slug);
      if (data) {
        setVendor(data);
      } else if (MOCK_VENDORS[slug]) {
        setVendor(MOCK_VENDORS[slug]);
      } else {
        setError('Vendor niet gevonden');
      }
    } catch (err) {
      if (MOCK_VENDORS[slug]) {
        setVendor(MOCK_VENDORS[slug]);
      } else {
        setError('Vendor niet gevonden');
      }
    }
    
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 md:h-96 bg-gray-200" />
          <div className="max-w-3xl mx-auto px-4 -mt-6">
            <div className="bg-white rounded-t-2xl p-5 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
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
        images={vendor.images} 
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

          <p className="mt-4 text-gray-600 leading-relaxed">{vendor.description}</p>

          <QuickInfoCard 
            price={vendor.price}
            capacity={vendor.capacity}
            location={vendor.location}
          />

          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Contactgegevens</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{vendor.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{vendor.website}</span>
              </div>
            </div>
          </div>

          {(vendor.facilities?.length > 0 || vendor.styles?.length > 0) && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Faciliteiten & Sfeer</h3>
              <div className="flex flex-wrap gap-2">
                {[...vendor.facilities, ...vendor.styles].map((item, index) => (
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
              vendorName={vendor.name}
              vendorEmail={vendor.email}
            />
          </div>

          <div className="mt-6">
            <FAQAccordion faqs={vendor.faqs} />
          </div>

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
