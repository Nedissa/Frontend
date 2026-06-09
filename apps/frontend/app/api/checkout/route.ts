import { Stripe } from 'stripe';

interface LineItem {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
    };
  };
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const body = await request.json();
    const { cartItems, total, formData, shippingCost, welcomeDiscount } = body;

    const lineItems: LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: 'sek',
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
        },
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'sek',
          unit_amount: shippingCost * 100,
          product_data: {
            name: 'Expressfrakt',
          },
        },
        quantity: 1,
      });
    }

    if (welcomeDiscount > 0) {
      lineItems.push({
        price_data: {
          currency: 'sek',
          unit_amount: -welcomeDiscount * 100,
          product_data: {
            name: 'Välkomstrabatt (10%)',
          },
        },
        quantity: 1,
      });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order-bekraftelse?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kassan?from=stripe`,
      customer_email: formData.email,
      payment_method_types: ['card'],
      metadata: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
      },
    });

    return Response.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Checkout error:', errorMessage);
    console.error('Full error:', error);
    return Response.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
