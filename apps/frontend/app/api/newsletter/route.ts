const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#000;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:1.2rem;">Ny nyhetsbrevsprenumerant</h1>
        </div>
        <div style="padding:32px;">
          <p style="font-size:0.875rem;color:#333;">En ny person har registrerat sig för nyhetsbrevet och 10% rabatt:</p>
          <p style="font-size:1rem;font-weight:700;color:#000;">${email}</p>
        </div>
        <div style="background:#f5f5f5;padding:16px 32px;font-size:0.75rem;color:#888;">
          Skickat via nyhetsbrevspopupen på techpilots.se
        </div>
      </div>
    `;

    await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Techpilots Nyhetsbrev', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        subject: 'Ny nyhetsbrevsprenumerant',
        htmlContent: html,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return Response.json({ error: 'Kunde inte registrera' }, { status: 500 });
  }
}
