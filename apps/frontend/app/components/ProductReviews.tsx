'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <svg
            className="w-5 h-5"
            fill={(hovered || rating) >= star ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      setError('Välj ett betyg');
      return;
    }
    setSubmitting(true);
    setError('');

    const meRes = await fetch('/api/auth/me');
    const meData = await meRes.json();

    if (!meData.customer) {
      setError('Du måste vara inloggad för att recensera');
      setSubmitting(false);
      return;
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        customer_id: meData.customer.id,
        customer_name: `${meData.customer.first_name || ''} ${meData.customer.last_name || ''}`.trim() || 'Anonym',
        rating: form.rating,
        comment: form.comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Något gick fel');
    } else {
      setReviews(prev => [data.review, ...prev]);
      setSubmitted(true);
      setShowForm(false);
      setForm({ rating: 0, comment: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div>
            <Stars rating={Math.round(avgRating)} />
            <p className="text-sm text-gray-500 mt-1">{reviews.length} recension{reviews.length !== 1 ? 'er' : ''}</p>
          </div>
        </div>
      )}

      {/* Write review button */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-semibold underline text-black hover:text-gray-600"
        >
          Skriv en recension
        </button>
      )}

      {submitted && (
        <p className="text-sm text-green-600 font-semibold">Tack för din recension!</p>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Skriv en recension</h3>
          <div>
            <p className="text-sm text-gray-600 mb-1">Betyg *</p>
            <Stars rating={form.rating} interactive onRate={(r) => setForm(f => ({ ...f, rating: r }))} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Kommentar</p>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Berätta om din upplevelse..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? 'Skickar...' : 'Skicka recension'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading && <p className="text-sm text-gray-500">Laddar recensioner...</p>}

      {!loading && reviews.length === 0 && (
        <div>
          <p className="text-sm text-gray-600">Denna produkt har inga recensioner än</p>
          <p className="text-xs text-gray-500 mt-1">Var den första att recensera denna produkt</p>
        </div>
      )}

      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{review.customer_name}</span>
              {review.verified_purchase && (
                <span className="text-xs text-green-600 font-medium">✓ Verifierat köp</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString('sv-SE')}
            </span>
          </div>
          <Stars rating={review.rating} />
          {review.comment && (
            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
