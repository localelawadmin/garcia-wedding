'use client';

interface GarciaLogoProps {
  width?: number;
  height?: number;
}

export default function GarciaLogo({ width = 220, height = 110 }: GarciaLogoProps) {
  return (
    <img
      src="/garcia-logo.svg"
      width={width}
      height={height}
      alt="The Garcias"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
