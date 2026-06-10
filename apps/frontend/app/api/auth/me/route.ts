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
          'x-publishable-api-key': publishableKey as string,
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await response.json();

    return Response.json({
      customer: {
        id: customer.customer?.id || customer.id,
        first_name: customer.customer?.first_name || customer.first_name,
        last_name: customer.customer?.last_name || customer.last_name,
        email: customer.customer?.email || customer.email,
        phone: customer.customer?.phone || customer.phone,
      },
    });
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

    const { firstName, lastName, phone } = await request.json();

    const updateData: any = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phone !== undefined) updateData.phone = phone;

    const response = await fetch(
      `${MEDUSA_URL}/store/customers/me`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableKey as string,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to update profile' },
        { status: response.status }
      );
    }

    const customer = await response.json();

    return Response.json({
      customer: {
        id: customer.customer?.id || customer.id,
        first_name: customer.customer?.first_name || customer.first_name,
        last_name: customer.customer?.last_name || customer.last_name,
        email: customer.customer?.email || customer.email,
        phone: customer.customer?.phone || customer.phone,
      },
    });
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
