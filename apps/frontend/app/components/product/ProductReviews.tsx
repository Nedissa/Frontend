'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '../shared/Spinner';

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
  const effective = hovered || rating;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = effective >= star;
        const half = !full && !interactive && effective >= star - 0.5;
        const id = `half-${star}`;
        return (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => onRate && onRate(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="1">
              {half && (
                <defs>
                  <linearGradient id={id}>
                    <stop offset="50%" stopColor="#e8c547" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={full ? '#e8c547' : half ? `url(#${id})` : 'none'}
                stroke={full || half ? '#e8c547' : '#d1d5db'}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formAnim, setFormAnim] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rating: 0, comment: '' });
  const [canReview, setCanReview] = useState<'loading' | 'yes' | 'not_purchased' | 'not_logged_in'>('loading');

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(async meData => {
        if (!meData.customer) {
          setCanReview('not_logged_in');
          return;
        }
        const res = await fetch(`/api/reviews/check?product_id=${productId}`);
        const data = await res.json();
        setCanReview(data.has_purchased ? 'yes' : 'not_purchased');
      });
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

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Summary header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-gray-200">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Total värdering</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold">{reviews.length > 0 ? avgRating.toFixed(1) : '—'}</span>
              <div>
                <Stars rating={avgRating} />
                <p className="text-sm text-gray-500 mt-1">{reviews.length} recension{reviews.length !== 1 ? 'er' : ''}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Sammanfattning</p>
            {starCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 w-14">{star} stjärn{star === 1 ? 'a' : 'or'}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
        {(canReview === 'yes' || canReview === 'not_purchased') && !submitted && (
          <button
            onClick={() => {
              if (showForm) {
                setFormAnim(false);
                setTimeout(() => setShowForm(false), 250);
              } else {
                setShowForm(true);
                requestAnimationFrame(() => requestAnimationFrame(() => setFormAnim(true)));
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors w-fit" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Skriv recension
          </button>
        )}
        {submitted && (
          <p className="text-sm text-green-600 font-semibold">Tack för din recension!</p>
        )}
      </div>

      {/* Review form — inline */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 p-4 space-y-4" style={{ transition: 'opacity 250ms ease, transform 250ms ease', opacity: formAnim ? 1 : 0, transform: formAnim ? 'translateY(0)' : 'translateY(-8px)' }}>
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
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? 'Skickar...' : 'Skicka'}
            </button>
            <button
              type="button"
              onClick={() => { setFormAnim(false); setTimeout(() => setShowForm(false), 250); }}
              className="px-4 py-2 border border-gray-300 text-sm font-semibold hover:bg-gray-50"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading && <div className="flex justify-center py-4 text-gray-400"><Spinner size={20} /></div>}

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
