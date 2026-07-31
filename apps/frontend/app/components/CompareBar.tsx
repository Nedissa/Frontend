'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { useCompare } from './CompareContext';

const COLUMN_COLORS = ['#dce3eb', '#c5d0db', '#a8b8c6', '#8a9fb0'];
const COLUMN_ACCENTS = ['#7a99b0', '#5f8498', '#4a6f82', '#355a6c'];

function getCategoryForKey(key: string, specs: { label: string; value: string; category?: string }[]): string {
  return specs.find(s => s.label === key)?.category || 'Övrigt';
}

export function CompareBar() {
  const { compareList, clearCompare, removeFromCompare } = useCompare();
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [barHeight, setBarHeight] = useState(64);
  const barRef = useRef<HTMLDivElement>(null);

  const modalOpenRef = useRef(false);
  useEffect(() => { modalOpenRef.current = modalOpen; }, [modalOpen]);

  useEffect(() => {
    if (!barRef.current) return;
    const observer = new ResizeObserver(() => {
      if (barRef.current && !modalOpenRef.current) setBarHeight(barRef.current.getBoundingClientRect().height);
    });
    observer.observe(barRef.current);
    setBarHeight(barRef.current.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => { setModalOpen(false); setClosing(false); }, 280);
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      (window as any).tidioChatApi?.hide();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      (window as any).tidioChatApi?.show();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      (window as any).tidioChatApi?.show();
    };
  }, [modalOpen]);

  useEffect(() => {
    if (compareList.length === 0) setModalOpen(false);
  }, [compareList.length]);

  if (compareList.length === 0) return null;

  const allSpecKeys: string[] = [];
  compareList.forEach(p => {
    const specs: { label: string; value: string }[] = (p.metadata?.specifications as any) || [];
    specs.forEach(s => {
      if (!allSpecKeys.includes(s.label)) allSpecKeys.push(s.label);
    });
  });

  const getSpec = (product: typeof compareList[0], label: string) => {
    const specs: { label: string; value: string }[] = (product.metadata?.specifications as any) || [];
    return specs.find(s => s.label === label)?.value || null;
  };

  const allSpecs = compareList.flatMap(p => (p.metadata?.specifications as any[] || []));
  const seenKeys = new Set<string>();
  const grouped: { category: string; keys: string[] }[] = [];
  allSpecKeys.forEach(key => {
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    const cat = getCategoryForKey(key, allSpecs);
    const existing = grouped.find(g => g.category === cat);
    if (existing) {
      existing.keys.push(key);
    } else {
      grouped.push({ category: cat, keys: [key] });
    }
  });

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes sheetOut {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        .compare-bar { animation: slideUp 0.25s ease; }
        .compare-backdrop { animation: fadeIn 0.2s ease; }
        .compare-sheet-in { animation: sheetIn 0.3s ease; }
        .compare-sheet-out { animation: sheetOut 0.28s ease forwards; }
        .compare-spec-row:hover .spec-label { color: #000 !important; }
        .compare-sheet-in::-webkit-scrollbar { display: none; }
        .compare-sheet-out::-webkit-scrollbar { display: none; }
        .remove-btn { opacity: 0; transition: opacity 0.15s; }
        .compare-product-col:hover .remove-btn { opacity: 1; }
        @media (hover: none) { .remove-btn { opacity: 1; } }
        @media (max-width: 767px) {
          .compare-col-4 { display: none !important; }
        }
      `}</style>

      {/* Floating bar */}
      <div ref={barRef} className="compare-bar fixed bottom-0 left-0 right-0 bg-white" style={{ zIndex: 102, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          {/* Left slot — fixed width so counter stays centered */}
          <div style={{ width: '72px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                if (modalOpen) {
                  closeSheet();
                } else {
                  window.dispatchEvent(new CustomEvent('clearCompare'));
                  clearCompare();
                }
              }}
              style={{ background: 'none', border: 'none', padding: '5px 4px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#555', whiteSpace: 'nowrap' }}
            >
              {modalOpen ? 'Stäng' : 'Rensa'}
            </button>
          </div>

          {/* Center counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f5', borderRadius: '999px', padding: '6px 14px' }}>
            <span className="hidden md:inline" style={{ fontSize: '0.78rem', color: '#3f3f46', fontWeight: 600, minWidth: '28px' }}>{compareList.length} / 4</span>
            <span className="md:hidden" style={{ fontSize: '0.78rem', color: '#3f3f46', fontWeight: 600, minWidth: '28px' }}>{Math.min(compareList.length, 3)} / 3</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {/* Desktop: 4 dots */}
              {[0,1,2,3].map(i => (
                <div key={i} className="hidden md:block" style={{ width: '24px', height: '4px', borderRadius: '999px', background: i < compareList.length ? '#3f3f46' : '#d4d4d8' }} />
              ))}
              {/* Mobil: 3 dots */}
              {[0,1,2].map(i => (
                <div key={i} className="md:hidden" style={{ width: '24px', height: '4px', borderRadius: '999px', background: i < compareList.length ? '#3f3f46' : '#d4d4d8' }} />
              ))}
            </div>
          </div>

          {/* Right slot — fixed width so counter stays centered */}
          <div style={{ width: '72px', flexShrink: 0, display: 'flex', justifyContent: 'flex-start' }}>
            {modalOpen ? (
              <button
                onClick={() => { closeSheet(); setTimeout(() => { window.dispatchEvent(new CustomEvent('clearCompare')); clearCompare(); }, 280); }}
                style={{ background: '#000', color: '#fff', border: 'none', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', borderRadius: '6px', whiteSpace: 'nowrap' }}
              >
                Rensa
              </button>
            ) : (
              <button
                onClick={() => { if (compareList.length >= 2) setModalOpen(true); }}
                disabled={compareList.length < 2}
                style={{ background: compareList.length < 2 ? '#e5e7eb' : '#000', color: compareList.length < 2 ? '#aaa' : '#fff', border: 'none', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: compareList.length < 2 ? 'not-allowed' : 'pointer', borderRadius: '6px', whiteSpace: 'nowrap' }}
              >
                Jämför
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="compare-backdrop"
            onClick={closeSheet}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, touchAction: 'none' }}
            onWheel={(e) => e.preventDefault()}
          />
          {/* Sheet */}
          <div
            className={closing ? 'compare-sheet-out' : 'compare-sheet-in'}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, background: '#fff', maxHeight: '100dvh', paddingBottom: `${barHeight}px`, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', scrollbarWidth: 'none' }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 12px', position: 'sticky', top: 0, background: '#fff', zIndex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', borderBottom: '2px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Jämförelse</h2>
              <button
                onClick={closeSheet}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal content */}
            <div style={{ padding: '16px 12px', maxWidth: '1280px', margin: '0 auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '35%' }} />
                  {compareList.map((_, i) => (
                    <col key={i} className={i === 3 ? 'compare-col-4' : ''} />
                  ))}
                </colgroup>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <td style={{ paddingBottom: '24px' }} />
                    {compareList.map((p, i) => (
                      <td key={p.id} className={`compare-product-col${i === 3 ? ' compare-col-4' : ''}`} style={{ paddingBottom: '0', verticalAlign: 'top', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '6px 8px 16px' }}>
                          <button
                            className="remove-btn"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('toggleCompare', { detail: compareList.find(x => x.id === p.id) }));
                              removeFromCompare(p.id);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#999', fontWeight: 600, padding: '2px 0 6px' }}
                          >
                            Ta bort
                          </button>
                          <img src={p.image} alt={p.title} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                          <p style={{ fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3, minHeight: '2.6em' }}>{p.title}</p>
                          <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626' }}>{p.price.toLocaleString('sv-SE')} kr</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSpecKeys.length > 0 ? grouped.map(({ category, keys }) => (
                    <Fragment key={category ?? 'uncategorized'}>
                      {category && category !== 'System' && category !== 'SYSTEM' && category !== 'Övrigt' && (
                        <tr key={`cat-${category}`}>
                          <td style={{ padding: '24px 0 6px', borderTop: '2px solid #e5e7eb' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999' }}>
                              {category}
                            </span>
                          </td>
                          {compareList.map((_, i) => (
                            <td key={i} className={i === 3 ? 'compare-col-4' : ''} style={{ borderTop: '2px solid #e5e7eb', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none' }} />
                          ))}
                        </tr>
                      )}
                      {keys.map((label) => {
                        const values = compareList.map(p => getSpec(p, label));
                        if (values.every(v => !v)) return null;
                        return (
                          <tr key={label} className="compare-spec-row" style={{ borderBottom: '1px solid #f3f4f6', cursor: 'default', transition: 'background 0.15s' }}>
                            <td className="spec-label" style={{ padding: '8px 8px 8px 0', fontSize: '0.72rem', color: '#555', fontWeight: 700, transition: 'color 0.15s', wordBreak: 'break-word', lineHeight: 1.3 }}>{label}</td>
                            {values.map((val, i) => (
                              <td key={i} className={`spec-val${i === 3 ? ' compare-col-4' : ''}`} style={{ padding: '8px 8px', fontSize: '0.7rem', fontWeight: 600, color: '#000', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', background: COLUMN_COLORS[i], textAlign: 'center', transition: 'background 0.15s, color 0.15s' }}>
                                {val ? (
                                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" style={{ display: 'inline-block' }}>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </Fragment>
                  )) : (
                    <tr>
                      <td colSpan={compareList.length + 1} style={{ padding: '32px 0', fontSize: '0.85rem', color: '#aaa', textAlign: 'center' }}>
                        Inga specifikationer att jämföra
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
