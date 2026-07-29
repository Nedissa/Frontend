'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const params = new URLSearchParams();
    if (token) params.set('reset_token', token);
    if (email) params.set('reset_email', email);
    router.replace(`/?${params.toString()}`);
  }, [router, token, email]);

  return null;
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetRedirect />
    </Suspense>
  );
}
