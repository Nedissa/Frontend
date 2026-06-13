import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integritetspolicy | Techpilots',
  description: 'Läs hur Techpilots hanterar dina personuppgifter i enlighet med GDPR. Vi värnar om din integritet.',
  openGraph: {
    title: 'Integritetspolicy | Techpilots',
    description: 'Läs hur Techpilots hanterar dina personuppgifter i enlighet med GDPR.',
    url: 'https://techpilots.se/integritetspolicy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
