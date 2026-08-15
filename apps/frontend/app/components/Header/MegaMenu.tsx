'use client';

import Link from 'next/link';
import { MENU_DATA, SECTION_IMAGES, OFFERS_CAMPAIGNS } from './menuData';

interface MegaMenuProps {
  showMegaMenu: boolean;
  activeMegaMenu: string | null;
  onMouseEnterCategory: (categoryId: string) => void;
  onMouseEnterOffers: () => void;
  onMouseLeave: () => void;
  isPathActive: (url: string) => boolean;
}

const OFFERS_LINKS = [
  { label: 'Veckans deals', url: '/erbjudanden/veckans-deals' },
  { label: 'Rea', url: '/erbjudanden/rea' },
  { label: 'Paketpris', url: '/erbjudanden/paketpris' },
  { label: 'Lagertömning', url: '/erbjudanden/lagertomning' },
];

// Desktop navigation + megameny (dropdown-panelen med kategorier/erbjudanden).
export function MegaMenu({
  showMegaMenu,
  activeMegaMenu,
  onMouseEnterCategory,
  onMouseEnterOffers,
  onMouseLeave,
  isPathActive,
}: MegaMenuProps) {
  return (
    <div className="hidden md:block" onMouseLeave={onMouseLeave}>
      {/* Navigation */}
      <nav className="bg-white">
        <div className="px-6 py-0 flex justify-center">
          <div className="w-full max-w-[960px] hd:max-w-[1250px] qhd:max-w-[1600px] flex items-stretch gap-0">
            {MENU_DATA.map((category) => {
              const isActive = isPathActive(category.url);
              return (
                <Link
                  key={category.id}
                  href={category.url}
                  onMouseEnter={() => {
                    if (category.items && category.items.length > 0) {
                      onMouseEnterCategory(category.id);
                    }
                  }}
                  className="px-6 py-2 text-sm font-semibold text-black whitespace-nowrap relative group inline-flex"
                >
                  {category.title}
                  <span className={`absolute bottom-0 left-6 h-0.5 transition-all duration-300 ease-out ${
                    isActive ? 'w-[calc(100%-48px)]' : 'w-0 group-hover:w-[calc(100%-48px)]'
                  }`} style={{ background: '#000' }}></span>
                </Link>
              );
            })}
            <div className="flex-1" />
            <button
              onMouseEnter={onMouseEnterOffers}
              className="px-6 py-2 text-sm font-semibold text-black whitespace-nowrap relative group inline-flex items-center"
            >
              Erbjudanden
              <span className={`absolute bottom-0 left-6 h-0.5 transition-all duration-300 ${activeMegaMenu === 'erbjudanden' ? 'w-[calc(100%-48px)]' : 'w-0 group-hover:w-[calc(100%-48px)]'}`} style={{ background: '#000' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white z-40 flex justify-center border-b border-l border-r border-gray-300 shadow-lg" style={{ opacity: (showMegaMenu && activeMegaMenu) ? 1 : 0, transform: (showMegaMenu && activeMegaMenu) ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-6px)', transition: 'opacity 150ms ease, transform 150ms ease', visibility: (showMegaMenu && activeMegaMenu) ? 'visible' : 'hidden', pointerEvents: (showMegaMenu && activeMegaMenu) ? 'auto' : 'none' }}>
        <div className="w-[960px] hd:w-[1250px] qhd:w-[1600px] px-6">
          <div className="py-8">
            {/* Erbjudanden panel */}
            <div style={{ display: activeMegaMenu === 'erbjudanden' ? 'flex' : 'none', gap: '2rem' }}>
                <div className="flex flex-col justify-between" style={{ minWidth: '180px' }}>
                  <div>
                    <ul className="space-y-3">
                      {OFFERS_LINKS.map((item) => (
                        <li key={item.label}>
                          <Link href={item.url} className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group inline-flex">
                            {item.label}
                            <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 ease-out ${isPathActive(item.url) ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ background: '#000' }} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <Link href="/erbjudanden/rea" className="text-sm font-bold text-black flex items-center gap-1 hover:gap-2 transition-all">
                      Se alla erbjudanden <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Erbjudanden</p>
                  <div className="flex gap-3">
                    {OFFERS_CAMPAIGNS.map((b) => (
                      <Link key={b.id} href={b.url} className="group relative overflow-hidden rounded flex-1 flex items-end p-3 hover:opacity-90 transition-opacity" style={{ aspectRatio: '1/1', backgroundColor: '#111' }}>
                        <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="relative z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                          <p className="text-white font-bold text-sm">{b.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
            </div>

            {/* Category panels — always in DOM, shown/hidden via display */}
            {MENU_DATA.map((category) => (
              <div key={category.id} style={{ display: activeMegaMenu === category.id ? 'grid' : 'none', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                {category.items?.map((section) => (
                  <div key={section.id} className="w-full">
                    <div className="mb-4 pb-4 border-b border-gray-200 w-full">
                      <div style={{ marginBottom: '8px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <img
                          src={SECTION_IMAGES[section.id] || '/assets/cat-electronics.webp'}
                          alt={section.title}
                          style={{ display: 'block', height: '80px', width: 'auto' }}
                        />
                      </div>
                      <Link href={section.url}>
                        <h3 className={`font-bold text-sm uppercase tracking-wide transition-colors cursor-pointer ${
                          isPathActive(section.url) ? 'text-black' : 'text-black hover:text-gray-600'
                        }`}>
                          {section.title}
                        </h3>
                      </Link>
                    </div>
                    <ul className="space-y-2">
                      {section.items && section.items.map((item) => (
                        <li key={item.id}>
                          <Link href={item.url} className="text-sm text-gray-700 hover:text-black transition-colors relative group inline-flex">
                            {item.title}
                            <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 ease-out ${isPathActive(item.url) ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ background: '#000' }} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block w-full h-px bg-gray-200 relative z-50"></div>
    </div>
  );
}
