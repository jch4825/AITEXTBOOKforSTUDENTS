import React, { useState } from 'react';

interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export default function ActivityIcon({ icon, size = 40, className }: Props) {
  const [error, setError] = useState(false);
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  
  if (error) return null; // 로드 실패 시 DOM을 렌더링하지 않음 (100% 무해하게 숨김)

  return (
    <img
      src={`${baseUrl}lessons/pecs/${icon}.webp`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={() => setError(true)}
    />
  );
}
