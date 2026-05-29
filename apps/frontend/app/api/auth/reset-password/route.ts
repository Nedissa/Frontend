const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    // Hämta reset-token från Medusa
    const response = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey!,
      },
      body: JSON.stringify({ identifier: email }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      if (token) {
        // Skicka mailet via backend
        await fetch(`${MEDUSA_URL}/store/send-reset-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': publishableKey!,
          },
          body: JSON.stringify({ email, token }),
        });
      }
    }

    // Returnera alltid OK för att inte avslöja om e-posten finns
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: true });
  }
}
