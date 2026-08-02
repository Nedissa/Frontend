const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

async function addBrevoContact(email: string, firstName: string) {
  await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: firstName },
      listIds: [5],
      updateEnabled: true,
    }),
  }).catch(() => {});
}

const emailHeader = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;"><tr><td align="center" style="padding:20px 40px;">
    <img src="https://techpilots.vercel.app/logo.png" alt="" width="28" height="28" style="vertical-align:middle;display:inline-block;" /><span style="font-size:1.2rem;font-weight:800;color:#000;letter-spacing:-0.5px;vertical-align:middle;"> Techpilots</span>
  </td></tr></table>
`;

const emailFooter = `
  <div style="padding:24px 40px;text-align:center;font-size:0.75rem;color:#aaa;border-top:1px solid #e5e7eb;">
    Techpilots AB &bull; Skogshyddegatan 37, 506 31 Borås &bull; support@techpilots.se
  </div>
`;

export async function sendWelcomeEmail(firstName: string, email: string) {
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
      ${emailHeader}
      <div style="background:#ffffff;padding:40px;">
        <h1 style="font-size:1.4rem;font-weight:800;color:#000;margin:0 0 8px;">${firstName ? `Hej ${firstName}, kul att du är med!` : 'Kul att du är med!'}</h1>
        <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 16px;">Ditt konto är nu skapat och du är redo att handla. Som ny medlem får du <strong style="color:#000;">10% rabatt på din första order</strong>. Rabatten läggs till automatiskt när du går till kassan.</p>
        <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 32px;">Vi har ett noggrant utvalt sortiment av elektronik med fri standardleverans och 30 dagars öppet köp.</p>
        <div style="text-align:center;margin:0 0 32px;">
          <a href="https://techpilots.vercel.app/produkter" style="background:#000;color:#fff;padding:14px 36px;text-decoration:none;font-weight:700;font-size:0.9rem;border-radius:999px;display:inline-block;">Shoppa nu</a>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:24px;">
          <tr>
            <td width="33%" style="padding-top:24px;padding-right:16px;vertical-align:top;">
              <p style="margin:0 0 4px;font-size:0.8rem;font-weight:700;color:#000;">Fri frakt</p>
              <p style="margin:0;font-size:0.75rem;color:#888;">På alla beställningar</p>
            </td>
            <td width="33%" style="padding-top:24px;padding-right:16px;vertical-align:top;">
              <p style="margin:0 0 4px;font-size:0.8rem;font-weight:700;color:#000;">30 dagars öppet köp</p>
              <p style="margin:0;font-size:0.75rem;color:#888;">Enkel retur utan krångel</p>
            </td>
            <td width="33%" style="padding-top:24px;vertical-align:top;">
              <p style="margin:0 0 4px;font-size:0.8rem;font-weight:700;color:#000;">Kundservice</p>
              <p style="margin:0;font-size:0.75rem;color:#888;">Mån till fre 09 till 17</p>
            </td>
          </tr>
        </table>
      </div>
      ${emailFooter}
    </div>
  `;

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Techpilots', email: 'info@techpilots.se' },
      to: [{ email, name: firstName }],
      subject: 'Välkommen till Techpilots',
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${JSON.stringify(error)}`);
  }

  await addBrevoContact(email, firstName);
}
