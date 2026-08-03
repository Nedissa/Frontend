'use client';

import Link from 'next/link';
import { Logo } from './Logo';

export function FooterWrapper() {
  return (
    <footer className="w-full text-white" style={{ background: '#0f2448' }}>
      <div className="py-12 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-0 sm:gap-6 lg:gap-12 mb-0 sm:mb-12 sm:border-b sm:border-gray-800 sm:pb-12 text-white [&>div]:border-b [&>div]:border-gray-800 [&>div]:pb-6 [&>div]:pt-6 sm:[&>div]:border-b-0 sm:[&>div]:pt-0 [&>div:last-child]:border-b-0">
            {/* Logo section */}
            <div>
              <div className="flex items-center gap-1 mb-6">
                <Logo />
                <h2 className="text-lg font-bold">Techpilots</h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+46108800981">+010-880 09 81</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:info@techpilots.se">info@techpilots.se</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C7.13 2 3 6.13 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.87-4.13-9-9-9zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>506 31 Borås</span>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-bold mb-3 text-sm">Information</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/kundservice/leverans">Leverans</Link></li>
                <li><Link href="/kundservice/betalning">Betalning</Link></li>
                <li><Link href="/kundservice/villkor">Försäljningsvillkor</Link></li>
                <li><Link href="/kundservice/integritet">Integritetspolicy</Link></li>
                <li><Link href="/kundservice/cookies">Cookiepolicy</Link></li>
              </ul>
            </div>

            {/* Kundservice */}
            <div>
              <h3 className="font-bold mb-3 text-sm">Kundservice</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/kundservice/kontakt">Kontakta oss</Link></li>
                <li><Link href="/kundservice/vanliga-fragor">Vanliga frågor</Link></li>
                <li><Link href="/kundservice/returer">Returer & byten</Link></li>
                <li><Link href="/kundservice/reklamation">Reklamation & service</Link></li>
              </ul>
            </div>

            {/* Om oss */}
            <div>
              <h3 className="font-bold mb-3 text-sm">Om oss</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/kundservice/om-oss">Vår historia</Link></li>
                <li><Link href="/pilotbloggen">Pilotbloggen</Link></li>
              </ul>
            </div>

            {/* Sociala medier - Längst till höger */}
            <div>
              <h3 className="font-bold mb-4 text-sm">Följ oss</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <circle cx="17.5" cy="6.5" r="1.5"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/techpilots-webagency" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Certifieringar + Betalningsmetoder — på desktop på samma rad */}
          <div className="py-6 border-b border-gray-800 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Certifieringar */}
            <div>
              <h3 className="font-bold mb-4 text-sm">Säkerhet & Certifieringar</h3>
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-6 h-6" style={{ color: '#f5c842' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <span className="text-xs text-gray-400 whitespace-nowrap">Kryptering</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-6 h-6" style={{ color: '#60a5fa' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-xs text-gray-400 whitespace-nowrap">GDPR</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-6 h-6" style={{ color: '#4ade80' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c9 0 11-16 11-16l-1.07-.8A10 10 0 0 1 17 8z"/>
                  </svg>
                  <span className="text-xs text-gray-400 whitespace-nowrap">Miljöansvar</span>
                </div>
              </div>
            </div>

            {/* Betalningsmetoder */}
            <div className="flex flex-row flex-nowrap items-center gap-4 overflow-x-auto md:ml-auto md:mt-9" style={{ scrollbarWidth: 'none' }}>
              <img src="/icons/klarna-text.svg" alt="Klarna" style={{ height: '14px', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
              <span style={{ color: '#444', flexShrink: 0 }}>|</span>
              <img src="/icons/visa.svg" alt="Visa" style={{ height: '20px', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
              <span style={{ color: '#444', flexShrink: 0 }}>|</span>
              <img src="/icons/mastercard.svg" alt="Mastercard" style={{ height: '20px', flexShrink: 0 }} />
              <span style={{ color: '#444', flexShrink: 0 }}>|</span>
              <img src="/icons/swish.svg" alt="Swish" style={{ height: '20px', flexShrink: 0 }} />
              <span style={{ color: '#444', flexShrink: 0 }}>|</span>
              <img src="/icons/applepay.svg" alt="Apple Pay" style={{ height: '20px', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
              <span style={{ color: '#444', flexShrink: 0 }}>|</span>
              <img src="/icons/googlepay.svg" alt="Google Pay" style={{ height: '20px', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-400 pt-8 gap-2">
            <p>© 2026 Techpilots AB. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
