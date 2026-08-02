import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kundservice | Techpilots',
  description: 'Hjälp med order, leverans, returer, reklamation och köpvillkor. Vi svarar inom 24 timmar.',
  openGraph: {
    title: 'Kundservice | Techpilots',
    description: 'Hjälp med order, leverans, returer, reklamation och köpvillkor.',
    url: 'https://techpilots.vercel.app/kundservice',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
