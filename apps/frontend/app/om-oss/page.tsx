'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function AboutPage() {
  return (
    <MainLayout>
      <InfoPageLayout title="Om Techpilots" description="Techpilots är en svensk e-handelsaktör inom konsumentelektronik. Sedan starten 2024 erbjuder vi ett noggrant utvalt sortiment av hemelektronik och datortillbehör." >
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Elektronik utan krångel</h2>
            <p className="mb-4">
              Vi startade Techpilots för att näthandel med elektronik ska vara enkel, pålitlig och prisvärd. Allt vi säljer är noggrant utvalt. Vi prioriterar kvalitet framför kvantitet och ser till att varje produkt i sortimentet håller måttet.
            </p>
            <p>
              Oavsett om du byter ut en gammal dator, köper din första laptop eller bara behöver ett nytt tangentbord finns vi här för att hjälpa dig hitta rätt produkt.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Våra värden</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">Kvalitet</h3>
                <p>Vi säljer bara produkter vi själva skulle köpa. Noggrant utvalt sortiment från etablerade varumärken med fullständig garanti.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Snabb leverans</h3>
                <p>Vi levererar inom 1–3 arbetsdagar, var du än bor i Sverige.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Kundservice</h3>
                <p>Vi är ett litet team som bryr oss om varje kund. Hör av dig via e-post eller telefon så löser vi ditt ärende snabbt.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Varför handla hos oss?</h2>
            <ul className="space-y-3">
              <li><strong>Originalprodukter med garanti.</strong> Allt vi säljer kommer från auktoriserade leverantörer och omfattas av tillverkarens garanti.</li>
              <li><strong>Leverans inom 1–3 arbetsdagar.</strong> Vi skickar snabbt och når dig normalt inom 1–3 arbetsdagar, oavsett var i Sverige du bor.</li>
              <li><strong>30 dagars öppet köp.</strong> Ångrar du ditt köp returnerar du enkelt inom 30 dagar, inga krångliga regler.</li>
              <li><strong>Säker betalning.</strong> Vi accepterar kort (Visa, Mastercard), Swish, PayPal och Klarna med SSL-kryptering.</li>
              <li><strong>Personlig kundservice.</strong> Hör av dig via e-post eller telefon under öppettider så svarar vi så snabbt vi kan.</li>
              <li><strong>Rättvisa priser.</strong> Noggrant utvalt sortiment med konkurrenskraftiga priser och regelbundna erbjudanden på elektronik.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Vår ambition</h2>
            <p className="mb-4">
              Vi vill att det ska vara lika enkelt att köpa elektronik online som att gå in i en butik och prata med någon som kan sitt jobb. Tydlig information, ärliga priser och snabb hjälp när något krånglar.
            </p>
            <p>
              Techpilots är ett ungt företag men vi bygger något vi är stolta över. Varje kund som väljer oss betyder något och vi tänker fortsätta förtjäna det förtroendet.
            </p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
