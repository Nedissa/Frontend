import Link from 'next/link';
import { ProductCarousel } from './components/ProductCarousel';
import { AboutBanner } from './components/AboutBanner';
import { FeaturedProductSection } from './components/FeaturedProductSection';
import { MainLayout } from './components/MainLayout';
import { NewsletterPopup } from './components/NewsletterPopup';
import { HeroCarouselClient } from './components/HeroCarouselClient';
import { LimitedTimeBanner } from './components/LimitedTimeBanner';
import { PerksBanner } from './components/PerksBanner';

export const revalidate = 60;

const FEATURED_COLLECTIONS = [
  { title: 'Gaming Laptops', handle: 'gaming-laptops' },
  { title: 'Datorkomponenter', handle: 'datorkomponenter' },
  { title: 'Gaming Setup', handle: 'gaming-setup' },
]


async function fetchProductsFromAPI() {
  try {
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';
    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&region_id=${regionId}&fields=*variants.prices,*variants.inventory_quantity,*collection,+metadata,*options,*options.values`,
      {
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': publishableKey },
        cache: 'no-store',
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    const products = data.products || [];

    function parseMeta(val: any): any[] {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
      return [];
    }

    return products.map((product: any) => {
      let imageUrl = product.images?.[0]?.url || product.thumbnail || '';
      imageUrl = imageUrl.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://');
      let price = 0;
      if (product.variants?.[0]?.calculated_price?.calculated_amount !== undefined) {
        price = product.variants[0].calculated_price.calculated_amount;
      } else if (product.variants?.[0]?.prices?.[0]?.amount) {
        price = product.variants[0].prices[0].amount;
      }
      const collectionTitle = product.collection?.title || '';
      const collectionHandle = product.collection?.handle || '';
      let sectionCategory = '';
      if (collectionTitle === 'Populära produkter' || collectionHandle === 'populara-produkter') sectionCategory = 'populär';
      else if (collectionTitle === 'Rekommenderade produkter' || collectionHandle === 'rekommenderade-produkter') sectionCategory = 'rekommenderad';
      else if (collectionTitle === 'Nya produkter' || collectionHandle === 'nya-produkter') sectionCategory = 'ny';
      else if (collectionTitle === 'Du kanske också gillar' || collectionHandle === 'du-kanske-ocksa-gillar') sectionCategory = 'också-gillar';
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        price,
        image: imageUrl,
        images: product.images?.map((img: any) => img.url.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://')) || [],
        colors: product.options?.find((o: any) => o.title?.toLowerCase() === 'color' || o.title?.toLowerCase() === 'färg')?.values?.map((v: any) => v.value) || parseMeta(product.metadata?.colors),
        stock: (() => { const manages = product.variants?.some((v: any) => v.manage_inventory); if (!manages) return 'I lager'; const qty = product.variants?.reduce((s: number, v: any) => s + (v.inventory_quantity || 0), 0) || 0; return qty > 0 ? 'I lager' : 'Slut i lager'; })(),
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        features: parseMeta(product.metadata?.features),
        brand: product.brand || '',
        isNew: product.isNew || false,
        sectionCategory,
        category: collectionTitle,
        description: product.description || '',
      };
    });
  } catch (error) {
    return [];
  }
}




export default async function Home() {
  const products = await fetchProductsFromAPI();

  const getProductsBySection = (section: 'populär' | 'rekommenderad' | 'ny', allProducts: any[]) => {
    return allProducts.filter((p: any) => p.sectionCategory === section);
  };

  const popularProducts = getProductsBySection('populär', products);
  const recommendedProducts = getProductsBySection('rekommenderad', products);
  const newProducts = getProductsBySection('ny', products);

  return (
    <div className="relative">
      <MainLayout bordered={true} noPadding={true}>
        <div className="flex flex-col gap-4 pt-0">
          <div className="-mx-0 sm:-mx-6 -mb-4">
            <HeroCarouselClient collections={FEATURED_COLLECTIONS} />
          </div>
          {products.length > 0 && (
            <>
              <ProductCarousel title="Populära produkter" products={products} variant="popular" />
              <AboutBanner />
              <ProductCarousel title="Rekommenderade produkter" products={products} variant="recommended" />
              <LimitedTimeBanner />
              <ProductCarousel title="Nya produkter" products={products} variant="new" />
            </>
          )}
          {products.length === 0 && (
            <div className="px-6 text-center py-12">
              <p className="text-gray-600">Inga produkter tillgängliga just nu.</p>
            </div>
          )}
          <PerksBanner />
        </div>
      </MainLayout>
      <div className="fixed bottom-4 right-4 z-50">
        <NewsletterPopup />
      </div>
    </div>
  );
}
