import type { JSX } from 'react';
import type { CharacterId } from '../data/characters';

/**
 * AI 동아리 4인 벡터 아바타 (흉상) — 사용자 제공 캐릭터 시트의 팔레트를 따른 단순화 버전.
 * 캐릭터 시각 표현은 이 파일 한 곳에만 존재한다. 추후 실제 일러스트 이미지로
 * 교체할 때는 이 컴포넌트 내부만 <img>로 바꾸면 된다.
 */

export type Expression =
  | 'neutral' | 'happy' | 'surprised' | 'thinking' // 사람 캐릭터
  | 'cheer' | 'curious' | 'sleepy';                // 아이미 전용 (사람에겐 비슷한 표정으로 폴백)

interface Props {
  character: CharacterId;
  expression?: Expression;
  size?: number; // px (정사각)
  className?: string;
}

export default function CharacterAvatar({ character, expression = 'neutral', size = 64, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 100 100',
    role: 'img' as const,
    className,
  };
  if (character === 'aimi') {
    return <svg {...common} aria-label="아이미"><AimiBody expression={expression} /></svg>;
  }
  if (character === 'jinwoo') {
    return <svg {...common} aria-label="강진우"><HumanBust config={JINWOO} expression={expression} /></svg>;
  }
  if (character === 'yoona') {
    return <svg {...common} aria-label="서윤아"><HumanBust config={YOONA} expression={expression} /></svg>;
  }
  return <svg {...common} aria-label="박민준 선생님"><HumanBust config={MINJUN} expression={expression} /></svg>;
}

// ─────────────────────────── 아이미 (로봇) ───────────────────────────

const AIMI = {
  bg: '#FBEFF2',
  shell: '#F7E4EA',
  shellLine: '#E3C4CF',
  screen: '#27314B',
  glow: '#8FE0FF',
  accent: '#BFE6F7',
};

function AimiBody({ expression }: { expression: Expression }) {
  return (
    <g>
      <circle cx="50" cy="50" r="48" fill={AIMI.bg} />
      {/* 안테나 */}
      <line x1="50" y1="12" x2="50" y2="21" stroke={AIMI.shellLine} strokeWidth="2.5" />
      <circle cx="50" cy="10" r="3.5" fill={AIMI.glow} />
      {/* 몸통 + 팔 */}
      <circle cx="25" cy="77" r="6" fill={AIMI.shell} stroke={AIMI.shellLine} strokeWidth="1.5" />
      <circle cx="75" cy="77" r="6" fill={AIMI.shell} stroke={AIMI.shellLine} strokeWidth="1.5" />
      <rect x="32" y="66" width="36" height="34" rx="16" fill={AIMI.shell} stroke={AIMI.shellLine} strokeWidth="1.5" />
      <circle cx="50" cy="80" r="5" fill={AIMI.glow} stroke={AIMI.accent} strokeWidth="2" />
      {/* 머리 */}
      <circle cx="20" cy="42" r="5" fill={AIMI.accent} />
      <circle cx="80" cy="42" r="5" fill={AIMI.accent} />
      <rect x="22" y="20" width="56" height="44" rx="20" fill={AIMI.shell} stroke={AIMI.shellLine} strokeWidth="1.5" />
      {/* LED 얼굴 스크린 */}
      <rect x="30" y="28" width="40" height="28" rx="12" fill={AIMI.screen} />
      <AimiFace expression={expression} />
    </g>
  );
}

function AimiFace({ expression }: { expression: Expression }): JSX.Element {
  const s = { stroke: AIMI.glow, strokeWidth: 2.6, fill: 'none' as const, strokeLinecap: 'round' as const };
  switch (expression) {
    case 'cheer':
      return (
        <g>
          <path d="M37 41 q4.5 -6 9 0" {...s} />
          <path d="M54 41 q4.5 -6 9 0" {...s} />
          <path d="M44 45 q6 9 12 0 z" fill={AIMI.glow} stroke="none" />
        </g>
      );
    case 'curious':
      return (
        <g>
          <circle cx="41.5" cy="40" r="3.2" fill={AIMI.glow} />
          <circle cx="58.5" cy="40" r="3.2" fill={AIMI.glow} />
          <circle cx="50" cy="49" r="2.4" fill="none" stroke={AIMI.glow} strokeWidth="2.2" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          <path d="M37.5 40 h8" {...s} />
          <path d="M54.5 40 h8" {...s} />
          <path d="M46 48.5 h8" {...s} />
        </g>
      );
    case 'sleepy':
      return (
        <g>
          <path d="M37 40 q4.5 5 9 0" {...s} />
          <path d="M54 40 q4.5 5 9 0" {...s} />
          <path d="M46.5 49 h7" {...s} />
        </g>
      );
    // happy (기본) — neutral/surprised 등 사람 표정 값이 오면 happy로 폴백
    default:
      return (
        <g>
          <path d="M37 41 q4.5 -6 9 0" {...s} />
          <path d="M54 41 q4.5 -6 9 0" {...s} />
          <path d="M43.5 46.5 q6.5 6 13 0" {...s} />
        </g>
      );
  }
}

// ─────────────────────────── 사람 캐릭터 공통 ───────────────────────────

interface HumanConfig {
  bg: string;
  skin: string;
  hair: string;
  hairPath: string;      // 머리 모양 (100×100 좌표계)
  blazer: string;
  neckwear: 'tie' | 'ribbon';
  neckwearColor: string;
  vestColor?: string;    // 블레이저 안 조끼 (윤아)
  glasses?: boolean;     // 안경 (민준쌤)
}

