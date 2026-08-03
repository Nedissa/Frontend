const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return Response.json({ accessories: [] }, { status: 400 });
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const response = await fetch(
    `${MEDUSA_URL}/store/products?metadata[accessory_for]=${productId}&limit=8`,
    { headers: { 'x-publishable-api-key': publishableKey || '' } }
  );

  if (!response.ok) {
    return Response.json({ accessories: [] });
  }

  const data = await response.json();
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
