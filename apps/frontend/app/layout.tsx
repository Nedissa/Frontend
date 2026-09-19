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

async function fetchActiveCategoryHandles(): Promise<string[]> {
  try {
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

    const response = await fetch(
      `${medusaUrl}/store/products?limit=200&region_id=${regionId}&fields=id,*categories`,
      {
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': publishableKey },
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) return [];

    const data = await response.json();
    const products = data.products || [];
    const activeHandles = new Set<string>();
    for (const product of products) {
      for (const category of product.categories || []) {
        if (category.handle) activeHandles.add(category.handle);
      }
    }
    return Array.from(activeHandles);
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('medusa_token')?.value;
  const isLoggedIn = !!token;
  const activeCategoryHandles = await fetchActiveCategoryHandles();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Techpilots',
    url: 'https://techpilots.vercel.app',
    sameAs: [
      'https://www.facebook.com/techpilots.se/',
      'https://www.instagram.com/techpilots.se/',
      'https://www.linkedin.com/company/techpilots-webagency',
    ],
  };

  return (
    <html lang="sv" style={{ scrollbarGutter: 'stable', overflowY: 'scroll' }} className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-white flex flex-col min-h-screen">
        <RootLayoutClient initialIsLoggedIn={isLoggedIn} activeCategoryHandles={activeCategoryHandles}>
          {children}
        </RootLayoutClient>
        <CookieBanner />
      </body>
    </html>
  );
}
