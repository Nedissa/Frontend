import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { RootLayoutClient } from './components/layout/RootLayoutClient';
import { CookieBanner } from './components/CookieBanner';
import { cookies } from 'next/headers';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans',display:'swap'});

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
    <html lang="sv" style={{ scrollbarGutter: 'stable', overflowY: 'scroll' }} className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`:root{--content-max-width:clamp(960px, 62.5vw, 1600px);--content-max-width-narrow:clamp(960px, 50vw, 1100px);}.ml-container{max-width:var(--content-max-width);width:100%;padding-left:12px;padding-right:12px;}@media(min-width:768px){.ml-container{padding-left:0;padding-right:0;}}.content-container{max-width:var(--content-max-width);margin-left:auto;margin-right:auto;}.content-container-narrow{max-width:var(--content-max-width-narrow);margin-left:auto;margin-right:auto;}`}</style>
      </head>
      <body className="bg-white flex flex-col min-h-screen">
        <Script
          src="https://static.klaviyo.com/onsite/js/XrJ4Rq/klaviyo.js"
          strategy="lazyOnload"
        />
        <RootLayoutClient initialIsLoggedIn={isLoggedIn}>
          {children}
        </RootLayoutClient>
        <CookieBanner />
      </body>
    </html>
  );
}
