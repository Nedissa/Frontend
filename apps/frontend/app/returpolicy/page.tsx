'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function ReturnPolicyPage() {
  return (
    <MainLayout>

      <InfoPageLayout title="Returpolicy" description="Enkla och rättvisa villkor för returer och byten." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Vårt löfte till dig</h2>
            <p className="mb-3">
              Du har <strong>30 dagars returrätt</strong> på alla köp hos Techpilots från det att du mottagit din order. Inga krångliga regler, ingen lång process.
            </p>
            <p>
              Det är mer än vad lagen kräver, för vi vill att du ska känna dig trygg när du handlar elektronik hos oss.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Returvillkor</h2>
            <p className="mb-4">
              Du har rätt att returnera en produkt inom <strong>30 dagar</strong> från mottagandet om produkten är oanvänd och i originalskick. För att en returering ska godkännas måste följande villkor uppfyllas:
            </p>
            <h4 className="font-bold mb-2">Produkten måste vara:</h4>
            <ul className="mb-4">
              <li>I originalskick och oanvänd</li>
              <li>I originalförpackning</li>
              <li>Med all tillbehör medföljade</li>
              <li>Utan synlig skada</li>
            </ul>
            <h4 className="font-bold mb-2">Du måste:</h4>
            <ul>
              <li>Initiera retur inom 30 dagar</li>
              <li>Skicka inom 30 dagar från mottagandet</li>
              <li>Betala returfrakt själv</li>
              <li>Inkludera faktura/följesedel</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Undantag från returrätt</h2>
            <p className="mb-4">Följande produkter är undantagna från returrätt:</p>
            <ul>
              <li>Förbrukningsvaror och öppna/använda produkter</li>
              <li>Kroppsnära produkter och hygienartiklar (t.ex. in-ear hörlurar)</li>
              <li>Spel och digitala produkter där serienummer/licens aktiverats</li>
              <li>Specialbeställda varor tillverkade enligt dina specifikationer</li>
              <li>Presentkort och gåvokort</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Returprocess - steg för steg</h2>
            <ol>
              <li><strong>Kontakta oss för godkännande.</strong> Skicka ett e-mail till support@techpilots.se med ditt ordernummer och anledningen till returningen. Du kan också ringa +46 10 880 09 81.</li>
              <li><strong>Få returetikett och godkännande.</strong> Vi granskar din returering och skickar instruktioner tillsammans med en returfraktsedel. Returering godkänns normalt inom 24 timmar.</li>
              <li><strong>Packa produkten säkert.</strong> Packa produkten i originalförpackningen tillsammans med all tillbehör och eventuell dokumentation. Se till att allt är väl skyddat för transporten.</li>
              <li><strong>Skicka tillbaka.</strong> Använd returetikettern och skicka paketet till vår returadress. Du måste skicka det inom 30 dagar från när du mottagit produkten. Spara ditt spårningsnummer.</li>
              <li><strong>Få pengaråterbetalning.</strong> När vi mottar och inspekterar produkten godkänner vi returningen. Du får pengaråterbetalning inom 5–7 arbetsdagar.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Vad gör jag om paketet är skadat?</h2>
            <ol>
              <li><strong>Inspektera omedelbart.</strong> Öppna paketet varsamt och inspektera produkten. Dokumentera all skada med tydliga bilder från flera vinklar.</li>
              <li><strong>Spara förpackningen.</strong> Behåll all originalförpackning och transportmaterial. Detta är viktigt för att vi ska kunna dokumentera skadan och få ersättning från försäkringen.</li>
              <li><strong>Kontakta oss inom 48 timmar.</strong> Skicka ett e-mail till support@techpilots.se eller ring +46 10 880 09 81 med ditt ordernummer och bilder av skadan.</li>
              <li><strong>Vi granskar och godkänner.</strong> Vi granskar bilderna och godkänner skadeanmälan. Du kommer att få instruktioner om nästa steg.</li>
              <li><strong>Vi skickar ersättning.</strong> Vi skickar en ny produkt eller pengaråterbetalning omedelbart efter godkännandet. Vi betalar frakten för bytet.</li>
            </ol>
            <p className="mt-4"><strong>Viktigt:</strong> Rapportera skador inom 48 timmar från mottagandet. Detta säkerställer att vi kan göra ett försäkringskrav hos transportören.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Garantikrav & defekta produkter</h2>
            <p className="mb-4">
              Alla produkter från Techpilots kommer med tillverkarens officiella garanti. Du har även rätt att reklamera fel i upp till 3 år från köpet.
            </p>
            <h4 className="font-bold mb-2">Vad gör jag om produkten är defekt?</h4>
            <ol>
              <li>Dokumentera defekten med bilder eller video</li>
              <li>Kontakta support@techpilots.se med ordernummer och dokumentation</li>
              <li>Vi erbjuder antingen byte eller pengaråterbetalning för defekta produkter</li>
              <li>Frakt täcks av oss för byte under garantiperioden</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Kontakt</h2>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81</p>
            <p><strong>Öppettider:</strong> Mån-Fre 09:00 - 17:00</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
