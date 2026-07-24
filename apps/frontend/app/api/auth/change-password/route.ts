const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return Response.json({ error: 'Serverkonfigurationsfel' }, { status: 500 });
    }

    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/medusa_token=([^;]+)/);
    const sessionToken = tokenMatch ? tokenMatch[1] : null;

    if (!sessionToken) {
      return Response.json({ error: 'Inte inloggad' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ error: 'Nuvarande och nytt lösenord krävs' }, { status: 400 });
    }

    // Hämta kundens e-post för att verifiera gamla lösenordet
    const meRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'x-publishable-api-key': publishableKey,
      },
    });

    if (!meRes.ok) {
      return Response.json({ error: 'Inte inloggad' }, { status: 401 });
    }

    const meData = await meRes.json();
    const email = meData.customer?.email || meData.email;

    if (!email) {
      return Response.json({ error: 'Kunde inte hämta e-postadress' }, { status: 500 });
    }

    // Verifiera nuvarande lösenord
    const verifyRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey,
      },
      body: JSON.stringify({ email, password: currentPassword }),
    });

    if (!verifyRes.ok) {
      return Response.json({ error: 'Fel nuvarande lösenord' }, { status: 400 });
    }

    const verifyData = await verifyRes.json();
    const verifyToken = verifyData.token;

    // Uppdatera lösenordet
    const updateRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${verifyToken}`,
        'x-publishable-api-key': publishableKey,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!updateRes.ok) {
      return Response.json({ error: 'Kunde inte byta lösenord' }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internt serverfel' }, { status: 500 });
  }
}
