const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

async function addBrevoContact(email: string, listId = 2) {
  await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
  }).catch(() => {});
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const emailHeader = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;"><tr><td align="center" style="padding:20px 40px;">
    <img src="https://techpilots.se/logo.png" alt="" width="28" height="28" style="vertical-align:middle;display:inline-block;" /><span style="font-size:1.2rem;font-weight:800;color:#000;letter-spacing:-0.5px;vertical-align:middle;"> Techpilots</span>
  </td></tr></table>
`;

const emailFooter = `
  <div style="padding:24px 40px;text-align:center;font-size:0.75rem;color:#aaa;border-top:1px solid #e5e7eb;">
    Techpilots AB &bull; Skogshyddegatan 37, 506 31 Borås &bull; support@techpilots.se
  </div>
`;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const safeEmail = escapeHtml(email);

    const storeHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
        ${emailHeader}
        <div style="background:#ffffff;padding:40px;">
          <h1 style="font-size:1.3rem;font-weight:800;color:#000;margin:0 0 16px;">Ny nyhetsbrevsprenumerant</h1>
          <p style="font-size:0.9rem;color:#555;margin:0 0 16px;">En ny person har registrerat sig för nyhetsbrevet och 10% rabatt:</p>
          <div style="background:#f4f4f4;border-radius:8px;padding:20px;">
            <p style="margin:0;font-size:1rem;font-weight:700;color:#000;">${safeEmail}</p>
          </div>
        </div>
        ${emailFooter}
      </div>
    `;

    await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots Nyhetsbrev', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        subject: 'Ny nyhetsbrevsprenumerant',
        htmlContent: storeHtml,
      }),
    });

    const welcomeHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
        ${emailHeader}
        <div style="background:#ffffff;padding:40px;">
          <h1 style="font-size:1.4rem;font-weight:800;color:#000;margin:0 0 8px;">Välkommen till Techpilots!</h1>
          <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 16px;">Kul att du är med! Som prenumerant får du <strong style="color:#000;">10% rabatt på ditt första köp</strong>. Rabatten läggs till automatiskt när du går till kassan.</p>
          ${password ? `<div style="background:#f4f4f4;padding:16px 20px;margin:0 0 16px;border-radius:4px;"><p style="margin:0 0 4px;font-size:0.8rem;color:#888;">Ditt lösenord för inloggning:</p><p style="margin:0;font-size:1rem;font-weight:700;color:#000;letter-spacing:0.05em;">${password}</p></div>` : ''}
          <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 32px;">Vi skickar erbjudanden och nyheter med jämna mellanrum, aldrig spam.</p>
          <div style="text-align:center;margin:0 0 32px;">
            <a href="https://techpilots.se/produkter" style="background:#000;color:#fff;padding:14px 36px;text-decoration:none;font-weight:700;font-size:0.9rem;border-radius:999px;display:inline-block;">Shoppa nu</a>
          </div>
          <p style="font-size:0.9rem;color:#555;line-height:1.7;margin:0;">Med vänliga hälsningar,<br/><strong style="color:#000;">Teamet på Techpilots</strong></p>
        </div>
        ${emailFooter}
      </div>
    `;

    await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots', email: 'info@techpilots.se' },
        to: [{ email }],
        subject: 'Välkommen till Techpilots',
        htmlContent: welcomeHtml,
      }),
    });

    await addBrevoContact(email);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Kunde inte registrera' }, { status: 500 });
  }
}
