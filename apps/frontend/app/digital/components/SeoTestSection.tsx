'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceSection } from './ServiceSection';
import { SectionHeader } from './SectionHeader';

const LOADING_STEPS = ['Hämtar sidan…', 'Analyserar prestanda…', 'Kontrollerar SEO…', 'Sammanställer resultat…'];

type Result = {
  url: string;
  scores: { performance: number; seo: number; accessibility: number; bestPractices: number };
};

function scoreColor(score: number) {
  if (score >= 90) return '#3fb950';
  if (score >= 50) return '#e8c547';
  return '#e5484d';
}

function ScoreCircle({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-[20px] font-bold"
        style={{ border: `3px solid ${scoreColor(score)}`, color: scoreColor(score) }}
      >
        {score}
      </div>
      <span className="text-[12px] font-medium text-center" style={{ color: 'rgb(104,105,99)' }}>
        {label}
      </span>
    </div>
  );
}

export function SeoTestSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/seo-analys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Något gick fel. Försök igen.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceSection id="seo-test" fullHeight={false} background="#f5f5f3">
      <SectionHeader num="04" label="SEO-test" extra="© 2026" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[40px] py-[20px]">
        <div className="max-w-[480px]">
          <h2
            className="font-extrabold uppercase m-0 mb-[12px]"
            style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-0.03em', lineHeight: 1, color: '#030303' }}
          >
            Hur står det till med er <span style={{ color: 'rgb(104,105,99)' }}>SEO?</span>
          </h2>
          <p className="text-[15px] leading-[1.6] m-0 mb-[24px]" style={{ color: 'rgb(104,105,99)' }}>
            Kostnadsfri analys direkt från Google. Skriv in er webbadress och se resultatet direkt.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[10px]">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="www.dinwebbplats.se"
              className="flex-1 text-[14px] px-[18px] py-[12px] rounded-[8px] outline-none"
              style={{ background: '#fff', border: '1px solid rgb(220,220,220)', color: '#030303' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="text-[14px] font-semibold px-[22px] py-[12px] rounded-[8px] whitespace-nowrap disabled:opacity-50"
              style={{ background: '#030303', color: '#fff' }}
            >
              {loading ? 'Analyserar…' : 'Testa nu'}
            </button>
          </form>

          {error && (
            <p className="text-[13px] m-0 mt-[12px]" style={{ color: '#e5484d' }}>
              {error}
            </p>
          )}

          {loading && (
            <div className="flex items-center gap-[8px] mt-[12px]">
              <span
                className="w-[12px] h-[12px] rounded-full shrink-0 animate-spin"
                style={{ border: '2px solid rgb(220,220,220)', borderTopColor: '#030303' }}
                aria-hidden="true"
              />
              <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>
                {LOADING_STEPS[stepIndex]} <span style={{ color: 'rgb(180,180,175)' }}>~30 sek</span>
              </span>
            </div>
          )}
        </div>

        {result && (
          <div className="flex flex-col items-start gap-[16px]">
            <div className="flex flex-wrap gap-[20px]">
              <ScoreCircle label="Prestanda" score={result.scores.performance} />
              <ScoreCircle label="SEO" score={result.scores.seo} />
              <ScoreCircle label="Tillgänglighet" score={result.scores.accessibility} />
              <ScoreCircle label="Best practices" score={result.scores.bestPractices} />
            </div>
            <Link
              href="#priser"
              className="text-[13px] font-semibold no-underline"
              style={{ color: '#030303', borderBottom: '1px solid rgb(104,105,99)' }}
            >
              Se hur vi kan hjälpa er →
            </Link>
          </div>
        )}
      </div>
    </ServiceSection>
  );
}
