import { PRICES } from '../pricing-data';
import { FAQS } from '../faq-data';

/**
 * JSON-LD för /digital. Datan hämtas från samma källor som UI:t (pricing-data.ts,
 * faq-data.ts) så schemat aldrig kan komma ur synk med det som faktiskt visas.
 */
export function StructuredData() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Webbutveckling och e-handel',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Techpilots AB',
      telephone: '+46108800981',
      email: 'info@techpilots.se',
      address: {
        '@type': 'PostalAddress',
        postalCode: '506 31',
        addressLocality: 'Borås',
        addressCountry: 'SE',
      },
    },
    areaServed: 'SE',
    offers: PRICES.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      priceCurrency: 'SEK',
      price: p.price.replace(/\s/g, ''),
      description: p.desc,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
