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
          Techpilots är en svensk nätbutik för elektronik, datorer och tillbehör. Vi grundades 2024 med målet att göra det enkelt att hitta rätt produkt — till ett rättvist pris och med snabb leverans direkt hem till dörren.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="p-12 space-y-16" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

          {/* Vad vi gör */}
          <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Elektronik utan krångel</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Vi startade Techpilots för att näthandel med elektronik ska vara enkel, pålitlig och prisvärd. Allt vi säljer är noggrant utvalt — vi prioriterar kvalitet framför kvantitet och ser till att varje produkt i vårt sortiment håller måttet.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Oavsett om du bygger din första gamingdator, uppgraderar din arbetsstation eller bara letar efter rätt tillbehör finns vi här för att hjälpa dig hitta rätt — utan onödigt krångel.
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
                <p className="text-gray-600 leading-relaxed">Vi säljer bara produkter vi själva skulle köpa. Noggrant utvalt sortiment från etablerade varumärken med fullständig garanti.</p>
              </div>
              <div className="border border-gray-100 p-8 rounded-lg">
                <div className="mb-5">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Snabb leverans</h3>
                <p className="text-gray-600 leading-relaxed">Lagerförda produkter skickas direkt och levereras inom 1–3 arbetsdagar till din dörr, var du än bor i Sverige.</p>
              </div>
              <div className="border border-gray-100 p-8 rounded-lg">
                <div className="mb-5">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v2h8v-2zm0-3h-8v2h8V11zm0-3H4V6h14v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Kundservice</h3>
                <p className="text-gray-600 leading-relaxed">Vi är ett litet team som bryr oss om varje kund. Hör av dig via e-post eller telefon — vi svarar snabbt och löser ditt ärende.</p>
              </div>
            </div>
          </section>

          {/* Varför välja oss */}
          <section className="bg-gray-50 p-10 rounded-lg">
            <h2 className="text-3xl font-bold mb-8">Varför handla hos oss?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Originalprodukter med garanti', desc: 'Allt vi säljer kommer från auktoriserade leverantörer och omfattas av tillverkarens garanti.' },
                { title: 'Leverans inom 1–3 arbetsdagar', desc: 'Lagerförda produkter skickas direkt och når dig normalt inom 1–3 arbetsdagar, oavsett var i Sverige du bor.' },
                { title: '30 dagars returrätt', desc: 'Ångrar du ditt köp returnerar du enkelt inom 30 dagar. Ingen krånglig process.' },
                { title: 'Säker betalning', desc: 'SSL-krypterad anslutning och säkra betalningslösningar skyddar dina uppgifter vid varje köp.' },
                { title: 'Personlig kundservice', desc: 'Vi är ett litet dedikerat team. Hör av dig via e-post eller telefon — vi svarar snabbt.' },
                { title: 'Rättvisa priser', desc: 'Noggrant utvalt sortiment med konkurrenskraftiga priser och regelbundna erbjudanden.' },
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
              Vi vill att det ska vara lika enkelt att köpa elektronik online som att gå in i en butik och prata med någon som kan sitt jobb. Tydlig information, ärliga priser och snabb hjälp när något krånglar.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Techpilots är fortfarande ett ungt företag, men vi bygger något vi är stolta över. Varje kund som väljer oss betyder något — och vi tänker fortsätta förtjäna det förtroendet.
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
