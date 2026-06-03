import { MainLayout } from '@/app/components/MainLayout';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { MAIN_CATEGORIES } from '@/app/lib/products';
import CategoryClient from './CategoryClient';

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
