import Link from 'next/link';
import { ProductCard } from './components/ProductCard';
import { ProductBanner } from './components/ProductBanner';
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.products || [];
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
              <div className="px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Populära produkter</h2>
                <div className="grid grid-cols-4 gap-6 py-6">
                  {(popularProducts.length > 0 ? popularProducts : products.slice(0, 4)).map((product: any, idx: number) => (
                    <ProductCard key={product.id} product={product} variant="popular" priority={idx < 4} />
                  ))}
                </div>
              </div>
              <div className="px-6">
                <ProductBanner />
              </div>
              <div className="px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rekommenderade produkter</h2>
                <div className="grid grid-cols-4 gap-6 py-6">
                  {(recommendedProducts.length > 0 ? recommendedProducts : products.slice(4, 8)).map((product: any) => (
                    <ProductCard key={product.id} product={product} variant="recommended" />
                  ))}
                </div>
              </div>
              <div className="px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nya produkter</h2>
                <div className="grid grid-cols-4 gap-6 py-6">
                  {(newProducts.length > 0 ? newProducts : products.slice(8, 12)).map((product: any) => (
                    <ProductCard key={product.id} product={product} variant="new" />
                  ))}
                </div>
              </div>
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
