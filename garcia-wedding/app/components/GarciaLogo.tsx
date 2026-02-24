'use client';

interface GarciaLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function GarciaLogo({ width = 160, height = 80, color = "#1A2744" }: GarciaLogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="40" rx="76" ry="36" stroke={color} strokeWidth="2" fill="none" />
      <text x="80" y="30" textAnchor="middle" fill={color} fontSize="14"
        fontFamily="Black Editorial Script, cursive" fontWeight="500">The</text>
      <text x="80" y="55" textAnchor="middle" fill={color} fontSize="28"
        fontFamily="Black Editorial Script, cursive" fontWeight="700">Garcias</text>
    </svg>
  );
}
