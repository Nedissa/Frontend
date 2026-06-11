import Image from 'next/image';

export function PerksBanner() {
  return (
    <div className="w-full" style={{ maxHeight: '300px', overflow: 'hidden' }}>
      <Image
        src="/sleek-speaker.png"
        alt="Sleek Speaker on Minimalist Surface"
        width={1920}
        height={800}
        className="w-full object-cover"
        style={{ maxHeight: '300px', objectFit: 'cover' }}
        priority
      />
    </div>
  );
}
