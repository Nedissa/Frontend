'use client';

import Image from 'next/image';

export function BottomBanner() {
  return (
    <div className="w-full bottom-banner-bg relative overflow-hidden">
      <style>{`
        @keyframes gradientShiftBottom {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bottom-banner-bg {
          background: linear-gradient(135deg, #0a0a0a, #030303, #0a0a0a, #0a0a0a, #030303);
        }
        .bottom-ribbon {
          position: absolute;
          top: 40px;
          right: -40px;
          width: 220px;
          background-color: #f5c842;
          color: #111;
          font-weight: 700;
          font-size: 11px;
          text-align: center;
          padding: 7px 0;
          transform: rotate(45deg);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .bottom-banner-inner {
          display: flex;
          height: 400px;
        }
        .bottom-banner-img-col {
          width: 50%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bottom-banner-text-col {
          width: 50%;
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 40px;
          text-align: center;
        }
        @media (max-width: 639px) {
          .bottom-banner-inner {
            flex-direction: column;
            height: auto;
          }
          .bottom-banner-img-col {
            width: 100%;
            height: 260px;
          }
          .bottom-banner-text-col {
            width: 100%;
            height: auto;
            padding: 32px 24px;
          }
        }
      `}</style>

      <div className="bottom-ribbon">● Nintendo ●</div>

      <div className="bottom-banner-inner">
        <div className="bottom-banner-img-col">
          <Image
            src="/controllers.webp"
            alt="Controllers"
            width={347}
            height={262}
            sizes="(max-width: 639px) 90vw, 45vw"
            style={{ maxHeight: '320px', maxWidth: '90%', width: 'auto', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div className="bottom-banner-text-col">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Exklusivt erbjudande</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Nintendo Kontroller: spela som ett proffs</h2>
          <p className="text-sm text-gray-300">Officiella kontroller för Switch. Begränsat antal.</p>
        </div>
      </div>
    </div>
  );
}
