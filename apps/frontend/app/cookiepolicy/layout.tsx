import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookiepolicy | Techpilots',
  description: 'Information om hur Techpilots använder cookies för att förbättra din upplevelse på sajten.',
  openGraph: {
    title: 'Cookiepolicy | Techpilots',
    description: 'Information om hur Techpilots använder cookies.',
    url: 'https://techpilots.vercel.app/cookiepolicy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
