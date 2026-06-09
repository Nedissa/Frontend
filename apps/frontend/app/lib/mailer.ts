import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.strato.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(firstName: string, email: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;width:100%;">

              <!-- Header -->
              <tr>
                <td style="background:#111111;padding:32px 40px;">
                  <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">TECHPILOTS</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 32px 40px;">
                  <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:1px;">Välkommen till Techpilots</p>
                  <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:700;color:#111;line-height:1.3;">Hej ${firstName},<br/>kul att du är med!</h1>
                  <p style="margin:0 0 16px 0;font-size:15px;color:#555;line-height:1.7;">
                    Ditt konto är nu skapat och du är redo att handla. Som ny medlem får du <strong style="color:#111;">10% rabatt på din första order</strong> — rabatten appliceras automatiskt i kassan.
                  </p>
                  <p style="margin:0 0 32px 0;font-size:15px;color:#555;line-height:1.7;">
                    Vi erbjuder ett noggrant utvalt sortiment av elektronik, levererat direkt hem till dig från svenska lager.
                  </p>

                  <!-- CTA -->
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#111111;border-radius:999px;">
                        <a href="https://techpilots.se/produkter" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                          Shoppa nu
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px;">
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
                </td>
              </tr>

              <!-- Perks -->
              <tr>
                <td style="padding:32px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:16px;vertical-align:top;width:33%;">
                        <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#111;">Fri frakt</p>
                        <p style="margin:0;font-size:12px;color:#888;line-height:1.5;">På alla beställningar</p>
                      </td>
                      <td style="padding-right:16px;vertical-align:top;width:33%;">
                        <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#111;">30 dagars öppet köp</p>
                        <p style="margin:0;font-size:12px;color:#888;line-height:1.5;">Enkel och kostnadsfri retur</p>
                      </td>
                      <td style="vertical-align:top;width:33%;">
                        <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#111;">Kundservice</p>
                        <p style="margin:0;font-size:12px;color:#888;line-height:1.5;">Mån–Fre 09:00–17:00</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f4f4f5;padding:24px 40px;">
                  <p style="margin:0 0 4px 0;font-size:12px;color:#aaa;">Techpilots AB · Skogshyddegatan 37, 506 31 Borås</p>
                  <p style="margin:0;font-size:12px;color:#aaa;">
                    <a href="https://techpilots.se/integritetspolicy" style="color:#aaa;">Integritetspolicy</a>
                    &nbsp;·&nbsp;
                    <a href="mailto:info@techpilots.se" style="color:#aaa;">info@techpilots.se</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Techpilots" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Välkommen till Techpilots — 10% på din första order',
    html,
  });
}
