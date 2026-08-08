import { MainLayout } from '@/app/components/layout/MainLayout';
import { ProductSeriesContent } from './ProductSeriesContent';
import { getCategoryTitle, getBreadcrumbTrail, MAIN_CATEGORIES } from '@/app/lib/products';

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(MAIN_CATEGORIES).map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchProducts() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?limit=100`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    return [];
  }
}

export default async function ProductSeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryTitle = getCategoryTitle(slug);
  const breadcrumbTrail = getBreadcrumbTrail(slug);
  const products = await fetchProducts();

  return (
    <MainLayout>
      <ProductSeriesContent
        categoryTitle={categoryTitle}
        categorySlug={slug}
        breadcrumbTrail={breadcrumbTrail}
        products={products}
      />
    </MainLayout>
  );
}
