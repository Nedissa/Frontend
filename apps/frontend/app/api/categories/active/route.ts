// Returnerar handles för kategorier som har minst en produkt, så menyn kan
// dölja tomma kategorier istället för att länka till en tom sida.
export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

    if (!publishableKey) {
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(
      `${medusaUrl}/store/products?limit=200&region_id=${regionId}&fields=id,*categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
          'x-publishable-api-key': publishableKey,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch from Medusa' }, { status: response.status });
    }

    const data = await response.json();
    const products = data.products || [];

    const activeHandles = new Set<string>();
    for (const product of products) {
      for (const category of product.categories || []) {
        if (category.handle) activeHandles.add(category.handle);
      }
    }

    return Response.json({ activeHandles: Array.from(activeHandles) });
  } catch (error) {
    return Response.json({ activeHandles: [] });
  }
}
