import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Varukorg | Techpilots',
  description: 'Din varukorg hos Techpilots.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
