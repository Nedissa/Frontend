'use client';
import { useEffect, useState } from 'react';
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
  const [ctaHovered, setCtaHovered] = useState(false);
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
    ['Best practice', result.scores.bestPractices],
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
            intro="0–100 poäng per område, enligt Google. Ju grönare, desto fler kunder hittar och stannar kvar på er sida."
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
            intro="Långsam laddning gör att besökare lämnar innan de ens ser er startsida."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Hur snabbt sidan syns</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.lcp ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Bra: under 2,5 s</div>
              </div>
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Sidan hoppar inte till</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.cls ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Bra: nära 0</div>
              </div>
              <div className="rounded-[8px] p-[16px]" style={{ background: '#f5f5f3' }}>
                <div className="text-[12px] font-semibold mb-[2px]" style={{ color: '#030303' }}>Första intryck</div>
                <div className="text-[16px] font-bold mb-[4px]">{result.metrics.fcp ?? '—'}</div>
                <div className="text-[11px] leading-[1.4]" style={{ color: 'rgb(104,105,99)' }}>Bra: under 1,8 s</div>
              </div>
            </div>
            {result.metrics.lcp && parseFloat(result.metrics.lcp) > 2.5 && (
              <div className="mt-[14px] rounded-[8px] px-[16px] py-[12px] text-[13px] font-medium" style={{ background: '#fdf6e3', color: '#030303' }}>
                Vi kan hjälpa dig sänka laddtiden och vinna tillbaka besökare som annars lämnar.
              </div>
            )}
          </Section>

          {result.geo && (
            <Section
              title="Synlighet för AI-assistenter"
              intro="Kan ChatGPT och Claude läsa och citera er sida?"
            >
              <GeoChecklist geo={result.geo} />
              {(result.geo.blockedCrawlers.length > 0 || !result.geo.visibleWithoutJs || !result.geo.hasStructuredData) && (
                <div className="mt-[14px] rounded-[8px] px-[16px] py-[12px] text-[13px] font-medium" style={{ background: '#fdf6e3', color: '#030303' }}>
                  Vi kan hjälpa dig säkra din synlighet för AI-assistenter.
                </div>
              )}
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
            <div className="text-[13px] mt-[16px]" style={{ color: 'rgb(104,105,99)' }}>
              Vill ni åtgärda detta?{' '}
              <Link href="#priser" onClick={onClose} className="font-semibold" style={{ color: '#030303' }}>
                Se våra SEO-paket →
              </Link>
            </div>
          </Section>

          <div className="flex items-center gap-[16px] py-[28px]">
            <CalPopupButton
              className="inline-flex items-center gap-[8px] w-fit px-[20px] py-[12px] sm:px-[28px] sm:py-[16px] text-[14px] sm:text-[15px] font-semibold rounded-full no-underline whitespace-nowrap"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                background: ctaHovered ? '#030303' : '#e8c547',
                color: ctaHovered ? '#e8c547' : '#0c0d12',
                border: ctaHovered ? '2px solid #e8c547' : '2px solid #030303',
                transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
              }}
            >
              Boka gratis genomgång
              <span>↗</span>
            </CalPopupButton>
            <button
              type="button"
              onClick={() => generateSeoReport(result)}
              className="flex items-center gap-[6px] text-[12px] whitespace-nowrap"
              style={{ color: 'rgb(150,150,145)', background: 'transparent' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v7M3 5.5 6 8.5 9 5.5M2 10.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ladda ner PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
