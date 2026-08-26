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
};

export const PRICES: PricePackage[] = [
  {
    name: 'Startup Website',
    price: '14 900',
    suffix: '/ Från',
    desc: 'För små företag och startups. 5 sidor, mobil-responsiv.',
    features: ['Skräddarsydd visuell identitet', 'Responsiv, modern webbdesign', 'Konverteringsfokuserad layout', 'Snabb sidladdning'],
    dark: false,
    popular: false,
  },
  {
    name: 'Growth Website',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För växande företag som behöver en skalbar webbplats med eget innehållssystem.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Core Web Vitals-optimering', 'WCAG-anpassning och tillgänglighet'],
    dark: false,
    popular: true,
  },
  {
    name: 'E-Commerce Platform',
    price: '35 000',
    suffix: '/ Från',
    desc: 'För varumärken som säljer online. Shopify eller headless-lösning med betalning, produkthantering och snabb prestanda.',
    features: ['Shopify-tema eller Headless', 'Betallösning (Stripe) med Klarna', 'Produkthantering', 'Sömlös kassaupplevelse', 'Snabb, optimerad prestandainstallation', 'Sömlöst CMS och organisation', 'API-integrationer och tredjepartstjänster'],
    dark: true,
    popular: false,
  },
];

export const SEO_PRICES: PricePackage[] = [
  {
    name: 'SEO Bas',
    price: '3 900',
    suffix: '/ Mån',
    desc: 'För företag som vill synas lokalt. Grundläggande sökordsoptimering och löpande uppföljning.',
    features: ['Sökordsanalys', 'On-page optimering', 'Google Business-optimering', 'Månadsrapport'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
  },
  {
    name: 'SEO Tillväxt',
    price: '7 900',
    suffix: '/ Mån',
    desc: 'För växande företag som vill klättra i sökresultaten med teknisk SEO och löpande innehåll.',
    features: ['Sökordsanalys', 'On-page optimering', 'Teknisk SEO-optimering', 'Innehållsproduktion', 'Konkurrentanalys', 'Core Web Vitals-optimering'],
    dark: false,
    popular: true,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
  },
  {
    name: 'SEO Auktoritet',
    price: '14 900',
    suffix: '/ Mån',
    desc: 'För varumärken som vill dominera sin bransch. Länkbygge, innehållsstrategi och dedikerad SEO-ansvarig.',
    features: ['Teknisk SEO-optimering', 'Innehållsproduktion', 'Länkbygge och digital PR', 'Innehållsstrategi', 'Dedikerad SEO-ansvarig', 'Kvartalsvis strategigenomgång', 'Prioriterad support'],
    dark: true,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
  },
];
