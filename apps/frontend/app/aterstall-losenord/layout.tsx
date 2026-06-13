import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Återställ lösenord | Techpilots',
  description: 'Återställ ditt lösenord till Techpilots-kontot.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
