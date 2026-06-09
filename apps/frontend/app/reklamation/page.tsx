'use client';

import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function ReklamationPage() {
  return (
    <MainLayout>
      <InfoPageLayout title="Reklamation & Service" description="Har något gått fel med din produkt? Vi hjälper dig snabbt och enkelt." updatedDate="6 juni 2026" version="1.0">
        <div className="space-y-8">

          <section>
            <h2 className="font-bold mb-4">1. Dina rättigheter</h2>
            <p className="mb-3">Som konsument har du enligt svensk lag rätt att reklamera en produkt i upp till <strong>3 år</strong> från köpdatum om felet var ursprungligt, det vill säga att det fanns när du köpte produkten.</p>
            <p className="mb-3">Under de första <strong>2 åren</strong> är det vi som måste bevisa att felet inte var ursprungligt. Efter 2 år är det du som behöver visa att felet fanns redan vid köpet.</p>
            <p>Reklamationsrätten gäller utöver tillverkarens garanti och kan inte avtalas bort.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">2. Vad täcker reklamationsrätten?</h2>
            <h3 className="font-bold mb-2">Täcks av reklamation</h3>
            <ul className="mb-4">
              <li>Tillverkningsfel och materialfel</li>
              <li>Defekt batteri som inte håller laddning normalt</li>
              <li>Skärm som slutar fungera utan yttre påverkan</li>
              <li>Komponenter som inte fungerar som utlovat</li>
              <li>Programvarufel som beror på hårdvarudefekt</li>
            </ul>
            <h3 className="font-bold mb-2">Täcks inte av reklamation</h3>
            <ul>
              <li>Fysisk skada orsakad av dig (tappat, stött, krossat)</li>
              <li>Vattenskada eller fuktskada</li>
              <li>Normalt slitage (repor, nötning)</li>
              <li>Skada orsakad av felaktig installation eller användning</li>
              <li>Programvaruproblem som inte beror på hårdvaran</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">3. Så gör du en felanmälan</h2>
            <p className="mb-3">Gör din felanmälan via någon av dessa kanaler:</p>
            <ol>
              <li><strong>E-post (rekommenderas):</strong> Skicka till <strong>support@techpilots.se</strong> med ordernummer, beskrivning av felet och bilder eller video</li>
              <li><strong>Telefon:</strong> Ring oss på <strong>+46 10 880 09 81</strong> under öppettider Mån-Fre 09:00–17:00</li>
              <li><strong>Kontaktformulär:</strong> Via vår <Link href="/kontakt" className="underline hover:opacity-70">kontaktsida</Link></li>
            </ol>
            <p className="mt-3">En reklamation som görs inom <strong>2 månader</strong> från att felet upptäcktes anses alltid vara gjord i rätt tid.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">4. Vad ska felanmälan innehålla?</h2>
            <p className="mb-3">För att vi ska kunna hantera ditt ärende så snabbt som möjligt, inkludera:</p>
            <ul>
              <li><strong>Ordernummer.</strong> Finns i din orderbekräftelse via e-post.</li>
              <li><strong>Produktnamn och modell</strong></li>
              <li><strong>Beskrivning av felet.</strong> När uppstod det, hur visar det sig?</li>
              <li><strong>Bilder eller video.</strong> Dokumentera felet tydligt.</li>
              <li><strong>Inköpsdatum</strong></li>
              <li><strong>Dina kontaktuppgifter.</strong> Namn, e-post och telefonnummer.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold mb-4">5. Vad händer efter felanmälan?</h2>
            <ol>
              <li><strong>Vi bekräftar inom 24 timmar.</strong> Du får ett e-mail med ärendenummer.</li>
              <li><strong>Bedömning inom 3 arbetsdagar.</strong> Vi granskar din anmälan och bilder.</li>
              <li><strong>Vi meddelar beslut.</strong> Godkänd reklamation eller motiverat avslag.</li>
              <li><strong>Åtgärd.</strong> Vi erbjuder reparation, byte eller återbetalning beroende på situation.</li>
              <li><strong>Vi betalar frakten</strong> vid godkänd reklamation.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold mb-4">6. Reparation eller byte?</h2>
            <p className="mb-3">Vid godkänd reklamation väljer vi i första hand:</p>
            <ul>
              <li><strong>Reparation</strong> om produkten kan repareras inom rimlig tid</li>
              <li><strong>Byte</strong> om reparation inte är möjlig eller tar för lång tid</li>
              <li><strong>Återbetalning</strong> om varken reparation eller byte är möjligt</li>
            </ul>
            <p className="mt-3">Du har alltid rätt till prisavdrag eller hävning av köpet om vi inte kan åtgärda felet.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">7. Tillverkargaranti</h2>
            <p className="mb-3">Utöver din lagstadgade reklamationsrätt kommer de flesta elektronikprodukter med <strong>tillverkarens garanti</strong>, normalt 1–2 år.</p>
            <p className="mb-3">Tillverkargarantin kan ha egna villkor och hanteras ibland direkt av tillverkaren. Vi hjälper dig att kontakta rätt instans om det behövs.</p>
            <p>Tillverkargarantin ersätter inte din lagstadgade reklamationsrätt. Du har alltid rätt att vända dig till oss som säljare.</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">8. Tvist</h2>
            <p className="mb-3">Om vi inte kan komma överens kan du vända dig till <strong>Allmänna Reklamationsnämnden (ARN)</strong>:</p>
            <p className="mb-1">Box 174, 101 23 Stockholm</p>
            <p className="mb-3">arn.se</p>
            <p>Du kan även använda EU:s plattform för tvistlösning online: ec.europa.eu/consumers/odr</p>
          </section>

          <section>
            <h2 className="font-bold mb-4">9. Kontakt</h2>
            <p className="mb-1"><strong>E-post:</strong> support@techpilots.se</p>
            <p className="mb-1"><strong>Telefon:</strong> +46 10 880 09 81</p>
            <p className="mb-1"><strong>Öppettider:</strong> Mån-Fre 09:00–17:00</p>
            <p className="mt-3">Se även vår <Link href="/returpolicy" className="underline hover:opacity-70">returpolicy</Link> och <Link href="/villkor" className="underline hover:opacity-70">försäljningsvillkor</Link> för mer information.</p>
          </section>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
