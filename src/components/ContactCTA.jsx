import { useState } from 'react';
import { Send, Heart, Calendar, User, Mail, MessageSquare } from 'lucide-react';

export default function ContactCTA({ vendorName, vendorEmail }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    message: '',
  });

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Aanvraag verzonden! De vendor zal contact met je opnemen.');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 h-14 flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold rounded-xl touch-manipulation transition-colors hover:bg-rose-600 active:scale-[0.98]"
          >
            <Send className="w-5 h-5" />
            Stuur aanvraag
          </button>
          <button
            onClick={handleSave}
            className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 touch-manipulation transition-colors ${
              isSaved 
                ? 'bg-rose-100 border-rose-500 text-rose-500' 
                : 'border-gray-200 text-gray-400 hover:border-gray-300'
            }`}
            aria-label={isSaved ? 'Verwijder uit favorieten' : 'Opslaan'}
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Naam
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Jouw naam"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="jouw@email.nl"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Trouwdatum
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Bericht
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder={`Hoi ${vendorName}, ik wil graag meer informatie over...`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold rounded-xl touch-manipulation transition-colors hover:bg-rose-600 active:scale-[0.98]"
          >
            <Send className="w-5 h-5" />
            Verzenden
          </button>
        </form>
      )}
    </div>
  );
}
