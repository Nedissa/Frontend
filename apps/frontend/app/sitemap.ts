import { MetadataRoute } from 'next';

const BASE_URL = 'https://techpilots.se';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/produkter`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/om-oss`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kundservice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/pilotbloggen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/integritetspolicy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const res = await fetch(`${medusaUrl}/store/products?limit=200&fields=handle`, {
      headers: { 'x-publishable-api-key': publishableKey },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const productPages: MetadataRoute.Sitemap = (data.products || []).map((p: any) => ({
        url: `${BASE_URL}/produkter/${p.handle}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      return [...staticPages, ...productPages];
    }
  } catch {}

  return staticPages;
}
