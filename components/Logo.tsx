import Image from "next/image";

interface LogoProps {
  className?: string;
  height?: number;
}

export function Logo({ className = "", height = 32 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Pigbit"
      width={height * 4.2}
      height={height}
      className={className}
      priority
    />
  );
}
