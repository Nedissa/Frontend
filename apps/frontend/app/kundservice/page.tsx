'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/MainLayout';
import { InfoPageLayout } from '@/app/components/PageHero';

export default function KundservicePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: `[${topic}] ${subject}`, message, recipientEmail: 'info@techpilots.se' }),
      });
      if (response.ok) {
        setSuccessMessage('Tack! Vi svarar inom 24 timmar.');
        setName(''); setEmail(''); setSubject(''); setTopic(''); setMessage('');
      } else {
        setErrorMessage('Ett fel uppstod. Försök igen senare.');
      }
    } catch {
      setErrorMessage('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: '0.875rem',
    background: '#f5f5f5', border: '1px solid #e5e7eb', color: '#111',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: '4px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '5px',
  };

  return (
    <MainLayout>
      <InfoPageLayout title="Kundservice" description="Vi hjälper dig med order, leverans, returer och allt däremellan. Vi svarar inom 24 timmar.">
        <div className="space-y-8">

          <h2 className="font-bold mb-4">Kontakta oss</h2>
          <p><strong>Telefon:</strong> +46 10 880 09 81 — Mån-Fre 09:00–17:00</p>
          <p><strong>E-post:</strong> support@techpilots.se — Svar inom 24 timmar</p>

          <div style={{ minHeight: '52px', marginTop: '16px' }}>
            {successMessage && <div style={{ padding: '12px 16px', background: '#14532d', border: '1px solid #166534', color: '#86efac', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>{successMessage}</div>}
            {errorMessage && <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>{errorMessage}</div>}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div><label style={labelStyle}>Ditt namn</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Din e-post *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /></div>
            </div>
            <div>
              <label style={labelStyle}>Ämne</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Välj kategori...</option>
                <option value="Order">Order & leverans</option>
                <option value="Retur">Retur & byte</option>
                <option value="Reklamation">Reklamation</option>
                <option value="Produkt">Produktfråga</option>
                <option value="Annat">Annat</option>
              </select>
            </div>
            <div><label style={labelStyle}>Rubrik *</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Ditt meddelande *</label><textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} required style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <button type="submit" disabled={isLoading} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.9rem', fontWeight: 700, borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, alignSelf: 'flex-start' }}>
              {isLoading ? 'Skickar...' : 'Skicka meddelande'}
            </button>
          </form>

          <h2 className="font-bold mb-4">Vanliga frågor</h2>
          <h3>Hur gör jag en beställning?</h3>
          <p>Lägg produkter i din varukorg, gå till kassan, fyll i dina uppgifter och välj betalningsmetod. Du får omedelbar orderbekräftelse via e-mail.</p>
          <h3>Kan jag ändra min beställning?</h3>
          <p>Om din beställning inte redan skickats kan vi hjälpa dig. Kontakta omedelbart support@techpilots.se eller ring +46 10 880 09 81.</p>
          <h3>Måste jag ha ett konto för att beställa?</h3>
          <p>Ja, du behöver registrera dig. Det tar bara några minuter och gör det enkelt att spåra dina beställningar.</p>
          <h3>Hur lång tid tar leveransen?</h3>
          <p>Standardleverans tar 2–5 arbetsdagar. Express 1–2 arbetsdagar. Standardleverans är gratis, express kostar 99 kr.</p>
          <h3>Hur spårar jag min beställning?</h3>
          <p>Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor för att se status.</p>
          <h3>Vilka betalningsmetoder accepterar ni?</h3>
          <p>Vi accepterar kreditkort (Visa, Mastercard), Swish, PayPal och Klarna. Alla betalningar är SSL-krypterade.</p>
          <h3>Kan jag returnera en produkt?</h3>
          <p>Ja, du har 30 dagars returrätt på alla köp. Produkten ska vara oanvänd och i originalskick. Du betalar returfrakten själv, och återbetalning sker inom 14 dagar efter godkänd retur.</p>
          <h3>Har produkterna garanti?</h3>
          <p>Ja, alla produkter har tillverkarens garanti (normalt 2 år). Du har även lagstadgad reklamationsrätt i 3 år. Kontakta support@techpilots.se med ordernummer och bilder vid fel.</p>

          <h2 className="font-bold mb-4">Leverans & Frakt</h2>
          <h3>Standardleverans</h3>
          <p>Fri frakt inom hela Sverige. Leveranstid 2–5 arbetsdagar via PostNord.</p>
          <h3>Expressfrakt</h3>
          <p>Expressfrakt kostar 99 kr och levereras inom 1–2 arbetsdagar.</p>
          <h3>Leveransområden</h3>
          <p>Vi skickar till hela Sverige utan extra kostnad. För leverans till Norge, Danmark, Finland och övriga EU kan vi erbjuda priser på förfrågan — kontakta oss på support@techpilots.se.</p>
          <h3>Spåra din beställning</h3>
          <p>Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor och klicka på din order för att följa paketet direkt via PostNord.</p>
          <h3>Skadat paket?</h3>
          <p>Om du mottar ett skadat paket — inspektera omedelbart, dokumentera med bilder och kontakta oss på support@techpilots.se inom 48 timmar med ditt ordernummer. Vi skickar ersättning eller ny produkt och betalar frakten.</p>

          <h2 className="font-bold mb-4">Returer & Öppet köp</h2>
          <h3>Returvillkor</h3>
          <p>Du har 30 dagars returrätt på alla köp. Produkten ska vara oanvänd, i originalförpackning, med allt tillbehör och utan synlig skada. Du initierar returen inom 30 dagar och betalar returfrakten själv.</p>
          <h3>Så gör du en retur</h3>
          <p>Kontakta oss på support@techpilots.se med ordernummer och anledning. Vi skickar instruktioner inom 24 timmar. Packa produkten säkert i originalförpackningen och skicka tillbaka med returfraktsedeln. Återbetalning sker inom 5–7 arbetsdagar efter godkänd retur.</p>
          <h3>Undantag från returrätt</h3>
          <p>Returrätt gäller inte förbrukningsvaror, öppna eller använda produkter, kroppsnära produkter och hygienartiklar (t.ex. in-ear hörlurar), spel och digitala produkter där licens aktiverats, specialbeställda varor eller presentkort.</p>

          <h2 className="font-bold mb-4">Garanti & Reklamation</h2>
          <h3>Reklamationsrätt</h3>
          <p>Du har lagstadgad reklamationsrätt i 3 år från köpdatum. Under de första 2 åren är det vi som måste bevisa att felet inte var ursprungligt.</p>
          <h3>Vad täcks?</h3>
          <p>Reklamationsrätten täcker tillverkningsfel och materialfel, defekt batteri, skärm som slutar fungera utan yttre påverkan samt komponenter som inte fungerar som utlovat.</p>
          <h3>Vad täcks inte?</h3>
          <p>Garantin täcker inte fysisk skada (tappat, stött), vattenskada, normalt slitage eller felaktig installation och användning.</p>
          <h3>Så gör du en felanmälan</h3>
          <p>Maila support@techpilots.se med ordernummer, produktnamn, beskrivning av felet och bilder eller video. En reklamation som görs inom 2 månader från att felet upptäcktes anses alltid vara gjord i rätt tid.</p>
          <h3>Vad händer sen?</h3>
          <p>Vi bekräftar inom 24 timmar med ett ärendenummer. Bedömning sker inom 3 arbetsdagar. Vid godkänd reklamation erbjuder vi reparation, byte eller återbetalning — och vi betalar alltid frakten.</p>
          <h3>Tvist</h3>
          <p>Om vi inte kan komma överens kan du vända dig till Allmänna Reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, arn.se. Du kan även använda EU:s plattform för tvistlösning: ec.europa.eu/consumers/odr</p>

          <h2 className="font-bold mb-4">Försäljningsvillkor</h2>
          <p style={{ color: '#888', fontSize: '0.8rem' }}>Gäller från 1 januari 2025 · Version 1.0 · Senast uppdaterad 6 juni 2026</p>
          <h3>1. Tillämplighet</h3>
          <p>Techpilots AB:s försäljningsvillkor gäller från och med 1 januari 2025 och ersätter tidigare publicerade försäljningsvillkor. Kund som beställer varor av Techpilots AB accepterar genom sin beställning dessa försäljningsvillkor.</p>
          <h3>2. Priser</h3>
          <p>Samtliga priser är angivna inklusive moms (25%). Alla priser är exklusive frakt där inget annat anges. Vi reserverar oss för prisfel och prisändringar.</p>
          <h3>3. Beställning</h3>
          <p>En beställning genomförs via vår webbplats med godkänd betalning. Vi skickar orderbekräftelse per e-post. Vi förbehåller oss rätten att annullera beställningar vid slutsålda varor eller misstänkt bedrägeri.</p>
          <h3>4. Betalning</h3>
          <p>Vi accepterar betalkort (Visa, Mastercard), Swish, PayPal och Klarna. Vi använder PCI DSS-certifierade betalningslösningar och lagrar aldrig dina fullständiga betalningsuppgifter.</p>
          <h3>5. Frakt och leverans</h3>
          <p>Leverans sker via PostNord inom 2–5 arbetsdagar. Standardleverans är gratis. Expressfrakt kostar 99 kr. För försändelser som ej löses ut debiteras en avgift om 249 kr inklusive moms.</p>
          <h3>6. Ångerrätt</h3>
          <p>Techpilots AB tillämpar 30 dagars öppet köp från mottagandet. Ångerrätt gäller inte förbrukningsvaror, kroppsnära produkter, spel, digitala produkter eller presentkort. Vid godkänd ångerrätt återbetalas hela beloppet inom 14 dagar.</p>
          <h3>7. Garanti och reklamation</h3>
          <p>Du har rätt att reklamera ursprungliga fel i upp till 3 år från köpdatum. Reklamation ska göras inom 2 månader från att felet upptäcktes.</p>
          <h3>8. Dataskydd</h3>
          <p>Vi behandlar din personliga data enligt GDPR. Vi delar aldrig din data med tredjeparter utan ditt samtycke, förutom vid leverans och betalningshantering.</p>
          <h3>9. Tillämplig lag och tvister</h3>
          <p>Dessa villkor regleras av svensk lag. Tvist kan hänskjutas till Allmänna Reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, eller online via europa.eu/consumers/odr.</p>
          <h3>10. Kontaktinformation</h3>
          <p>Techpilots AB · Skogshyddegatan 37, 506 31 Borås · Telefon: +46 10 880 09 81 · E-post: support@techpilots.se · Öppettider: Mån-Fre 09:00–17:00</p>

          <h2 className="font-bold mb-4">Integritetspolicy</h2>
          <p style={{ color: '#888', fontSize: '0.8rem' }}>Senast uppdaterad 6 juni 2026 · Techpilots AB</p>
          <h3>Personuppgiftsansvarig</h3>
          <p>Techpilots AB, org.nr 559385-5346, Skogshyddegatan 37, 506 31 Borås, är personuppgiftsansvarig för behandlingen av dina personuppgifter.</p>
          <h3>Vilka uppgifter vi samlar in</h3>
          <p>Vi samlar in namn, e-postadress, leveransadress, telefonnummer och betalningsinformation när du handlar hos oss. Vi samlar även in tekniska uppgifter om din enhet via cookies.</p>
          <h3>Varför vi behandlar dina uppgifter</h3>
          <p>Vi behandlar dina uppgifter för att genomföra köp och leverans, skicka orderbekräftelser och statusuppdateringar, samt förbättra vår webbplats och kundupplevelse.</p>
          <h3>Hur länge vi sparar uppgifterna</h3>
          <p>Orderuppgifter sparas i 7 år enligt bokföringslagen. Nyhetsbrevsprenumerationer sparas tills du avregistrerar dig. Tekniska loggar raderas efter 12 månader.</p>
          <h3>Dina rättigheter</h3>
          <p>Du har rätt att begära tillgång till, rätta, radera eller begränsa behandlingen av dina uppgifter. Kontakta oss på info@techpilots.se för att utöva dina rättigheter.</p>
          <h3>Klagomål</h3>
          <p>Om du anser att vi behandlar dina uppgifter felaktigt har du rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), imy.se.</p>

          <h2 className="font-bold mb-4">Cookiepolicy</h2>
          <h3>Vad är cookies?</h3>
          <p>Cookies är små textfiler som lagras i din webbläsare när du besöker en webbplats. De används för att webbplatsen ska fungera korrekt och för att förstå hur besökare använder sajten.</p>
          <h3>Nödvändiga cookies</h3>
          <p>Dessa cookies krävs för att webbplatsen ska fungera, t.ex. din varukorg och inloggningsstatus. Du kan inte stänga av dessa utan att webbplatsen slutar fungera.</p>
          <h3>Analyscookies</h3>
          <p>Vi använder Google Analytics för att förstå hur besökare navigerar på sajten. Du kan tacka nej till dessa via vår cookiebanner.</p>
          <h3>Hantera dina val</h3>
          <p>Du kan när som helst ändra dina cookie-inställningar via vår cookiebanner eller direkt i din webbläsares inställningar.</p>

        </div>
      </InfoPageLayout>
    </MainLayout>
  );
}
