import { useState } from 'react';
import { ChevronDown, Shield, AlertTriangle, FileText } from 'lucide-react';

const defaultFaqItems = [
  {
    question: 'Hoe weet ik dat deze vendor betrouwbaar is?',
    answer: 'Alle vendors op Weddingfinder worden handmatig gecontroleerd. Wij verifieren hun bedrijfsgegevens, vergunningen en klantbeoordelingen. Geverifieerde vendors hebben een blauw vinkje.',
    icon: Shield,
  },
  {
    question: 'Wat gebeurt er als de vendor failliet gaat?',
    answer: 'Weddingfinder biedt een beschermingsfonds voor betaalde boekingen. Bij een faillissement helpen wij met het vinden van een alternatieve vendor of krijg je je geld terug.',
    icon: AlertTriangle,
  },
  {
    question: 'Kan ik een contract via Weddingfinder afsluiten?',
    answer: 'Ja! Wij bieden standaard contract templates aan die beide partijen beschermen. Op ons platform kun je veilig betalen met officiële facturatie.',
    icon: FileText,
  },
];

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Veelgestelde vragen</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {[...faqs.map(f => ({ ...f, icon: Shield })), ...defaultFaqItems].slice(0, 5).map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left touch-manipulation hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <div className="flex items-center gap-3 pr-2">
                <item.icon className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <span className="font-medium text-gray-900 text-sm">{item.question}</span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 pl-12 pr-2">
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
