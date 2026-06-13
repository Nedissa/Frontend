import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kassa | Techpilots',
  description: 'Genomför ditt köp hos Techpilots.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
