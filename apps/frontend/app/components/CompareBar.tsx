'use client';

import { useState, useEffect, Fragment } from 'react';
import { useCompare } from './CompareContext';

const COLUMN_COLORS = ['#dce3eb', '#c5d0db', '#a8b8c6', '#8a9fb0'];

const SPEC_CATEGORIES: { label: string; keys: string[] }[] = [
  { label: 'Processor', keys: ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
  { label: 'Grafik', keys: ['RTX 4070', 'RTX 4080', 'RTX 4090', 'RTX 3080', 'RX 7900 XT', '16GB GDDR6X', '8GB GDDR6', '12GB GDDR6X', 'PCIe 4.0', 'PCIe 5.0'] },
  { label: 'Minne', keys: ['16GB RAM', '32GB RAM', '64GB RAM', '32GB DDR5', '16GB DDR5', '16GB DDR4'] },
  { label: 'Lagring', keys: ['512GB SSD', '1TB SSD', '2TB SSD', '1TB NVMe', '2TB NVMe'] },
  { label: 'Kylning', keys: ['Triple Fan kylning', 'Dual Fan kylning', '6 Heatpipes', '250W TDP', '120mm PWM', '140mm PWM'] },
];

function getCategoryForKey(key: string): string | null {
  for (const cat of SPEC_CATEGORIES) {
    if (cat.keys.some(k => key.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(key.toLowerCase()))) {
      return cat.label;
    }
  }
  return null;
}

export function CompareBar() {
  const { compareList, clearCompare } = useCompare();
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => { setModalOpen(false); setClosing(false); }, 280);
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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
    (p.features || []).filter(f => !f.startsWith('tier:')).forEach(f => {
      if (!allSpecKeys.includes(f)) allSpecKeys.push(f);
    });
  });

  const getSpec = (product: typeof compareList[0], label: string) => {
    const specs: { label: string; value: string }[] = (product.metadata?.specifications as any) || [];
    const fromSpecs = specs.find(s => s.label === label)?.value;
    if (fromSpecs) return fromSpecs;
    return (product.features || []).includes(label) ? '⬤' : null;
  };

  // Group spec keys by category
  const grouped: { category: string | null; keys: string[] }[] = [];
  const seen = new Set<string>();
  allSpecKeys.forEach(key => {
    const cat = getCategoryForKey(key);
    const existing = grouped.find(g => g.category === cat);
    if (existing) {
      existing.keys.push(key);
    } else {
      grouped.push({ category: cat, keys: [key] });
    }
    seen.add(key);
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
        .compare-spec-row:hover .spec-val { background: #111 !important; color: #fff !important; }
        .compare-spec-row:hover .spec-label { font-weight: 700 !important; color: #000 !important; }
        .compare-spec-row-even .spec-val { filter: brightness(0.97); }
        .compare-sheet-in::-webkit-scrollbar { display: none; }
        .compare-sheet-out::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Floating bar */}
      <div className="compare-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ zIndex: 102, boxShadow: '0 -4px 24px rgba(0,0,0,0.12)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: '#555', fontWeight: 600 }}>
            {compareList.length} / 4 produkter valda
          </span>
          <button
            onClick={() => {
              if (modalOpen) {
                closeSheet();
                setTimeout(() => { window.dispatchEvent(new CustomEvent('clearCompare')); clearCompare(); }, 280);
              } else {
                window.dispatchEvent(new CustomEvent('clearCompare'));
                clearCompare();
              }
            }}
            style={{ background: 'none', border: '1px solid #e5e7eb', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#666' }}
          >
            Rensa
          </button>
          <button
            onClick={() => setModalOpen(true)}
            disabled={compareList.length < 2}
            style={{ background: compareList.length < 2 ? '#e5e7eb' : '#000', color: compareList.length < 2 ? '#aaa' : '#fff', border: 'none', padding: '8px 20px', fontSize: '0.78rem', fontWeight: 700, cursor: compareList.length < 2 ? 'not-allowed' : 'pointer' }}
          >
            Jämför nu
          </button>
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
            onTouchMove={(e) => e.preventDefault()}
          />
          {/* Sheet */}
          <div
            className={closing ? 'compare-sheet-out' : 'compare-sheet-in'}
            style={{ position: 'fixed', bottom: '57px', left: 0, right: 0, zIndex: 101, background: '#fff', maxHeight: 'calc(100vh - 57px)', overflowY: 'auto', overscrollBehavior: 'contain', scrollbarWidth: 'none', borderRadius: '12px 12px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: '#fff', zIndex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Jämförelse</h2>
              <button
                onClick={closeSheet}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal content */}
            <div style={{ padding: '24px 28px', maxWidth: '1280px', margin: '0 auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <td style={{ width: '160px', paddingBottom: '8px' }} />
                    {compareList.map((p, i) => (
                      <td key={p.id} style={{ paddingBottom: '24px', paddingRight: '16px', verticalAlign: 'top', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', paddingLeft: i > 0 ? '16px' : '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <img src={p.image} alt={p.title} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                          <p style={{ fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>{p.title}</p>
                          <p style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626' }}>{p.price.toLocaleString('sv-SE')} kr</p>
                          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#888' }}>Du jämför</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSpecKeys.length > 0 ? grouped.map(({ category, keys }) => (
                    <Fragment key={category ?? 'uncategorized'}>
                      {category && (
                        <tr key={`cat-${category}`}>
                          <td colSpan={compareList.length + 1} style={{ padding: '12px 0 6px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', borderTop: '2px solid #e5e7eb' }}>
                            {category}
                          </td>
                        </tr>
                      )}
                      {keys.map((label) => {
                        const values = compareList.map(p => getSpec(p, label));
                        return (
                          <tr key={label} className="compare-spec-row" style={{ borderBottom: '1px solid #f3f4f6', cursor: 'default', transition: 'background 0.15s' }}>
                            <td className="spec-label" style={{ padding: '10px 0', fontSize: '0.8rem', color: '#555', fontWeight: 500, transition: 'color 0.15s, font-weight 0.15s' }}>{label}</td>
                            {values.map((val, i) => (
                              <td key={i} className="spec-val" style={{ padding: '10px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#000', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', background: COLUMN_COLORS[i], textAlign: 'center', transition: 'filter 0.15s' }}>
                                {val ?? ''}
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
