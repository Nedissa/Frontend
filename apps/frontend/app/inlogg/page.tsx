'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '../components/MainLayout';
import { Logo } from '../components/Logo';
import { InputWithCheck } from '../components/InputWithCheck';

export default function LoginPage() {
  const router = useRouter();
  const returnPath = useRef<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('preLoginPath');
    if (stored) {
      returnPath.current = stored;
    } else if (document.referrer && !document.referrer.includes('/inlogg')) {
      const ref = new URL(document.referrer);
      returnPath.current = ref.pathname + ref.search + ref.hash;
    }
  }, []);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setLoginError(error.error || 'E-postadressen eller lösenordet är felaktig');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const customer = data.customer;

      localStorage.setItem('userData', JSON.stringify({
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
      }));

      try {
        const favoritesResponse = await fetch(`/api/favorites?customer_id=${customer.id}`);
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          localStorage.setItem('favoritesList', JSON.stringify(favoritesData.wishlist || []));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }

      window.dispatchEvent(new Event('userLogin'));
      const dest = returnPath.current || '/konto';
      sessionStorage.removeItem('preLoginPath');
      router.push(dest);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Ett fel uppstod. Försök igen senare.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        setLoginError(error.error || 'Registreringen misslyckades. Försök igen.');
        return;
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPassword }),
      });

      if (!loginResponse.ok) {
        setLoginError('Kontot skapades men login misslyckades. Försök logga in manuellt.');
        return;
      }

      const data = await loginResponse.json();
      const customer = data.customer;

      localStorage.setItem('userData', JSON.stringify({
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
      }));

      localStorage.setItem('favoritesList', JSON.stringify([]));

      window.dispatchEvent(new Event('userLogin'));
      const dest = returnPath.current || '/konto';
      sessionStorage.removeItem('preLoginPath');
      router.push(dest);
    } catch (error) {
      console.error('Registration error:', error);
      setLoginError('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout bordered={false}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="flex items-center gap-1 mb-8">
            <Logo />
            <span className="text-3xl font-bold">Techpilots</span>
          </div>
          <div className="w-full">
            <div className="space-y-6">
              {/* Login Form */}
              {showLogin && (
                <div className="p-8 rounded-lg shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <h2 className="text-2xl font-bold mb-6 text-center">Logga in</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">E-postadress</label>
                      <InputWithCheck
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0"
                        style={{
                          WebkitAutofillBoxShadow: '0 0 0 1000px white inset',
                          WebkitAutofillTextFillColor: '#000'
                        } as React.CSSProperties}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lösenord</label>
                      <InputWithCheck
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0"
                        style={{
                          WebkitAutofillBoxShadow: '0 0 0 1000px white inset',
                          WebkitAutofillTextFillColor: '#000'
                        } as React.CSSProperties}
                        required
                      />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Loggar in...' : 'Logga in'}
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-600">
                      <button className="text-black">Glömt lösenord? Återställ här</button>
                    </p>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              {!showLogin && (
                <div className="p-8 rounded-lg shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <h2 className="text-2xl font-bold mb-6">Skapa konto</h2>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Förnamn</label>
                      <InputWithCheck
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border-0 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Efternamn</label>
                      <InputWithCheck
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-0 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">E-postadress</label>
                      <InputWithCheck
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="border-0 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lösenord</label>
                      <InputWithCheck
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="border-0 rounded-lg"
                        required
                      />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Skapar konto...' : 'Skapa konto'}
                    </button>
                  </form>
                </div>
              )}

              {/* Toggle */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {showLogin ? 'Har du inget konto?' : 'Redan medlem?'}
                </p>
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="text-black font-semibold"
                >
                  {showLogin ? 'Skapa ett här' : 'Logga in här'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
