import { useEffect, useState } from 'react';

interface Props {
  webpSrc: string;
  pngSrc: string;
  alt: string;
  className?: string;
}

/** 서비스용 WebP를 우선 사용하고, 로드 오류 때 PNG 원본으로 폴백한다. */
export default function StoryAsset({ webpSrc, pngSrc, alt, className = '' }: Props) {
  const [src, setSrc] = useState(webpSrc);

  useEffect(() => setSrc(webpSrc), [webpSrc]);

  return <img src={src} alt={alt} className={className} onError={() => setSrc(pngSrc)} />;
}
