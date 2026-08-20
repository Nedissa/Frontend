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
    name: 'Startup Website',
    price: '14 900',
    suffix: '/ Från',
    desc: 'För små företag och startups. 5 sidor, mobil-responsiv, grundläggande SEO.',
    features: ['Skräddarsydd visuell identitet', 'Responsiv, modern webbdesign', 'Konverteringsfokuserad layout', 'Grundläggande SEO'],
    dark: false,
    popular: false,
  },
  {
    name: 'Growth Website',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För växande företag som behöver en skalbar webbplats med eget innehållssystem och teknisk SEO.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Teknisk SEO', 'Core Web Vitals-optimering', 'WCAG-anpassning och tillgänglighet'],
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
