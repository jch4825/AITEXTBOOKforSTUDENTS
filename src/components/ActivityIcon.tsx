import React from 'react';

interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export default function ActivityIcon({ icon, size = 40, className }: Props) {
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  
  return (
    <img
      src={`${baseUrl}lessons/pecs/${icon}.webp`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
      }}
    />
  );
}
