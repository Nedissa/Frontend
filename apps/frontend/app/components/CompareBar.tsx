'use client';

import { useState } from 'react';
import { useCompare } from './CompareContext';

const COLUMN_COLORS = ['#dce3eb', '#c5d0db', '#a8b8c6', '#8a9fb0'];

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [expanded, setExpanded] = useState(false);

  if (compareList.length === 0) return null;

  // Collect all spec keys from both metadata.specifications and features
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
    const fromFeatures = (product.features || []).includes(label);
    return fromFeatures ? '⬤' : '';
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .compare-bar { animation: slideUp 0.25s ease; }
      `}</style>

      <div className="compare-bar fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200" style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.12)' }}>

        {/* Expanded table */}
        {expanded && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <td style={{ width: '160px', paddingBottom: '16px' }} />
                    {compareList.map((p, i) => (
                      <td key={p.id} style={{ paddingBottom: '16px', paddingRight: '16px', verticalAlign: 'top', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', paddingLeft: i > 0 ? '16px' : '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                          <p style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>{p.title}</p>
                          <p style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626' }}>{p.price.toLocaleString('sv-SE')} kr</p>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888' }}>Du jämför</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Specifications */}
                  {allSpecKeys.length > 0 && (
                    <>
                      {allSpecKeys.map(label => {
                        const values = compareList.map(p => getSpec(p, label));
                        const differs = new Set(values).size > 1;
                        return (
                          <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '10px 0', fontSize: '0.8rem', color: '#555', fontWeight: 500 }}>{label}</td>
                            {values.map((val, i) => (
                              <td key={i} style={{ padding: '10px 16px', fontSize: '1rem', fontWeight: 600, color: '#000', borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none', background: COLUMN_COLORS[i], textAlign: 'center' }}>
                                {val}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {allSpecKeys.length === 0 && (
                    <tr>
                      <td colSpan={compareList.length + 1} style={{ padding: '24px 0', fontSize: '0.85rem', color: '#aaa', textAlign: 'center' }}>
                        Inga specifikationer att jämföra
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Toggle bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={clearCompare}
            style={{ background: 'none', border: '1px solid #e5e7eb', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#666' }}
          >
            Rensa
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            disabled={compareList.length < 2}
            style={{ background: compareList.length < 2 ? '#e5e7eb' : '#000', color: compareList.length < 2 ? '#aaa' : '#fff', border: 'none', padding: '8px 20px', fontSize: '0.78rem', fontWeight: 700, cursor: compareList.length < 2 ? 'not-allowed' : 'pointer' }}
          >
            {expanded ? 'Stäng' : 'Jämför nu'}
          </button>
        </div>
      </div>
    </>
  );
}
