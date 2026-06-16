const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'E-postadress och lösenord krävs' },
        { status: 400 }
      );
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return Response.json(
        { error: 'Serverkonfigurationsfel' },
        { status: 500 }
      );
    }

    // Authenticate with Medusa
    const authResponse = await fetch(
      `${MEDUSA_URL}/auth/customer/emailpass`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey as string,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!authResponse.ok) {
      return Response.json(
        { error: 'E-postadressen eller lösenordet är felaktigt' },
        { status: 401 }
      );
    }

    const authData = await authResponse.json();
    const token = authData.token;

    if (!token) {
      return Response.json(
        { error: 'Inloggningen misslyckades' },
        { status: 401 }
      );
    }

    // Get customer profile using the token
    const customerResponse = await fetch(
      `${MEDUSA_URL}/store/customers/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': publishableKey,
        },
      }
    );

    if (!customerResponse.ok) {
      return Response.json(
        { error: 'Kunde inte hämta kundprofil' },
        { status: 500 }
      );
    }

    const customer = await customerResponse.json();

    const response = Response.json({
      customer: {
        id: customer.customer?.id || customer.id,
        first_name: customer.customer?.first_name || customer.first_name,
        last_name: customer.customer?.last_name || customer.last_name,
        email: customer.customer?.email || customer.email,
        metadata: customer.customer?.metadata || customer.metadata,
      },
    });

    // Set httpOnly cookie with token
    response.headers.append(
      'Set-Cookie',
      `medusa_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    );
    // Set non-httpOnly cookie for client-side login state detection
    response.headers.append(
      'Set-Cookie',
      `is_logged_in=1; Path=/; Secure; SameSite=Lax; Max-Age=604800`
    );

    return response;
  } catch {
    return Response.json(
      { error: 'Ett fel uppstod. Försök igen senare.' },
      { status: 500 }
    );
  }
}
