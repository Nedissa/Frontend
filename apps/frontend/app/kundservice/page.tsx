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
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                  fontSize: '0.875rem', fontWeight: s.id === active ? 700 : 400,
                  color: s.id === active ? '#000' : '#555',
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
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Vanliga frågor</h2>

                <section>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Beställning</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Hur gör jag en beställning?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Lägg produkter i din varukorg, gå till kassan, fyll i dina uppgifter och välj betalningsmetod. Du får omedelbar orderbekräftelse via e-mail.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Kan jag ändra min beställning efter att jag lagt den?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Om din beställning inte redan skickats kan vi hjälpa dig. Kontakta omedelbart support@techpilots.se eller ring +46 10 880 09 81.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Måste jag ha ett konto för att beställa?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Ja, du behöver registrera dig. Det tar bara några minuter och gör det enkelt att spåra dina beställningar.</p></div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Leverans & Frakt</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Hur lång tid tar leveransen?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Standardleverans tar 2–5 arbetsdagar. Express 1–2 arbetsdagar.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Är frakt kostnadsfritt?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Standardleverans är gratis inom Sverige. Express kostar 99 kr.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Hur kan jag spåra min beställning?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Du får ett spårningsnummer via e-mail när din beställning skickas. Logga även in på Mina sidor för att se status.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Levererar ni utanför Sverige?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Vi levererar för närvarande till Sverige. Leverans till övriga Norden kan diskuteras på förfrågan.</p></div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Betalning</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Vilka betalningsmetoder accepterar ni?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Vi accepterar kreditkort (Visa, Mastercard), Swish, PayPal och Klarna.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Är det säkert att betala online?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Ja. Vi använder SSL-kryptering och är PCI DSS-certifierade. Vi lagrar aldrig dina fullständiga betalningsuppgifter.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Varför blev min betalning nekad?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Kontrollera att ditt betalningsmedel är giltigt och att beloppet finns tillgängligt. Kontakta din bank eller försök med en annan metod.</p></div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Returer & Ångerrätt</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Kan jag returnera en produkt?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Ja, du har 30 dagars returrätt på alla köp. Produkten ska vara oanvänd och i originalskick.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Betalar jag returfrakten?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Ja, du betalar returfrakten själv vid vanlig retur. Vid reklamation betalar vi.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Hur länge tar det att få återbetalt?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Du får återbetalning inom 14 dagar från att vi mottagit och godkänt din retur.</p></div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Garanti & Reklamation</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Har produkterna garanti?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Ja, alla produkter har tillverkarens garanti (normalt 2 år). Du har även lagstadgad reklamationsrätt i 3 år.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Vad täcker inte garantin?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Garantin täcker inte slitage, felaktig användning, olyckor, vattenskador eller skador från felaktig installation.</p></div>
                    <div><p style={{ fontWeight: 600, marginBottom: '4px' }}>Hur gör jag ett garantikrav?</p><p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Kontakta support@techpilots.se med ordernummer och beskrivning av problemet. Bifoga gärna bilder.</p></div>
                  </div>
                </section>

                <div style={{ marginTop: '8px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 700, marginBottom: '4px' }}>Hittade du inte svaret?</p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>Ring oss på <strong>+46 10 880 09 81</strong> eller maila <strong>support@techpilots.se</strong> — vi svarar inom 24 timmar.</p>
                </div>
              </div>
            )}

            {/* LEVERANS */}
            {active === 'leverans' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Leverans & Frakt</h2>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Leveransalternativ</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: '200px', padding: '20px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 700, marginBottom: '4px' }}>Standardleverans</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Gratis</p>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>2–5 arbetsdagar inom Sverige</p>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', padding: '20px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 700, marginBottom: '4px' }}>Express</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>99 kr</p>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>1–2 arbetsdagar</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Leveransområden</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>Vi skickar till hela Sverige utan extra kostnad. För leverans till Norge, Danmark, Finland och övriga EU kan vi erbjuda priser på förfrågan — kontakta oss på support@techpilots.se.</p>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Spåra din beställning</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>Du får ett spårningsnummer via e-mail när din beställning skickas. Du kan även logga in på <strong>Mina sidor</strong> och klicka på din order för att följa paketet direkt via PostNord.</p>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Förpackning & Säkerhet</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>Vi använder luftbubbelpapper, skumkuddar och stödjematerial för att säkerställa att produkterna anländer i perfekt skick. Alla försändelser är försäkrade för fullt värde.</p>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Skadat paket?</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>Om du mottar ett skadat paket — inspektera omedelbart, dokumentera med bilder och kontakta oss på support@techpilots.se inom <strong>48 timmar</strong> med ditt ordernummer. Vi skickar ersättning eller ny produkt och betalar frakten.</p>
                </section>
              </div>
            )}

            {/* RETURER */}
            {active === 'returer' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Returer & Öppet köp</h2>
                <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '24px' }}>Du har <strong>30 dagars returrätt</strong> på alla köp hos oss — mer än vad lagen kräver.</p>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Returvillkor</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>För att en retur ska godkännas måste produkten vara oanvänd, i originalförpackning, med allt tillbehör och utan synlig skada. Du initierar returen inom 30 dagar och betalar returfrakten själv.</p>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Returprocess — steg för steg</h3>
                  <ol style={{ paddingLeft: '20px', color: '#555', fontSize: '0.9rem', lineHeight: 2 }}>
                    <li><strong>Kontakta oss.</strong> Maila support@techpilots.se med ordernummer och anledning.</li>
                    <li><strong>Få returetikett.</strong> Vi skickar instruktioner inom 24 timmar.</li>
                    <li><strong>Packa produkten säkert.</strong> Originalförpackning med all tillbehör.</li>
                    <li><strong>Skicka tillbaka.</strong> Använd returfraktsedeln och spara ditt spårningsnummer.</li>
                    <li><strong>Återbetalning.</strong> Inom 5–7 arbetsdagar efter godkänd retur.</li>
                  </ol>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Undantag från returrätt</h3>
                  <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '0.9rem', lineHeight: 2 }}>
                    <li>Förbrukningsvaror och öppna/använda produkter</li>
                    <li>Kroppsnära produkter och hygienartiklar (t.ex. in-ear hörlurar)</li>
                    <li>Spel och digitala produkter där licens aktiverats</li>
                    <li>Specialbeställda varor</li>
                    <li>Presentkort</li>
                  </ul>
                </section>
              </div>
            )}

            {/* REKLAMATION */}
            {active === 'reklamation' && (
              <div className="space-y-8">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Garanti & Reklamation</h2>
                <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '24px' }}>Du har lagstadgad reklamationsrätt i <strong>3 år</strong> från köpdatum. Under de första 2 åren är det vi som måste bevisa att felet inte var ursprungligt.</p>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Vad täcker reklamationsrätten?</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#16a34a' }}>✓ Täcks</p>
                      <ul style={{ paddingLeft: '16px', color: '#555', fontSize: '0.875rem', lineHeight: 1.9 }}>
                        <li>Tillverkningsfel och materialfel</li>
                        <li>Defekt batteri</li>
                        <li>Skärm som slutar fungera utan yttre påverkan</li>
                        <li>Komponenter som inte fungerar som utlovat</li>
                      </ul>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#dc2626' }}>✗ Täcks inte</p>
                      <ul style={{ paddingLeft: '16px', color: '#555', fontSize: '0.875rem', lineHeight: 1.9 }}>
                        <li>Fysisk skada (tappat, stött)</li>
                        <li>Vattenskada</li>
                        <li>Normalt slitage</li>
                        <li>Felaktig installation eller användning</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Så gör du en felanmälan</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>Maila <strong>support@techpilots.se</strong> med ordernummer, produktnamn, beskrivning av felet och bilder eller video. En reklamation som görs inom <strong>2 månader</strong> från att felet upptäcktes anses alltid vara gjord i rätt tid.</p>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Du kan även ringa <strong>+46 10 880 09 81</strong> mån-fre 09:00–17:00.</p>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Vad händer efter felanmälan?</h3>
                  <ol style={{ paddingLeft: '20px', color: '#555', fontSize: '0.9rem', lineHeight: 2 }}>
                    <li><strong>Vi bekräftar inom 24 timmar</strong> med ett ärendenummer.</li>
                    <li><strong>Bedömning inom 3 arbetsdagar.</strong> Vi granskar anmälan och bilder.</li>
                    <li><strong>Vi meddelar beslut</strong> — godkänd reklamation eller motiverat avslag.</li>
                    <li><strong>Åtgärd.</strong> Reparation, byte eller återbetalning beroende på situation.</li>
                    <li><strong>Vi betalar frakten</strong> vid godkänd reklamation.</li>
                  </ol>
                </section>

                <section>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Tvist</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>Om vi inte kan komma överens kan du vända dig till <strong>Allmänna Reklamationsnämnden (ARN)</strong>, Box 174, 101 23 Stockholm — arn.se. Du kan även använda EU:s plattform för tvistlösning: ec.europa.eu/consumers/odr</p>
                </section>
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

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
