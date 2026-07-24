'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/app/components/MainLayout';

export default function SharedCartPage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/shared-cart?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error || !data.items) return;

        localStorage.setItem('cartItems', JSON.stringify(data.items));
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { count: data.items.reduce((s: number, i: any) => s + i.quantity, 0) }
        }));
        window.dispatchEvent(new CustomEvent('openCart'));
      });
  }, [id]);

  return <MainLayout bordered={false}><div /></MainLayout>;
}
