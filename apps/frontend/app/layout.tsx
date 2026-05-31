import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from './components/RootLayoutClient';
import { HeaderServer } from './components/HeaderServer';

export const metadata: Metadata = {
  title: 'Techpilots - Datorkomponenter och Datorer',
  description: 'Köp högkvalitativa datorer, komponenter och tillbehör',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" style={{ scrollbarGutter: 'stable' }}>
      <body className="bg-white flex flex-col min-h-screen">
        <HeaderServer />
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
