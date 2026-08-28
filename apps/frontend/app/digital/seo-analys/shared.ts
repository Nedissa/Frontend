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
    Prestanda: 'Sidan laddar snabbt. Fortsätt hålla koll på bildstorlekar och tredjepartsskript.',
    SEO: 'Grunden är på plats. Fortsatt arbete med innehåll och länkar stärker positionen.',
    Tillgänglighet: 'Väl anpassad för skärmläsare och andra hjälpmedel.',
    'Best practice': 'Följer moderna webbstandarder för säkerhet och kodkvalitet.',
  };
  const okay: Record<string, string> = {
    Prestanda: 'Utrymme att förbättra laddtiden, t.ex. bildoptimering och mindre JavaScript.',
    SEO: 'Grunderna finns, men strukturerad data eller innehåll kan förbättras.',
    Tillgänglighet: 'Vissa förbättringar rekommenderas, t.ex. kontrast eller alt-texter.',
    'Best practice': 'Några mindre avvikelser, t.ex. föråldrade bibliotek eller säkerhetsheaders.',
  };
  const bad: Record<string, string> = {
    Prestanda: 'Långsam laddning kostar er både besökare och sökrankning. Ofta den viktigaste faktorn att åtgärda.',
    SEO: 'Flera grundläggande SEO-faktorer saknas, vilket gör det svårare att synas i sökresultat.',
    Tillgänglighet: 'Tillgänglighetsproblem kan utestänga besökare som använder hjälpmedel.',
    'Best practice': 'Flera webbstandarder följs inte, vilket kan påverka säkerhet och underhåll.',
  };

  const set = score >= 90 ? good : score >= 50 ? okay : bad;
  return { label: category, text: set[category] };
}
