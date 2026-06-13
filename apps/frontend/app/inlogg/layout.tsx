import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logga in | Techpilots',
  description: 'Logga in på ditt Techpilots-konto för att se orderhistorik, favoriter och hantera dina uppgifter.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
