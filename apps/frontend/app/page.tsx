import Link from 'next/link';
import { ProductCarousel } from './components/ProductCarousel';
import { ProductBanner } from './components/ProductBanner';
import { FeaturedProductSection } from './components/FeaturedProductSection';
import { MainLayout } from './components/MainLayout';
import { NewsletterPopup } from './components/NewsletterPopup';
import { HeroCarouselClient } from './components/HeroCarouselClient';

export const revalidate = 60;

const FEATURED_COLLECTIONS = [
  { title: 'Gaming Laptops', handle: 'gaming-laptops' },
  { title: 'Datorkomponenter', handle: 'datorkomponenter' },
  { title: 'Gaming Setup', handle: 'gaming-setup' },
]

function CampaignBannersSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <CampaignBanner title="Se alla veckans deals" bgColor="bg-blue-900" />
      <CampaignBanner title="Samsung Micro RGB" bgColor="bg-black" />
      <CampaignBanner title="Vi tömmer lagret!" bgColor="bg-blue-900" />
      <CampaignBanner title="50% rabatt på kök!" bgColor="bg-green-100" />
    </div>
  );
}

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


function CampaignBanner({
  title,
  bgColor,
}: {
  title: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} p-6 h-32 flex items-end justify-start overflow-hidden relative`} style={{}}>
      <h3 className={`text-xl font-bold ${bgColor === 'bg-green-100' ? 'text-green-700' : 'text-white'}`}>
        {title}
      </h3>
    </div>
  );
}

function CallToAction() {
  return (
    <div className="flex justify-center">
      <div className="max-w-[1280px] w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6">
        <h2 className="text-4xl font-bold mb-4">Är du redo att uppgradera?</h2>
        <p className="text-xl mb-8 max-w-2xl">
          Hitta de bästa datorerna, komponenterna och tillbehöret. Snabb leverans och utmärkt kundsupport.
        </p>
        <Link href="/produkter" className="inline-block bg-white text-gray-900 px-8 py-3 rounded font-bold hover:bg-gray-100">
          Börja shoppa nu →
        </Link>
      </div>
    </div>
  );
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
        <div className="flex flex-col gap-4">
          <div className="-mx-6">
            <HeroCarouselClient collections={FEATURED_COLLECTIONS} />
          </div>
          {products.length > 0 && (
            <>
              <ProductCarousel title="Populära produkter" products={products} variant="popular" />
              <div className="px-6">
                <ProductBanner />
              </div>
              <ProductCarousel title="Rekommenderade produkter" products={products} variant="recommended" />
              <ProductCarousel title="Nya produkter" products={products} variant="new" />
            </>
          )}
          {products.length === 0 && (
            <div className="px-6 text-center py-12">
              <p className="text-gray-600">Inga produkter tillgängliga just nu.</p>
            </div>
          )}
          <div className="-mx-6">
            <CallToAction />
          </div>
        </div>
      </MainLayout>
      <div className="fixed bottom-4 right-4 z-50">
        <NewsletterPopup />
      </div>
    </div>
  );
}
