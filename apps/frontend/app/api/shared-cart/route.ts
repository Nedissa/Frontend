const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const res = await fetch(`${MEDUSA_URL}/store/shared-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (!res.ok) return Response.json({ error: data.error }, { status: res.status });
    return Response.json({ id: data.id });
  } catch {
    return Response.json({ error: 'Kunde inte dela korgen' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return Response.json({ error: 'id krävs' }, { status: 400 });

    const res = await fetch(`${MEDUSA_URL}/store/shared-cart?id=${id}`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY },
    });

    const data = await res.json();

    if (!res.ok) return Response.json({ error: data.error }, { status: res.status });
    return Response.json({ items: data.items });
  } catch {
    return Response.json({ error: 'Kunde inte hämta korgen' }, { status: 500 });
  }
}
