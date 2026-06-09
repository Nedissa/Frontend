'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function ShippingPage() {
  return (
    <MainLayout>

      <InfoPageLayout title="Frakt och leverans" description="Snabb leverans direkt till din dörr." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Leveransalternativ</h2>
            <h3 className="font-bold mb-1">Standardleverans</h3>
            <p className="mb-1">Leverans inom 1–3 arbetsdagar.</p>
            <p className="mb-4"><strong>Kostnad:</strong> Gratis inom hela Sverige</p>
            <h3 className="font-bold mb-1">Express-leverans</h3>
            <p className="mb-1">Leverans samma dag eller nästa dag för brådskande ordrar.</p>
            <p><strong>Kostnad:</strong> 199 SEK. Beställ före 12:00.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Leveranstider</h2>
            <p>Vi levererar normalt inom <strong>1–3 arbetsdagar</strong> från beställning. Leveranstider är vägledande och inte garanterade. Helger och helgdagar räknas inte.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Leveransområden</h2>
            <p className="mb-4">Vi skickar till hela Sverige utan extra kostnad. För leverans till övriga Norden kan vi erbjuda priser på förfrågan.</p>
            <h3 className="font-bold mb-2">Internationellt (på förfrågan)</h3>
            <ul className="mb-4">
              <li>Norge</li>
              <li>Danmark</li>
              <li>Finland</li>
              <li>Övriga EU</li>
            </ul>
            <p>Kontakta oss för priser på internationell leverans: +46 10 880 09 81 eller support@techpilots.se</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Spåra din beställning</h2>
            <ol>
              <li><strong>Logga in på ditt konto.</strong> Gå till "Mitt konto" och navigera till "Mina beställningar".</li>
              <li><strong>Hitta din beställning.</strong> Välj den beställning du vill spåra från listan.</li>
              <li><strong>Klicka på spårningsnummret.</strong> Du kommer då direkt till PostNords spårningssystem.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Förpackning & Säkerhet</h2>
            <p className="mb-3">Vi är mycket noga med förpackningen för att säkerställa att dina produkter anländer i perfekt skick:</p>
            <ul className="mb-6">
              <li><strong>Skyddande material:</strong> Vi använder luftbubbelpapper, skumkuddar och stödjematerial</li>
              <li><strong>Försäkrat frakt:</strong> Alla shipment är försäkrade för full värde</li>
              <li><strong>Miljövänligt:</strong> Vi använder återvunnet material när möjligt</li>
              <li><strong>Korrekt etikett:</strong> Alla paket är korrekt etiketterade</li>
            </ul>

            <h3 className="font-bold mb-2">Vad gör jag om paketet är skadat?</h3>
            <p className="mb-3">Om du mottar ett skadat paket, följ dessa steg:</p>
            <ol className="mb-4">
              <li><strong>Inspektera paketet omedelbart.</strong> Öppna varsamt och dokumentera all skada med bilder från flera vinklar.</li>
              <li><strong>Spara förpackningen.</strong> Behåll all originalförpackning och transportmaterial för försäkringskravet.</li>
              <li><strong>Kontakta oss inom 48 timmar.</strong> Skicka e-mail till support@techpilots.se eller ring +46 10 880 09 81 med ordernummer och bilder.</li>
              <li><strong>Vi granskar och godkänner.</strong> Du får instruktioner om nästa steg.</li>
              <li><strong>Vi skickar ersättning eller ny produkt.</strong> Vi betalar frakten.</li>
            </ol>
            <p><strong>Viktigt:</strong> Rapportera skador inom 48 timmar från mottagandet.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Vanliga returer (ångra köp)</h2>
            <p className="mb-3">Du har <strong>30 dagars returrätt</strong> på alla köp hos Techpilots. Ångrar du ditt köp kontaktar du oss bara så löser vi det.</p>
            <ol className="mb-4">
              <li><strong>Kontakta oss för godkännande.</strong> Skicka e-mail till support@techpilots.se med ordernummer och anledningen.</li>
              <li><strong>Få returetikett.</strong> Vi skickar instruktioner med returetikett normalt inom 24 timmar.</li>
              <li><strong>Packa produkten.</strong> Originalförpackning med all tillbehör. Måste vara oanvänd.</li>
              <li><strong>Skicka tillbaka.</strong> Inom 30 dagar från mottagandet. Du betalar returfrakten själv.</li>
              <li><strong>Få pengaråterbetalning.</strong> Inom 5–7 arbetsdagar efter godkänd retur.</li>
            </ol>
            <p>Se vår <Link href="/returpolicy" className="underline hover:opacity-70">detaljerade returpolicy</Link> för alla villkor.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Kontakt</h2>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81 (Mån-Fre 09:00–17:00)</p>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p><Link href="/faq" className="underline hover:opacity-70">Besök vår FAQ</Link> för fler vanliga frågor om frakt.</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
