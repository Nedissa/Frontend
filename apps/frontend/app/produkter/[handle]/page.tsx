import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MainLayout } from '@/app/components/MainLayout';
import { getProductByHandle, getBreadcrumbTrail } from '@/app/lib/products';
import ProductDetailClient from '@/app/produktserier/[slug]/[handle]/ProductDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  let product;
  try {
    product = await getProductByHandle(handle);
  } catch {
    return {};
  }
  if (!product) return {};

  const title = `${product.title} | Techpilots`;
  const description = product.description
    ? product.description.slice(0, 155)
    : `Köp ${product.title} hos Techpilots. Snabb leverans och bra pris.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
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
