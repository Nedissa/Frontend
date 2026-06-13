import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mina beställningar | Techpilots',
  description: 'Se och följ upp dina beställningar hos Techpilots.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
