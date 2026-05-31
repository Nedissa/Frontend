export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  originalPrice?: number;
  brand?: string;
  discount?: string;
  discountPercent?: number;
  rating?: number;
  reviews?: number;
  image: string;
  images?: string[];
  colors?: string[];
  stock?: string;
  features?: string[];
  isNew?: boolean;
  category?: string;
  sectionCategory?: string;
}

export const MAIN_CATEGORIES: Record<string, string> = {
  'datorer-tillbehor': 'Datorer & Tillbehör',
  'datorkomponenter': 'Datorkomponenter',
  'gaming': 'Gaming',
  'mobiltelefoner': 'Mobiltelefoner',
  'natwerk': 'Nätverk',
  'tv-hifi': 'TV & HiFi',
};

export const SUBCATEGORIES: Record<string, { title: string; mainCategory: string }> = {
  'laptops': { title: 'Bärbara datorer', mainCategory: 'datorer-tillbehor' },
  'desktops': { title: 'Stationära Datorer', mainCategory: 'datorer-tillbehor' },
  'accessories': { title: 'Datortillbehör', mainCategory: 'datorer-tillbehor' },
  'components': { title: 'Komponenter', mainCategory: 'datorkomponenter' },
  'gaming-laptops': { title: 'Gaming Bärbara datorer', mainCategory: 'gaming' },
  'gaming-pc': { title: 'Gaming Stationär dator', mainCategory: 'gaming' },
  'phones': { title: 'Mobiltelefoner', mainCategory: 'mobiltelefoner' },
  'ultrabooks': { title: 'Ultrabooks', mainCategory: 'laptops' },
};

export const PRODUCT_SERIES: Record<string, { title: string; parentCategory: string }> = {
  'ultrabooks': { title: 'Ultrabooks', parentCategory: 'laptops' },
  'gaming-laptops-gaming': { title: 'Gaming bärbara', parentCategory: 'gaming-laptops' },
  'kontor': { title: 'Kontor', parentCategory: 'laptops' },
};

export const CATEGORY_TITLES: Record<string, string> = {
  'laptops': 'Bärbara datorer',
  'desktops': 'Stationära Datorer',
  'accessories': 'Datortillbehör',
  'components': 'Komponenter',
  'gaming-laptops': 'Gaming Bärbara datorer',
  'gaming-pc': 'Gaming Stationär dator',
  'phones': 'Mobiltelefoner',
  'ultrabooks': 'Ultrabooks',
};

let cachedProducts: Product[] | null = null;

async function fetchProductsFromMedusa(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts;

  try {
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&region_id=${regionId}&fields=*variants.prices,*collection`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch products from Medusa:', response.status);
      return [];
    }

    const data = await response.json();
    const products = data.products || [];

    cachedProducts = products.map((product: any) => {
      let imageUrl = product.images?.[0]?.url || product.thumbnail || '';
      imageUrl = imageUrl.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se');

      let price = 0;
      if (product.variants?.[0]?.calculated_price?.calculated_amount !== undefined) {
        price = product.variants[0].calculated_price.calculated_amount;
      } else if (product.variants?.[0]?.prices?.[0]?.amount) {
        price = product.variants[0].prices[0].amount;
      }

      const collectionHandle = product.collection?.handle || '';
      const collectionTitle = product.collection?.title || '';
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
        images: (product.images?.map((img: any) => img.url?.replace(/^http:\/\/localhost:9000/, 'https://api.techpilots.se') || '') || []).slice(0, 3),
        description: product.description || '',
        brand: product.brand || '',
        stock: product.stock || 'I lager',
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        features: product.features || [],
        isNew: product.isNew || false,
        sectionCategory,
        category: collectionTitle,
      };
    });

    return cachedProducts as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  return [];
}

export function getBreadcrumbTrail(slug: string) {
  const productSeries = PRODUCT_SERIES[slug];
  if (productSeries) {
    const parentSubcategory = SUBCATEGORIES[productSeries.parentCategory];
    if (parentSubcategory) {
      const mainCategory = MAIN_CATEGORIES[parentSubcategory.mainCategory];
      return {
        mainCategorySlug: parentSubcategory.mainCategory,
        mainCategoryTitle: mainCategory,
        subcategorySlug: productSeries.parentCategory,
        subcategoryTitle: parentSubcategory.title,
        seriesSlug: slug,
        seriesTitle: productSeries.title,
      };
    }
  }

  const subcategory = SUBCATEGORIES[slug];
  if (subcategory) {
    const mainCategory = MAIN_CATEGORIES[subcategory.mainCategory];
    return {
      mainCategorySlug: subcategory.mainCategory,
      mainCategoryTitle: mainCategory,
      subcategorySlug: slug,
      subcategoryTitle: subcategory.title,
    };
  }

  return null;
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await fetchProductsFromMedusa();
  return products.find(product => product.handle === handle);
}

export function getCategoryTitle(slug: string): string {
  return CATEGORY_TITLES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}
