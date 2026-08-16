'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '../shared/Spinner';
import { Logo } from '../layout/Logo';

interface Question {
  id: string;
  customer_name: string;
  question: string;
  answer: string;
  created_at: string;
  answered_at: string;
  question_likes: number;
  question_dislikes: number;
  answer_likes: number;
  answer_dislikes: number;
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const units: [number, string, string][] = [
    [60 * 60 * 24 * 365, 'år', 'år'],
    [60 * 60 * 24 * 30, 'månad', 'månader'],
    [60 * 60 * 24 * 7, 'vecka', 'veckor'],
    [60 * 60 * 24, 'dag', 'dagar'],
    [60 * 60, 'timme', 'timmar'],
    [60, 'minut', 'minuter'],
  ];

  for (const [secondsInUnit, singular, plural] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) {
      return `${value} ${value === 1 ? singular : plural} sedan`;
    }
  }
  return 'just nu';
}

function VoteButtons({
  likes,
  dislikes,
  votedKey,
  onVote,
}: {
  likes: number;
  dislikes: number;
  votedKey: string;
  onVote: (vote: 'like' | 'dislike') => void;
}) {
  const [voted, setVoted] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    setVoted(localStorage.getItem(votedKey) as 'like' | 'dislike' | null);
  }, [votedKey]);

  const handleVote = (vote: 'like' | 'dislike') => {
    if (voted) return;
    localStorage.setItem(votedKey, vote);
    setVoted(vote);
    onVote(vote);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote('like')}
        disabled={!!voted}
        className={`flex items-center gap-1 text-xs ${voted ? 'cursor-default' : 'cursor-pointer hover:text-black'} ${voted === 'like' ? 'text-black font-semibold' : 'text-gray-500'}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
        {likes}
      </button>
      <button
        onClick={() => handleVote('dislike')}
        disabled={!!voted}
        className={`flex items-center gap-1 text-xs ${voted ? 'cursor-default' : 'cursor-pointer hover:text-black'} ${voted === 'dislike' ? 'text-black font-semibold' : 'text-gray-500'}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
        {dislikes}
      </button>
    </div>
  );
}

export function ProductQuestions({ productId }: { productId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formAnim, setFormAnim] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', question: '' });

  useEffect(() => {
    fetch(`/api/questions?product_id=${productId}`)
      .then(r => r.json())
      .then(data => setQuestions(data.questions || []))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleVote = async (questionId: string, target: 'question' | 'answer', vote: 'like' | 'dislike') => {
    const res = await fetch(`/api/questions/${questionId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, vote }),
    });
    if (res.ok) {
      const data = await res.json();
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, ...data.question } : q));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.question.trim()) {
      setError('Fyll i alla fält');
      return;
    }
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        customer_name: form.name,
        customer_email: form.email,
        question: form.question,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Något gick fel');
    } else {
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: '', email: '', question: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          Ställ frågor om produktens funktioner och kompatibilitet, så svarar vårt team.
        </p>
      </div>

      {loading && <div className="flex justify-center py-4 text-gray-400"><Spinner size={20} /></div>}

      {!loading && questions.length === 0 && (
        <div>
          <p className="text-sm text-gray-600">Inga frågor har besvarats för denna produkt än</p>
          <p className="text-xs text-gray-500 mt-1">Var den första att ställa en fråga</p>
        </div>
      )}

      {questions.map(q => (
        <div key={q.id} className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {q.customer_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 my-1" style={{ borderLeft: '2px dashed #d1d5db' }} />
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              <Logo size={24} />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{q.customer_name}</span>
                <span className="text-xs text-gray-400">{relativeTime(q.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700">{q.question}</p>
              <div className="mt-2">
                <VoteButtons
                  likes={q.question_likes}
                  dislikes={q.question_dislikes}
                  votedKey={`qa_vote_${q.id}_question`}
                  onVote={(vote) => handleVote(q.id, 'question', vote)}
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Techpilots</span>
                <span className="text-xs text-gray-400">{relativeTime(q.answered_at)}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.answer}</p>
              <div className="mt-2">
                <VoteButtons
                  likes={q.answer_likes}
                  dislikes={q.answer_dislikes}
                  votedKey={`qa_vote_${q.id}_answer`}
                  onVote={(vote) => handleVote(q.id, 'answer', vote)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2">
        {!submitted && !showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              requestAnimationFrame(() => requestAnimationFrame(() => setFormAnim(true)));
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors w-fit" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
          >
            Skicka in fråga
          </button>
        )}
        {submitted && (
          <p className="text-sm text-green-600 font-semibold">Tack! Din fråga skickas till oss och publiceras här när den besvarats.</p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 p-4 space-y-4" style={{ transition: 'opacity 250ms ease, transform 250ms ease', opacity: formAnim ? 1 : 0, transform: formAnim ? 'translateY(0)' : 'translateY(-8px)' }}>
          <div>
            <p className="text-sm text-gray-600 mb-1">Namn *</p>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">E-post *</p>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Din fråga *</p>
            <textarea
              value={form.question}
              onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              placeholder="Vad undrar du över?"
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
    </div>
  );
}
