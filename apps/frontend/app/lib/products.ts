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
  categoryHandles?: string[];
  categoryNames?: string[];
  sectionCategory?: string;
  metadata?: Record<string, any> | null;
}

// Enda källan för kategori-/menystruktur är MENU_DATA (Header/menuData.tsx).
// Funktionerna nedan slår upp i det trädet istället för att duplicera det
// i egna kategori-tabeller, så meny, kategorisidor och brödsmulor aldrig
// kan komma ur synk med varandra.
import { MENU_DATA, MenuCategory, MenuSection, MenuItem } from '@/app/components/Header/menuData';

export interface CategoryTrailNode {
  slug: string;
  title: string;
}

// Hittar hela kedjan (huvudkategori -> ... -> träffad nod) för en given
// URL-slug (t.ex. "blackpatroner" från "/kategori/blackpatroner"), genom att
// leta i url-fältet på varje nivå i MENU_DATA.
export function findCategoryTrail(slug: string): CategoryTrailNode[] | null {
  const targetUrl = `/kategori/${slug}`;

  for (const main of MENU_DATA) {
    if (main.url === targetUrl) {
      return [{ slug, title: main.title }];
    }
    for (const section of main.items || []) {
      if (section.url === targetUrl) {
        return [
          { slug: main.url.replace('/kategori/', ''), title: main.title },
          { slug, title: section.title },
        ];
      }
      for (const item of section.items || []) {
        if (item.url === targetUrl) {
          return [
            { slug: main.url.replace('/kategori/', ''), title: main.title },
            { slug: section.url.replace('/kategori/', ''), title: section.title },
            { slug, title: item.title },
          ];
        }
      }
    }
  }
  return null;
}

// Samlar in categoryHandles för en menynod och alla dess undernoder,
// så en klick på en huvudkategori visar produkter från alla underkategorier.
function collectCategoryHandles(node: MenuCategory | MenuSection | MenuItem): string[] {
  const handles = [...(node.categoryHandles || [])];
  for (const child of node.items || []) {
    handles.push(...collectCategoryHandles(child));
  }
  return handles;
}

// Hittar den Medusa-kategori-handle-listan som hör till en given URL-slug,
// genom att leta upp noden i MENU_DATA och samla ihop dess (och dess barns)
// categoryHandles.
export function getCategoryHandlesForSlug(slug: string): string[] {
  const targetUrl = `/kategori/${slug}`;

  for (const main of MENU_DATA) {
    if (main.url === targetUrl) return collectCategoryHandles(main);
    for (const section of main.items || []) {
      if (section.url === targetUrl) return collectCategoryHandles(section);
      for (const item of section.items || []) {
        if (item.url === targetUrl) return collectCategoryHandles(item);
      }
    }
  }
  return [];
}

export function getCategoryTitle(slug: string): string {
  const trail = findCategoryTrail(slug);
  if (trail) return trail[trail.length - 1].title;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

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

// Slår upp rätt kategori-slug (djupaste matchande menynivå) utifrån
// produktens faktiska Medusa-kategori-handles, för brödsmula/länkning.
export function getBreadcrumbSlugFromCategoryHandles(categoryHandles: string[]): string | null {
  type Match = { slug: string; depth: number };
  let bestMatch: Match | null = null;

  const visit = (node: MenuCategory | MenuSection | MenuItem, depth: number) => {
    const slug = node.url.replace('/kategori/', '');
    if ((node.categoryHandles || []).some((h) => categoryHandles.includes(h))) {
      if (!bestMatch || depth > (bestMatch as Match).depth) bestMatch = { slug, depth };
    }
    for (const child of node.items || []) visit(child, depth + 1);
  };

  for (const main of MENU_DATA) visit(main, 0);
  return bestMatch ? (bestMatch as Match).slug : null;
}

// Brödsmule-data för en kategorisida, byggd direkt från MENU_DATA-trädet.
export function getBreadcrumbTrail(slug: string) {
  const trail = findCategoryTrail(slug);
  if (!trail) return null;

  if (trail.length === 1) {
    return {
      mainCategorySlug: trail[0].slug,
      mainCategoryTitle: trail[0].title,
      subcategorySlug: '',
      subcategoryTitle: '',
    };
  }
  if (trail.length === 2) {
    return {
      mainCategorySlug: trail[0].slug,
      mainCategoryTitle: trail[0].title,
      subcategorySlug: trail[1].slug,
      subcategoryTitle: trail[1].title,
    };
  }
  return {
    mainCategorySlug: trail[0].slug,
    mainCategoryTitle: trail[0].title,
    subcategorySlug: trail[1].slug,
    subcategoryTitle: trail[1].title,
    seriesSlug: trail[2].slug,
    seriesTitle: trail[2].title,
  };
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await fetchProductsFromMedusa();
  return products.find(product => product.handle === handle);
}

// TILLFÄLLIG DUMMY DATA för visuell test — ta bort när riktiga tillbehör finns i Medusa
function getDummyAccessories(fallbackImage: string): Product[] {
  return [
    { id: 'dummy-1', title: 'CPU-kylare Dark Rock 6', handle: '#', price: 899, image: 'https://api.techpilots.se/static/1780865499247-5325871_1dwxx4.webp' } as any,
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
