'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  useEffect(() => {
    // Redirected here (e.g. from /konto) because the auth token is missing
    // or invalid, but the client-side is_logged_in cookie may still be set
    // from a previous session — clear it so the header stops showing
    // "Mina sidor" for a user who isn't actually authenticated.
    if (document.cookie.includes('is_logged_in=1')) {
      fetch('/api/auth/logout', { method: 'POST' })
        .catch(() => {})
        .finally(() => window.dispatchEvent(new Event('userLogout')));
    }

    const params = new URLSearchParams();
    params.set('open_login', '1');
    if (view) params.set('login_view', view);
    router.replace(`/?${params.toString()}`);
  }, [router, view]);

  return null;
}

export default function LoginRedirectPage() {
  return (
    <Suspense>
      <LoginRedirect />
    </Suspense>
  );
}
