export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  price?: number;
  description?: string;
  images?: Array<{ url: string }>;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  category?: string;
  brand?: string;
  sectionCategory?: string;
}

let productsCache: { data: Product[]; ts: number } | null = null;

export async function fetchProductsFromMedusa(): Promise<Product[]> {
  if (productsCache && Date.now() - productsCache.ts < 60_000) {
    return productsCache.data;
  }
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch products from API:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      console.error('Invalid response format from API:', data);
      return [];
    }
    const result = data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle || product.title.toLowerCase().replace(/\s+/g, '-'),
      price: product.price || 0,
      originalPrice: product.originalPrice,
      image: product.image || product.images?.[0] || '/assets/placeholder.webp',
      images: (Array.isArray(product.images) && product.images.length > 0) ? product.images : [],
      colors: product.colors || [],
      sectionCategory: product.sectionCategory || '',
      description: product.description || '',
      stock: product.stock || 'I lager',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      category: product.category || '',
      brand: product.brand || '',
    }));
    productsCache = { data: result, ts: Date.now() };
    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/products?handle=${handle}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return null;
    }

    const product = data.products[0];
    return {
      id: product.id,
      title: product.title,
      handle: product.handle || product.title.toLowerCase().replace(/\s+/g, '-'),
      price: product.price || 0,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || '/assets/placeholder.webp',
      images: product.images?.map((img: { url: string }) => img.url) || [],
      rating: 4.5,
      reviews: 0,
      category: 'General',
      brand: 'Brand',
    };
  } catch (error) {
    console.error('Error fetching product from Medusa:', error);
    return null;
  }
}
