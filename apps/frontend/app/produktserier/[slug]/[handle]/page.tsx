import { MainLayout } from '@/app/components/MainLayout';
import { getProductByHandle, getCategoryTitle, getBreadcrumbTrail } from '@/app/lib/products';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).map((p: any) => ({
      slug: p.category_handle || 'produkter',
      handle: p.handle,
    }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
    handle: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return <div>Produkten hittades inte</div>;
  }

  const categoryTitle = getCategoryTitle(slug);
  const breadcrumbTrail = getBreadcrumbTrail(slug);

  return (
    <MainLayout>
      <ProductDetailClient
        product={product}
        categorySlug={slug}
        categoryTitle={categoryTitle}
        breadcrumbTrail={breadcrumbTrail}
      />
    </MainLayout>
  );
}
