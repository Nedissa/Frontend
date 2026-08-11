export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Alla fält krävs' }, { status: 400 });
    }

    await Promise.allSettled([
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY!,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email: 'info@techpilots.se' }],
          replyTo: { email, name },
          templateId: 6,
          params: { senderName: name, senderEmail: email, subject, message },
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
              properties: { senderName: name, senderEmail: email, subject, message },
              metric: { data: { type: 'metric', attributes: { name: 'Contact Form Submitted' } } },
              profile: { data: { type: 'profile', attributes: { email: 'info@techpilots.se' } } },
            },
          },
        }),
      }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 });
  }
}
