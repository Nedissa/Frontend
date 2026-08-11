export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    await Promise.allSettled([
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
        body: JSON.stringify({
          to: [{ email }],
          templateId: 5,
          params: { discountCode: 'WELCOME10', unsubscribeUrl: 'https://techpilots.vercel.app/avprenumerera' },
        }),
      }),
      fetch('https://a.klaviyo.com/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY!}`,
          'content-type': 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'event',
            attributes: {
              properties: { discountCode: 'WELCOME10', unsubscribeUrl: 'https://techpilots.vercel.app/avprenumerera' },
              metric: { data: { type: 'metric', attributes: { name: 'Newsletter Signup' } } },
              profile: { data: { type: 'profile', attributes: { email } } },
            },
          },
        }),
      }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Kunde inte registrera' }, { status: 500 });
  }
}
