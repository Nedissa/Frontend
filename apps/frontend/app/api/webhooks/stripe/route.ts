import { Stripe } from 'stripe';

// Order confirmation emails are sent by the backend order-placed subscriber (templateId: 1).
// This webhook only needs to validate the Stripe signature and acknowledge the event.

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET saknas');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] ogiltig signatur:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('[webhook] event type:', event.type);

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('[webhook] sending mail to:', (paymentIntent.metadata as any)?.email);
    await sendOrderConfirmation(paymentIntent);
  } else if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const piId = session.payment_intent;
    console.log('[webhook] checkout.session.completed, payment_intent:', piId);
    if (piId && process.env.STRIPE_SECRET_KEY) {
      const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}`, {
        headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });
      if (piRes.ok) {
        const pi = await piRes.json();
        console.log('[webhook] fetched PI, email:', pi.metadata?.email);
        await sendOrderConfirmation(pi);
      }
    }
  }

  return Response.json({ received: true });
}
