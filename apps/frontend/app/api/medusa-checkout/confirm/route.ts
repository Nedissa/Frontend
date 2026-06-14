const MEDUSA_URL = 'https://api.techpilots.se';
const MEDUSA_PUB_KEY = 'pk_be1d32dae17bd54fa1b82b443354fc250d222284107fd067a30caf3cf2f49b8f';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const h = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': MEDUSA_PUB_KEY,
};

async function sendMail(formData: any, total: number, orderId: string) {
  const name = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
  const email = formData.email || '';
  const address = `${formData.address || ''}, ${formData.postalCode || ''} ${formData.city || ''}`;
  const totalStr = (total / 100).toLocaleString('sv-SE');

  if (!email) return;

  const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#fff;padding:40px;">
        <h1 style="font-size:1.4rem;font-weight:800;">Tack för din beställning!</h1>
        <p>Hej ${name}! Vi har tagit emot din order och packar den så snart som möjligt.</p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;margin:24px 0;">
          <p><strong>Ordernummer:</strong> #${orderId}</p>
          <p><strong>Leveransadress:</strong> ${address}</p>
          <p><strong>Totalt:</strong> ${totalStr} kr</p>
        </div>
        <p>Frågor? Kontakta <a href="mailto:support@techpilots.se">support@techpilots.se</a></p>
      </div>
    </div>
  `;

  const storeHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#fff;padding:40px;">
        <h1>Ny order #${orderId}</h1>
        <p><strong>Kund:</strong> ${name} (${email})</p>
        <p><strong>Adress:</strong> ${address}</p>
        <p><strong>Totalt:</strong> ${totalStr} kr</p>
      </div>
    </div>
  `;

  await Promise.allSettled([
    fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots', email: 'info@techpilots.se' },
        to: [{ email, name }],
        subject: `Orderbekräftelse #${orderId} - Techpilots`,
        htmlContent: customerHtml,
      }),
    }),
    fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Techpilots Order', email: 'info@techpilots.se' },
        to: [{ email: 'info@techpilots.se', name: 'Techpilots' }],
        subject: `Ny order #${orderId} - ${totalStr} kr`,
        htmlContent: storeHtml,
      }),
    }),
  ]);
}

export async function POST(request: Request) {
  try {
    const { cartId, formData, total } = await request.json();

    if (!cartId) {
      return Response.json({ error: 'Saknar cartId' }, { status: 400 });
    }

    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: h,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[medusa-confirm] complete failed:', err);
      return Response.json({ error: 'Kunde inte slutföra order' }, { status: 500 });
    }

    const data = await res.json();
    const order = data.order || data.data;
    const orderId = order?.display_id || order?.id?.slice(-8).toUpperCase() || 'N/A';
    const orderTotal = total || order?.total || 0;

    if (formData?.email) {
      await sendMail(formData, orderTotal, orderId);
    }

    return Response.json({ order });
  } catch (error) {
    console.error('[medusa-confirm] error:', error);
    return Response.json({ error: 'Internt fel' }, { status: 500 });
  }
}
