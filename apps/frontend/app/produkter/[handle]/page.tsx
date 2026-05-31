import { notFound } from 'next/navigation';
import { MainLayout } from '@/app/components/MainLayout';
import { getProductByHandle, getBreadcrumbTrail } from '@/app/lib/products';
import ProductDetailClient from '@/app/produktserier/[slug]/[handle]/ProductDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;

  let product;
  try {
    product = await getProductByHandle(handle);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const categorySlug = product.category || 'laptops';
  const breadcrumbTrail = getBreadcrumbTrail(categorySlug);

  return (
    <MainLayout>
      <ProductDetailClient
        product={product}
        categorySlug={categorySlug}
        categoryTitle={product.category || 'Produkter'}
        breadcrumbTrail={breadcrumbTrail}
      />
    </MainLayout>
  );
}
