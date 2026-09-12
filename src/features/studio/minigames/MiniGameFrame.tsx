import React, { useEffect, useRef } from 'react';
import BauhausMark from './engine/BauhausMark';
import type { MarkKind } from './engine/BauhausMark';
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
   * 갈라 두려고 이 자리를 만들었다.
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
 * 놀이는 교과서 본문과 다른 문법을 쓴다 — 바우하우스의 원·사각형·삼각형, 평면 채색,
 * 각진 모서리, 그림자 없음. 어휘가 통째로 바뀌는 것이 "이제 놀이 시간"이라는 신호다.
 * 바깥 프레임은 종이, 가운데 플레이 보드만 어두운 면으로 둔다.
 *
 * 62개를 옮기는 동안에는 이 셸이 옛 어휘와 새 어휘를 `bauhaus` 플래그로 함께 안고
 * 있었다. 전환이 끝나 플래그와 옛 갈래를 걷어냈다.
 */
export default function MiniGameFrame({
  badge,
  instruction,
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
      className="flex h-full min-h-0 flex-col gap-2 overflow-hidden p-3 sm:p-3.5"
      style={{
        background: 'var(--game-paper)',
        border: 'var(--game-heavy) solid var(--game-ink)',
        color: 'var(--game-ink)',
      }}
    >
      {/* 이름표 + 난이도 + 진행 수치.
          난이도를 따로 한 줄에 두었더니 그 줄만 60px 남짓을 먹어 놀이판이 그만큼 눌렸다.
          셋은 모두 "이 판이 무엇인지" 알리는 머리글이라 한 줄에 모은다. */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[14px] font-black"
          style={{
            /* 종이 위 노랑은 대비가 1.70이라 도형의 최소 3:1에도 못 미친다.
               검정 윤곽선이 경계를 대신 만든다. */
            background: 'var(--game-yellow)',
            border: 'var(--game-line) solid var(--game-keyline)',
            color: 'var(--game-ink)',
          }}
        >
          <BauhausMark kind="square" size={14} />
          {badge}
        </span>

        {/* 난이도 — 세 칸을 붙인 길쭉한 한 덩어리로 둔다. 낱개 버튼 셋보다 높이를 덜 쓰고,
            지금 어느 칸에 서 있는지도 한눈에 읽힌다. */}
        {stages && stages.length > 1 && (
          <div
            role="group"
            aria-label="난이도 고르기"
            className="flex shrink-0 items-center overflow-hidden"
            style={{ border: 'var(--game-line) solid var(--game-ink)' }}
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
                    background: active ? 'var(--game-blue)' : 'var(--game-paper)',
                    color: active ? 'var(--game-paper)' : 'var(--game-ink)',
                    borderLeft: index === 0 ? 'none' : 'var(--game-line) solid var(--game-ink)',
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
          className="flex-1 text-[17px] font-bold leading-relaxed sm:text-[19px]"
          style={{ color: 'var(--game-ink)' }}
        >
          {instruction}
        </p>
        <button
          type="button"
          onClick={() => speakNow(instruction)}
          aria-label="설명 읽어주기"
          className="grid h-11 w-11 shrink-0 place-items-center transition"
          style={{
            background: 'var(--game-paper)',
            border: 'var(--game-line) solid var(--game-ink)',
            color: 'var(--game-ink)',
          }}
        >
          <BauhausMark kind="sound" size={22} />
        </button>
      </div>

      {/* 플레이 보드 — 유일한 다크 영역 */}
      <div
        className="mini-game-board relative flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2.5 sm:p-3"
        style={{
          background: 'var(--game-board)',
          border: 'var(--game-line) solid var(--game-ink)',
          color: 'var(--game-board-ink)',
        }}
      >
        {/* 남은 기회·시간과 진행 수치는 한 줄에 둔다.
            진행 수치를 이름표 줄에 두었더니, 이름이 긴 차시에서는 난이도 탭에 밀려 줄이
            접히고 그만큼 놀이판이 눌렸다. 셋 다 "지금 판이 어떤 상태인가"를 알리는 값이라
            판 안에 함께 두는 편이 찾기도 쉽다. */}
        {(hud || progress) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {hud && <div className="min-w-0 flex-1">{hud}</div>}
            {progress && (
              <span
                className="shrink-0 text-[15px] font-black"
                style={{ color: 'var(--game-board-grey)' }}
              >
                {progress.label}{' '}
                <strong className="text-[18px]" style={{ color: 'var(--game-board-ink)' }}>
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
          className="flex items-center justify-center gap-2 px-3 py-2 text-center text-[16px] font-black leading-relaxed sm:text-[17px]"
          style={{
            background: 'var(--game-paper)',
            color: status === 'success' ? 'var(--game-blue)' : 'var(--game-red)',
            border: `var(--game-heavy) solid ${
              status === 'success' ? 'var(--game-blue)' : 'var(--game-red)'}`,
          }}
        >
          {/* 잘됐다는 확인 표시, 다시 해 보자는 되돌리기 표시. 색과 모양이 함께 간다. */}
          <BauhausMark kind={status === 'success' ? 'check' : 'retry'} size={22} />
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
  /** 버튼이 하는 일을 나타내는 기하 마크. 이모지를 쓰지 않는다. */
  mark: MarkKind;
  /**
   * 마크를 돌리는 각도(도).
   *
   * 화살표 하나로 네 방향을 다 쓴다. 방향마다 다른 마크를 두면 어휘가 넷으로 늘고,
   * 학생은 같은 뜻의 그림 넷을 따로 익혀야 한다.
   */
  markRotate?: number;
  label: string;
  /** primary는 "실행"처럼 그 화면의 주된 다음 동작 하나에만 쓴다. */
  variant?: 'primary' | 'quiet';
}

/** 미니게임 하단 조작 버튼. 터치 목표를 44px 이상으로 유지한다. */
export function MiniGameButton({
  onClick,
  disabled = false,
  mark,
  markRotate = 0,
  label,
  variant = 'quiet',
}: ButtonProps) {
  const primary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-12 flex-1 items-center justify-center gap-1.5 px-1 py-1 text-[14px] font-black leading-tight transition disabled:opacity-45 sm:text-[15px]"
      style={{
        background: primary ? 'var(--game-blue)' : 'var(--game-paper)',
        color: primary ? 'var(--game-paper)' : 'var(--game-ink)',
        border: `var(--game-line) solid ${primary ? 'var(--game-blue)' : 'var(--game-ink)'}`,
      }}
    >
      <BauhausMark kind={mark} size={20} rotate={markRotate} />
      {label}
    </button>
  );
}
