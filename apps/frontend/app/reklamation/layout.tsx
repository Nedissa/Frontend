import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reklamation & Service | Techpilots',
  description: 'Har du en defekt produkt? Anmäl reklamation enkelt hos Techpilots. Vi har 3 års reklamationsrätt och hjälper dig snabbt.',
  openGraph: {
    title: 'Reklamation & Service | Techpilots',
    description: '3 års reklamationsrätt. Anmäl enkelt och få snabb hjälp.',
    url: 'https://techpilots.se/reklamation',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
