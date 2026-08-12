import { sendWelcomeEmail } from '@/app/lib/mailer';
import { resolveMx } from 'node:dns/promises';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

async function hasValidMx(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) return false;
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'E-post och lösenord måste fyllas i' },
        { status: 400 }
      );
    }

    if (!(await hasValidMx(email))) {
      return Response.json(
        { error: 'E-postadressen verkar inte vara giltig. Kontrollera stavningen.' },
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

    // Step 1: Get registration token
    const tokenResponse = await fetch(
      `${MEDUSA_URL}/auth/customer/emailpass/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return Response.json(
        { error: 'E-postadressen är redan registrerad. Försök logga in istället.' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const registrationToken = tokenData.token;

    // Step 2: Register customer with token
    const registerResponse = await fetch(
      `${MEDUSA_URL}/store/customers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registrationToken}`,
          'x-publishable-api-key': publishableKey,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
        }),
      }
    );

    if (!registerResponse.ok) {
      return Response.json(
        { error: 'Registrering misslyckades, försök igen.' },
        { status: registerResponse.status }
      );
    }

    const customerData = await registerResponse.json();
    const customer = customerData.customer || customerData;

    // Step 3: Authenticate the user
    const authResponse = await fetch(
      `${MEDUSA_URL}/auth/customer/emailpass`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    let token = null;
    if (authResponse.ok) {
      const authData = await authResponse.json();
      token = authData.token;
    }

    const response = Response.json({
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
      },
      token,
    });

    if (token) {
      response.headers.append('Set-Cookie', `medusa_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
      response.headers.append('Set-Cookie', `is_logged_in=1; Path=/; Secure; SameSite=Lax; Max-Age=604800`);
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(customer.first_name, customer.email).catch(() => {});

    return response;
  } catch {
    return Response.json(
      { error: 'Ett internt serverfel uppstod' },
      { status: 500 }
    );
  }
}
