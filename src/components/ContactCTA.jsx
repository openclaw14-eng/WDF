import { useState } from 'react';
import { Send, Heart, Calendar, User, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { submitContactRequest } from '../lib/supabase';

export default function ContactCTA({ vendorId, vendorName, vendorEmail }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    wedding_date: '',
    guest_count: '',
    message: '',
  });

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    
    setSubmitting(true);
    try {
      await submitContactRequest({
        vendor_id: vendorId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        wedding_date: formData.wedding_date || null,
        guest_count: formData.guest_count ? parseInt(formData.guest_count) : null,
        message: formData.message
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', wedding_date: '', guest_count: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact request:', err);
      alert('Er is een fout opgetreden. Probeer het later opnieuw.');
    }
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-green-800 mb-1">Aanvraag verzonden!</h4>
        <p className="text-green-700 text-sm">
          {vendorName} ontvangt je aanvraag en neemt zo snel mogelijk contact met je op.
        </p>
      </div>
    );
  }

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
              Naam *
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
              Email *
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefoon (optioneel)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="06-12345678"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="wedding_date" className="block text-sm font-medium text-gray-700 mb-1.5">
                Trouwdatum
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="wedding_date"
                  name="wedding_date"
                  value={formData.wedding_date}
                  onChange={handleChange}
                  className="w-full h-12 pl-11 pr-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="guest_count" className="block text-sm font-medium text-gray-700 mb-1.5">
                Aantal gasten
              </label>
              <input
                type="number"
                id="guest_count"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleChange}
                min="1"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="80"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Bericht *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder={`Hoi ${vendorName}, ik wil graag meer informatie over...`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold rounded-xl touch-manipulation transition-colors hover:bg-rose-600 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Versturen...</>
            ) : (
              <><Send className="w-5 h-5" /> Verzenden</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
