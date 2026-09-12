'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { PagespeedResult, PagespeedResults } from './pagespeed-data';

function scoreColor(score: number): string {
  if (score >= 90) return '#3fb950';
  if (score >= 50) return '#c99a2e';
  return '#e5484d';
}

function ScoreRing({ label, score, displayValue, color: colorOverride }: { label: string; score: number; displayValue?: string; color?: string }) {
  const color = colorOverride ?? scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2 w-28 shrink-0">
      <motion.div
        className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
        animate={{ background: color, scale: [1.15, 1] }}
        transition={{ background: { duration: 0.4 }, scale: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={displayValue ?? score}
            className="text-sm font-bold text-white"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue ?? score}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8a86] text-center">{label}</span>
    </div>
  );
}

function ScoreRings({ result }: { result: PagespeedResult }) {
  const geoChecks = [
    (result.geoBlockedCrawlers?.length ?? 0) === 0,
    result.geoVisibleWithoutJs ?? false,
    result.geoHasStructuredData ?? false,
  ];
  const geoScore = geoChecks.filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-start justify-center">
      <ScoreRing label="Prestanda" score={result.performance} />
      <ScoreRing label="Tillgänglighet" score={result.accessibility} />
      <ScoreRing label="Bästa metoder" score={result.bestPractices} />
      <ScoreRing label="SEO" score={result.seo} />
      <ScoreRing
        label="Agentisk webbläsning"
        score={geoScore}
        displayValue={`${geoScore}/3`}
        color={scoreColor(geoScore === 3 ? 100 : geoScore === 2 ? 70 : 30)}
      />
    </div>
  );
}

export function PerformanceBadge({ results }: { results: PagespeedResults }) {
  const activeResult = results.desktop ?? results.mobile;

  if (!activeResult) return null;

  return (
    <div className="relative flex gap-5 justify-center">
      <div className="flex flex-col gap-8 items-center">
        <ScoreRings result={activeResult} />
      </div>
    </div>
  );
}
