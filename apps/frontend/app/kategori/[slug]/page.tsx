import type { Metadata } from 'next';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { Breadcrumb } from '@/app/components/layout/Breadcrumb';
import { MAIN_CATEGORIES } from '@/app/lib/products';
import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryTitle = MAIN_CATEGORIES[slug];
  if (!categoryTitle) return {};
  return {
    title: `${categoryTitle} | Techpilots`,
    description: `Köp ${categoryTitle.toLowerCase()} hos Techpilots. Stort urval, fri frakt och bästa priser.`,
    openGraph: {
      title: `${categoryTitle} | Techpilots`,
      description: `Köp ${categoryTitle.toLowerCase()} hos Techpilots. Stort urval och fri frakt.`,
      url: `https://techpilots.vercel.app/kategori/${slug}`,
    },
  };
}

export const revalidate = false;

export async function generateStaticParams() {
  return Object.keys(MAIN_CATEGORIES).map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryTitle = MAIN_CATEGORIES[slug];

  if (!categoryTitle) {
    return <div>Kategorin hittades inte</div>;
  }

  const breadcrumbItems = [{ label: categoryTitle }];

  return (
    <MainLayout>
      <Breadcrumb items={breadcrumbItems} />
      <CategoryClient slug={slug} categoryTitle={categoryTitle} />
    </MainLayout>
  );
}
