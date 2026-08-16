const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideSlug = searchParams.get('guide_slug');

  if (!guideSlug) {
    return Response.json({ error: 'guide_slug krävs' }, { status: 400 });
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const response = await fetch(`${MEDUSA_URL}/store/guide-questions?guide_slug=${guideSlug}`, {
    headers: { 'x-publishable-api-key': publishableKey || '' },
  });

  const data = await response.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  const body = await request.json();

  const response = await fetch(`${MEDUSA_URL}/store/guide-questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': publishableKey || '',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
