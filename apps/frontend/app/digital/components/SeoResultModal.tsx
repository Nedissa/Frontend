'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { CalPopupButton } from './CalPopupButton';
import { GeoChecklist } from './GeoChecklist';
import { type SeoResult, scoreColor, recommendationFor } from '../seo-analys/shared';
import { generateSeoReport } from '../seo-analys/generateReport';

export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-[8px] mb-[10px]">
      <span className="w-[8px] h-[8px] shrink-0" style={{ background: '#030303' }} aria-hidden="true" />
      <div className="text-[15px] font-bold uppercase" style={{ color: '#030303', letterSpacing: '0.02em' }}>{title}</div>
    </div>
  );
}

export function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-[1.6] mb-[16px]" style={{ color: 'rgb(104,105,99)' }}>
      {children}
    </p>
  );
}

export function Section({ title, intro, children }: { title: string; intro: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="py-[28px]" style={{ borderBottom: '1px solid rgb(230,230,230)' }}>
      <SectionHeading title={title} />
      <SectionIntro>{intro}</SectionIntro>
      {children}
    </div>
  );
}

function ScoreCircle({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[22px] font-bold"
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

function GeoScoreCircle({ geo }: { geo: NonNullable<SeoResult['geo']> }) {
  const passed = (geo.blockedCrawlers.length === 0 ? 1 : 0) + (geo.visibleWithoutJs ? 1 : 0) + (geo.hasStructuredData ? 1 : 0);
  const color = passed === 3 ? '#3fb950' : passed === 0 ? '#e5484d' : '#e8c547';
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[20px] font-bold"
        style={{ border: `3px solid ${color}`, color }}
      >
        {passed}/3
      </div>
      <span className="text-[12px] font-medium text-center" style={{ color: 'rgb(104,105,99)' }}>
        Agentisk<br />webbläsning
      </span>
    </div>
  );
}

export function SeoResultModal({ result, onClose }: { result: SeoResult; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const scores: [string, number][] = [
    ['Prestanda', result.scores.performance],
    ['SEO', result.scores.seo],
    ['Tillgänglighet', result.scores.accessibility],
    ['Best practices', result.scores.bestPractices],
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-[20px]"
      style={{ background: 'rgba(3,3,3,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[12px] max-w-[720px] w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-[32px] py-[20px] bg-white" style={{ borderBottom: '1px solid rgb(230,230,230)' }}>
          <div>
            <div className="text-[18px] font-bold" style={{ color: '#030303' }}>SEO-resultat</div>
            <div className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{result.url}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#f5f5f3', color: '#030303' }}
          >
            ✕
          </button>
        </div>

        <div className="px-[32px]">
          <Section
            title="Helhetsbetyg"
            intro="Så här presterar er webbplats enligt Google. Poängen går från 0 till 100 — högre är bättre. Under 50 innebär att besökare och sökmotorer sannolikt påverkas negativt."
          >
            <div className="flex flex-wrap gap-[24px]">
              {scores.map(([label, score]) => (
                <ScoreCircle key={label} label={label} score={score} />
              ))}
              {result.geo && <GeoScoreCircle geo={result.geo} />}
            </div>
          </Section>

          <Section
            title="Laddningsupplevelse"
            intro="Långsamma sidor gör att besökare lämnar innan de hunnit se innehållet, och Google sänker rankningen för sidor som laddar långsamt."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Tid till huvudinnehållet syns</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.lcp ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Hur lång tid det tar innan det viktigaste innehållet syns. Under 2,5 s är bra.</div>
              </div>
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Visuell stabilitet</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.cls ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Hur mycket sidan hoppar till medan den laddar. 0 betyder helt stilla.</div>
              </div>
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Tid till första intryck</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.fcp ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Hur snabbt besökaren ser något alls på skärmen. Under 1,8 s är bra.</div>
              </div>
            </div>
          </Section>

          {result.geo && (
            <Section
              title="Synlighet för AI-assistenter"
              intro="Kan verktyg som ChatGPT och Claude läsa och citera er sida när de svarar på frågor."
            >
              <GeoChecklist geo={result.geo} />
            </Section>
          )}

          <Section
            title="Rekommendationer"
            intro="Konkreta förbättringsområden baserat på resultatet ovan, i prioritetsordning efter vad som påverkar mest."
          >
            <div className="flex flex-col gap-[14px]">
              {scores.map(([label, score]) => {
                const rec = recommendationFor(label, score);
                return (
                  <div key={label}>
                    <div className="text-[13px] font-semibold mb-[2px]" style={{ color: '#030303' }}>{rec.label}</div>
                    <div className="text-[13px] leading-[1.5]" style={{ color: 'rgb(104,105,99)' }}>{rec.text}</div>
                  </div>
                );
              })}
            </div>
          </Section>

          <div className="flex flex-wrap gap-[10px] py-[28px]">
            <button
              type="button"
              onClick={() => generateSeoReport(result)}
              className="text-[13px] font-semibold px-[18px] py-[10px] rounded-full whitespace-nowrap"
              style={{ border: '1px solid rgb(104,105,99)', color: '#030303', background: 'transparent' }}
            >
              Ladda ner rapport (PDF)
            </button>
            <CalPopupButton
              className="text-[13px] font-semibold px-[18px] py-[10px] rounded-full whitespace-nowrap"
              style={{ background: '#030303', color: '#fff' }}
            >
              Boka gratis genomgång
            </CalPopupButton>
            <Link
              href="#priser"
              onClick={onClose}
              className="text-[13px] font-semibold px-[18px] py-[10px] rounded-full whitespace-nowrap no-underline"
              style={{ border: '1px solid rgb(220,220,220)', color: '#030303' }}
            >
              Se SEO-paket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
