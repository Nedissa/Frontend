'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceSection } from '../components/ServiceSection';
import { SectionHeader } from '../components/SectionHeader';
import { CalPopupButton } from '../components/CalPopupButton';

const LOADING_STEPS = [
  'Hämtar sidan…',
  'Analyserar prestanda…',
  'Kontrollerar SEO…',
  'Testar tillgänglighet…',
  'Sammanställer resultat…',
];

type Result = {
  url: string;
  scores: { performance: number; seo: number; accessibility: number; bestPractices: number };
  metrics: { lcp: string | null; cls: string | null; fcp: string | null };
};

function scoreColor(score: number) {
  if (score >= 90) return '#3fb950';
  if (score >= 50) return '#e8c547';
  return '#e5484d';
}

function ScoreCircle({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-[12px]">
      <div
        className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[28px] font-bold"
        style={{ border: `4px solid ${scoreColor(score)}`, color: scoreColor(score) }}
      >
        {score}
      </div>
      <span className="text-[13px] font-medium text-center" style={{ color: 'rgb(104,105,99)' }}>
        {label}
      </span>
    </div>
  );
}

export default function SeoAnalysPage() {
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
    <main
      className="bg-white text-[#030303] min-h-screen"
      style={{ fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <ServiceSection id="seo-analys">
        <SectionHeader num="11" label="SEO-analys" extra="© 2026" hasVisibleHeading />

        <div className="max-w-[640px]">
          <h1
            className="font-extrabold uppercase m-0 mb-[16px]"
            style={{ fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303' }}
          >
            Testa er <span style={{ color: 'rgb(104,105,99)' }}>SEO-hälsa</span>
          </h1>
          <p className="text-[16px] leading-[1.6] m-0 mb-[40px]" style={{ color: 'rgb(104,105,99)' }}>
            Kostnadsfri analys direkt från Google. Ange er webbadress och få en snabb bild av prestanda, SEO, tillgänglighet och best practices.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[12px] mb-[16px]">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="www.dinwebbplats.se"
              className="flex-1 text-[15px] px-[20px] py-[14px] rounded-[8px] outline-none"
              style={{ background: '#f5f5f3', border: '1px solid rgb(220,220,220)', color: '#030303' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="text-[15px] font-semibold px-[28px] py-[14px] rounded-[8px] whitespace-nowrap disabled:opacity-50"
              style={{ background: '#030303', color: '#fff' }}
            >
              {loading ? 'Analyserar…' : 'Analysera nu'}
            </button>
          </form>

          {error && (
            <p className="text-[14px] m-0 mb-[24px]" style={{ color: '#e5484d' }}>
              {error}
            </p>
          )}

          {loading && (
            <div className="flex items-center gap-[10px] mb-[24px]">
              <span
                className="w-[14px] h-[14px] rounded-full shrink-0 animate-spin"
                style={{ border: '2px solid rgb(220,220,220)', borderTopColor: '#030303' }}
                aria-hidden="true"
              />
              <span className="text-[14px]" style={{ color: 'rgb(104,105,99)' }}>
                {LOADING_STEPS[stepIndex]} <span style={{ color: 'rgb(180,180,175)' }}>Tar cirka 30 sekunder.</span>
              </span>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-[48px] max-w-[900px]">
            <p className="text-[14px] m-0 mb-[24px]" style={{ color: 'rgb(104,105,99)' }}>
              Resultat för <span style={{ color: '#030303', fontWeight: 600 }}>{result.url}</span>
            </p>

            <div className="flex flex-wrap gap-[32px] mb-[40px]">
              <ScoreCircle label="Prestanda" score={result.scores.performance} />
              <ScoreCircle label="SEO" score={result.scores.seo} />
              <ScoreCircle label="Tillgänglighet" score={result.scores.accessibility} />
              <ScoreCircle label="Best practices" score={result.scores.bestPractices} />
            </div>

            <div className="grid grid-cols-3 gap-[16px] mb-[40px]">
              <div className="rounded-[8px] p-[20px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] mb-[6px]" style={{ color: 'rgb(104,105,99)' }}>Largest Contentful Paint</div>
                <div className="text-[18px] font-bold">{result.metrics.lcp ?? '—'}</div>
              </div>
              <div className="rounded-[8px] p-[20px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] mb-[6px]" style={{ color: 'rgb(104,105,99)' }}>Cumulative Layout Shift</div>
                <div className="text-[18px] font-bold">{result.metrics.cls ?? '—'}</div>
              </div>
              <div className="rounded-[8px] p-[20px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] mb-[6px]" style={{ color: 'rgb(104,105,99)' }}>First Contentful Paint</div>
                <div className="text-[18px] font-bold">{result.metrics.fcp ?? '—'}</div>
              </div>
            </div>

            <div className="rounded-[8px] p-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[20px]" style={{ background: '#030303' }}>
              <div>
                <div className="text-[18px] font-semibold text-white mb-[6px]">Vill ni förbättra dessa siffror?</div>
                <div className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Vi hjälper er höja SEO-poängen med en skräddarsydd plan.
                </div>
              </div>
              <div className="flex gap-[12px] shrink-0">
                <CalPopupButton
                  className="text-[14px] font-semibold px-[22px] py-[12px] rounded-full whitespace-nowrap"
                  style={{ background: '#e8c547', color: '#030303' }}
                >
                  Boka gratis genomgång
                </CalPopupButton>
                <Link
                  href="/digital#priser"
                  className="text-[14px] font-semibold px-[22px] py-[12px] rounded-full whitespace-nowrap no-underline"
                  style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  Se SEO-paket
                </Link>
              </div>
            </div>
          </div>
        )}
      </ServiceSection>
    </main>
  );
}
