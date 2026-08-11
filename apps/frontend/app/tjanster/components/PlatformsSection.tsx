'use client';
import { useLayoutEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  SiPayloadcms, SiSanity, SiContentful, SiMedusa, SiShopify, SiStripe, SiKlarna,
  SiHetzner, SiDigitalocean, SiSupabase, SiBrevo, SiNextdotjs, SiReact, SiTypescript,
  SiVercel, SiGoogleanalytics, SiGoogletagmanager, SiFramer, SiWebflow, SiWordpress,
  SiGit, SiClaude,
} from 'react-icons/si';
import SiHubspot from 'react-icons/si/SiHubspot';
import SiKlaviyo from 'react-icons/si/SiKlaviyo';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const CATEGORIES = ['Utvalda', 'Frontend', 'CMS', 'E-handel', 'Infrastruktur', 'Webbplattformar', 'CRM', 'Säkerhet', 'Verktyg'] as const;

type Category = (typeof CATEGORIES)[number];
type Tool = { name: string; category: Exclude<Category, 'Utvalda'>; featured?: boolean; icon: IconType | null; mono: string; desc: string };

const TOOLS: Tool[] = [
  { name: 'Payload', category: 'CMS', featured: true, icon: SiPayloadcms, mono: 'P', desc: 'Innehållshantering' },
  { name: 'Sanity', category: 'CMS', icon: SiSanity, mono: 'SA', desc: 'Headless CMS' },
  { name: 'Contentful', category: 'CMS', icon: SiContentful, mono: 'CF', desc: 'Headless CMS' },
  { name: 'Framer CMS', category: 'CMS', icon: SiFramer, mono: 'FR', desc: 'Headless CMS' },
  { name: 'Webflow CMS', category: 'CMS', icon: SiWebflow, mono: 'WF', desc: 'Headless CMS' },
  { name: 'Shopify CMS', category: 'CMS', icon: SiShopify, mono: 'SH', desc: 'E-handels-CMS' },
  { name: 'Medusa', category: 'E-handel', featured: true, icon: SiMedusa, mono: 'M', desc: 'E-handelsplattform' },
  { name: 'Shopify', category: 'E-handel', featured: true, icon: SiShopify, mono: 'SH', desc: 'E-handelsplattform' },
  { name: 'Stripe', category: 'E-handel', featured: true, icon: SiStripe, mono: 'ST', desc: 'Betallösning' },
  { name: 'Klarna', category: 'E-handel', icon: SiKlarna, mono: 'K', desc: 'Betallösning' },
  { name: 'Hetzner', category: 'Infrastruktur', featured: false, icon: SiHetzner, mono: 'H', desc: 'Serverdrift' },
  { name: 'Inleed', category: 'Infrastruktur', featured: false, icon: null, mono: 'I', desc: 'Serverdrift' },
  { name: 'DigitalOcean', category: 'Infrastruktur', icon: SiDigitalocean, mono: 'DO', desc: 'Serverdrift' },
  { name: 'Supabase', category: 'Infrastruktur', featured: false, icon: SiSupabase, mono: 'SB', desc: 'Databas & backend' },
  { name: 'HubSpot', category: 'CRM', featured: true, icon: null, mono: 'HS', desc: 'CRM & email' },
  { name: 'Klaviyo', category: 'CRM', featured: true, icon: null, mono: 'K', desc: 'E-commerce CRM' },
  { name: 'Brevo', category: 'CRM', featured: false, icon: SiBrevo, mono: 'B', desc: 'E-postutskick' },
  { name: 'Next.js', category: 'Frontend', featured: true, icon: SiNextdotjs, mono: 'N', desc: 'Ramverk' },
  { name: 'React', category: 'Frontend', featured: true, icon: SiReact, mono: 'R', desc: 'Ramverk' },
  { name: 'TypeScript', category: 'Frontend', icon: SiTypescript, mono: 'TS', desc: 'Programspråk' },
  { name: 'Vercel', category: 'Frontend', featured: true, icon: SiVercel, mono: 'V', desc: 'Driftsättning' },
  { name: 'Git', category: 'Verktyg', icon: SiGit, mono: 'G', desc: 'Versionshantering' },
  { name: 'VS Code', category: 'Verktyg', icon: null, mono: 'VS', desc: 'Kodredigerare' },
  { name: 'Claude AI', category: 'Verktyg', icon: SiClaude, mono: 'C', desc: 'AI-utveckling' },
  { name: 'Google Analytics', category: 'CRM', featured: false, icon: SiGoogleanalytics, mono: 'GA', desc: 'Webbanalys' },
  { name: 'Google Tag Manager', category: 'CRM', featured: false, icon: SiGoogletagmanager, mono: 'GT', desc: 'Taggning & spårning' },
  { name: 'Cookiebot', category: 'Säkerhet', featured: false, icon: null, mono: 'C', desc: 'GDPR & cookie-hantering' },
  { name: 'SSL/TLS', category: 'Säkerhet', featured: false, icon: null, mono: 'SSL', desc: 'Datakryptering' },
  { name: 'Hetzner Security', category: 'Säkerhet', featured: false, icon: null, mono: 'HS', desc: 'Firewall & DDoS-skydd' },
  { name: 'Framer', category: 'Webbplattformar', featured: false, icon: SiFramer, mono: 'F', desc: 'No-code-byggare' },
  { name: 'Webflow', category: 'Webbplattformar', featured: false, icon: SiWebflow, mono: 'W', desc: 'No-code-byggare' },
  { name: 'WordPress', category: 'Webbplattformar', icon: SiWordpress, mono: 'WP', desc: 'För kundens räkning' },
  { name: 'Shopify (Headless)', category: 'Webbplattformar', featured: false, icon: SiShopify, mono: 'SH', desc: 'Headless e-handel' },
];

