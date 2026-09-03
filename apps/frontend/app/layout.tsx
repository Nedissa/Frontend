import type { Metadata } from 'next';
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
      <head></head>
      <body className="bg-white flex flex-col min-h-screen">
        <RootLayoutClient initialIsLoggedIn={isLoggedIn}>
          {children}
        </RootLayoutClient>
        <CookieBanner />
      </body>
    </html>
  );
}
