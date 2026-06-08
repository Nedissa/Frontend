const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return Response.json({ error: 'product_id krävs' }, { status: 400 });
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const response = await fetch(`${MEDUSA_URL}/store/reviews?product_id=${productId}`, {
    headers: { 'x-publishable-api-key': publishableKey || '' },
  });

  const data = await response.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  const cookies = request.headers.get('cookie') || '';
  const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return Response.json({ error: 'Du måste vara inloggad' }, { status: 401 });
  }

  const body = await request.json();

  const response = await fetch(`${MEDUSA_URL}/store/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': publishableKey || '',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
