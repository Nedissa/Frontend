import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alla produkter | Techpilots',
  description: 'Utforska Techpilots sortiment av gaming-laptops, grafikkort, processorer och tillbehör. Fri frakt och bästa priser.',
  openGraph: {
    title: 'Alla produkter | Techpilots',
    description: 'Gaming-laptops, grafikkort, processorer och tillbehör. Fri frakt och bästa priser.',
    url: 'https://techpilots.se/produkter',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
