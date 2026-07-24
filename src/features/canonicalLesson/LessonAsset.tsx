import React, { useState } from 'react';
import type { CanonicalAssetSpec } from '../../data/canonicalLessons/types';

interface LessonAssetProps {
  asset: CanonicalAssetSpec;
  className?: string;
}

export const LessonAsset: React.FC<LessonAssetProps> = ({ asset, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (asset.renderAs === 'html') {
    return (
      <div className={`p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 font-sans ${className}`}>
        <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
          {asset.purpose || '자료'}
        </div>
        <div className="text-sm text-slate-800 leading-relaxed">{asset.alt}</div>
      </div>
    );
  }

  if (asset.renderAs === 'audio') {
    return (
      <div className={`p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center space-x-3 ${className}`}>
        <span className="text-xl" role="img" aria-label="음성 자료">🔊</span>
        <div className="text-xs text-indigo-900 font-medium">{asset.alt}</div>
      </div>
    );
  }

  // renderAs === 'image'
  if (hasError || !asset.src) {
    return (
      <div className={`aspect-video rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center ${className}`}>
        <span className="text-3xl mb-2" role="img" aria-label="이미지">🖼️</span>
        <span className="text-xs text-slate-500 font-medium">{asset.alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200/80 ${className}`}>
      <img
        src={asset.src}
        alt={asset.alt}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover max-h-[360px]"
        loading="lazy"
      />
    </div>
  );
};
