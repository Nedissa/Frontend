export type PricePackage = {
  name: string;
  price: string;
  suffix: string;
  desc: string;
  features: string[];
  dark: boolean;
  popular: boolean;
};

export const PRICES: PricePackage[] = [
  {
    name: 'Grundläggande',
    price: '14 900',
    suffix: '/ Från',
    desc: 'Grundläggande designstöd för nya varumärken som tar sina första steg.',
    features: ['Skräddarsydd visuell identitet', 'Responsiv, modern webbdesign', 'Konverteringsfokuserad layout'],
    dark: false,
    popular: false,
  },
  {
    name: 'Företagswebbplats',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För etablerade bolag som behöver en skalbar webbplats som växer med verksamheten.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Teknisk SEO', 'Core Web Vitals-optimering', 'WCAG-anpassning och tillgänglighet'],
    dark: false,
    popular: true,
  },
  {
    name: 'E-handel',
    price: '35 000',
    suffix: '/ Från',
    desc: 'För varumärken som vill äga hela köpupplevelsen eller komma igång snabbt.',
    features: ['Shopify-tema eller Headless', 'Betallösning (Stripe) med Klarna', 'Produkthantering', 'Sömlös kassaupplevelse', 'Snabb, optimerad prestandainstallation', 'Sömlöst CMS och organisation', 'API-integrationer och tredjepartstjänster'],
    dark: true,
    popular: false,
  },
];
