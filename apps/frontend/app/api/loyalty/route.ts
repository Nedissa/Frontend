const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function GET(request: Request) {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return Response.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${MEDUSA_URL}/store/customers/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableKey,
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch customer data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const customer = data.customer || data;
    const loyalty = customer.metadata?.loyalty || {
      current_tier: 'Silver',
      total_points: 0,
      points_to_next_tier: 500,
      lifetime_orders: 0,
      lifetime_spend: 0,
      benefits: ['Fri frakt på beställningar över 699 kr', 'Medlemsexklusiv rabatt'],
      member_since: new Date().toISOString(),
    };

    return Response.json({ loyalty });
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return Response.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }

    const { points } = await request.json();

    if (points === undefined) {
      return Response.json(
        { error: 'Missing points value' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${MEDUSA_URL}/store/customers/me`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableKey,
        },
        body: JSON.stringify({
          metadata: {
            loyalty: {
              total_points: points,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to update loyalty points' },
        { status: response.status }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
