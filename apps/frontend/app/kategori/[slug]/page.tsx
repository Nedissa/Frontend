import { MainLayout } from '@/app/components/MainLayout';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { MAIN_CATEGORIES } from '@/app/lib/products';

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
      <div className="px-6 text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryTitle}</h1>
        <p className="text-lg text-gray-600">Innehål för denna kategori kommer snart</p>
      </div>
    </MainLayout>
  );
}
