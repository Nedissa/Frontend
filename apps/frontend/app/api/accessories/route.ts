const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const CATEGORY_TO_COLLECTION: Record<string, string> = {
  grafikkort: 'grafikkort-tillbehor',
  'stationär-dator': 'stationardator-tillbehor',
  kylare: 'kylare-tillbehor',
  laptop: 'laptop-tillbehor',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionHandle = searchParams.get('collection');
  const category = searchParams.get('category');

  const handle = collectionHandle || (category ? CATEGORY_TO_COLLECTION[category] : null);

  if (!handle) {
    return Response.json({ accessories: [] }, { status: 400 });
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const collectionRes = await fetch(
    `${MEDUSA_URL}/store/collections?handle=${handle}&limit=1`,
    { headers: { 'x-publishable-api-key': publishableKey || '' } }
  );

  if (!collectionRes.ok) return Response.json({ accessories: [] });

  const collectionData = await collectionRes.json();
  const collection = collectionData.collections?.[0];
  if (!collection) return Response.json({ accessories: [] });

  const productsRes = await fetch(
    `${MEDUSA_URL}/store/products?collection_id[]=${collection.id}&limit=8`,
    { headers: { 'x-publishable-api-key': publishableKey || '' } }
  );

  if (!productsRes.ok) return Response.json({ accessories: [] });

  const data = await productsRes.json();
  const products = data.products || [];

  const accessories = products.map((p: any) => ({
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
