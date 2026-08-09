// Reusable code-built mockup frame for mobile screenshots.
// Pass a real screenshot URL via `image`, or omit it to show a placeholder gradient canvas.

export function PhoneMockup({ style, image }: { style?: React.CSSProperties; image?: string }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '230px',
        aspectRatio: '410 / 900',
        margin: '0 auto',
        borderRadius: '46px',
        background: '#000',
        padding: '11px',
        boxShadow: '0 25px 70px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.15)',
        boxSizing: 'border-box',
        position: 'relative',
        ...style,
      }}
    >
      {/* Inner bezel */}
      <div style={{ position: 'absolute', inset: '4px', borderRadius: '42px', background: '#000', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }} />

      {/* Side buttons */}
      <div style={{ position: 'absolute', left: '-2px', top: '20%', width: '2px', height: '6%', background: 'rgb(70,72,76)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', left: '-2px', top: '30%', width: '2px', height: '10%', background: 'rgb(70,72,76)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', left: '-2px', top: '44%', width: '2px', height: '10%', background: 'rgb(70,72,76)', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 2px rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', right: '-2px', top: '25%', width: '2px', height: '13%', background: 'rgb(70,72,76)', borderRadius: '0 2px 2px 0', boxShadow: '1px 0 2px rgba(0,0,0,0.3)' }} />

      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '38px',
          overflow: 'hidden',
          position: 'relative',
          background: image ? '#fff' : undefined,
          backgroundImage: image ? `url(${image})` : 'linear-gradient(135deg, rgb(247,247,246) 0%, rgb(237,237,233) 100%)',
          backgroundSize: image ? '100% 100%' : 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      >
        {!image && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 15%, rgba(232,197,71,0.14) 0%, transparent 55%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
