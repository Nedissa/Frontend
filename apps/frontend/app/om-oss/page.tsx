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
            <h2 className="font-bold mb-4">Elektronik utan krångel</h2>
            <p className="mb-4">
              Vi startade Techpilots med en enkel idé: näthandel med elektronik ska vara enkel, pålitlig och prisvärd. Varje produkt i vårt sortiment är noggrant utvald. Vi prioriterar kvalitet framför kvantitet.
            </p>
            <p>
              Oavsett vad du letar efter finns vi här för att navigera dig till rätt produkt.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">Därför Techpilots</h2>
            <p className="mb-4">
              Techpilots drivs av personer med erfarenhet från både tillverkare och detaljhandelskedjor inom teknikbranschen. Vi har arbetslivserfarenhet från företag som Intel, LG Electronics, MSI, Dyson, MediaMarkt, Elgiganten och Netonnet. Vi har varit med i produktlanseringar, testat hårdvara och byggt upp en djup förståelse för hur teknikmarknaden faktiskt fungerar.
            </p>
            <p className="mb-4">
              Den erfarenheten påverkar hur vi väljer vårt sortiment. Vi fokuserar inte på att erbjuda flest produkter, utan på att erbjuda produkter vi tror på och kan rekommendera med gott samvete.
            </p>
            <p className="mb-4">
              Till skillnad från många återförsäljare bygger och driftar vi själva webbplatser, servrar och e-handelslösningar. Teknik är inte bara produkterna vi säljer. Det är vårt dagliga arbete.
            </p>
            <p>
              När du kontaktar oss möter du inte ett automatiserat supportsystem. Du får hjälp av personer med praktisk erfarenhet av produkterna vi säljer.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">Våra värden</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">Kvalitet</h3>
                <p>Vi säljer bara produkter vi själva tror på, noggrant utvalda från etablerade varumärken med fullständig garanti.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Snabb leverans</h3>
                <p>Leverans inom 2–5 arbetsdagar, var du än bor i Sverige.</p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Kundservice</h3>
                <p>Vi är ett litet team som bryr oss på riktigt. Hör av dig så löser vi det.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-4">Varför handla hos oss?</h2>
            <ul className="space-y-3">
              <li><strong>Originalprodukter med garanti.</strong> Allt vi säljer kommer från auktoriserade leverantörer och omfattas av tillverkarens garanti.</li>
              <li><strong>Leverans inom 2–5 arbetsdagar.</strong> Vi skickar snabbt och når dig oavsett var i Sverige du bor.</li>
              <li><strong>30 dagars öppet köp.</strong> Ångrar du ditt köp returnerar du enkelt inom 30 dagar utan krångel.</li>
              <li><strong>Säker betalning.</strong> Vi accepterar kort (Visa, Mastercard), Swish och Klarna med SSL-kryptering.</li>
              <li><strong>Personlig kundservice.</strong> Du pratar alltid med en person som känner till produkterna vi säljer.</li>
              <li><strong>Rättvisa priser.</strong> Noggrant utvalt sortiment med konkurrenskraftiga priser och regelbundna erbjudanden.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">Vår ambition</h2>
            <p className="mb-4">
              Vi vill göra det lika enkelt att köpa elektronik online som att gå in och prata med någon som verkligen kan sitt jobb. Tydlig information, ärliga priser och snabb hjälp när något krånglar.
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
