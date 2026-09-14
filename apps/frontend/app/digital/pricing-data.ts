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
    name: 'Startup',
    price: '1 490',
    suffix: '/ Mån',
    desc: 'För små företag och startups. 5 sidor, mobil-responsiv.',
    features: ['Skräddarsydd design och konverteringsfokuserad layout', 'Snabb, responsiv webbplats', 'Grundläggande SEO-struktur', 'Kontaktformulär och Google-koppling', 'Drift, backup och säkerhetsuppdateringar'],
    dark: false,
    popular: false,
    bindingMonths: 12,
    upgradeNote: 'Helhetslösning: Du behöver ingen annan leverantör. Efter bindningstiden rullar samma fasta pris på, utan några prishöjningar.',
    headerGradient: 'linear-gradient(135deg, #3a3d2e 0%, #030303 100%)',
  },
  {
    name: 'Företag',
    price: '2 490',
    suffix: '/ Mån',
    desc: 'För växande företag som behöver en skalbar webbplats med eget innehållssystem.',
    features: ['Eget innehållssystem för flera sidor', 'Snabb webbplats anpassad för alla besökare', 'Blogg/nyhetsflöde', 'Formulär och API-integrationer', 'Drift, backup och säkerhetsuppdateringar'],
    dark: false,
    popular: true,
    bindingMonths: 12,
    upgradeNote: 'Helhetslösning: Du behöver ingen annan leverantör. Efter bindningstiden rullar samma fasta pris på, utan några prishöjningar.',
    headerGradient: 'linear-gradient(135deg, #e8c547 0%, #8a6d1a 60%, #030303 100%)',
  },
  {
    name: 'E-handel',
    price: '3 990',
    suffix: '/ Mån',
    desc: 'För varumärken som säljer online. Färdig e-handelslösning med betalning, produkthantering och snabb prestanda.',
    features: ['Shopify e-handelslösning', 'Betalning och sömlös kassaupplevelse (Stripe, Klarna)', 'Produkthantering och CMS', 'API-integrationer och tredjepartstjänster', 'Drift, backup och säkerhetsuppdateringar', 'Google Analytics & E-handelsspårning'],
    bindingMonths: 12,
    dark: false,
    popular: false,
    upgradeNote: 'Helhetslösning: Du behöver ingen annan leverantör. Efter bindningstiden rullar samma fasta pris på, utan några prishöjningar. Skräddarsydda headless-lösningar eller större behov offereras separat.',
    headerGradient: 'linear-gradient(135deg, #2a3a5e 0%, #14162a 100%)',
  },
];

export const SEO_PRICES: PricePackage[] = [
  {
    name: 'Startup',
    price: '2 990',
    suffix: '/ Mån',
    desc: 'Passar mindre företag som vill ha en snabb, felfri sajt med grundläggande mätning.',
    features: ['Snabbare laddtid: Besökare lämnar inte sajten i förväg', 'Rätt grundinställningar: Google hittar er sajt', 'Tydlig struktur: Sökmotorvänlig kod', 'Klar statistik: Ni ser vad besökarna gör'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: '3 månaders bindningstid, därefter löpande',
    headerGradient: 'linear-gradient(135deg, #3a3d2e 0%, #030303 100%)',
  },
  {
    name: 'Företag',
    price: '6 990',
    suffix: '/ Mån',
    desc: 'Passar växande bolag och B2B som kräver struktur och skräddarsydd kod.',
    features: ['Allt från Startup: Grundfunktionerna ingår', 'Bättre sökresultat: Priser och betyg syns på Google', 'Löpande kontroll: Inget slutar fungera i tysthet', 'Fler landningssidor: Fler sökord fångas upp', 'Tydliga rapporter: Månatlig uppdatering om synligheten'],
    dark: false,
    popular: true,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: '3 månaders bindningstid, därefter löpande',
    headerGradient: 'linear-gradient(135deg, #e8c547 0%, #8a6d1a 60%, #030303 100%)',
  },
  {
    name: 'E-handel',
    price: '14 900',
    suffix: '/ Mån',
    desc: 'Passar e-handlare som kör Medusa och kräver att tusentals produktsidor laddar blixtsnabbt utan flaskhalsar.',
    features: ['Allt från Företag: Alla funktioner ingår', 'Klockren e-handel: Produkter syns perfekt i Google', 'Rätt prioritering: Viktigaste produkterna hittas först', 'Stabil prestanda: Snabb butik även vid högt tryck', 'Snabb felsökning: Indexeringsproblem åtgärdas direkt'],
    dark: false,
    popular: false,
    ctaLabel: 'Kostnadsfri SEO-analys',
    note: '3 månaders bindningstid, därefter löpande',
    headerGradient: 'linear-gradient(135deg, #2a3a5e 0%, #14162a 100%)',
  },
];
