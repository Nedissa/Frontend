'use client';
import { useState, useEffect } from 'react';
import { ServiceSection } from './ServiceSection';
import { SectionHeader } from './SectionHeader';
import { FadeIn } from './FadeIn';
import { SeoResultModal } from './SeoResultModal';
import { type SeoResult, scoreColor } from '../seo-analys/shared';

const GRAY_TEXT = { color: 'rgb(104,105,99)' } as const;

const LOADING_STEPS: React.ReactNode[] = [
  <>Hämtar<br /><span style={GRAY_TEXT}>sidan</span></>,
  <>Analyserar<br /><span style={GRAY_TEXT}>prestanda</span></>,
  <>Kontrollerar<br /><span style={GRAY_TEXT}>SEO</span></>,
  <>Sammanställer<br /><span style={GRAY_TEXT}>resultat</span></>,
];

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

function FadeText({ text, fadeKey }: { text: React.ReactNode; fadeKey: string }) {
  return (
    <span
      key={fadeKey}
      style={{
        display: 'inline-block',
        animation: 'seoTestFadeUp 0.4s ease-out',
      }}
    >
      {text}
    </span>
  );
}

function GeoBadge({ geo }: { geo: NonNullable<SeoResult['geo']> }) {
  const passed = (geo.blockedCrawlers.length === 0 ? 1 : 0) + (geo.visibleWithoutJs ? 1 : 0) + (geo.hasStructuredData ? 1 : 0);
  const color = passed === 3 ? '#3fb950' : passed === 0 ? '#e5484d' : '#e8c547';
  const textColor = passed === 1 || passed === 2 ? '#030303' : '#fff';
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px]" style={{ background: color }}>
      <span className="text-[18px] font-bold" style={{ color: textColor }}>{passed}/3</span>
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase mb-[6px]" style={{ color: textColor, letterSpacing: '0.02em' }}>Redo för AI-sökning</div>
        <div className="flex gap-[3px] h-[4px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-full"
              style={{ background: i < passed ? textColor : `${textColor}40` }}
            />
          ))}
        </div>
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
  const [resultVisible, setResultVisible] = useState(false);

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
    setResultVisible(false);

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
          requestAnimationFrame(() => setResultVisible(true));
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

      <FadeIn
        className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[40px] py-[20px]${result ? ' min-h-[440px] lg:min-h-[260px]' : ''}`}
      >
        <div className="max-w-[480px]">
          <h2
            className="font-extrabold uppercase m-0 mb-[12px]"
            style={{
              fontSize: 'clamp(32px,4.2vw,54px)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#030303',
              minHeight: 'calc(clamp(32px,4.2vw,54px) * 2)',
            }}
          >
            <FadeText
              fadeKey={loading ? `loading-${stepIndex}` : result ? 'result' : 'idle'}
              text={
                loading ? (
                  LOADING_STEPS[stepIndex]
                ) : result ? (
                  <>Ta del av<br /><span style={{ color: 'rgb(104,105,99)' }}>ert resultat</span></>
                ) : (
                  <>Hur står det till med er <span style={{ color: 'rgb(104,105,99)' }}>SEO?</span></>
                )
              }
            />
          </h2>

          <div className="mb-[16px]" style={{ visibility: loading ? 'visible' : 'hidden' }}>
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
          </div>

          <p className="text-[15px] leading-[1.6] m-0 mb-[24px]" style={{ color: 'rgb(104,105,99)' }}>
            Baserat på Googles egna mätverktyg får ni en analys av prestanda, SEO, tillgänglighet och teknisk kvalitet.
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
              className="shrink-0 text-[13px] font-semibold px-[12px] py-[10px] rounded-[7px] whitespace-nowrap disabled:opacity-100 text-center"
              style={{ background: '#030303', color: '#fff', minWidth: '72px' }}
            >
              Kör
            </button>
          </form>

          {error && (
            <p className="text-[13px] m-0 mt-[12px]" style={{ color: '#e5484d' }}>
              {error}
            </p>
          )}
        </div>

        {result && (
          <div
            className="w-full lg:w-auto"
            style={{
              opacity: resultVisible ? 1 : 0,
              transform: resultVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            }}
          >
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
      </FadeIn>

      {modalOpen && result && (
        <SeoResultModal result={result} onClose={() => setModalOpen(false)} />
      )}
    </ServiceSection>
  );
}
