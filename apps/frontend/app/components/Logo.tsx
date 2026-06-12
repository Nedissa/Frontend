import Image from 'next/image';

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Techpilots"
      width={size}
      height={size}
      className="flex-shrink-0"
      priority
    />
  );
}
