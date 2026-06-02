import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Techpilots"
      width={32}
      height={32}
      className="flex-shrink-0"
      priority
    />
  );
}