const MOBILE_HIDDEN_CATEGORIES: readonly Category[] = ['Utvalda'];

const MOBILE_BREAKPOINT = 900;

export function PlatformsSection() {
  // Serverrendering vet inte skärmbredden, så starta alltid med "Utvalda" (matchar
  // desktop-defaulten) för att undvika hydration-mismatch. "Utvalda" och "GDPR" är
  // dolda på mobil — useLayoutEffect körs synkront innan webbläsaren målar första
  // framen, så bytet till "Frontend" på mobil sker utan synlig blink.
  const [active, setActive] = useState<Category>('Utvalda');

  useLayoutEffect(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setActive('Frontend');
    }
  }, []);

  const visible = active === 'Utvalda' ? TOOLS.filter((t) => t.featured) : TOOLS.filter((t) => t.category === active);

  const selectCategory = (cat: Category) => {
    setActive(cat);
    // På mobil ligger flikarna ovanför ikonlistan — glid ner till ikonerna direkt
    // vid byte, annars ser det ut som att inget hände förrän man scrollar själv.
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById('plattformar-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  };

  return (
    <section id="plattformar" className="section-padding" style={{ padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="08" label="Tech stack" extra="© 2026" />

        <FadeIn>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#030303',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '48px',
            }}
          >
            Plattformar
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="platform-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '56px', borderBottom: '1px solid rgb(230,230,230)', paddingBottom: '20px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={MOBILE_HIDDEN_CATEGORIES.includes(cat) ? 'platform-tab-hide-mobile' : undefined}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: active === cat ? '#030303' : 'rgb(104,105,99)',
                  borderBottom: active === cat ? '2px solid #030303' : '2px solid transparent',
                  paddingBottom: '8px',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        <div id="plattformar-grid" className="grid-platforms" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px 32px' }}>
          {visible.map((tool, i) => (
            <FadeIn key={tool.name} delay={i * 0.04}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: '#030303',
                    color: tool.featured ? '#e8c547' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: tool.mono.length > 1 ? '13px' : '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {tool.icon ? <tool.icon size={22} color="#e8c547" /> : tool.mono}
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#030303', letterSpacing: '-0.01em' }}>{tool.name}</div>
                  <div style={{ fontSize: '13px', color: 'rgb(104,105,99)', marginTop: '2px' }}>{tool.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
