const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const emailHeader = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;"><tr><td align="center" style="padding:20px 40px;">
    <img src="https://techpilots.se/logo.png" alt="" width="28" height="28" style="vertical-align:middle;display:inline-block;" /><span style="font-size:1.2rem;font-weight:800;color:#000;letter-spacing:-0.5px;vertical-align:middle;"> Techpilots</span>
  </td></tr></table>
`;

const emailFooter = `
  <div style="padding:16px 40px;text-align:center;font-size:0.75rem;color:#aaa;border-top:1px solid #e5e7eb;">
    Skickat via kontaktformuläret på techpilots.se
  </div>
`;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Alla fält krävs' }, { status: 400 });
    }

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
        ${emailHeader}
        <div style="background:#ffffff;padding:40px;">
          <h1 style="font-size:1.3rem;font-weight:800;color:#000;margin:0 0 24px;">Nytt kontaktmeddelande</h1>
          <div style="background:#f4f4f4;border-radius:8px;padding:24px;margin:0 0 24px;">
            <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
              <tr>
                <td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;width:80px;">Från</td>
                <td style="padding:6px 0;font-size:0.9rem;font-weight:600;color:#000;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">E-post</td>
                <td style="padding:6px 0;font-size:0.9rem;color:#555;">${esc(email)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Ämne</td>
                <td style="padding:6px 0;font-size:0.9rem;color:#333;">${esc(subject)}</td>
              </tr>
            </table>
          </div>
          <p style="font-size:0.9rem;color:#333;line-height:1.7;margin:0;white-space:pre-wrap;">${esc(message)}</p>
        </div>
        ${emailFooter}
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
        subject: `Kontakt: ${esc(subject)}`,
        htmlContent: html,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 });
  }
}
