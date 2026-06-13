import { Stripe } from 'stripe';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendOrderConfirmation(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {};
  const email = session.customer_email || '';
  const name = `${meta.firstName || ''} ${meta.lastName || ''}`.trim();
  const address = `${meta.address || ''}, ${meta.postalCode || ''} ${meta.city || ''}`;
  const total = session.amount_total ? (session.amount_total / 100).toLocaleString('sv-SE') : '0';
  const orderId = session.id.slice(-8).toUpperCase();

  const customerHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="background:#000;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:1.2rem;">Tack för din beställning!</h1>
      </div>
      <div style="padding:32px;">
        <p style="font-size:0.95rem;color:#333;line-height:1.7;">Hej ${name},</p>
        <p style="font-size:0.95rem;color:#333;line-height:1.7;">Vi har tagit emot din beställning och den behandlas nu. Du hör av oss igen när paketet är på väg.</p>
        <div style="background:#f9f9f9;border:1px solid #e5e7eb;border-radius:6px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Ordernummer</p>
          <p style="margin:0 0 16px;font-size:1rem;font-weight:700;color:#000;">#${orderId}</p>
          <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Leveransadress</p>
          <p style="margin:0 0 16px;font-size:0.95rem;color:#333;">${address}</p>
          <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Totalt</p>
          <p style="margin:0;font-size:1rem;font-weight:700;color:#000;">${total} kr</p>
        </div>
        <p style="font-size:0.95rem;color:#333;line-height:1.7;">Har du frågor? Hör av dig till <a href="mailto:support@techpilots.se" style="color:#000;">support@techpilots.se</a> eller ring 010-880 09 81.</p>
        <p style="font-size:0.95rem;color:#333;line-height:1.7;margin-top:24px;">Med vänliga hälsningar,<br/><strong>Teamet på Techpilots</strong></p>
      </div>
      <div style="background:#f5f5f5;padding:16px 32px;font-size:0.75rem;color:#888;">
        Techpilots AB &bull; support@techpilots.se &bull; +46 10 880 09 81
      </div>
    </div>
  `;

  const storeHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="background:#000;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:1.2rem;">Ny order inkommen!</h1>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Ordernummer</p>
        <p style="margin:0 0 16px;font-size:1rem;font-weight:700;">#${orderId}</p>
        <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Kund</p>
        <p style="margin:0 0 4px;font-size:0.95rem;">${name}</p>
        <p style="margin:0 0 16px;font-size:0.95rem;color:#555;">${email}</p>
        <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Leveransadress</p>
        <p style="margin:0 0 16px;font-size:0.95rem;">${address}</p>
        <p style="margin:0 0 8px;font-size:0.85rem;color:#666;">Totalt</p>
        <p style="margin:0;font-size:1rem;font-weight:700;">${total} kr</p>
      </div>
    </div>
  `;

  await Promise.all([
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
        subject: `Ny order #${orderId} - ${total} kr`,
        htmlContent: storeHtml,
      }),
    }),
  ]);
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') {
      await sendOrderConfirmation(session);
    }
  }

  return Response.json({ received: true });
}
