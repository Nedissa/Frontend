const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Alla fält krävs' }, { status: 400 });
    }

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#000;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:1.2rem;">Nytt kontaktmeddelande</h1>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;font-size:0.875rem;color:#333;">
            <tr><td style="padding:8px 0;font-weight:700;width:120px;">Från:</td><td style="padding:8px 0;">${name} (${email})</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;">Ämne:</td><td style="padding:8px 0;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
          <p style="font-size:0.875rem;color:#333;line-height:1.6;white-space:pre-wrap;">${message}</p>
        </div>
        <div style="background:#f5f5f5;padding:16px 32px;font-size:0.75rem;color:#888;">
          Skickat via kontaktformuläret på techpilots.se
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
        sender: { name: 'Techpilots Kontakt', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        replyTo: { email, name },
        subject: subject,
        htmlContent: html,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 });
  }
}
