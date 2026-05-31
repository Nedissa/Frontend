import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from './components/RootLayoutClient';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Techpilots - Datorkomponenter och Datorer',
  description: 'Köp högkvalitativa datorer, komponenter och tillbehör',
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
    <html lang="sv" style={{ scrollbarGutter: 'stable' }}>
      <head>
        <link rel="preload" as="image" href="/assets/hero-1.jpg" fetchPriority="high" />
        <style>{`.ml-container{max-width:1280px;width:100%}`}</style>
      </head>
      <body className="bg-white flex flex-col min-h-screen overflow-x-hidden">
        <RootLayoutClient initialIsLoggedIn={isLoggedIn}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
