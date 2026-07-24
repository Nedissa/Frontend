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
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { count: data.items.reduce((s: number, i: any) => s + i.quantity, 0) }
        }));
        // Flagga att korgen ska öppnas efter navigation
        sessionStorage.setItem('openCartOnLoad', '1');
        router.push('/');
      });
  }, [id, router]);

  return null;
}
