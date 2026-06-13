import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Försäljningsvillkor | Techpilots',
  description: 'Läs Techpilots försäljningsvillkor — information om betalning, leverans, ångerrätt och reklamation.',
  openGraph: {
    title: 'Försäljningsvillkor | Techpilots',
    description: 'Läs Techpilots försäljningsvillkor — betalning, leverans, ångerrätt och reklamation.',
    url: 'https://techpilots.se/villkor',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
