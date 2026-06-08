const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return Response.json({ has_purchased: false }, { status: 400 });
  }

  const cookies = request.headers.get('cookie') || '';
  const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return Response.json({ has_purchased: false });
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const response = await fetch(`${MEDUSA_URL}/store/reviews/check?product_id=${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': publishableKey || '',
    },
  });

  if (!response.ok) {
    return Response.json({ has_purchased: false });
  }

  const data = await response.json();
  return Response.json(data);
}
