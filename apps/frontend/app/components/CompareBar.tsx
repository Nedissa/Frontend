'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { useCompare } from './CompareContext';
import { useAside } from './Aside';

const COLUMN_COLORS = ['#f9fafb', '#f9fafb', '#f9fafb', '#f9fafb'];

function getCategoryForKey(key: string, specs: { label: string; value: string; category?: string }[]): string {
  const cat = specs.find(s => s.label === key)?.category;
  return (cat && cat.trim()) ? cat.trim() : 'Övrigt';
}

export function CompareBar() {
  const { compareList, clearCompare, removeFromCompare } = useCompare();
  const { type: asideType } = useAside();
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [barHeight, setBarHeight] = useState(64);
  const [onlyDiffs, setOnlyDiffs] = useState(false);
  const [copied, setCopied] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const [mobileCardHeight, setMobileCardHeight] = useState(210);

  const copyLink = () => {
    const ids = compareList.map(p => p.id).join(',');
    const url = `${window.location.origin}?compare=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Öppna modal automatiskt om ?compare= finns i URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compareParam = params.get('compare');
    if (compareParam && compareList.length >= 2) {
      setModalOpen(true);
      // Rensa URL-parametern utan att ladda om sidan
      const url = new URL(window.location.href);
      url.searchParams.delete('compare');
      window.history.replaceState({}, '', url.toString());
    }
  }, [compareList.length]);

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
  if (asideType !== 'closed') return null;

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
  // Flytta "Övrigt"/tom kategori (Produktinfo) först
  const ovrigtIdx = grouped.findIndex(g => !g.category || !g.category.trim() || g.category === 'Övrigt');
  if (ovrigtIdx > 0) { const [item] = grouped.splice(ovrigtIdx, 1); grouped.unshift(item); }

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
        .compare-spec-row:hover td { background: #f3f4f6 !important; }
        .compare-spec-row:hover .spec-label { color: #000 !important; }
        .compare-sheet-in::-webkit-scrollbar { display: none; }
        .compare-sheet-out::-webkit-scrollbar { display: none; }
        .remove-btn { opacity: 1; }
        .compare-header-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        @media (max-width: 767px) {
          .compare-col-4 { display: none !important; }
          .compare-col-3 { display: none !important; }
          .spec-label-col { width: 25% !important; }
          .compare-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Floating bar */}
      <div ref={barRef} className="compare-bar fixed bottom-0 left-0 right-0 bg-white" style={{ zIndex: 102, paddingBottom: 'env(safe-area-inset-bottom)', borderTop: '1px solid #e5e7eb', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        {/* Desktop */}
        <div className="hidden md:flex" style={{ padding: '12px 16px', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <button onClick={() => { clearCompare(); window.dispatchEvent(new Event('clearCompare')); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f4f4f5', border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: '#444' }}>
            <svg width="14" height="14" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
            Nollställ
          </button>
          <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />
          <div style={{ display: 'flex', alignItems: 'center', background: '#f4f4f5', borderRadius: '999px', padding: '6px 14px' }}>
            <span style={{ fontSize: '0.78rem', color: '#3f3f46', fontWeight: 600 }}>{compareList.length} / 4</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />
          <div style={{ width: '72px', flexShrink: 0 }}>
            {modalOpen ? (
              <button onClick={closeSheet} style={{ background: '#111', border: 'none', width: '72px', padding: '7px 0', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', color: '#fff', borderRadius: '6px', textAlign: 'center' }}>Stäng</button>
            ) : (
              <button onClick={() => { if (compareList.length >= 2) setModalOpen(true); }} disabled={compareList.length < 2} style={{ background: compareList.length < 2 ? '#e5e7eb' : '#000', color: compareList.length < 2 ? '#aaa' : '#fff', border: 'none', width: '72px', padding: '7px 0', fontSize: '0.78rem', fontWeight: 700, cursor: compareList.length < 2 ? 'not-allowed' : 'pointer', borderRadius: '6px', textAlign: 'center' }}>Jämför</button>
            )}
          </div>
        </div>
        {/* Mobil */}
        <div className="flex md:hidden items-center justify-center" style={{ padding: '12px 16px', gap: '10px' }}>
          <button onClick={() => { clearCompare(); window.dispatchEvent(new Event('clearCompare')); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f4f4f5', border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: '#444', flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
            Nollställ
          </button>
          <div style={{ width: '1px', height: '16px', background: '#d1d5db', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5', borderRadius: '999px', padding: '6px 0', width: '52px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.78rem', color: '#3f3f46', fontWeight: 600 }}>{compareList.length} / 3</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: '#d1d5db', flexShrink: 0 }} />
          <div style={{ width: '72px', flexShrink: 0 }}>
            {modalOpen ? (
              <button onClick={closeSheet} style={{ background: '#111', border: 'none', width: '72px', padding: '7px 0', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', color: '#fff', borderRadius: '6px', textAlign: 'center' }}>Stäng</button>
            ) : (
              <button onClick={() => { if (compareList.length >= 2) setModalOpen(true); }} disabled={compareList.length < 2} style={{ background: compareList.length < 2 ? '#e5e7eb' : '#000', color: compareList.length < 2 ? '#aaa' : '#fff', border: 'none', width: '72px', padding: '7px 0', fontSize: '0.78rem', fontWeight: 700, cursor: compareList.length < 2 ? 'not-allowed' : 'pointer', borderRadius: '6px', textAlign: 'center' }}>Jämför</button>
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
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, background: '#fff', height: '100dvh', paddingBottom: `${barHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', scrollbarWidth: 'none' }}
          >
            {/* Modal header */}
            <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 50, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Kopiera länk */}
                  <button
                    className="compare-header-btn"
                    onClick={copyLink}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#444' }}
                  >
                    <svg width="14" height="14" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {copied ? '✓ Kopierad' : 'Dela'}
                  </button>
                  <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />
                  {/* Visa bara skillnader */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#444', padding: '7px 14px' }}>
                    <div
                      onClick={() => setOnlyDiffs(v => !v)}
                      style={{ width: '36px', height: '20px', borderRadius: '999px', background: onlyDiffs ? '#000' : '#d1d5db', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: onlyDiffs ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                    <span className="hidden md:inline">Visa endast skillnader</span>
                    <span className="md:hidden">Endast skillnader</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal content */}
            <div style={{ padding: '0', maxWidth: '1280px', margin: '0 auto' }}>

              {/* Desktop: produktkort + tabell */}
              <div className="hidden md:block" style={{ padding: '16px 16px 16px 16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ flexShrink: 0, width: '35%' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: '8px', flex: 1 }}>
                    {compareList.map((p, i) => (
                      <div key={p.id} style={{ position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => { window.dispatchEvent(new CustomEvent('toggleCompare', { detail: p })); removeFromCompare(p.id); }} style={{ position: 'absolute', top: 0, right: 0, background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRadius: '0 4px 0 999px', padding: '5px 5px 7px 9px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px', height: '70px' }}>
                          <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left' }} />
                        </div>
                        <div style={{ padding: '5px 8px', borderBottom: '1px solid #f3f4f6' }}>
                          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: '1px' }}>{p.brand || 'Varumärke'}</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2, color: '#111' }}>{p.title}</p>
                        </div>
                        <div style={{ padding: '4px 8px', borderBottom: '1px solid #f3f4f6' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>{p.price.toLocaleString('sv-SE')} kr</span>
                        </div>
                        <div style={{ padding: '4px 8px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.stock === 'Slut i lager' ? '#ef4444' : '#22c55e', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: p.stock === 'Slut i lager' ? '#ef4444' : '#16a34a' }}>{p.stock || 'I lager'}</span>
                        </div>
                        <div style={{ padding: '5px 8px', marginTop: 'auto' }}>
                          <button onClick={() => window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: p.id, variantId: p.variantId, title: p.title, price: p.price, quantity: 1, image: p.image } }))} style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '5px 0', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                            Lägg i varukorg
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '35%' }} />
                    {compareList.map((_, i) => <col key={i} />)}
                  </colgroup>
                  <tbody>
                    {/* PRODUKTINFO + Betyg — alltid överst */}
                    <Fragment key="produktinfo-header">
                      <tr>
                        <td style={{ padding: '16px 8px 6px 3px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '0.12em', fontSize: '0.72rem' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />Produktinfo</span>
                        </td>
                        {compareList.map((_, i) => <td key={i} />)}
                      </tr>
                      {(!onlyDiffs || compareList.some((p, _, arr) => p.rating !== arr[0].rating)) && (
                        <tr className="compare-spec-row" style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td className="spec-label" style={{ padding: '8px', fontSize: '0.68rem', color: '#555', fontWeight: 700, verticalAlign: 'top' }}>Betyg</td>
                          {compareList.map((p, i) => (
                            <td key={i} style={{ padding: '8px 8px 8px 12px', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', background: COLUMN_COLORS[i], verticalAlign: 'top' }}>
                              {p.rating ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ display: 'flex', gap: '1px' }}>
                                    {[...Array(5)].map((_, s) => (
                                      <span key={s} style={{ color: s < Math.floor(p.rating || 0) ? '#111' : '#d1d5db', fontSize: '0.9rem' }}>★</span>
                                    ))}
                                  </span>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>{p.rating.toFixed(1)}</span>
                                  {p.reviews ? <span style={{ fontSize: '0.72rem', color: '#aaa' }}>({p.reviews})</span> : null}
                                </div>
                              ) : <span style={{ fontSize: '0.82rem', color: '#ccc' }}>—</span>}
                            </td>
                          ))}
                        </tr>
                      )}
                    </Fragment>
                    {allSpecKeys.length > 0 ? grouped.map(({ category, keys }, groupIdx) => (
                      <Fragment key={category ?? 'uncategorized'}>
                        {(() => {
                          const isProdInfo = !category || !category.trim() || category === 'Övrigt' || category === 'System' || category === 'SYSTEM';
                          if (isProdInfo) return null; // redan renderad ovan
                          return (
                            <tr>
                              <td style={{ padding: '16px 8px 6px 3px', borderTop: '2px solid #e5e7eb' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '0.12em', fontSize: '0.72rem' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />{category}</span>
                              </td>
                              {compareList.map((_, i) => <td key={i} style={{ borderTop: '2px solid #e5e7eb' }} />)}
                            </tr>
                          );
                        })()}
                        {keys.map((label) => {
                          const values = compareList.map(p => getSpec(p, label));
                          if (values.every(v => !v)) return null;
                          if (onlyDiffs && values.every(v => v === values[0])) return null;
                          return (
                            <tr key={label} className="compare-spec-row" style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td className="spec-label" style={{ padding: '8px', fontSize: '0.68rem', color: '#555', fontWeight: 700, wordBreak: 'break-word', lineHeight: 1.3, verticalAlign: 'top', overflow: 'hidden' }}>{label}</td>
                              {values.map((val, i) => (
                                <td key={i} style={{ padding: '8px 8px 8px 12px', fontSize: '0.82rem', fontWeight: 500, color: val ? '#111' : '#ccc', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', background: COLUMN_COLORS[i], textAlign: 'left', verticalAlign: 'top', wordBreak: 'break-word', overflow: 'hidden' }}>
                                  {val || '—'}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </Fragment>
                    )) : (
                      <tr><td colSpan={compareList.length + 1} style={{ padding: '32px 0', fontSize: '0.85rem', color: '#aaa', textAlign: 'center' }}>Inga specifikationer att jämföra</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobil — EN scrollbar container med kort + specs */}
              <div className="md:hidden">
                <div
                  style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', scrollSnapType: 'x mandatory', display: 'block', fontSize: 0, width: '100vw', position: 'relative' }}
                >
                  {/* Vertikala kolumnlinjer */}
                  {compareList.slice(1).map((_, i) => (
                    <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i + 1) * 50}vw`, width: '1px', background: '#e5e7eb', zIndex: 2, pointerEvents: 'none' }} />
                  ))}
                  <table style={{ width: `${compareList.length * 50}vw`, minWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: '1rem' }}>
                    <colgroup>
                      {compareList.map((_, i) => <col key={i} style={{ width: '50vw' }} />)}
                    </colgroup>
                    <tbody>
                      {/* Produktkort-rad */}
                      <tr>
                        {compareList.map((p, i) => (
                            <td key={p.id} style={{ verticalAlign: 'top', padding: 0 }}>
                              <div style={{ position: 'relative', borderBottom: '1px solid #e5e7eb' }}>
                                <button onClick={() => { window.dispatchEvent(new CustomEvent('toggleCompare', { detail: p })); removeFromCompare(p.id); }} style={{ position: 'absolute', top: 0, right: 0, background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRadius: '0 4px 0 999px', padding: '5px 5px 7px 9px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', height: '80px' }}>
                                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ padding: '5px 8px', borderTop: '1px solid #f3f4f6' }}>
                                  <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: '1px' }}>{p.brand || 'Varumärke'}</p>
                                  <p style={{ fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.2, color: '#111' }}>{p.title}</p>
                                </div>
                                <div style={{ padding: '4px 8px', borderTop: '1px solid #f3f4f6' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111' }}>{p.price.toLocaleString('sv-SE')} kr</span>
                                </div>
                                <div style={{ padding: '4px 8px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.stock === 'Slut i lager' ? '#ef4444' : '#22c55e', flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: p.stock === 'Slut i lager' ? '#ef4444' : '#16a34a' }}>{p.stock || 'I lager'}</span>
                                </div>
                                <div style={{ padding: '5px 8px' }}>
                                  <button onClick={() => window.dispatchEvent(new CustomEvent('addToCart', { detail: { id: p.id, variantId: p.variantId, title: p.title, price: p.price, quantity: 1, image: p.image } }))} style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '6px 0', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                    Lägg i varukorg
                                  </button>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      {/* PRODUKTINFO + Betyg — alltid överst */}
                      <Fragment key="produktinfo-header-mobile">
                        <tr>
                          <td colSpan={compareList.length} style={{ padding: '14px 8px 4px 11px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '0.12em', fontSize: '0.72rem' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />Produktinfo</span>
                          </td>
                        </tr>
                        {(!onlyDiffs || compareList.some((p, _, arr) => p.rating !== arr[0].rating)) && (
                          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            {compareList.map((p, i) => (
                              <td key={i} style={{ padding: '8px 8px 8px 16px', verticalAlign: 'top' }}>
                                <div style={{ fontSize: '0.62rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Betyg</div>
                                {p.rating ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', gap: '1px' }}>
                                      {[...Array(5)].map((_, s) => (
                                        <span key={s} style={{ color: s < Math.floor(p.rating || 0) ? '#111' : '#d1d5db', fontSize: '0.8rem' }}>★</span>
                                      ))}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#555' }}>{p.rating.toFixed(1)}</span>
                                    {p.reviews ? <span style={{ fontSize: '0.68rem', color: '#aaa' }}>({p.reviews})</span> : null}
                                  </div>
                                ) : <span style={{ fontSize: '0.78rem', color: '#ccc' }}>—</span>}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Fragment>
                      {/* Specs-rader */}
                      {grouped.map(({ category, keys }) => {
                        const visibleKeys = keys.filter(label => {
                          const values = compareList.map(p => getSpec(p, label));
                          if (values.every(v => !v)) return false;
                          if (onlyDiffs && values.every(v => v === values[0])) return false;
                          return true;
                        });
                        const isProdInfo = !category || !category.trim() || category === 'Övrigt' || category === 'System' || category === 'SYSTEM';
                        if (visibleKeys.length === 0) return null;
                        return (
                          <Fragment key={category ?? 'uncategorized'}>
                            {(() => {
                              if (isProdInfo) return null; // redan renderad ovan
                              return (
                                <tr>
                                  <td colSpan={compareList.length} style={{ padding: '14px 8px 4px 11px', borderTop: '2px solid #e5e7eb' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textTransform: 'uppercase', color: '#111', letterSpacing: '0.12em', fontSize: '0.72rem' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111', flexShrink: 0 }} />{category}</span>
                                  </td>
                                </tr>
                              );
                            })()}
                            {visibleKeys.map((label) => (
                              <tr key={label} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                {compareList.map((p, i) => (
                                  <td key={i} style={{ padding: '8px 8px 8px 16px', verticalAlign: 'top', wordBreak: 'break-word', overflow: 'hidden', maxWidth: '50vw' }}>
                                    <div style={{ fontSize: '0.58rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: getSpec(p, label) ? '#111' : '#ccc', lineHeight: 1.3, overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{getSpec(p, label) || '—'}</div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
