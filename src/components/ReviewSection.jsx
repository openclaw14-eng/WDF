import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { addReview } from '../lib/supabase';

export default function ReviewSection({ vendorId, reviews, averageRating, reviewCount, onReviewAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 5,
    review_text: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.review_text.trim() || !formData.user_name.trim()) return;
    
    setSubmitting(true);
    try {
      const newReview = await addReview({
        vendor_id: vendorId,
        user_name: formData.user_name,
        user_email: formData.user_email || null,
        rating: formData.rating,
        review_text: formData.review_text
      });
      onReviewAdded(newReview);
      setSubmitted(true);
      setShowForm(false);
      setFormData({ user_name: '', user_email: '', rating: 5, review_text: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Er is een fout opgetreden. Probeer het later opnieuw.');
    }
    setSubmitting(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(Math.round(averageRating || 0))}</div>
              <span className="text-sm text-gray-600">
                {averageRating?.toFixed(1) || '0.0'} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors"
          >
            Schrijf een review
          </button>
        )}
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <p>Bedankt voor je review! Deze wordt zo snel mogelijk geplaatst.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Je naam</label>
              <input
                type="text"
                required
                value={formData.user_name}
                onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Bijv. Anna & Peter"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail (optioneel)</label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="jouw@email.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beoordeling</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Je ervaring</label>
              <textarea
                required
                rows={4}
                value={formData.review_text}
                onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                placeholder="Deel je ervaring met deze vendor..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Versturen...' : <><Send className="w-4 h-4" /> Plaats review</>}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">Nog geen reviews. Wees de eerste!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{review.user_name}</span>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 text-sm">{review.review_text}</p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(review.created_at).toLocaleDateString('nl-NL', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
