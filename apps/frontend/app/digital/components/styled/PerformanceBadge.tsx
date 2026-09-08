const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';

export type PagespeedResult = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  geoBlockedCrawlers?: string[];
  geoVisibleWithoutJs?: boolean;
  geoHasStructuredData?: boolean;
  measuredAt: string;
};

export async function getPagespeedResult(slug: string): Promise<PagespeedResult | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pagespeed-results?where[projectSlug][equals]=${encodeURIComponent(slug)}&where[strategy][equals]=mobile&limit=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

function scoreColor(score: number): string {
  if (score >= 90) return '#3fb950';
  if (score >= 50) return '#c99a2e';
  return '#e5484d';
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
          <circle cx="28" cy="28" r={radius} fill="none" stroke="#e5e5e1" strokeWidth="4" />
          <circle
            cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8a86] text-center">{label}</span>
    </div>
  );
}

export function PerformanceBadge({ result }: { result: PagespeedResult }) {

  const geoChecks = [
    (result.geoBlockedCrawlers?.length ?? 0) === 0,
    result.geoVisibleWithoutJs ?? false,
    result.geoHasStructuredData ?? false,
  ];
  const geoScore = geoChecks.filter(Boolean).length;

  return (
    <div className="relative flex gap-5 justify-center">
      <div className="flex flex-col gap-4 items-center">
        <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">Prestanda (Google PageSpeed)</span>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <ScoreRing label="Prestanda" score={result.performance} />
          <ScoreRing label="Tillgänglighet" score={result.accessibility} />
          <ScoreRing label="Best practice" score={result.bestPractices} />
          <ScoreRing label="SEO" score={result.seo} />
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: scoreColor(geoScore === 3 ? 100 : geoScore === 2 ? 70 : 30) }}>
                {geoScore}/3
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8a86] text-center">Agentisk webbläsning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
