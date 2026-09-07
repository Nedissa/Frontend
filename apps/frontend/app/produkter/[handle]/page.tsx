import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { getProductByHandle, getBreadcrumbTrail, getAccessories, getReviewStats, getQuestionCount } from '@/app/lib/products';
import { getProductJsonLd, getBreadcrumbJsonLd } from '@/app/lib/productSchema';
import ProductDetailClient from '@/app/produktserier/[slug]/[handle]/ProductDetailClient';

export const revalidate = 60;

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

  const title = product.metadata?.seo_title
    ? `${product.metadata.seo_title} | Techpilots`
    : `${product.title} | Techpilots`;
  const description = product.metadata?.seo_description
    || (product.description ? product.description.slice(0, 155) : `Köp ${product.title} hos Techpilots. Snabb leverans och bra pris.`);

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
  const accessories = await getAccessories(categorySlug, product.image);
  const reviewStats = await getReviewStats(product.id);
  const questionCount = await getQuestionCount(product.id);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
  const productUrl = `${baseUrl}/produkter/${handle}`;
  const productJsonLd = getProductJsonLd(product, productUrl);
  const breadcrumbJsonLd = getBreadcrumbJsonLd(breadcrumbTrail, product, baseUrl, productUrl);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        categorySlug={categorySlug}
        categoryTitle={product.category || 'Produkter'}
        breadcrumbTrail={breadcrumbTrail}
        initialAccessories={accessories as any}
        initialReviewStats={reviewStats}
        initialQuestionCount={questionCount}
      />
    </MainLayout>
  );
}
