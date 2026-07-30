'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputWithCheck } from './InputWithCheck';
import { useAside } from './Aside';

type View = 'login' | 'register' | 'reset' | 'reset-confirm';

export function LoginAside({
  onViewChange,
  resetToken,
  resetEmail: initialResetEmail,
  initialView,
}: {
  onViewChange?: (view: View) => void;
  resetToken?: string;
  resetEmail?: string;
  initialView?: View;
}) {
  const router = useRouter();
  const { close } = useAside();
  const [view, setView] = useState<View>(resetToken ? 'reset-confirm' : (initialView || 'login'));

  const changeView = (v: View) => {
    setView(v);
    onViewChange?.(v);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Panel 4: nytt lösenord
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      window.dispatchEvent(new Event('userLogin'));
      const dest = sessionStorage.getItem('preLoginPath') || '/konto';
      sessionStorage.removeItem('preLoginPath');
      sessionStorage.removeItem('preLoginScrollY');
      setIsLoading(false);
      close();
      router.push(dest);
      router.refresh();
    } catch {
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
      window.dispatchEvent(new Event('userLogin'));
      const dest = sessionStorage.getItem('preLoginPath') || '/konto';
      sessionStorage.removeItem('preLoginPath');
      sessionStorage.removeItem('preLoginScrollY');
      close();
      router.push(dest);
      router.refresh();
    } catch {
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

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');
    if (newPassword !== confirmPassword) {
      setConfirmError('Lösenorden matchar inte.');
      return;
    }
    if (newPassword.length < 8) {
      setConfirmError('Lösenordet måste vara minst 8 tecken.');
      return;
    }
    setConfirmLoading(true);
    try {
      const response = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      if (!response.ok) {
        setConfirmError('Länken är ogiltig. Begär en ny återställningslänk.');
        return;
      }
      setConfirmSuccess(true);
    } catch {
      setConfirmError('Ett fel uppstod. Försök igen.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const panelStyle = (p: View): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    padding: '24px',
    boxSizing: 'border-box',
    opacity: view === p ? 1 : 0,
    pointerEvents: view === p ? 'auto' : 'none',
    transition: 'opacity 200ms ease',
  });

  return (
    <div style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1 }}>

        {/* Panel 1: Login */}
        <div style={panelStyle('login')}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">E-postadress</label>
              <InputWithCheck type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-0" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Lösenord</label>
              <InputWithCheck type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-0" required />
            </div>
            <p className={`text-sm text-red-600 ${loginError ? 'visible' : 'invisible'}`}>{loginError || '.'}</p>
            <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:cursor-not-allowed">
              {isLoading ? 'Loggar in...' : 'Logga in'}
            </button>
            <div className="flex flex-col items-center gap-0 pt-2">
              <button type="button" onClick={() => { setResetSent(false); setResetEmail(''); changeView('reset'); }} className="w-full text-xs text-gray-500 hover:text-black py-2">
                Glömt lösenord?
              </button>
              <button type="button" onClick={() => changeView('register')} className="w-full text-xs text-gray-500 hover:text-black py-2 border-t border-gray-200">
                Skapa konto
              </button>
            </div>
          </form>
        </div>

        {/* Panel 2: Register */}
        <div style={panelStyle('register')}>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">E-postadress</label>
              <InputWithCheck type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="border-0" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Lösenord</label>
              <InputWithCheck type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="border-0" required />
            </div>
            <p className={`text-sm text-red-600 ${loginError ? 'visible' : 'invisible'}`}>{loginError || '.'}</p>
            <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:cursor-not-allowed">
              {isLoading ? 'Registrerar...' : 'Registrera'}
            </button>
            <div className="flex flex-col items-center gap-0 pt-2">
              <button type="button" onClick={() => changeView('login')} className="w-full text-xs text-gray-500 hover:text-black py-2">Avbryt</button>
            </div>
          </form>
        </div>

        {/* Panel 3: Reset */}
        <div style={panelStyle('reset')}>
          {resetSent ? (
            <div className="space-y-4">
              <div aria-hidden style={{ visibility: 'hidden' }}>
                <label className="block text-sm font-semibold mb-2">‎</label>
                <InputWithCheck type="password" value="" onChange={() => {}} />
              </div>
              <p className="text-sm text-gray-600">Om e-postadressen finns i vårt system skickar vi instruktioner för att återställa lösenordet.</p>
              <div aria-hidden style={{ visibility: 'hidden' }}>
                <label className="block text-sm font-semibold mb-2">‎</label>
                <InputWithCheck type="email" value="" onChange={() => {}} />
              </div>
              <button onClick={() => changeView('login')} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800">Stäng</button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div aria-hidden style={{ visibility: 'hidden' }}>
                  <label className="block text-sm font-semibold mb-2">‎</label>
                  <InputWithCheck type="password" value="" onChange={() => {}} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">E-postadress</label>
                  <InputWithCheck type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                  <p className="text-sm text-gray-500 mt-2">Ange din e-post så skickar vi dig en återställningslänk.</p>
                </div>
                <button type="submit" disabled={resetLoading} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:cursor-not-allowed">
                  {resetLoading ? 'Skickar...' : 'Skicka'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => changeView('login')} className="text-xs text-gray-500 hover:text-black">Avbryt</button>
                </div>
              </form>
          )}
        </div>

        {/* Panel 4: Nytt lösenord (från mail-länk) */}
        <div style={panelStyle('reset-confirm')}>
          {confirmSuccess ? (
            <div className="space-y-4">
              <div aria-hidden style={{ visibility: 'hidden' }}>
                <label className="block text-sm font-semibold mb-2">‎</label>
                <InputWithCheck type="password" value="" onChange={() => {}} />
              </div>
              <p className="text-sm text-gray-600">Ditt lösenord har uppdaterats. Du kan nu logga in med ditt nya lösenord.</p>
              <div aria-hidden style={{ visibility: 'hidden' }}>
                <label className="block text-sm font-semibold mb-2">‎</label>
                <InputWithCheck type="password" value="" onChange={() => {}} />
              </div>
              <button onClick={() => { close(); router.replace('/'); }} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800">
                Logga in
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nytt lösenord</label>
                <InputWithCheck type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bekräfta lösenord</label>
                <InputWithCheck type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <p className={`text-sm text-red-600 ${confirmError ? 'visible' : 'invisible'}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{confirmError || '.'}</p>
              <button type="submit" disabled={confirmLoading} className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 disabled:cursor-not-allowed">
                {confirmLoading ? 'Sparar...' : 'Spara'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
