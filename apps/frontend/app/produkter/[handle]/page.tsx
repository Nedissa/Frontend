import { notFound } from 'next/navigation';
import { MainLayout } from '@/app/components/MainLayout';
import { getProductByHandle, getBreadcrumbTrail } from '@/app/lib/products';
import ProductDetailClient from '@/app/produktserier/[slug]/[handle]/ProductDetailClient';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).map((p: any) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

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
