'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '../components/Logo';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Push /inlogg to history so back button goes there
  React.useEffect(() => {
    window.history.pushState(null, '', '/inlogg');
    window.history.pushState(null, '', window.location.href);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        setError('Länken är ogiltig eller har gått ut. Begär en ny återställningslänk.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Ett fel uppstod. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full p-8 shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-center gap-1 mb-10">
          <Logo />
          <span className="text-2xl font-bold">Techpilots</span>
        </div>

        {success ? (
          <div className="text-center">
            <p className="font-semibold text-lg mb-4">Lösenord uppdaterat!</p>
            <p className="text-sm text-gray-600 mb-6">Ditt lösenord har uppdaterats. Gå till inloggningssidan för att logga in med ditt nya lösenord.</p>
            <button
              onClick={() => router.push('/inlogg')}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Gå till inloggning
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6">Välj nytt lösenord</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nytt lösenord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 outline-none text-sm"
                  placeholder="Minst 8 tecken"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bekräfta lösenord</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 outline-none text-sm"
                  placeholder="Upprepa lösenordet"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:opacity-50 rounded-lg"
              >
                {isLoading ? 'Sparar...' : 'Spara nytt lösenord'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/inlogg')}
                className="w-full text-sm text-gray-500 hover:text-black py-2 mt-2"
              >
                Tillbaka till inloggning
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
