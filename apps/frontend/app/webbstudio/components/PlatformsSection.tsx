'use client';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  SiPayloadcms, SiSanity, SiContentful, SiMedusa, SiShopify, SiStripe, SiKlarna,
  SiHetzner, SiDigitalocean, SiSupabase, SiBrevo, SiNextdotjs, SiReact, SiTypescript,
  SiVercel, SiGoogleanalytics, SiGoogletagmanager, SiFramer, SiWebflow, SiWordpress,
} from 'react-icons/si';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const CATEGORIES = ['Utvalda', 'Frontend', 'CMS', 'E-handel', 'Backend & VPS', 'Webbplattformar', 'Marknadsföring', 'GDPR'] as const;

type Category = (typeof CATEGORIES)[number];
type Tool = { name: string; category: Exclude<Category, 'Utvalda'>; featured?: boolean; icon: IconType | null; mono: string; desc: string };

const TOOLS: Tool[] = [
  { name: 'Payload', category: 'CMS', featured: true, icon: SiPayloadcms, mono: 'P', desc: 'Innehållshantering' },
  { name: 'Sanity', category: 'CMS', icon: SiSanity, mono: 'SA', desc: 'Headless CMS' },
  { name: 'Contentful', category: 'CMS', icon: SiContentful, mono: 'CF', desc: 'Headless CMS' },
  { name: 'Medusa', category: 'E-handel', featured: true, icon: SiMedusa, mono: 'M', desc: 'E-handelsplattform' },
  { name: 'Shopify', category: 'E-handel', featured: true, icon: SiShopify, mono: 'SH', desc: 'E-handelsplattform' },
  { name: 'Stripe', category: 'E-handel', featured: true, icon: SiStripe, mono: 'ST', desc: 'Betallösning' },
  { name: 'Klarna', category: 'E-handel', icon: SiKlarna, mono: 'K', desc: 'Betallösning' },
  { name: 'Hetzner', category: 'Backend & VPS', featured: true, icon: SiHetzner, mono: 'H', desc: 'Serverdrift' },
  { name: 'Inleed', category: 'Backend & VPS', featured: true, icon: null, mono: 'I', desc: 'Serverdrift' },
  { name: 'DigitalOcean', category: 'Backend & VPS', icon: SiDigitalocean, mono: 'DO', desc: 'Serverdrift' },
  { name: 'Supabase', category: 'Backend & VPS', featured: true, icon: SiSupabase, mono: 'SB', desc: 'Databas & backend' },
  { name: 'Brevo', category: 'Marknadsföring', featured: true, icon: SiBrevo, mono: 'B', desc: 'E-postutskick' },
  { name: 'Next.js', category: 'Frontend', featured: true, icon: SiNextdotjs, mono: 'N', desc: 'Ramverk' },
  { name: 'React', category: 'Frontend', featured: true, icon: SiReact, mono: 'R', desc: 'Ramverk' },
  { name: 'TypeScript', category: 'Frontend', icon: SiTypescript, mono: 'TS', desc: 'Programspråk' },
  { name: 'Vercel', category: 'Frontend', featured: true, icon: SiVercel, mono: 'V', desc: 'Driftsättning' },
  { name: 'Google Analytics', category: 'Marknadsföring', featured: true, icon: SiGoogleanalytics, mono: 'GA', desc: 'Webbanalys' },
  { name: 'Google Tag Manager', category: 'Marknadsföring', icon: SiGoogletagmanager, mono: 'GT', desc: 'Taggning & spårning' },
  { name: 'Cookiebot', category: 'GDPR', featured: true, icon: null, mono: 'C', desc: 'Cookiesamtycke' },
  { name: 'Framer', category: 'Webbplattformar', featured: true, icon: SiFramer, mono: 'F', desc: 'No-code-byggare' },
  { name: 'Webflow', category: 'Webbplattformar', featured: true, icon: SiWebflow, mono: 'W', desc: 'No-code-byggare' },
  { name: 'WordPress', category: 'Webbplattformar', icon: SiWordpress, mono: 'WP', desc: 'För kundens räkning' },
  { name: 'Shopify (Headless)', category: 'Webbplattformar', featured: true, icon: SiShopify, mono: 'SH', desc: 'Headless e-handel' },
];

export function PlatformsSection() {
  const [active, setActive] = useState<Category>('Utvalda');

  const visible = active === 'Utvalda' ? TOOLS.filter((t) => t.featured) : TOOLS.filter((t) => t.category === active);

  return (
    <section id="plattformar" className="section-padding" style={{ padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="08" label="Plattformar" extra="© 2026" />

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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '56px', borderBottom: '1px solid rgb(230,230,230)', paddingBottom: '20px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: active === cat ? '#030303' : 'rgb(104,105,99)',
                  borderBottom: active === cat ? '2px solid #e8c547' : '2px solid transparent',
                  paddingBottom: '8px',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid-platforms" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px 32px' }}>
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
