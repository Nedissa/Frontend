import type { Metadata } from 'next';
import { Footer } from './components/Footer';
import { SiteNav } from './components/SiteNav';
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
    url: 'https://techpilots.se/tjanster',
    title: 'Techpilots — Webbutveckling i Borås',
    description: 'Vi designar, utvecklar och levererar moderna webbplatser och e-handelslösningar. Baserade i Borås — vi arbetar med hela Sverige.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techpilots — Webbutveckling i Borås',
    description: 'Vi designar, utvecklar och levererar moderna webbplatser och e-handelslösningar.',
  },
  alternates: {
    canonical: 'https://techpilots.se/tjanster',
  },
};

export default function WebStudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <SiteNav />
        {children}
        <Footer />
      </div>
    </>
  );
}
