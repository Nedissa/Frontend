const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const CATEGORY_TO_HANDLE: Record<string, string> = {
  grafikkort: 'grafikkort-tillbehor',
  'stationär-dator': 'stationardator-tillbehor',
  kylare: 'kylare-tillbehor',
  laptop: 'laptop-tillbehor',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const handle = category ? CATEGORY_TO_HANDLE[category] : null;
  if (!handle) return Response.json({ accessories: [] }, { status: 400 });

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const catRes = await fetch(
    `${MEDUSA_URL}/store/product-categories?handle=${handle}&limit=1`,
    { headers: { 'x-publishable-api-key': publishableKey || '' } }
  );
  if (!catRes.ok) return Response.json({ accessories: [] });

  const catData = await catRes.json();
  const cat = catData.product_categories?.[0];
  if (!cat) return Response.json({ accessories: [] });

  const productsRes = await fetch(
    `${MEDUSA_URL}/store/products?category_id[]=${cat.id}&limit=8`,
    { headers: { 'x-publishable-api-key': publishableKey || '' } }
  );
  if (!productsRes.ok) return Response.json({ accessories: [] });

  const data = await productsRes.json();
  const accessories = (data.products || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    brand: p.metadata?.brand || '',
    price: p.variants?.[0]?.calculated_price?.calculated_amount ?? p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    image: p.thumbnail || p.images?.[0]?.url || '',
    stock: p.variants?.[0]?.inventory_quantity > 0 ? 'I lager' : 'Slut i lager',
    metadata: p.metadata || {},
  }));

  return Response.json({ accessories });
}
