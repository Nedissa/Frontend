'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { Breadcrumb } from '@/app/components/Breadcrumb';

export default function AboutPage() {
  return (
    <MainLayout>
      <Breadcrumb items={[{ label: 'Om oss' }]} />

      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-4">Om Techpilots</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Hos Techpilots hittar du datorer, datorkomponenter och tillbehör från välkända varumärken – till konkurrenskraftiga priser och med snabb leverans inom hela Sverige.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="p-12 space-y-16" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

          {/* Vad vi gör */}
          <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Teknik för alla</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Oavsett om du bygger din första gamingdator, uppgraderar din arbetsstation eller letar efter rätt tillbehör — vi hjälper dig att hitta produkter som passar dina behov och din budget.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Vi erbjuder ett noggrant utvalt sortiment med tydlig information, rättvisa priser och en smidig köpupplevelse från beställning till leverans.
            </p>
          </section>

          {/* Våra värden */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Våra värden</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-100 p-8 rounded-lg">
                <div className="mb-5">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Kvalitet</h3>
                <p className="text-gray-600 leading-relaxed">Endast autentiska produkter från auktoriserade leverantörer med fullständig tillverkares garanti.</p>
              </div>
              <div className="border border-gray-100 p-8 rounded-lg">
                <div className="mb-5">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Snabbhet</h3>
                <p className="text-gray-600 leading-relaxed">Lagerförda produkter levereras inom 1–2 arbetsdagar direkt till din dörr. Vi respekterar din tid.</p>
              </div>
              <div className="border border-gray-100 p-8 rounded-lg">
                <div className="mb-5">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v2h8v-2zm0-3h-8v2h8V11zm0-3H4V6h14v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Support</h3>
                <p className="text-gray-600 leading-relaxed">Personlig kundservice via e-post och telefon under affärstid. Vi finns här före och efter ditt köp.</p>
              </div>
            </div>
          </section>

          {/* Varför välja oss */}
          <section className="bg-gray-50 p-10 rounded-lg">
            <h2 className="text-3xl font-bold mb-8">Varför handla hos oss?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Originalprodukter med garanti', desc: 'Alla produkter kommer från auktoriserade leverantörer och omfattas av tillverkarens garanti.' },
                { title: 'Snabb leverans 1–2 dagar', desc: 'Produkter som finns i lager skickas direkt och levereras normalt inom 1–2 arbetsdagar.' },
                { title: '30 dagars returrätt', desc: 'Ångrar du ditt köp kan du returnera produkten inom 30 dagar enligt våra returvillkor.' },
                { title: 'Säker betalning', desc: 'SSL-krypterad anslutning och PCI DSS-certifierad betalning skyddar dina uppgifter.' },
                { title: 'Personlig kundservice', desc: 'Vi svarar på e-post och telefon under öppettider och löser ditt ärende snabbt.' },
                { title: 'Konkurrenskraftiga priser', desc: 'Noggrant utvalt sortiment med rättvisa priser och regelbundna erbjudanden på elektronik.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white p-5 rounded-lg">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vår ambition */}
          <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Vår ambition</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vi vill göra det enkelt att köpa teknik online. Därför fokuserar vi på ett noggrant utvalt sortiment, tydlig produktinformation och en smidig köpupplevelse från beställning till leverans.
            </p>
            <p className="text-gray-700 leading-relaxed">
              När du handlar hos Techpilots ska du känna dig trygg med att du får rätt produkt, till rätt pris och med support när du behöver den.
            </p>
          </section>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Redo att börja?</h2>
          <p className="text-lg text-gray-300 mb-8">Utforska vårt sortiment av datorer, komponenter och tillbehör</p>
          <Link href="/produkter" className="inline-block bg-white text-gray-900 px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors">
            Utforska sortimentet →
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
