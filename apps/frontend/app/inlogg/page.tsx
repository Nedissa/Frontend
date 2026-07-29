'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('open_login', '1');
    if (view) params.set('login_view', view);
    router.replace(`/?${params.toString()}`);
  }, [router, view]);

  return null;
}

export default function InloggPage() {
  return (
    <Suspense>
      <LoginRedirect />
    </Suspense>
  );
}
