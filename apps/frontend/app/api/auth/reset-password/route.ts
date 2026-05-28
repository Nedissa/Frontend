const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    const response = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey!,
      },
      body: JSON.stringify({ identifier: email }),
    });

    // Returnera alltid OK för att inte avslöja om e-posten finns
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: true });
  }
}
