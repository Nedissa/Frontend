'use client';

import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/app/components/MainLayout';

const fadeIn: React.CSSProperties = {
  animation: 'ks-fade-in 0.25s ease forwards',
};

const SECTIONS = [
  { id: 'kontakt', label: 'Kontakt' },
  { id: 'vanliga-fragor', label: 'Vanliga frågor' },
  { id: 'leverans', label: 'Leverans & Frakt' },
  { id: 'returer', label: 'Returer & Öppet köp' },
  { id: 'reklamation', label: 'Garanti & Reklamation' },
  { id: 'villkor', label: 'Försäljningsvillkor' },
  { id: 'integritet', label: 'Integritetspolicy' },
  { id: 'cookies', label: 'Cookiepolicy' },
];

export default function KundservicePage() {
  const [active, setActive] = useState('kontakt');
  const [animKey, setAnimKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (id: string) => {
    setActive(id);
    setAnimKey(k => k + 1);
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTIONS.find(s => s.id === hash)) navigate(hash);
  }, []);

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
      <style>{`
        @keyframes ks-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ks-nav-btn { color: #555 !important; }
        .ks-nav-btn.ks-active { color: #000 !important; }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', fontFamily: "'Inter', sans-serif" }}>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '8px' }}>Kundservice</h1>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '40px' }}>Vi hjälper dig med order, leverans, returer och allt däremellan.</p>

        {/* Mobile nav */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ width: '100%', padding: '12px 16px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '6px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {SECTIONS.find(s => s.id === active)?.label}
            <svg style={{ width: 16, height: 16, transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileOpen && (
            <div style={{ border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => { navigate(s.id); setMobileOpen(false); }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: s.id === active ? 700 : 400, background: s.id === active ? '#f5f5f5' : '#fff', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <nav className="hidden md:block" style={{ width: '220px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => navigate(s.id)}
                className={`ks-nav-btn${s.id === active ? ' ks-active' : ''}`}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                  fontSize: '0.875rem', fontWeight: s.id === active ? 700 : 400,
                  background: s.id === active ? '#f5f5f5' : 'transparent',
                  border: 'none', borderLeft: `2px solid ${s.id === active ? '#000' : 'transparent'}`,
                  cursor: 'pointer', marginBottom: '2px', borderRadius: '0 4px 4px 0',
                  transition: 'all 0.15s',
                }}>
                {s.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div key={animKey} style={{ flex: 1, minWidth: 0, ...fadeIn }}>

            {/* KONTAKT */}
            {active === 'kontakt' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Vi hjälper dig gärna</h2>
                <p style={{ color: '#666', marginBottom: '32px', fontSize: '0.95rem' }}>Har du frågor om en order, produkt eller något annat? Fyll i formuläret eller kontakta oss direkt.</p>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '8px' }}>Telefon</p>
                    <p style={{ fontWeight: 700, marginBottom: '4px' }}>+46 10 880 09 81</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Mån-Fre 09:00–17:00</p>
                  </div>
                  <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '8px' }}>E-post</p>
                    <p style={{ fontWeight: 700, marginBottom: '4px' }}>support@techpilots.se</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Svar inom 24 timmar</p>
                  </div>
                </div>

                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Skicka ett meddelande</h3>
                <div style={{ minHeight: '52px' }}>
                  {successMessage && <div style={{ padding: '12px 16px', background: '#14532d', border: '1px solid #166534', color: '#86efac', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>{successMessage}</div>}
                  {errorMessage && <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>{errorMessage}</div>}
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>Ditt namn</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Din e-post *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    </div>
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
                  <div>
                    <label style={labelStyle}>Rubrik *</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ditt meddelande *</label>
                    <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} required style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <button type="submit" disabled={isLoading} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.9rem', fontWeight: 700, borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, alignSelf: 'flex-start' }}>
                    {isLoading ? 'Skickar...' : 'Skicka meddelande'}
                  </button>
                </form>
              </div>
            )}

            {/* VANLIGA FRÅGOR */}
            {active === 'vanliga-fragor' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Vanliga frågor</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>Hittade du inte svaret? Ring +46 10 880 09 81 eller maila support@techpilots.se</p>
                {[
                  { title: 'Hur gör jag en beställning?', content: 'Lägg produkter i din varukorg, gå till kassan, fyll i dina uppgifter och välj betalningsmetod. Du får omedelbar orderbekräftelse via e-mail.' },
                  { title: 'Kan jag ändra min beställning?', content: 'Om din beställning inte redan skickats kan vi hjälpa dig. Kontakta omedelbart support@techpilots.se eller ring +46 10 880 09 81.' },
                  { title: 'Måste jag ha ett konto för att beställa?', content: 'Ja, du behöver registrera dig. Det tar bara några minuter och gör det enkelt att spåra dina beställningar.' },
                  { title: 'Hur lång tid tar leveransen?', content: 'Standardleverans tar 2–5 arbetsdagar. Express 1–2 arbetsdagar. Standardleverans är gratis, express kostar 99 kr.' },
                  { title: 'Hur spårar jag min beställning?', content: 'Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor för att se status.' },
                  { title: 'Vilka betalningsmetoder accepterar ni?', content: 'Vi accepterar kreditkort (Visa, Mastercard), Swish, PayPal och Klarna. Alla betalningar är SSL-krypterade.' },
                  { title: 'Kan jag returnera en produkt?', content: 'Ja, du har 30 dagars returrätt på alla köp. Produkten ska vara oanvänd och i originalskick. Du betalar returfrakten själv, och återbetalning sker inom 14 dagar efter godkänd retur.' },
                  { title: 'Har produkterna garanti?', content: 'Ja, alla produkter har tillverkarens garanti (normalt 2 år). Du har även lagstadgad reklamationsrätt i 3 år. Kontakta support@techpilots.se med ordernummer och bilder vid fel.' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* LEVERANS */}
            {active === 'leverans' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Leverans & Frakt</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>Standardleverans är gratis · Express 99 kr</p>
                {[
                  { title: 'Standardleverans', content: 'Fri frakt inom hela Sverige. Leveranstid 2–5 arbetsdagar via PostNord.' },
                  { title: 'Expressfrakt', content: 'Expressfrakt kostar 99 kr och levereras inom 1–2 arbetsdagar.' },
                  { title: 'Leveransområden', content: 'Vi skickar till hela Sverige utan extra kostnad. För leverans till Norge, Danmark, Finland och övriga EU kan vi erbjuda priser på förfrågan — kontakta oss på support@techpilots.se.' },
                  { title: 'Spåra din beställning', content: 'Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på Mina sidor och klicka på din order för att följa paketet direkt via PostNord.' },
                  { title: 'Förpackning & Säkerhet', content: 'Vi använder luftbubbelpapper, skumkuddar och stödjematerial för att säkerställa att produkterna anländer i perfekt skick. Alla försändelser är försäkrade för fullt värde.' },
                  { title: 'Skadat paket?', content: 'Om du mottar ett skadat paket — inspektera omedelbart, dokumentera med bilder och kontakta oss på support@techpilots.se inom 48 timmar med ditt ordernummer. Vi skickar ersättning eller ny produkt och betalar frakten.' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* RETURER */}
            {active === 'returer' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Returer & Öppet köp</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>30 dagars returrätt på alla köp</p>
                {[
                  { title: 'Returvillkor', content: 'För att en retur ska godkännas måste produkten vara oanvänd, i originalförpackning, med allt tillbehör och utan synlig skada. Du initierar returen inom 30 dagar och betalar returfrakten själv.' },
                  { title: 'Så gör du en retur', content: 'Kontakta oss på support@techpilots.se med ordernummer och anledning. Vi skickar instruktioner inom 24 timmar. Packa produkten säkert i originalförpackningen och skicka tillbaka med returfraktsedeln. Återbetalning sker inom 5–7 arbetsdagar efter godkänd retur.' },
                  { title: 'Undantag från returrätt', content: 'Returrätt gäller inte förbrukningsvaror, öppna eller använda produkter, kroppsnära produkter och hygienartiklar (t.ex. in-ear hörlurar), spel och digitala produkter där licens aktiverats, specialbeställda varor eller presentkort.' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* REKLAMATION */}
            {active === 'reklamation' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Garanti & Reklamation</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>3 års reklamationsrätt enligt lag</p>
                {[
                  { title: 'Reklamationsrätt', content: 'Du har lagstadgad reklamationsrätt i 3 år från köpdatum. Under de första 2 åren är det vi som måste bevisa att felet inte var ursprungligt.' },
                  { title: 'Vad täcks?', content: 'Reklamationsrätten täcker tillverkningsfel och materialfel, defekt batteri, skärm som slutar fungera utan yttre påverkan samt komponenter som inte fungerar som utlovat.' },
                  { title: 'Vad täcks inte?', content: 'Garantin täcker inte fysisk skada (tappat, stött), vattenskada, normalt slitage eller felaktig installation och användning.' },
                  { title: 'Så gör du en felanmälan', content: 'Maila support@techpilots.se med ordernummer, produktnamn, beskrivning av felet och bilder eller video. En reklamation som görs inom 2 månader från att felet upptäcktes anses alltid vara gjord i rätt tid. Du kan även ringa +46 10 880 09 81 mån-fre 09:00–17:00.' },
                  { title: 'Vad händer sen?', content: 'Vi bekräftar inom 24 timmar med ett ärendenummer. Bedömning sker inom 3 arbetsdagar. Vid godkänd reklamation erbjuder vi reparation, byte eller återbetalning — och vi betalar alltid frakten.' },
                  { title: 'Tvist', content: 'Om vi inte kan komma överens kan du vända dig till Allmänna Reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, arn.se. Du kan även använda EU:s plattform för tvistlösning: ec.europa.eu/consumers/odr' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* VILLKOR */}
            {active === 'villkor' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Försäljningsvillkor</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>Gäller från 1 januari 2025 · Version 1.0 · Senast uppdaterad 6 juni 2026</p>

                {[
                  { title: '1. Tillämplighet', content: 'Techpilots AB:s försäljningsvillkor gäller från och med 1 januari 2025 och ersätter tidigare publicerade försäljningsvillkor. Kund som beställer varor av Techpilots AB accepterar genom sin beställning dessa försäljningsvillkor.' },
                  { title: '2. Priser', content: 'Samtliga priser är angivna inklusive moms (25%). Alla priser är exklusive frakt där inget annat anges. Vi reserverar oss för prisfel och prisändringar. Vid uppenbart felaktigt prissatta varor förbehåller Techpilots AB sig rätten att annullera beställningen. Levererade varor förblir Techpilots AB:s egendom till dess full likvid erlagts.' },
                  { title: '3. Beställning', content: 'En beställning avlägges genom att fylla i beställningsformuläret på vår webbplats och genomföra en godkänd betalning. Vi skickar en orderbekräftelse per e-post. Vi förbehåller oss rätten att annullera beställning om beställd vara är slutsåld eller om beställningen verkar misstänkt eller bedräglig.' },
                  { title: '4. Betalning', content: 'För konsumenter sker betalning med betalkort (Visa, Mastercard), Swish, PayPal eller Klarna. Vi använder PCI DSS-certifierade betalningslösningar och lagrar aldrig dina fullständiga betalningsuppgifter.' },
                  { title: '5. Frakt och leverans', content: 'Leverans sker normalt genom PostNord inom 2–5 arbetsdagar. Standardleverans är gratis. Expressfrakt kostar 99 kr. Leveranstiderna är vägledande och inte garanterade. För försändelser som ej löses ut debiteras en avgift om 249 kr inklusive moms.' },
                  { title: '6. Transportskada', content: 'Kontrollera leveransen vid mottagandet. Vid transportskadad vara ska du omgående kontakta PostNord och reklamera godset, sedan kontakta Techpilots AB på support@techpilots.se med ordernummer och reklamationsnummer från PostNord.' },
                  { title: '7. Ångerrätt', content: 'Techpilots AB tillämpar 30 dagars öppet köp från mottagandet. Ångerrätt gäller inte förbrukningsvaror, kroppsnära produkter, hygienartiklar, spel, digitala produkter eller presentkort. Vid godkänd ångerrätt återbetalas hela beloppet inom 14 dagar.' },
                  { title: '8. Garanti och reklamation', content: 'Du har rätt att reklamera ursprungliga fel i upp till 3 år från köpdatum. Under de första 2 åren är det vi som måste bevisa att felet inte var ursprungligt. Reklamation ska göras inom 2 månader från att felet upptäcktes.' },
                  { title: '9. Ansvarsbegränsningar', content: 'Techpilots AB:s ansvar gentemot kund är begränsat till inköpspriset för aktuell vara. Vi ansvarar inte för indirekta skador eller följdskador.' },
                  { title: '10. Dataskydd', content: 'Vi behandlar din personliga data enligt GDPR. Din information används endast för att genomföra beställningar och förbättra vår service. Vi delar aldrig din data med tredjeparter utan ditt samtycke, förutom vid leverans och betalningshantering.' },
                  { title: '11. Tillämplig lag och tvister', content: 'Dessa villkor regleras av svensk lag. Tvist kan hänskjutas till Allmänna Reklamationsnämnden (ARN), Box 174, 101 23 Stockholm, eller online via europa.eu/consumers/odr.' },
                  { title: '12. Kontaktinformation', content: 'Techpilots AB · Skogshyddegatan 37, 506 31 Borås · Telefon: +46 10 880 09 81 · E-post: support@techpilots.se · Öppettider: Mån-Fre 09:00–17:00' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* INTEGRITETSPOLICY */}
            {active === 'integritet' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Integritetspolicy</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>Senast uppdaterad 6 juni 2026 · Techpilots AB</p>

                {[
                  { title: 'Personuppgiftsansvarig', content: 'Techpilots AB, org.nr 559385-5346, Skogshyddegatan 37, 506 31 Borås, är personuppgiftsansvarig för behandlingen av dina personuppgifter.' },
                  { title: 'Vilka uppgifter vi samlar in', content: 'Vi samlar in namn, e-postadress, leveransadress, telefonnummer och betalningsinformation när du handlar hos oss. Vi samlar även in tekniska uppgifter om din enhet och ditt beteende på sajten (IP-adress, webbläsare, klick) via cookies.' },
                  { title: 'Varför vi behandlar dina uppgifter', content: 'Vi behandlar dina uppgifter för att genomföra köp och leverans (avtalsgrund), skicka orderbekräftelser och statusuppdateringar (berättigat intresse), förbättra vår webbplats och kundupplevelse (berättigat intresse), samt skicka nyhetsbrev om du samtyckt till det.' },
                  { title: 'Hur länge vi sparar uppgifterna', content: 'Orderuppgifter sparas i 7 år enligt bokföringslagen. Nyhetsbrevsprenumerationer sparas tills du avregistrerar dig. Tekniska loggar raderas efter 12 månader.' },
                  { title: 'Dina rättigheter', content: 'Du har rätt att begära tillgång till dina uppgifter, rätta felaktiga uppgifter, begära radering ("rätten att bli glömd"), begränsa eller invända mot behandling, samt dataportabilitet. Kontakta oss på info@techpilots.se för att utöva dina rättigheter.' },
                  { title: 'Tredjeparter', content: 'Vi delar uppgifter med PostNord (leverans), Stripe och Klarna (betalning), Brevo (e-post), Vercel (webbhotell) och Google Analytics (statistik). Alla tredjeparter är GDPR-kompatibla och behandlar data enligt databehandlingsavtal.' },
                  { title: 'Klagomål', content: 'Om du anser att vi behandlar dina uppgifter felaktigt har du rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), imy.se.' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

            {/* COOKIEPOLICY */}
            {active === 'cookies' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Cookiepolicy</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '24px' }}>Senast uppdaterad 6 juni 2026 · Techpilots AB</p>

                {[
                  { title: 'Vad är cookies?', content: 'Cookies är små textfiler som lagras i din webbläsare när du besöker en webbplats. De används för att webbplatsen ska fungera korrekt, för att komma ihåg dina inställningar och för att förstå hur besökare använder sajten.' },
                  { title: 'Nödvändiga cookies', content: 'Dessa cookies krävs för att webbplatsen ska fungera. De lagrar exempelvis din varukorg, inloggningsstatus och preferenser. Du kan inte stänga av dessa utan att webbplatsen slutar fungera.' },
                  { title: 'Analyscookies', content: 'Vi använder Google Analytics för att förstå hur besökare navigerar på sajten. Dessa cookies samlar anonym statistik om sidvisningar, trafikkällor och användarflöden. Du kan tacka nej till dessa via vår cookiebanner.' },
                  { title: 'Marknadsföringscookies', content: 'Om du godkänner marknadsföringscookies kan vi visa relevanta annonser för dig på andra plattformar (t.ex. Google, Meta). Vi delar aldrig din identitet med dessa plattformar utan enbart anonymiserade signaler.' },
                  { title: 'Hantera dina val', content: 'Du kan när som helst ändra dina cookie-inställningar via vår cookiebanner (klicka på "Cookie-inställningar" i sidfoten) eller direkt i din webbläsares inställningar. Observera att blockering av cookies kan påverka webbplatsens funktionalitet.' },
                  { title: 'Kontakt', content: 'Frågor om vår cookiepolicy? Kontakta oss på info@techpilots.se eller +46 10 880 09 81.' },
                ].map(s => (
                  <section key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.8 }}>{s.content}</p>
                  </section>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
