export type PricePackage = {
  name: string;
  price: string;
  suffix: string;
  desc: string;
  features: string[];
  dark: boolean;
  popular: boolean;
  ctaLabel?: string;
  note?: string;
  bindingMonths?: number;
  upgradeNote?: string;
  headerGradient?: string;
};

export const PRICES: PricePackage[] = [
  {
    name: 'Startup Website',
    price: '1 490',
    suffix: '/ Mån',
    desc: 'För små företag och startups. 5 sidor, mobil-responsiv.',
    features: ['Skräddarsydd design och konverteringsfokuserad layout', 'Snabb, responsiv webbplats', 'Drift, backup och säkerhetsuppdateringar'],
    dark: false,
    popular: false,
    bindingMonths: 12,
    headerGradient: 'linear-gradient(135deg, #3a3d2e 0%, #030303 100%)',
  },
  {
    name: 'Growth Website',
    price: '2 490',
    suffix: '/ Mån',
    desc: 'För växande företag som behöver en skalbar webbplats med eget innehållssystem.',
    features: ['Eget innehållssystem för flera sidor', 'Snabb, tillgänglighetsanpassad webbplats', '1 timme innehållsändringar/mån', 'Drift, backup och säkerhetsuppdateringar'],
    dark: false,
    popular: true,
    bindingMonths: 12,
    headerGradient: 'linear-gradient(135deg, #e8c547 0%, #8a6d1a 60%, #030303 100%)',
  },
  {
    name: 'E-Commerce Platform',
    price: '4 990',
    suffix: '/ Mån',
    desc: 'För varumärken som säljer online. Shopify eller headless-lösning med betalning, produkthantering och snabb prestanda.',
    features: ['Shopify eller headless, efter behov', 'Betalning och sömlös kassaupplevelse (Stripe, Klarna)', 'Produkthantering och CMS', 'API-integrationer och tredjepartstjänster', 'Drift, backup och säkerhetsuppdateringar', 'Google-koppling och rapportering'],
    note: 'Headless-lösningar offereras separat',
    bindingMonths: 12,
    dark: false,
    popular: false,
    headerGradient: 'linear-gradient(135deg, #2a3a5e 0%, #14162a 100%)',
  },
];

export const SEO_PRICES: PricePackage[] = [
  {
    name: 'SEO Bas',
    price: '2 990',
    suffix: '/ Mån',
    desc: 'För företag som vill synas lokalt. Grundläggande sökordsoptimering och löpande uppföljning.',
    features: ['Löpande sökordsuppföljning (topp 10-ord)', 'On-page optimering', 'Google Business-optimering med månatliga inlägg', '1 blogginlägg/mån', 'Månadsrapport med mätning och spårning'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
    headerGradient: 'linear-gradient(135deg, #3a3d2e 0%, #030303 100%)',
  },
  {
    name: 'SEO Tillväxt',
    price: '6 990',
    suffix: '/ Mån',
    desc: 'För bolag som vill ta marknadsandelar från konkurrenterna med teknisk SEO och löpande innehåll.',
    features: ['Sökordsstrategi och nulägesanalys', 'Teknisk SEO och löpande sidoptimering', '4 artiklar/mån', 'Konkurrentanalys', 'Komplett mät- och uppföljningssetup'],
    dark: false,
    popular: true,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
    headerGradient: 'linear-gradient(135deg, #e8c547 0%, #8a6d1a 60%, #030303 100%)',
  },
  {
    name: 'SEO Auktoritet',
    price: '14 900',
    suffix: '/ Mån',
    desc: 'För varumärken som vill dominera sin bransch. Länkbygge, innehållsstrategi och dedikerad SEO-ansvarig.',
    features: ['Sökordsstrategi och nulägesanalys', 'Teknisk djuprevision och innehållsstrategi', '4 artiklar/mån', 'Länkbygge och digital PR, upp till 5/kvartal', 'Dedikerad SEO-ansvarig med prioriterad support', 'Komplett mät- och uppföljningssetup'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
    headerGradient: 'linear-gradient(135deg, #2a3a5e 0%, #14162a 100%)',
  },
];
