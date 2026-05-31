export interface Product {
  id: string;
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://techpilots.vercel.app';
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return [];
    }

    const data = await response.json();
    cachedProducts = data.products || [];
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
