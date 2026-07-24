'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SharedCartPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/shared-cart?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error || !data.items) {
          router.push('/');
          return;
        }

        localStorage.setItem('cartItems', JSON.stringify(data.items));
        sessionStorage.setItem('openCartOnLoad', '1');
        router.push('/');
        // Efter navigation: ladda om korgen och öppna aside
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('cartReplaced'));
          window.dispatchEvent(new CustomEvent('openCart'));
        }, 400);
      });
  }, [id, router]);

  return null;
}
