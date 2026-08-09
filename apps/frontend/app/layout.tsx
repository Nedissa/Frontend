import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from './components/layout/RootLayoutClient';
import { CookieBanner } from './components/CookieBanner';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: 'Techpilots – Din guide genom teknikdjungeln',
    template: '%s | Techpilots',
  },
  description: 'Köp gaming-laptops, grafikkort, processorer och tillbehör hos Techpilots. Fri standardleverans, bästa priser och snabb service från Borås.',
  metadataBase: new URL('https://techpilots.vercel.app'),
  openGraph: {
    siteName: 'Techpilots',
    locale: 'sv_SE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('medusa_token')?.value;
  const isLoggedIn = !!token;

  return (
    <html lang="sv" style={{ scrollbarGutter: 'stable', overflowY: 'scroll' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/assets/hero-1.jpg" fetchPriority="high" />
        <link rel="preload" as="image" href="/icons/barbara-datorer.png" />
        <link rel="preload" as="image" href="/icons/stationara-datorer.png" />
        <link rel="preload" as="image" href="/icons/datortillbehor.png" />
        <link rel="preload" as="image" href="/icons/cpu.png" />
        <link rel="preload" as="image" href="/icons/moderkort.png" />
        <link rel="preload" as="image" href="/icons/gpu.png" />
        <link rel="preload" as="image" href="/icons/ram.png" />
        <link rel="preload" as="image" href="/icons/lagring.png" />
        <link rel="preload" as="image" href="/icons/nataggregat.png" />
        <link rel="preload" as="image" href="/icons/gaming-laptop.png" />
        <link rel="preload" as="image" href="/icons/gaming-pc.png" />
        <link rel="preload" as="image" href="/icons/gaming-tillbehor.png" />
        <link rel="preload" as="image" href="/icons/smartphones.png" />
        <link rel="preload" as="image" href="/icons/mobiltillbehor.png" />
        <link rel="preload" as="image" href="/icons/accesspunkter.png" />
        <link rel="preload" as="image" href="/icons/natverksforlangare.png" />
        <link rel="preload" as="image" href="/icons/routrar.png" />
        <link rel="preload" as="image" href="/icons/mesh.png" />
        <link rel="preload" as="image" href="/icons/tv.png" />
        <link rel="preload" as="image" href="/icons/ljud-hifi.png" />
        <link rel="preload" as="image" href="/icons/tv-tillbehor.png" />
        <style>{`:root{--content-max-width:1080px;}@media(min-width:2560px){:root{--content-max-width:1440px;}}.ml-container{max-width:var(--content-max-width);width:100%;padding-left:12px;padding-right:12px;}@media(min-width:768px){.ml-container{padding-left:0;padding-right:0;}}.content-container{max-width:var(--content-max-width);margin-left:auto;margin-right:auto;}`}</style>
      </head>
      <body className="bg-white flex flex-col min-h-screen">
        <RootLayoutClient initialIsLoggedIn={isLoggedIn}>
          {children}
        </RootLayoutClient>
        <CookieBanner />
      </body>
    </html>
  );
}
