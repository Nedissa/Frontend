'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripePaymentFormProps {
  clientSecret: string;
  total: number;
  onSuccess: () => void;
}

function PaymentFormContent({ clientSecret, total }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe) {
      setErrorMessage('Stripe inte laddat');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/order-bekraftelse`,
      },
    } as any);

    if (result.error) {
      setErrorMessage(result.error.message || 'Betalningen misslyckades');
      setIsProcessing(false);
    }
    // If no error, Stripe handles the redirect
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="p-6 rounded border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Betalningsuppgifter</h3>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
      >
        {isProcessing ? 'Bearbetar betalning...' : `Betala ${total.toLocaleString('sv-SE')} SEK`}
      </button>
    </form>
  );
}

export function StripePaymentForm({ clientSecret, total, onSuccess }: StripePaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#000000',
            colorText: '#1f2937',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
          },
        },
      }}
    >
      <PaymentFormContent clientSecret={clientSecret} total={total} onSuccess={onSuccess} />
    </Elements>
  );
}
