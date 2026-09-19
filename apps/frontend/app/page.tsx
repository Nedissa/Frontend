import Link from 'next/link';
import { ProductCarousel } from './components/product/ProductCarousel';
import { AboutBanner } from './components/home/AboutBanner';
import { FeaturedProductSection } from './components/home/FeaturedProductSection';
import { MainLayout } from './components/layout/MainLayout';
import { NewsletterPopup } from './components/home/NewsletterPopup';
import { HeroBanner } from './components/home/HeroBanner';
import { LimitedTimeBanner } from './components/home/LimitedTimeBanner';
import { BottomBanner } from './components/home/BottomBanner';
import { HomeCategoryGrid } from './components/home/HomeCategoryGrid';

export const revalidate = 60;

const FEATURED_COLLECTIONS = [
  { title: 'Smart hem', handle: 'gaming-laptops' },
  { title: 'TV & streaming', handle: 'datorkomponenter' },
  { title: 'Ljud & hörlurar', handle: 'gaming-setup' },
]


async function fetchProductsFromAPI() {
  try {
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&region_id=${regionId}&fields=id,title,handle,description,*images,thumbnail,brand,isNew,created_at,*variants.prices,*variants.inventory_quantity,*collection,options.title,options.values.value,+metadata`,
      {
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': publishableKey },
        next: { revalidate: 60 },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);
    if (!response.ok) return [];
    const buffer = await response.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    const products = data.products || [];

    // Hämta ratings
    let reviewsByProduct: Record<string, { avg: number; count: number }> = {};
    try {
      const ratingsRes = await fetch(`${medusaUrl}/store/reviews/summary`, {
        headers: { 'x-publishable-api-key': publishableKey },
        next: { revalidate: 60 },
      });
      if (ratingsRes.ok) {
        const ratingsData = await ratingsRes.json();
        reviewsByProduct = ratingsData.ratings || {};
      }
    } catch {}

    function parseMeta(val: any): any[] {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
      return [];
    }

    const fixImageUrl = (url: string) =>
      url.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://');

    return products.map((product: any) => {
      let imageUrl = product.images?.[0]?.url || product.thumbnail || '';
      imageUrl = fixImageUrl(imageUrl);
      let price = 0;
      const sekVariant = product.variants?.find((v: any) => v.prices?.some((p: any) => p.currency_code === 'sek')) || product.variants?.[0];
      if (sekVariant?.calculated_price?.calculated_amount !== undefined) {
        price = sekVariant.calculated_price.calculated_amount;
      } else {
        const sekPrice = sekVariant?.prices?.find((p: any) => p.currency_code === 'sek');
        price = sekPrice?.amount || sekVariant?.prices?.[0]?.amount || 0;
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
        variantId: sekVariant?.id || '',
        title: product.title,
        handle: product.handle,
        price,
        image: imageUrl,
        images: product.images?.map((img: any) => img.url.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se').replace(/^http:\/\//, 'https://')) || [],
        colors: product.options?.find((o: any) => o.title?.toLowerCase() === 'color' || o.title?.toLowerCase() === 'färg')?.values?.map((v: any) => v.value) || parseMeta(product.metadata?.colors),
        stock: (() => { const manages = product.variants?.some((v: any) => v.manage_inventory); if (!manages) return 'I lager'; const qty = product.variants?.reduce((s: number, v: any) => s + (v.inventory_quantity || 0), 0) || 0; return qty > 0 ? 'I lager' : 'Slut i lager'; })(),
        rating: reviewsByProduct[product.id]?.avg || 0,
        reviews: reviewsByProduct[product.id]?.count || 0,
        features: (() => {
          const explicit = parseMeta(product.metadata?.features);
          if (explicit.length > 0) return explicit;
          const specs = parseMeta(product.metadata?.specifications);
          const short = specs.filter((s: any) => s.value.length <= 15);
          return short.slice(0, 3).map((s: any) => `${s.value}|${s.label}`);
        })(),
        brand: product.brand || product.metadata?.brand || product.title?.split(' ')[0] || '',
        isNew: product.isNew || false,
        created_at: product.created_at || '',
        sectionCategory,
        category: collectionTitle,
        description: product.description || '',
        metadata: {
          specifications: parseMeta(product.metadata?.specifications),
          contents: parseMeta(product.metadata?.contents),
          colorMap: product.metadata?.colorMap || null,
          imageMap: product.metadata?.imageMap
            ? Object.fromEntries(Object.entries(product.metadata.imageMap).map(([color, url]) => [color, fixImageUrl(url as string)]))
            : null,
        },
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

  const popularFiltered = getProductsBySection('populär', products);
  const popularProducts = popularFiltered.length >= 3 ? popularFiltered : products;
  const recommendedFiltered = products.filter((p: any) => p.originalPrice && p.originalPrice > p.price);
  const recommendedProducts = recommendedFiltered.length >= 3 ? recommendedFiltered : products;
  const newProducts = [...products].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 8);

  return (
    <div className="relative flex flex-col w-full">
      <HeroBanner collections={FEATURED_COLLECTIONS} />
      <MainLayout bordered={true} noPadding={true}>
        <div className="flex flex-col gap-4 pt-0">
          <HomeCategoryGrid />
          {products.length > 0 && (
            <>
              <ProductCarousel title="Populära produkter" products={popularProducts} variant="popular" />
              <AboutBanner />
              <ProductCarousel title="Rekommenderade produkter" products={recommendedProducts} variant="recommended" />
              <LimitedTimeBanner />
              <ProductCarousel title="Nya produkter" products={newProducts.length > 0 ? newProducts : products} variant="new" />
            </>
          )}
          {products.length === 0 && (
            <div className="px-6 text-center py-12">
              <p className="text-gray-600">Inga produkter tillgängliga just nu.</p>
            </div>
          )}
          <BottomBanner />
          <ProductCarousel title="Relaterade produkter" products={products} variant="related" />
        </div>
      </MainLayout>
      <div className="fixed bottom-4 left-4 right-4 md:bottom-4 md:left-4 md:right-auto z-50">
        <NewsletterPopup />
      </div>
    </div>
  );
}
