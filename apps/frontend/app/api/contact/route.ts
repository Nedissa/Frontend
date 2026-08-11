export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Alla fält krävs' }, { status: 400 });
    }

    await fetch('https://a.klaviyo.com/api/events', {
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
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 });
  }
}
