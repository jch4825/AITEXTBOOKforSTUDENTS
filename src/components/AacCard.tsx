import type { AacCardAsset } from '../data/aacCards';
import { publicAssetUrl } from '../utils/publicAssetUrl';

interface CardButtonProps {
  key?: string;
  card: AacCardAsset;
  selected: boolean;
  onSelect: (card: AacCardAsset) => void;
}

export function AacCardButton({ card, selected, onSelect }: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      aria-label={`${card.label} 그림 카드`}
      aria-pressed={selected}
      className="flex min-h-[88px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white p-1.5 text-center transition sm:min-h-[96px]"
      style={{
        borderColor: selected ? '#fbbf24' : '#94a3b8',
        background: selected ? '#fffbeb' : '#ffffff',
        boxShadow: selected ? '0 0 0 2px #f59e0b' : 'none',
        color: '#172554',
      }}
    >
      <img
        src={publicAssetUrl(card.imageSrc)}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
        draggable={false}
      />
      <span className="w-full break-keep text-[12px] font-black leading-tight sm:text-[13px]">{card.label}</span>
    </button>
  );
}

interface CardVisualProps {
  card: AacCardAsset;
  selected?: boolean;
}

export function AacCardVisual({ card, selected = false }: CardVisualProps) {
  return (
    <figure
      className="mx-auto flex w-full max-w-40 flex-col items-center gap-1.5 rounded-xl border-2 bg-white p-2 text-center"
      style={{
        borderColor: selected ? '#34d399' : '#94a3b8',
        boxShadow: selected ? '0 0 0 2px #059669' : 'none',
        color: '#172554',
      }}
    >
      <img
        src={publicAssetUrl(card.imageSrc)}
        alt=""
        className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
        draggable={false}
      />
      <figcaption className="break-keep text-[13px] font-black leading-tight sm:text-[14px]">{card.label}</figcaption>
    </figure>
  );
}
