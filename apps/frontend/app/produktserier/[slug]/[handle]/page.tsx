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
