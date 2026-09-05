import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { playSound } from '../../../utils/sound';
import type { MiniGameStageTab, MiniGameStatus } from './types';

interface Progress {
  label: string;
  value: number;
  max: number;
}

const STAGE_LABELS: Record<string, string> = {
  '기본': '연습',
  '1단계': '기본',
  '2단계': '도전',
  '3단계': '확장',
};

interface Props {
  /** 게임 이름표. 예: "한 붓 그리기 퍼즐" */
  badge: string;
  /** 무엇을 어떻게 조작하는지 한두 줄. 읽어주기 버튼이 이 문장을 읽는다. */
  instruction: string;
  /** 프레임 테두리·립 색. 스튜디오가 넘겨주는 단원 강조색을 그대로 쓴다. */
  accent?: string;
  progress?: Progress;
  /**
   * 보드 위에 붙는 상태 표시(남은 기회·점수·남은 시간). GameHud를 넣으면 톤이 맞는다.
   * 진행 칸 수(progress)와 달리 매 프레임 바뀌는 값이라 보드 쪽에 둔다.
   */
  hud?: React.ReactNode;
  stages?: MiniGameStageTab[];
  activeStageIndex?: number;
  onStageSelect?: (index: number) => void;
  status: MiniGameStatus;
  /** 성공·실패 배너 문구. 비텍스트 피드백의 보조이므로 한 줄로 짧게. */
  message?: string;
  /**
   * 조작 버튼 바로 위에 붙는 설명 띠.
   *
   * 보드 안에 띄우면 놀이 장면을 가린다. 판 위에서 눈으로 알아보는 것과 글로 읽는 것을
   * 갈라 두려고 이 자리를 만들었다. 보드 밖 종이 면이므로 다크 보드 색을 쓰지 않는다.
   */
  footer?: React.ReactNode;
  /** 하단 조작 버튼들. MiniGameButton을 쓰면 톤이 맞는다. */
  actions?: React.ReactNode;
  /** 실제 플레이 보드. 프레임이 다크 배경을 깔아주므로 자체 배경을 두지 않는다. */
  children: React.ReactNode;
}

/**
 * 미니게임 공통 셸.
 *
 * 바깥 프레임(이름표·스테이지 탭·안내·버튼·배너)은 앱 전체와 같은 종이-스티커 화이트,
 * 가운데 플레이 보드만 다크로 둔다. 학생이 "여기가 놀이 공간"이라고 바로 알아보게 하려는
 * 의도적인 대비이며, 게임마다 다시 칠하지 않도록 여기서 한 번만 정의한다.
 */
