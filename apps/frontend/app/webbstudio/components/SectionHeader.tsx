export function SectionHeader({ num, label, extra }: { num: string; label: string; extra?: string }) {
  return (
    <>
      <div style={{ borderBottom: '1px solid rgb(230,230,230)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', marginBottom: '60px', fontSize: '14px', color: 'rgb(104,105,99)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', background: '#030303', display: 'inline-block', transform: 'rotate(45deg)' }} />
          ({num})
        </span>
        <span>({label})</span>
        {extra && <span>{extra}</span>}
      </div>
    </>
  );
}
