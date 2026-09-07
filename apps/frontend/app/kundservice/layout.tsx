import type { Metadata } from 'next';
import { FAQS } from './faq-data';

export const metadata: Metadata = {
  title: 'Kundservice | Techpilots',
  description: 'Hjälp med order, leverans, returer, reklamation och köpvillkor. Vi svarar inom 24 timmar.',
  openGraph: {
    title: 'Kundservice | Techpilots',
    description: 'Hjälp med order, leverans, returer, reklamation och köpvillkor.',
    url: 'https://techpilots.vercel.app/kundservice',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