const JINWOO: HumanConfig = {
  bg: '#EAF1FB',
  skin: '#F6D7BC',
  hair: '#6B4A32',
  // 짧고 부스스한 머리 — 이마 위 지그재그 앞머리
  hairPath:
    'M28 44 Q26 18 50 17 Q74 18 72 44 L72 37 Q69 30 64 34 Q60 26 53 31 Q49 24 43 30 Q38 27 34 33 Q30 31 28 38 Z',
  blazer: '#33405C',
  neckwear: 'tie',
  neckwearColor: '#B03A3A',
};

const YOONA: HumanConfig = {
  bg: '#FDF3EC',
  skin: '#F8DCC3',
  hair: '#5E4634',
  // 단정한 단발 — 일자 앞머리 + 양옆 커튼
  hairPath:
    'M27 54 Q24 17 50 16 Q76 17 73 54 Q73 58 68 58 L68 40 Q62 31 50 31 Q38 31 32 40 L32 58 Q27 58 27 54 Z',
  blazer: '#33405C',
  neckwear: 'ribbon',
  neckwearColor: '#B03A3A',
  vestColor: '#D9C39A',
};

const MINJUN: HumanConfig = {
  bg: '#EEF0F4',
  skin: '#F2D3B3',
  hair: '#26282E',
  // 정갈한 짧은 머리
  hairPath: 'M29 39 Q28 19 50 18 Q72 19 71 39 Q70 32 61 30 Q51 26 41 30 Q32 32 29 39 Z',
  blazer: '#2F3B54',
  neckwear: 'tie',
  neckwearColor: '#8A6240',
  glasses: true,
};

function HumanBust({ config, expression }: { config: HumanConfig; expression: Expression }) {
  return (
    <g>
      <circle cx="50" cy="50" r="48" fill={config.bg} />
      {/* 어깨(블레이저) */}
      <path d="M17 100 Q19 73 50 73 Q81 73 83 100 Z" fill={config.blazer} />
      {/* 조끼(있으면) → 셔츠 → 넥웨어 순서로 겹침 */}
      {config.vestColor && <path d="M41 74 L50 90 L59 74 Z" fill={config.vestColor} />}
      <path d="M44 74 L50 85 L56 74 Z" fill="#FFFFFF" />
      {config.neckwear === 'tie' ? (
        <path d="M48.4 75 L51.6 75 L51 87 L49 87 Z" fill={config.neckwearColor} />
      ) : (
        <g fill={config.neckwearColor}>
          <path d="M50 78 L43.5 74.5 L43.5 81.5 Z" />
          <path d="M50 78 L56.5 74.5 L56.5 81.5 Z" />
          <circle cx="50" cy="78" r="1.6" />
        </g>
      )}
      {/* 목 + 얼굴 */}
      <rect x="45" y="62" width="10" height="12" rx="4" fill={config.skin} />
      <circle cx="50" cy="43" r="21" fill={config.skin} />
      <path d={config.hairPath} fill={config.hair} />
      {config.glasses && (
        <g fill="rgba(255,255,255,0.25)" stroke="#3A3F4A" strokeWidth="1.8">
          <rect x="35.5" y="38" width="11.5" height="8.5" rx="3.5" />
          <rect x="53" y="38" width="11.5" height="8.5" rx="3.5" />
          <line x1="47" y1="41.5" x2="53" y2="41.5" />
        </g>
      )}
      <HumanFace expression={expression} />
    </g>
  );
}

function HumanFace({ expression }: { expression: Expression }): JSX.Element {
  const ink = '#3D2B1E';
  const s = { stroke: ink, strokeWidth: 2, fill: 'none' as const, strokeLinecap: 'round' as const };
  switch (expression) {
    case 'happy':
    case 'cheer': // 아이미 전용 값 폴백
      return (
        <g>
          <path d="M38 43 q4 -5 8 0" {...s} />
          <path d="M54 43 q4 -5 8 0" {...s} />
          <path d="M44.5 52 q5.5 6 11 0" {...s} />
        </g>
      );
    case 'surprised':
    case 'curious':
      return (
        <g>
          <circle cx="42" cy="43" r="3" fill="#FFFFFF" stroke={ink} strokeWidth="1.6" />
          <circle cx="58" cy="43" r="3" fill="#FFFFFF" stroke={ink} strokeWidth="1.6" />
          <circle cx="42" cy="43" r="1.4" fill={ink} />
          <circle cx="58" cy="43" r="1.4" fill={ink} />
          <ellipse cx="50" cy="55" rx="3.2" ry="4" fill="#8A5A48" />
        </g>
      );
    case 'thinking':
    case 'sleepy':
      return (
        <g>
          <path d="M38 43 h7.5" {...s} />
          <path d="M54.5 43 h7.5" {...s} />
          <path d="M37 36.5 q4 -3 8 -1.2" {...s} strokeWidth={1.7} />
          <path d="M46 54.5 h8" {...s} />
        </g>
      );
    // neutral
    default:
      return (
        <g>
          <circle cx="42" cy="43" r="2.2" fill={ink} />
          <circle cx="58" cy="43" r="2.2" fill={ink} />
          <path d="M45.5 53 q4.5 4 9 0" {...s} />
        </g>
      );
  }
}
