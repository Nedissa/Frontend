export type SeoResult = {
  url: string;
  scores: { performance: number; seo: number; accessibility: number; bestPractices: number };
  metrics: { lcp: string | null; cls: string | null; fcp: string | null };
  geo?: { blockedCrawlers: string[]; visibleWithoutJs: boolean; hasStructuredData: boolean };
};

export type Recommendation = { label: string; text: string };

export function scoreColor(score: number) {
  if (score >= 90) return '#3fb950';
  if (score >= 50) return '#e8c547';
  return '#e5484d';
}

export function recommendationFor(category: string, score: number): Recommendation {
  const good: Record<string, string> = {
    Prestanda: 'Sidan laddar snabbt. Fortsätt hålla koll på bildstorlekar och tredjepartsskript vid framtida uppdateringar.',
    SEO: 'Grundläggande SEO-struktur är på plats. Fortsatt arbete med innehåll och länkbygge stärker positionen ytterligare.',
    Tillgänglighet: 'Sidan är väl anpassad för skärmläsare och andra hjälpmedel.',
    'Best practices': 'Sidan följer moderna webbstandarder för säkerhet och kodkvalitet.',
  };
  const okay: Record<string, string> = {
    Prestanda: 'Det finns utrymme att förbättra laddtiden, t.ex. genom bildoptimering och minskad JavaScript-belastning.',
    SEO: 'Grunderna finns, men strukturerad data, metataggar eller innehållsdjup kan förbättras för bättre synlighet.',
    Tillgänglighet: 'Vissa tillgänglighetsförbättringar rekommenderas, t.ex. kontrast eller alt-texter.',
    'Best practices': 'Några mindre avvikelser från best practices, t.ex. föråldrade bibliotek eller saknade säkerhetsheaders.',
  };
  const bad: Record<string, string> = {
    Prestanda: 'Sidan laddar långsamt, vilket påverkar både användarupplevelse och sökrankning. Detta är ofta den enskilt viktigaste faktorn att åtgärda.',
    SEO: 'Flera grundläggande SEO-faktorer saknas eller är felaktiga, vilket gör det svårare att synas i sökresultat.',
    Tillgänglighet: 'Sidan har tillgänglighetsproblem som kan utestänga besökare som använder hjälpmedel.',
    'Best practices': 'Flera moderna webbstandarder följs inte, vilket kan påverka säkerhet och långsiktig underhållbarhet.',
  };

  const set = score >= 90 ? good : score >= 50 ? okay : bad;
  return { label: category, text: set[category] };
}
