import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returpolicy | Techpilots',
  description: 'Techpilots returpolicy — 14 dagars öppet köp, enkel returprocess och snabb återbetalning. Köp tryggt hos oss.',
  openGraph: {
    title: 'Returpolicy | Techpilots',
    description: '14 dagars öppet köp, enkel returprocess och snabb återbetalning.',
    url: 'https://techpilots.se/returpolicy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
