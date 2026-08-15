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
    desc: 'För små företag och startups. 5 sidor, mobil-responsiv, SEO-setup. Leverans: 3–4 veckor.',
    features: ['Skräddarsydd visuell identitet', 'Responsiv, modern webbdesign', 'Konverteringsfokuserad layout'],
    dark: false,
    popular: false,
  },
  {
    name: 'Growth Website',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För växande företag som behöver en skalbar webbplats. CMS, SEO och uppdaterbar struktur.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Teknisk SEO', 'Core Web Vitals-optimering', 'WCAG-anpassning och tillgänglighet'],
    dark: false,
    popular: true,
  },
  {
    name: 'E-Commerce Platform',
    price: '35 000',
    suffix: '/ Från',
    desc: 'För varumärken som säljer online. Fullständig lösning med betalning, produkthantering och optimering.',
    features: ['Shopify-tema eller Headless', 'Betallösning (Stripe) med Klarna', 'Produkthantering', 'Sömlös kassaupplevelse', 'Snabb, optimerad prestandainstallation', 'Sömlöst CMS och organisation', 'API-integrationer och tredjepartstjänster'],
    dark: true,
    popular: false,
  },
];
