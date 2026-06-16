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
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

      window.dispatchEvent(new Event('userLogin'));
      const dest = sessionStorage.getItem('preLoginPath') || '/konto';
      sessionStorage.removeItem('preLoginPath');
      sessionStorage.removeItem('preLoginScrollY');
      router.push(dest);
      router.refresh();
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
          firstName: registerEmail.split('@')[0],
          lastName: '',
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        setLoginError(error.error || 'Registreringen misslyckades. Försök igen.');
        return;
      }

      const data = await registerResponse.json();

      window.dispatchEvent(new Event('userLogin'));
      const dest = sessionStorage.getItem('preLoginPath') || '/konto';
      sessionStorage.removeItem('preLoginPath');
      sessionStorage.removeItem('preLoginScrollY');
      router.push(dest);
      router.refresh();
    } catch (error) {
      console.error('Registration error:', error);
      setLoginError('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <MainLayout bordered={false}>
      <div className="relative">
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="w-full">
            <div className="space-y-6">
              {/* Login Form */}
              {showLogin && !showResetModal && (
                <div className="p-8 rounded-lg shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Link href="/" className="flex items-center justify-center gap-2 mb-10 hover:opacity-80 transition-opacity">
                    <span className="block md:hidden"><Logo size={32} /></span>
                    <span className="hidden md:block"><Logo size={40} /></span>
                    <span className="text-2xl font-bold">Techpilots</span>
                  </Link>
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
                    {loginError && (
                      <p className="text-sm text-red-600">{loginError}</p>
                    )}
                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Loggar in...' : 'Logga in'}
                    </button>
                  </form>
                  <div className="space-y-3 mt-6">
                    <button type="button" onClick={() => { setShowResetModal(true); setResetSent(false); setResetEmail(''); }} className="w-full text-xs text-gray-500 hover:text-black py-2">
                      Glömt lösenord?
                    </button>
                    <div className="border-t pt-4 text-center">
                      <p className="text-xs text-gray-600 mb-2">Har du inget konto?</p>
                      <button
                        type="button"
                        onClick={() => setShowLogin(false)}
                        className="text-sm font-semibold text-black hover:text-gray-700"
                      >
                        Skapa ett här
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              {!showLogin && !showResetModal && (
                <div className="p-8 rounded-lg shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <div className="flex items-center justify-center gap-1 mb-6">
                    <Logo />
                    <span className="text-2xl font-bold">Techpilots</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-6">Skapa konto</h2>
                  <form onSubmit={handleRegister} className="space-y-4">
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
                    {loginError && (
                      <p className="text-sm text-red-600">{loginError}</p>
                    )}
                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Skapar konto...' : 'Skapa konto'}
                    </button>
                  </form>
                  <div className="border-t pt-4 mt-6 text-center">
                    <p className="text-xs text-gray-600 mb-2">Redan medlem?</p>
                    <button
                      type="button"
                      onClick={() => setShowLogin(true)}
                      className="text-sm font-semibold text-black hover:text-gray-700"
                    >
                      Logga in här
                    </button>
                  </div>
                </div>
              )}

              {/* Reset Password Form */}
              {showResetModal && (
                <div className="p-8 rounded-lg shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Link href="/" className="flex items-center justify-center gap-2 mb-10 hover:opacity-80 transition-opacity">
                    <span className="block md:hidden"><Logo size={32} /></span>
                    <span className="hidden md:block"><Logo size={40} /></span>
                    <span className="text-2xl font-bold">Techpilots</span>
                  </Link>
                  {resetSent ? (
                    <>
                      <h3 className="text-lg font-bold mb-3">E-post skickad</h3>
                      <p className="text-sm text-gray-600 mb-6">Om e-postadressen finns i vårt system skickar vi instruktioner för att återställa lösenordet.</p>
                      <button onClick={() => setShowResetModal(false)} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Stäng</button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold mb-6">Återställ lösenord</h3>
                      <p className="text-sm text-gray-600 mb-6">Ange din e-postadress så skickar vi en återställningslänk.</p>
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">E-postadress</label>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-sm outline-none rounded-lg border border-gray-200"
                            style={{ backgroundColor: '#f5f5f5', WebkitBoxShadow: '0 0 0 1000px #f5f5f5 inset' }}
                          />
                        </div>
                        <button type="submit" disabled={resetLoading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                          {resetLoading ? 'Skickar...' : 'Skicka återställningslänk'}
                        </button>
                      </form>
                      <div className="text-center mt-4">
                        <button type="button" onClick={() => { setShowResetModal(false); router.push('/inlogg'); }} className="text-xs text-gray-500 hover:text-black">Avbryt</button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
