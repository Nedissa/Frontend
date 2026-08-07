import type { Metadata } from 'next';
import { Footer } from './components/Footer';
import { SiteNav } from './components/SiteNav';
import './studio.css';

export const metadata: Metadata = {
  title: 'Techpilots — Webbutveckling i Borås',
  description: 'Vi designar, utvecklar och levererar moderna webbplatser och digitala upplevelser.',
};

export default function WebbstudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <SiteNav />
        {children}
        <Footer />
      </div>
    </>
  );
}
