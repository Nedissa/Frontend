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
  upgradeNote?: string;
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
    upgradeNote: 'Growth Website lägger till: CMS, flera sidor, tillgänglighetsanpassning',
  },
  {
    name: 'Growth Website',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För växande företag som behöver en skalbar webbplats med eget innehållssystem.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Snabbare laddtider (gillas av Google)', 'WCAG-anpassning och tillgänglighet'],
    dark: false,
    popular: true,
    upgradeNote: 'E-Commerce Platform lägger till: betalning, produkthantering, kassaflöde',
  },
  {
    name: 'E-Commerce Platform',
    price: '39 900',
    suffix: '/ Från',
    desc: 'För varumärken som säljer online. Shopify eller headless-lösning med betalning, produkthantering och snabb prestanda.',
    features: ['Shopify eller headless, efter behov', 'Betallösning (Stripe) med Klarna', 'Produkthantering', 'Sömlös kassaupplevelse', 'Snabb, optimerad prestandainstallation', 'Sömlöst CMS och organisation', 'API-integrationer och tredjepartstjänster'],
    note: 'Gratis · samma dag offert · Headless-lösningar offereras separat',
    dark: true,
    popular: false,
  },
];

export const SEO_PRICES: PricePackage[] = [
  {
    name: 'SEO Bas',
    price: '4 900',
    suffix: '/ Mån',
    desc: 'För företag som vill synas lokalt. Grundläggande sökordsoptimering och löpande uppföljning.',
    features: ['Löpande sökordsuppföljning', 'On-page optimering', 'Google Business-optimering', 'Månadsrapport'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
    upgradeNote: 'SEO Tillväxt lägger till: teknisk SEO, innehållsproduktion, konkurrentanalys',
  },
  {
    name: 'SEO Tillväxt',
    price: '7 900',
    suffix: '/ Mån',
    desc: 'För bolag som vill ta marknadsandelar från konkurrenterna med teknisk SEO och löpande innehåll.',
    features: ['Löpande sökordsuppföljning', 'On-page optimering', 'Teknisk SEO-optimering', '2 artiklar/mån', 'Konkurrentanalys', 'Snabbare laddtider (gillas av Google)'],
    dark: false,
    popular: true,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
    upgradeNote: 'SEO Auktoritet lägger till: länkbygge, digital PR, dedikerad SEO-ansvarig',
  },
  {
    name: 'SEO Auktoritet',
    price: '14 900',
    suffix: '/ Mån',
    desc: 'För varumärken som vill dominera sin bransch. Länkbygge, innehållsstrategi och dedikerad SEO-ansvarig.',
    features: ['Teknisk SEO-optimering', '4 artiklar/mån', 'Upp till 5 länkar/kvartal och digital PR', 'Innehållsstrategi', 'Dedikerad SEO-ansvarig', 'Kvartalsvis strategigenomgång', 'Prioriterad support'],
    dark: true,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: 'Ingen bindningstid · Uppsägning löpande månadsvis',
  },
];
