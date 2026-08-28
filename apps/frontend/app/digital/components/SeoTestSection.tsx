'use client';
import { useState, useEffect } from 'react';
import { ServiceSection } from './ServiceSection';
import { SectionHeader } from './SectionHeader';
import { SeoResultModal } from './SeoResultModal';
import { type SeoResult, scoreColor } from '../seo-analys/shared';

const LOADING_STEPS = ['Hämtar sidan…', 'Analyserar prestanda…', 'Kontrollerar SEO…', 'Sammanställer resultat…'];

function ScoreCircle({ label, score }: { label: string; score: number }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(t * score);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);
  const color = scoreColor(score);
  const angle = (progress / 100) * 360;
  return (
    <div className="flex flex-col items-center gap-[10px] w-[92px]">
      <div
        className="relative w-[76px] h-[76px] rounded-full flex items-center justify-center shrink-0"
        style={{ background: `conic-gradient(${color} ${angle}deg, rgb(230,230,230) ${Math.min(angle + 0.75, 360)}deg)` }}
      >
        <div className="absolute rounded-full flex items-center justify-center text-[22px] font-bold" style={{ inset: '10px', background: '#fff', color: '#030303' }}>
          {score}
        </div>
      </div>
      <span className="text-[11px] font-medium text-center uppercase" style={{ color: 'rgb(104,105,99)', letterSpacing: '0.02em' }}>
        {label}
      </span>
    </div>
  );
}

function GeoBadge({ geo }: { geo: NonNullable<SeoResult['geo']> }) {
  const passed = (geo.blockedCrawlers.length === 0 ? 1 : 0) + (geo.visibleWithoutJs ? 1 : 0) + (geo.hasStructuredData ? 1 : 0);
  const color = passed === 3 ? '#3fb950' : passed === 0 ? '#e5484d' : '#e8c547';
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px]" style={{ background: color }}>
      <span className="text-[18px] font-bold" style={{ color: '#fff' }}>{passed}/3</span>
      <div>
        <div className="text-[11px] font-semibold uppercase" style={{ color: '#fff', letterSpacing: '0.02em' }}>AI / Agent Ready</div>
        <div className="text-[11px]" style={{ color: '#fff' }}>{passed} av 3 tester godkända</div>
      </div>
    </div>
  );
}

export function SeoTestSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      setProgress(0);
      setFinishing(false);
      return;
    }
    const stepInterval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 7000);
    const start = Date.now();
    const progressInterval = setInterval(() => {
      setProgress((p) => (finishing ? p : Math.min(((Date.now() - start) / 30000) * 100, 98)));
    }, 100);
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [loading, finishing]);

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
        setLoading(false);
      } else {
        setResult(data);
        setFinishing(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setProgress(100));
        });
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch {
      setError('Något gick fel. Försök igen.');
      setLoading(false);
    }
  };

  return (
    <ServiceSection id="seo-test" fullHeight={false} background="#f5f5f3">
      <SectionHeader num="04" label="SEO-test" extra="© 2026" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[40px] py-[20px] min-h-[280px] lg:min-h-[180px]">
        <div className="max-w-[480px]">
          <h2
            className="font-extrabold uppercase m-0 mb-[12px]"
            style={{ fontSize: 'clamp(32px,4.2vw,54px)', letterSpacing: '-0.03em', lineHeight: 1, color: '#030303' }}
          >
            Hur står det till med er <span style={{ color: 'rgb(104,105,99)' }}>SEO?</span>
          </h2>
          <p className="text-[15px] leading-[1.6] m-0 mb-[24px]" style={{ color: 'rgb(104,105,99)' }}>
            Få en snabb analys av webbplatsens prestanda, SEO, tillgänglighet och tekniska kvalitet.
          </p>

          <form onSubmit={handleSubmit} className="flex items-center gap-[10px]">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="www.dinwebbplats.se"
              className="flex-1 min-w-0 text-[14px] px-[18px] py-[12px] rounded-[8px] outline-none"
              style={{ background: '#fff', border: '1px solid rgb(220,220,220)', color: '#030303' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="shrink-0 text-[14px] font-semibold px-[14px] py-[12px] rounded-[8px] whitespace-nowrap disabled:opacity-100 text-center"
              style={{ background: '#030303', color: '#fff' }}
            >
              {loading ? 'Analyserar' : 'Analysera'}
            </button>
          </form>

          {error && (
            <p className="text-[13px] m-0 mt-[12px]" style={{ color: '#e5484d' }}>
              {error}
            </p>
          )}

          {loading && (
            <div className="mt-[12px]">
              <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: 'rgb(230,230,230)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: '#030303',
                    width: `${progress}%`,
                    transition: progress === 100 ? 'width 0.4s ease-out' : 'width 0.1s linear',
                  }}
                />
              </div>
              <span className="text-[13px] mt-[8px] inline-block" style={{ color: 'rgb(104,105,99)' }}>
                {LOADING_STEPS[stepIndex]}
              </span>
            </div>
          )}
        </div>

        {result && (
          <div className="w-full lg:w-auto">
            <div className="text-[11px] font-semibold uppercase mb-[16px]" style={{ color: 'rgb(104,105,99)', letterSpacing: '0.04em' }}>
              {result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </div>
            <div className="flex flex-wrap items-center gap-[24px] mb-[16px]">
              <ScoreCircle label="Prestanda" score={result.scores.performance} />
              <ScoreCircle label="SEO" score={result.scores.seo} />
              <ScoreCircle label="Tillgänglighet" score={result.scores.accessibility} />
              <ScoreCircle label="Best practice" score={result.scores.bestPractices} />
            </div>
            {result.geo && <div className="mb-[16px]"><GeoBadge geo={result.geo} /></div>}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-[13px] font-semibold"
              style={{ color: '#030303', borderBottom: '1px solid rgb(104,105,99)', background: 'transparent' }}
            >
              Se detaljer och ladda ner rapport →
            </button>
          </div>
        )}
      </div>

      {modalOpen && result && (
        <SeoResultModal result={result} onClose={() => setModalOpen(false)} />
      )}
    </ServiceSection>
  );
}
