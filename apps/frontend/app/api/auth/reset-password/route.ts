const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    await fetch(`${MEDUSA_URL}/auth/customer/emailpass/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      body: JSON.stringify({ identifier: email }),
    });

    // Backend subscriber (password-reset.ts) handles sending the email via templateId: 2
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: true });
  }
}