export default function MiniGameFrame({
  badge,
  instruction,
  accent = 'var(--brand-ink)',
  progress,
  hud,
  stages,
  activeStageIndex = 0,
  onStageSelect,
  status,
  message,
  footer,
  actions,
  children,
}: Props) {
  const { speakNow } = useSpeak();
  const tint = `color-mix(in srgb, ${accent} 12%, var(--paper-0))`;

  // 한 칸 채울 때마다 같은 소리를 낸다. 여기 한 곳에 두면 62개 게임이 함께 따른다.
  // 줄어들 때(되돌리기·다시 하기)는 울리지 않는다 — 되돌리는 것은 실패가 아니다.
  const lastProgress = useRef<number | null>(null);
  useEffect(() => {
    const value = progress?.value ?? null;
    if (value !== null && lastProgress.current !== null && value > lastProgress.current) {
      playSound('fill');
    }
    lastProgress.current = value;
  }, [progress?.value]);

  return (
    <div
      data-minigame-frame
      className="surface-sticker flex h-full min-h-0 flex-col gap-2 overflow-hidden rounded-2xl p-3 sm:p-3.5"
      style={{
        '--surface-edge': accent,
      } as React.CSSProperties}
    >
      {/* 이름표 + 난이도 + 진행 수치.
          난이도를 따로 한 줄에 두었더니 그 줄만 60px 남짓을 먹어 놀이판이 그만큼 눌렸다.
          셋은 모두 "이 판이 무엇인지" 알리는 머리글이라 한 줄에 모은다. */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] font-black"
          style={{ background: tint, border: `1.5px solid ${accent}` }}
        >
          <Icon name="cards" size={16} />
          {badge}
        </span>

        {/* 난이도 — 세 칸을 붙인 길쭉한 한 덩어리로 둔다. 낱개 버튼 셋보다 높이를 덜 쓰고,
            지금 어느 칸에 서 있는지도 한눈에 읽힌다. */}
        {stages && stages.length > 1 && (
          <div
            role="group"
            aria-label="난이도 고르기"
            className="flex shrink-0 items-center overflow-hidden rounded-full"
            style={{ border: `1.5px solid var(--line)` }}
          >
            {stages.map((stage, index) => {
              const active = index === activeStageIndex;
              const stageLabel = STAGE_LABELS[stage.label] ?? stage.label;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => onStageSelect?.(index)}
                  aria-pressed={active}
                  // 손가락으로 누르는 칸이므로 최소 44px 높이를 지킨다.
                  className="min-h-11 shrink-0 px-4 text-[14px] font-black transition"
                  style={{
                    background: active ? accent : 'var(--paper-1)',
                    color: active ? 'var(--paper-0)' : 'var(--ink-2)',
                    borderLeft: index === 0 ? 'none' : '1.5px solid var(--line)',
                  }}
                >
                  {stageLabel}
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* 안내 문장 + 읽어주기 */}
      <div className="flex items-start gap-2">
        <p
          className="flex-1 text-[15px] font-bold leading-normal sm:text-[16px]"
          style={{ color: 'var(--ink-2)' }}
        >
          {instruction}
        </p>
        <button
          type="button"
          onClick={() => speakNow(instruction)}
          aria-label="설명 읽어주기"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-[17px] transition"
          style={{ background: tint, border: `1.5px solid ${accent}` }}
        >
          <span aria-hidden="true">🔊</span>
        </button>
      </div>

      {/* 플레이 보드 — 유일한 다크 영역 */}
      <div
        className="mini-game-board relative flex min-h-0 flex-1 flex-col gap-2 overflow-auto rounded-xl p-2.5 sm:p-3"
      >
        {/* 남은 기회·시간과 진행 수치는 한 줄에 둔다.
            진행 수치를 이름표 줄에 두었더니, 이름이 긴 차시에서는 난이도 탭에 밀려 줄이
            접히고 그만큼 놀이판이 눌렸다. 셋 다 "지금 판이 어떤 상태인가"를 알리는 값이라
            판 안에 함께 두는 편이 찾기도 쉽다. */}
        {(hud || progress) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {hud && <div className="min-w-0 flex-1">{hud}</div>}
            {progress && (
              <span className="shrink-0 text-[15px] font-black" style={{ color: '#CBD5E1' }}>
                {progress.label}{' '}
                <strong className="text-[18px]" style={{ color: 'var(--board-ink)' }}>
                  {progress.value}
                </strong>
                {' / '}
                {progress.max}
              </span>
            )}
          </div>
        )}
        {children}
      </div>

      {/* 성공·실패 배너 — 보드 안의 움직임이 1차 피드백이고 이 문구는 보조다 */}
      {message && (status === 'success' || status === 'fail') && (
        <div
          role="status"
          className="rounded-xl px-3 py-2 text-center text-[15px] font-black leading-relaxed"
          style={
            status === 'success'
              ? { background: 'var(--ok-bg)', color: '#14532d', border: '1.5px solid var(--ok)' }
              : { background: 'var(--warn-bg)', color: '#7c2d12', border: '1.5px solid var(--warn)' }
          }
        >
          {status === 'success' ? '🎉 ' : '🔄 '}
          {message}
        </div>
      )}

      {footer}

      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  emoji: string;
  label: string;
  /** primary는 "실행"처럼 그 화면의 주된 다음 동작 하나에만 쓴다. */
  variant?: 'primary' | 'quiet';
  accent?: string;
}

/** 미니게임 하단 조작 버튼. 터치 목표를 44px 이상으로 유지한다. */
export function MiniGameButton({
  onClick,
  disabled = false,
  emoji,
  label,
  variant = 'quiet',
  accent = 'var(--brand-ink)',
}: ButtonProps) {
  const primary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1 text-[14px] font-black leading-tight transition disabled:opacity-45 sm:text-[15px]"
      style={{
        background: primary ? accent : 'var(--paper-1)',
        color: primary ? 'var(--paper-0)' : 'var(--ink-1)',
        border: `2px solid ${primary ? accent : 'var(--line)'}`,
      }}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}
