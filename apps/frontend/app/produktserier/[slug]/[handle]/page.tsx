import { Metadata } from 'next';
import { MainLayout } from '@/app/components/MainLayout';
import { getProductByHandle, getCategoryTitle, getBreadcrumbTrail } from '@/app/lib/products';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
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
  const { slug, handle } = await params;

  let product;
  try {
    product = await getProductByHandle(handle);
  } catch {
    return <div>Produkten hittades inte</div>;
  }

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
