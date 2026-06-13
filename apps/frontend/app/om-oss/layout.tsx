import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om oss | Techpilots',
  description: 'Lär känna Techpilots — ett techbolag från Borås som brinner för gaming, datorer och teknik. Vi hjälper dig hitta rätt produkt till rätt pris.',
  openGraph: {
    title: 'Om oss | Techpilots',
    description: 'Lär känna Techpilots — ett techbolag från Borås som brinner för gaming, datorer och teknik.',
    url: 'https://techpilots.se/om-oss',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
