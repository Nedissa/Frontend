'use client';

import Link from 'next/link';
import { MENU_DATA, MOBILE_CATEGORY_ICONS, MOBILE_SECTION_ICONS } from './menuData';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  mobileActiveLevel: 0 | 1 | 2;
  mobileExpandedCategory: string | null;
  mobileActiveSubCategory: Set<string>;
  activeMobileCategory: string | null;
  isLoggedIn: boolean;
  onClose: () => void;
  onOpenCategory: (categoryId: string) => void;
  onBackToLevel0: () => void;
  onToggleOffers: () => void;
  onToggleSubCategory: (sectionId: string) => void;
}

const OFFERS_LINKS = [
  { label: 'Veckans deals', url: '/erbjudanden/veckans-deals' },
  { label: 'Rea', url: '/erbjudanden/rea' },
  { label: 'Paketpris', url: '/erbjudanden/paketpris' },
  { label: 'Lagertömning', url: '/erbjudanden/lagertomning' },
];

// Mobilmenyns overlay: nivå 0 (huvudkategorier) och nivå 1 (underkategorier + accordion).
export function MobileMenu({
  mobileMenuOpen,
  mobileActiveLevel,
  mobileExpandedCategory,
  mobileActiveSubCategory,
  activeMobileCategory,
  isLoggedIn,
  onClose,
  onOpenCategory,
  onBackToLevel0,
  onToggleOffers,
  onToggleSubCategory,
}: MobileMenuProps) {
  const activeCat = MENU_DATA.find(c => c.id === mobileExpandedCategory);

  return (
    <div className="lg:hidden fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: mobileMenuOpen ? 0.45 : 0, pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="absolute top-0 left-0 h-full bg-white overflow-hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '100vw',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      >
        {/* ── LEVEL 0: Huvudkategorier ── */}
        <div
          className="absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto"
          style={{ transform: mobileActiveLevel === 0 ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Huvudkategorier</p>
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MENU_DATA.map((category) => (
              <button
                key={category.id}
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100 text-left active:bg-gray-50"
                onClick={() => onOpenCategory(category.id)}
              >
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-black">
                  {MOBILE_CATEGORY_ICONS[category.id]}
                </span>
                <span className="flex-1 text-sm font-semibold text-black">{category.title}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
            {/* Erbjudanden accordion */}
            <div className="border-b border-gray-100">
              <button
                className="w-full flex items-center gap-4 px-5 py-4"
                onClick={onToggleOffers}
              >
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img src="/icons/categories/erbjudanden.png" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                </span>
                <span className="flex-1 text-sm font-semibold text-black text-left">Erbjudanden</span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${activeMobileCategory === 'erbjudanden' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {activeMobileCategory === 'erbjudanden' && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {OFFERS_LINKS.map(item => (
                    <Link
                      key={item.url}
                      href={item.url}
                      className="flex items-center gap-3 px-8 py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/erbjudanden/rea" className="flex items-center gap-2 px-8 py-3 text-xs font-bold text-black border-t border-gray-200" onClick={onClose}>
                    Se alla erbjudanden →
                  </Link>
                </div>
              )}
            </div>
            {isLoggedIn && (
              <Link
                href="/konto"
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100"
                onClick={onClose}
              >
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-black">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </span>
                <span className="flex-1 text-sm font-semibold text-black">Mina sidor</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── LEVEL 1: Underkategorier med accordion för nivå 3 ── */}
        <div
          className="absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto bg-white"
          style={{ transform: mobileActiveLevel === 1 ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-gray-100">
            <button
              onClick={onBackToLevel0}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <p className="text-sm font-bold text-black">{activeCat?.title}</p>
          </div>
          <Link
            href={activeCat?.url || '#'}
            className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-gray-500"
            onClick={onClose}
          >
            Se alla produkter
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
          <div className="flex-1 overflow-y-auto">
            {activeCat?.items?.map((section) => (
              <div key={section.id} className="border-b border-gray-100">
                {/* Direktlänk om inga underkategorier, annars accordion */}
                {(!section.items || section.items.length === 0) ? (
                  <Link
                    href={section.url}
                    className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50"
                    onClick={onClose}
                  >
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      {MOBILE_SECTION_ICONS[section.id]}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-black">{section.title}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </Link>
                ) : (
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left active:bg-gray-50"
                  onClick={() => onToggleSubCategory(section.id)}
                >
                  <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    {MOBILE_SECTION_ICONS[section.id]}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-black">{section.title}</span>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: mobileActiveSubCategory.has(section.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>)}
                {/* Accordion nivå 2 öppen — visa nivå 3 som accordion */}
                {section.items && section.items.length > 0 && <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: mobileActiveSubCategory.has(section.id) ? '600px' : '0px' }}
                >
                  <Link
                    href={section.url}
                    className="flex items-center justify-between pl-16 pr-5 py-3 bg-gray-50 border-t border-gray-100 text-xs font-bold uppercase tracking-wide text-gray-400"
                    onClick={onClose}
                  >
                    Se alla produkter
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                  {section.items?.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className="flex items-center justify-between pl-16 pr-5 min-h-[44px] py-2 border-t border-gray-100 active:bg-gray-50"
                      onClick={onClose}
                    >
                      <span className="text-sm text-gray-700">{item.title}</span>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  ))}
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
