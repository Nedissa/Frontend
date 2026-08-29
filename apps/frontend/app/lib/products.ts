export interface Product {
  id: string;
  variantId?: string;
  title: string;
  handle: string;
  price: number;
  originalPrice?: number;
  description?: string;
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
  metadata?: Record<string, any> | null;
}

export const MAIN_CATEGORIES: Record<string, string> = {
  'datorer-tillbehor': 'Datorer & Tillbehör',
  'datorkomponenter': 'Datorkomponenter',
  'gaming': 'Gaming',
  'mobiltelefoner': 'Mobiltelefoner',
  'natwerk': 'Nätverk',
  'natverk': 'Nätverk',
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

async function fetchProductsFromMedusa(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return [];
    }

    const data = await response.json();
    return (data.products || []) as Product[];
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

// TILLFÄLLIG DUMMY DATA för visuell test — ta bort när riktiga tillbehör finns i Medusa
function getDummyAccessories(fallbackImage: string): Product[] {
  return [
    { id: 'dummy-1', title: 'Nätaggregat 850W 80+ Gold', handle: '#', price: 1290, image: fallbackImage } as any,
    { id: 'dummy-2', title: 'CPU-kylare Dark Rock 6', handle: '#', price: 899, image: fallbackImage } as any,
  ];
}

export async function getAccessories(categorySlug: string, fallbackImage: string = ''): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/accessories?category=${categorySlug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return getDummyAccessories(fallbackImage);

    const data = await response.json();
    const accessories = (data.accessories || []) as Product[];
    return accessories.length > 0 ? accessories : getDummyAccessories(fallbackImage);
  } catch (error) {
    console.error('Error fetching accessories:', error);
  }
  return getDummyAccessories(fallbackImage);
}

export async function getReviewStats(productId: string): Promise<{ avg: number; count: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/reviews?product_id=${productId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return { avg: 0, count: 0 };

    const data = await response.json();
    const reviews = data.reviews || [];
    if (reviews.length === 0) return { avg: 0, count: 0 };

    const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;
    return { avg, count: reviews.length };
  } catch (error) {
    console.error('Error fetching review stats:', error);
  }
  return { avg: 0, count: 0 };
}

export async function getQuestionCount(productId: string): Promise<number> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/questions?product_id=${productId}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return 0;

    const data = await response.json();
    return (data.questions || []).length;
  } catch (error) {
    console.error('Error fetching question count:', error);
  }
  return 0;
}
