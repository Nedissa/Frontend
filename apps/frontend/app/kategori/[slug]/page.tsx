import type { Metadata } from 'next';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { Breadcrumb } from '@/app/components/layout/Breadcrumb';
import { findCategoryTrail } from '@/app/lib/products';
import { MENU_DATA } from '@/app/components/Header/menuData';
import CategoryClient from './CategoryClient';

function getAllCategorySlugs(): string[] {
  const slugs: string[] = [];
  const visit = (node: { url: string; items?: any[] }) => {
    slugs.push(node.url.replace('/kategori/', ''));
    for (const child of node.items || []) visit(child);
  };
  for (const main of MENU_DATA) visit(main);
  return slugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trail = findCategoryTrail(slug);
  const categoryTitle = trail ? trail[trail.length - 1].title : undefined;
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
  return getAllCategorySlugs().map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const trail = findCategoryTrail(slug);

  if (!trail) {
    return (
      <MainLayout>
        <div className="py-16 text-center text-gray-600">Kategorin hittades inte</div>
      </MainLayout>
    );
  }

  const categoryTitle = trail[trail.length - 1].title;
  const breadcrumbItems = trail.map((node, idx) => ({
    label: node.title,
    href: idx < trail.length - 1 ? `/kategori/${node.slug}` : undefined,
  }));

  return (
    <MainLayout>
      <div className="px-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <CategoryClient slug={slug} categoryTitle={categoryTitle} />
    </MainLayout>
  );
}
