import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';
import { ProductsPageClient } from './ProductsPageClient';

export default async function ProductsPage() {
  const products = await fetchProductsFromMedusa();
  return <ProductsPageClient products={products} />;
}
