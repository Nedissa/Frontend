'use client';
import { useLayoutEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { Shield, Lock, Cookie, Gear, Code } from '@phosphor-icons/react';
import { BrandIcon } from './BrandIcon';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const brandIcon = (name: Parameters<typeof BrandIcon>[0]['name']): IconType =>
  (({ size, color }: { size?: number; color?: string }) => <BrandIcon name={name} size={size} color={color} />) as IconType;

const SiPayloadcms = brandIcon('payloadcms');
const SiSanity = brandIcon('sanity');
const SiContentful = brandIcon('contentful');
const SiMedusa = brandIcon('medusa');
const SiShopify = brandIcon('shopify');
const SiStripe = brandIcon('stripe');
const SiKlarna = brandIcon('klarna');
const SiHetzner = brandIcon('hetzner');
const SiDigitalocean = brandIcon('digitalocean');
const SiSupabase = brandIcon('supabase');
const SiBrevo = brandIcon('brevo');
const SiNextdotjs = brandIcon('nextdotjs');
const SiReact = brandIcon('react');
const SiTypescript = brandIcon('typescript');
const SiVercel = brandIcon('vercel');
const SiGoogleanalytics = brandIcon('googleanalytics');
const SiGoogletagmanager = brandIcon('googletagmanager');
const SiFramer = brandIcon('framer');
const SiWebflow = brandIcon('webflow');
const SiWordpress = brandIcon('wordpress');
const SiGit = brandIcon('git');
const SiClaude = brandIcon('claude');

const CATEGORIES = ['Utvalda', 'Frontend', 'CMS', 'E-handel', 'Infrastruktur', 'Webbplattformar', 'CRM', 'Säkerhet', 'Verktyg'] as const;

type Category = (typeof CATEGORIES)[number];
type Tool = { name: string; category: Exclude<Category, 'Utvalda'>; featured?: boolean; icon: IconType | null; mono: string; desc: string; url: string };

const TOOLS: Tool[] = [
  { name: 'Payload', category: 'CMS', featured: true, icon: SiPayloadcms, mono: 'P', desc: 'Innehållshantering', url: 'https://payloadcms.com' },
  { name: 'Sanity', category: 'CMS', icon: SiSanity, mono: 'SA', desc: 'Headless CMS', url: 'https://www.sanity.io' },
  { name: 'Contentful', category: 'CMS', icon: SiContentful, mono: 'CF', desc: 'Headless CMS', url: 'https://www.contentful.com' },
  { name: 'Framer CMS', category: 'CMS', icon: SiFramer, mono: 'FR', desc: 'Inbyggt CMS', url: 'https://www.framer.com' },
  { name: 'Webflow CMS', category: 'CMS', icon: SiWebflow, mono: 'WF', desc: 'Inbyggt CMS', url: 'https://webflow.com' },
  { name: 'Shopify CMS', category: 'CMS', icon: SiShopify, mono: 'SH', desc: 'E-handels-CMS', url: 'https://www.shopify.com' },
  { name: 'Medusa', category: 'E-handel', featured: true, icon: SiMedusa, mono: 'M', desc: 'E-handelsplattform', url: 'https://medusajs.com' },
  { name: 'Shopify', category: 'E-handel', featured: true, icon: SiShopify, mono: 'SH', desc: 'E-handelsplattform', url: 'https://www.shopify.com' },
  { name: 'Stripe', category: 'E-handel', featured: true, icon: SiStripe, mono: 'ST', desc: 'Betallösning', url: 'https://stripe.com' },
  { name: 'Klarna', category: 'E-handel', icon: SiKlarna, mono: 'K', desc: 'Betallösning', url: 'https://www.klarna.com' },
  { name: 'Hetzner', category: 'Infrastruktur', featured: false, icon: SiHetzner, mono: 'H', desc: 'Serverdrift', url: 'https://www.hetzner.com' },
  { name: 'Inleed', category: 'Infrastruktur', featured: false, icon: null, mono: 'I', desc: 'Serverdrift', url: 'https://www.inleed.se' },
  { name: 'DigitalOcean', category: 'Infrastruktur', icon: SiDigitalocean, mono: 'DO', desc: 'Serverdrift', url: 'https://www.digitalocean.com' },
  { name: 'Supabase', category: 'Infrastruktur', featured: false, icon: SiSupabase, mono: 'SB', desc: 'Databas & backend', url: 'https://supabase.com' },
  { name: 'HubSpot', category: 'CRM', featured: true, icon: Gear as IconType, mono: 'HS', desc: 'CRM & email', url: 'https://www.hubspot.com' },
  { name: 'Klaviyo', category: 'CRM', featured: true, icon: Gear as IconType, mono: 'K', desc: 'E-commerce CRM', url: 'https://www.klaviyo.com' },
  { name: 'Brevo', category: 'CRM', featured: false, icon: SiBrevo, mono: 'B', desc: 'E-postutskick', url: 'https://www.brevo.com' },
  { name: 'Next.js', category: 'Frontend', featured: true, icon: SiNextdotjs, mono: 'N', desc: 'Snabb sidladdning', url: 'https://nextjs.org' },
  { name: 'React', category: 'Frontend', featured: true, icon: SiReact, mono: 'R', desc: 'Grunden i webbplatsen', url: 'https://react.dev' },
  { name: 'TypeScript', category: 'Frontend', icon: SiTypescript, mono: 'TS', desc: 'Färre buggar, stabilare kod', url: 'https://www.typescriptlang.org' },
  { name: 'Vercel', category: 'Frontend', featured: true, icon: SiVercel, mono: 'V', desc: 'Driftsättning', url: 'https://vercel.com' },
  { name: 'Git', category: 'Verktyg', icon: SiGit, mono: 'G', desc: 'Versionshantering', url: 'https://git-scm.com' },
  { name: 'VS Code', category: 'Verktyg', icon: Code as IconType, mono: 'VS', desc: 'Kodredigerare', url: 'https://code.visualstudio.com' },
  { name: 'Claude AI', category: 'Verktyg', icon: SiClaude, mono: 'C', desc: 'AI-utveckling', url: 'https://claude.com' },
  { name: 'Google Analytics', category: 'CRM', featured: false, icon: SiGoogleanalytics, mono: 'GA', desc: 'Webbanalys', url: 'https://marketingplatform.google.com/about/analytics/' },
  { name: 'Google Tag Manager', category: 'CRM', featured: false, icon: SiGoogletagmanager, mono: 'GT', desc: 'Taggning & spårning', url: 'https://marketingplatform.google.com/about/tag-manager/' },
  { name: 'Cookiebot', category: 'Säkerhet', featured: false, icon: Cookie as IconType, mono: 'C', desc: 'GDPR & cookie-hantering', url: 'https://www.cookiebot.com' },
  { name: 'SSL/TLS', category: 'Säkerhet', featured: false, icon: Lock as IconType, mono: 'SSL', desc: 'Datakryptering', url: 'https://letsencrypt.org' },
  { name: 'Hetzner Security', category: 'Säkerhet', featured: false, icon: SiHetzner, mono: 'HS', desc: 'Firewall & DDoS-skydd', url: 'https://www.hetzner.com' },
  { name: 'Framer', category: 'Webbplattformar', featured: false, icon: SiFramer, mono: 'F', desc: 'No-code-byggare', url: 'https://www.framer.com' },
  { name: 'Webflow', category: 'Webbplattformar', featured: false, icon: SiWebflow, mono: 'W', desc: 'No-code-byggare', url: 'https://webflow.com' },
  { name: 'WordPress', category: 'Webbplattformar', icon: SiWordpress, mono: 'WP', desc: 'För kundens räkning', url: 'https://wordpress.org' },
  { name: 'Shopify (Headless)', category: 'Webbplattformar', featured: false, icon: SiShopify, mono: 'SH', desc: 'Headless e-handel', url: 'https://www.shopify.com' },
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
        <SectionHeader num="09" label="Verktygen vi använder" extra="© 2026" />

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
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: '#030303',
                    color: '#e8c547',
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
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
