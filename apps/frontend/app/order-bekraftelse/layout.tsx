import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orderbekräftelse | Techpilots',
  description: 'Din order är bekräftad. Tack för ditt köp hos Techpilots!',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
