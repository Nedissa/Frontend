import type { Metadata } from 'next';
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { SiteNav } from './components/SiteNav';
import { StructuredData } from './components/StructuredData';
import './studio.css';

export const metadata: Metadata = {
  title: {
    default: 'Techpilots — Webbutveckling i Borås',
    template: '%s | Techpilots',
  },
  description: 'Vi designar, utvecklar och levererar moderna webbplatser och e-handelslösningar. Baserade i Borås — vi arbetar med hela Sverige.',
  openGraph: {
    siteName: 'Techpilots',
    locale: 'sv_SE',
    type: 'website',
    url: 'https://techpilots.se/digital',
    title: 'Techpilots — Webbutveckling i Borås',
    description: 'Vi designar, utvecklar och levererar moderna webbplatser och e-handelslösningar. Baserade i Borås — vi arbetar med hela Sverige.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techpilots — Webbutveckling i Borås',
    description: 'Vi designar, utvecklar och levererar moderna webbplatser och e-handelslösningar.',
  },
  alternates: {
    canonical: 'https://techpilots.se/digital',
  },
};

export default function WebStudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/_next/image?url=%2Fdigital%2Fhero.webp&w=750&q=75"
        fetchPriority="high"
      />
      <StructuredData />
      <div style={{ fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <SiteNav />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </div>
    </>
  );
}
