import { sendWelcomeEmail } from '@/app/lib/mailer';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return Response.json(
        { error: 'Server configuration error' },
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
      const errorData = await tokenResponse.json();
      console.error('Token error:', errorData);
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
      const errorData = await registerResponse.json();
      console.error('Register error:', errorData);
      return Response.json(
        { error: errorData.message || 'Failed to register customer' },
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
      response.headers.append('Set-Cookie', `medusa_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
      response.headers.append('Set-Cookie', `is_logged_in=1; Path=/; SameSite=Lax; Max-Age=604800`);
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(customer.first_name, customer.email).catch((err) =>
      console.error('Welcome email failed:', err)
    );

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
