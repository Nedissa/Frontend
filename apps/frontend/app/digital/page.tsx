import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AwardsSection } from './components/AwardsSection';
import { CustomersSection } from './components/CustomersSection';
import { SeoTestSection } from './components/SeoTestSection';
import { PricingSection } from './components/PricingSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProcessStatsSection } from './components/ProcessStatsSection';
import { PlatformsSection } from './components/PlatformsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import './studio.css';

const LOGO_NAMES = ['Sagateatern', 'Crownmatch', 'Wästgöta Bil AB', 'Pistolero Studio', 'Ljuva Hem i Mark', 'Medieinstitutet', 'Siroma'];
const LOGOS = [...LOGO_NAMES, ...LOGO_NAMES];

export default function WebStudioPage() {
  return (
    <main
      className="main-mobile-order bg-white text-[#030303] min-h-screen"
      style={{ fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* Hero */}
      <HeroSection />

      {/* Logo ticker — visar de verktyg/plattformar vi arbetar med, inte kundreferenser.
          Shown here on mobile only (order-1 within a flex column) */}
      <section
        className="logo-ticker-mobile-first overflow-hidden bg-white py-[40px]"
        style={{ borderTop: '1px solid rgb(220,220,220)' }}
        aria-label="Kunder och samarbetspartners"
      >
        <p className="text-center text-[14px] font-medium uppercase text-[rgb(107,107,107)] mb-[24px]" style={{ letterSpacing: '0.04em' }}>
          Kunder &amp; partners
        </p>
        <div className="logo-ticker-fade">
          <div className="animate-marquee flex items-center gap-0 whitespace-nowrap" aria-hidden="true">
            {LOGOS.map((logo, i) => (
              <span key={i} className="inline-flex items-center">
                <span
                  className="logo-ticker-text text-[34px] font-bold text-[#1a1a1a] px-[36px]"
                  style={{ letterSpacing: '0' }}
                >
                  {logo}
                </span>
                <span
                  className="inline-block w-[1px] h-[52px]"
                  style={{ background: 'rgb(210,210,210)' }}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Offers / Awards */}
      <AwardsSection />

      {/* Bevis (kundcitat) före pris — läsaren ska ha förtroende innan de ser prislappen */}
      <CustomersSection />

      {/* Väcker SEO-behovet innan priserna visas */}
      <SeoTestSection />

      <PricingSection />

      {/* Process */}
      <FeaturesSection />

      {/* Projects */}
      <ProjectsSection />

      <ProcessStatsSection />

      <PlatformsSection />

      <FaqSection />

      <CtaSection />

    </main>
  );
}
