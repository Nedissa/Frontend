const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://techpilots.se';

const emailHeader = `
  <div style="background:#ffffff;padding:20px 40px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;gap:4px;">
    <img src="https://techpilots.se/logo.png" alt="Techpilots" width="32" height="32" style="display:inline-block;" />
    <span style="font-size:1.3rem;font-weight:800;color:#000;letter-spacing:-0.5px;">Techpilots</span>
  </div>
`;

const emailFooter = `
  <div style="padding:24px 40px;text-align:center;font-size:0.75rem;color:#aaa;border-top:1px solid #e5e7eb;">
    Techpilots AB &bull; Skogshyddegatan 37, 506 31 Borås &bull; support@techpilots.se
  </div>
`;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    const response = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey!,
      },
      body: JSON.stringify({ identifier: email }),
    });

    if (response.ok) {
      let data: any = {};
      try { data = JSON.parse(await response.text()); } catch {}
      const token = data.token;

      if (token) {
        const resetLink = `${SITE_URL}/aterstall-losenord?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

        const html = `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;">
            ${emailHeader}
            <div style="background:#ffffff;padding:40px;">
              <h1 style="font-size:1.4rem;font-weight:800;color:#000;margin:0 0 8px;">Återställ ditt lösenord</h1>
              <p style="font-size:0.95rem;color:#555;line-height:1.7;margin:0 0 24px;">Hej! Vi fick en förfrågan om att återställa lösenordet till ditt konto på Techpilots. Klicka på knappen så väljer du ett nytt lösenord.</p>
              <div style="text-align:center;margin:0 0 32px;">
                <a href="${resetLink}" style="background:#000;color:#fff;padding:14px 36px;text-decoration:none;font-weight:700;font-size:0.9rem;border-radius:999px;display:inline-block;">Återställ lösenord</a>
              </div>
              <p style="font-size:0.8rem;color:#aaa;line-height:1.7;margin:0;">Länken är giltig i 24 timmar. Om du inte begärde detta kan du ignorera detta mail.</p>
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
            sender: { name: 'Techpilots', email: 'info@techpilots.se' },
            to: [{ email }],
            subject: 'Återställ ditt lösenord',
            htmlContent: html,
          }),
        });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: true });
  }
}
