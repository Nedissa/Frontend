import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilotbloggen | Techpilots',
  description: 'Tips, tester och nyheter inom gaming och teknik. Techpilots blogg för dig som vill hålla dig uppdaterad.',
  openGraph: {
    title: 'Pilotbloggen | Techpilots',
    description: 'Tips, tester och nyheter inom gaming och teknik från Techpilots.',
    url: 'https://techpilots.vercel.app/pilotbloggen',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
