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
  // 기존 7종 (하위 호환 유지)
  | 'neutral' | 'happy' | 'surprised' | 'thinking'
  | 'cheer' | 'curious' | 'sleepy'
  // 사람 캐릭터 신규 28종 표정 키
  | 'cold' | 'haha' | 'writing' | 'focus' | 'thought_deep' | 'smile_calm' 
  | 'strict' | 'explain' | 'observe_logical' | 'observe_surprised' | 'error_check' 
  | 'tired' | 'realization' | 'relief' | 'warning' | 'insight' | 'coding' | 'ethical'
  | 'gentle' | 'bright' | 'greet' | 'frustrated' | 'sad' | 'angry' | 'embarrassed'
  | 'wink' | 'bored' | 'stubborn' | 'shocked' | 'shy' | 'proud' | 'alternative'
  // 아이미 로봇 신규 28종 표정 키
  | 'aimi_happy' | 'aimi_bored' | 'aimi_sad' | 'aimi_crying' | 'aimi_tired' 
  | 'aimi_charging' | 'aimi_low_battery' | 'aimi_error' | 'aimi_study' | 'aimi_curious'
  | 'aimi_shy' | 'aimi_surprised' | 'aimi_scared' | 'aimi_angry' | 'aimi_wink' 
  | 'aimi_glitch' | 'aimi_proud' | 'aimi_lonely' | 'aimi_friendly' | 'aimi_neutral' 
  | 'aimi_sleepy' | 'aimi_cheer' | 'aimi_observe' | 'aimi_thought' | 'aimi_explain' 
  | 'aimi_alert' | 'aimi_success' | 'aimi_fail';

interface Props {
  character: CharacterId;
  expression?: Expression;
  size?: number; // px (정사각)
  className?: string;
  idle?: boolean; // 은은히 떠오르는 idle 모션(기본 켬) — reduced-motion에선 자동 정지
}

/** 세션 내 404 캐시 — 없는 확장자를 매 마운트마다 다시 요청하지 않는다 */
const missingAssets = new Set<string>();

function pickSrc(candidates: string[]): string | null {
  for (const c of candidates) {
    if (!missingAssets.has(c)) return c;
  }
  return null;
}

export default function CharacterAvatar({ character, expression = 'neutral', size = 64, className, idle = true }: Props) {
  const charMeta = CHARACTERS[character];
  const cls = [idle ? 'float-soft' : '', className].filter(Boolean).join(' ') || undefined;
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
      className={cls}
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
