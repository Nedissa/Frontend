'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/MainLayout';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { InputWithCheck } from '@/app/components/InputWithCheck';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          recipientEmail: 'info@techpilots.se',
        }),
      });

      if (response.ok) {
        setSuccessMessage('Tack! Ditt meddelande har skickats. Vi svarar inom 24 timmar.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage('Ett fel uppstod när meddelandet skulle skickas. Försök igen senare.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Ett fel uppstod när meddelandet skulle skickas. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Breadcrumb items={[{ label: 'Kontakta oss' }]} />

      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-4">Kontakta oss</h1>
        <p className="text-xl text-gray-600">Vi är här för att hjälpa dig</p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="p-12" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Skicka oss ett meddelande</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {successMessage && (
                  <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Namn</label>
                  <InputWithCheck type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ditt namn" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-post</label>
                  <InputWithCheck type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@email.se" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ämne</label>
                  <InputWithCheck type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Vad handlar det om?" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meddelande</label>
                  <div className="relative">
                    <textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 pr-10 focus:outline-none border border-gray-200 focus:border-black" style={{ backgroundColor: '#f5f5f5' }} placeholder="Beskriv ditt ärende här..." required />
                    {message && <svg className="absolute right-3 top-3 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Skickar...' : 'Skicka meddelande'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Kontaktinformation</h2>

              <div className="space-y-8">
                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-bold mb-2 text-lg">Telefon</h3>
                  <p className="text-gray-700">+46 10 880 09 81</p>
                  <p className="text-sm text-gray-600 mt-1">Mån-Fre 09:00-17:00</p>
                </div>

                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-bold mb-2 text-lg">E-post</h3>
                  <p className="text-gray-700">support@techpilots.se</p>
                  <p className="text-sm text-gray-600 mt-1">Vi svarar inom 24 timmar</p>
                </div>

                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-bold mb-2 text-lg">Adress</h3>
                  <p className="text-gray-700">
                    Techpilots AB<br />
                    Skogshyddegatan 37<br />
                    506 31 Borås<br />
                    Sverige
                  </p>
                </div>

                <div className="border-l-4 border-black pl-4">
                  <h3 className="font-bold mb-2 text-lg">Öppettider</h3>
                  <p className="text-gray-700">Mån-Fre: 09:00-17:00</p>
                  <p className="text-gray-700">Lör-Sön: Stängt</p>
                  <p className="text-sm text-gray-600 mt-1">Vi är stängda på svenska helgdagar</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
