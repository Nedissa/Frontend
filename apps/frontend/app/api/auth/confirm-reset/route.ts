const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json({ error: 'Token och lösenord krävs' }, { status: 400 });
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    const response = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': publishableKey!,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      return Response.json({ error: 'Ogiltig eller utgången länk' }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Internt serverfel' }, { status: 500 });
  }
}
