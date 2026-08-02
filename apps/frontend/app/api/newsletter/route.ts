const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

async function addBrevoContact(email: string, listId = 2) {
  await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        to: [{ email }],
        templateId: 5,
        params: { discountCode: 'WELCOME10', unsubscribeUrl: 'https://techpilots.se/avprenumerera' },
      }),
    });

    await addBrevoContact(email);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Kunde inte registrera' }, { status: 500 });
  }
}
