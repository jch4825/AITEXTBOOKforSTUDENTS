import { useEffect, useState } from 'react';
import type { CharacterId } from '../data/characters';
import { CHARACTERS } from '../data/characters';

/**
 * AI 동아리 4인 아바타 — 캐릭터 비주얼 단일 지점 (D5 교체점 가동).
 * public/characters/{id}-{expression}.png(실제 일러스트 컷) → .svg(벡터 폴백) 순서로
 * 시도한다. 일러스트 컷을 같은 파일명으로 넣기만 하면 코드 수정 없이 교체된다.
 * (규격: 512×512, 투명 배경 — docs/design-upgrade-plan.md §6)
 */

export type Expression =
  | 'neutral' | 'happy' | 'surprised' | 'thinking' // 사람 캐릭터
  | 'cheer' | 'curious' | 'sleepy';                // 아이미 전용 (사람 컷도 파일로 제공됨)

interface Props {
  character: CharacterId;
  expression?: Expression;
  size?: number; // px (정사각)
  className?: string;
}

/** 세션 내 404 캐시 — 없는 확장자를 매 마운트마다 다시 요청하지 않는다 */
const missingAssets = new Set<string>();

function pickSrc(candidates: string[]): string | null {
  for (const c of candidates) {
    if (!missingAssets.has(c)) return c;
  }
  return null;
}

export default function CharacterAvatar({ character, expression = 'neutral', size = 64, className }: Props) {
  const charMeta = CHARACTERS[character];
  const base = `${import.meta.env.BASE_URL}characters/${character}-${expression}`;
  const candidates = [`${base}.png`, `${base}.svg`];
  const [src, setSrc] = useState<string | null>(() => pickSrc(candidates));

  // 캐릭터·표정이 바뀌면 후보 체인을 다시 시도한다.
  useEffect(() => {
    setSrc(pickSrc(candidates));
    // eslint 없음 — candidates는 base에서 파생되므로 base만 의존.
  }, [base]);

  if (!src) {
    // png·svg 모두 없음 — 자리만 지키는 무해한 원 (배포 에셋 누락 시에도 UI는 깨지지 않는다)
    return (
      <span
        aria-label={charMeta.name}
        role="img"
        className={className}
        style={{ width: size, height: size, display: 'inline-block', borderRadius: '50%', background: 'var(--paper-2)' }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={charMeta.name}
      width={size}
      height={size}
      className={className}
      onError={() => {
        missingAssets.add(src);
        setSrc(pickSrc(candidates));
      }}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}
