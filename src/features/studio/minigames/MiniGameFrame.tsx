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
 * 각진 모서리. 어휘가 통째로 바뀌는 것이 "이제 놀이 시간"이라는 신호다.
 *
 * 2026-09-13 레퍼런스("FORM & COLOR: Bauhaus Arcade")를 따라 틀 전체를 어두운 면으로
 * 바꿨다. 앞의 틀은 종이 바탕에 검정 판 하나라 판이 휑하게 떠 보였고, 글자 위계도 없었다.
 * 레퍼런스에서 가져온 것은 넷이다.
 *  - 위계: 두꺼운 이름 → 작은 딱지 이름 → 큰 숫자
 *  - 제도지 같은 판: 격자, 귀퉁이 꺾쇠
 *  - 딱딱한 어긋남 하나로 만든 깊이, 누르면 내려앉는 버튼
 *  - 칸으로 나뉜 진행 막대
 * 가져오지 않은 것도 있다. 10px 로마자 설명 글(이 교재의 글자 바닥은 14px이고, 뜻 없는
 * 로마자는 이 학생들에게 소음이다), 번지는 빛, 반투명 면.
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
      className="game-lift-4 flex h-full min-h-0 flex-col gap-2.5 overflow-hidden p-3 sm:p-3.5"
      style={{
        background: 'var(--game-board-shell)',
        border: 'var(--game-hair) solid var(--game-board-line)',
        color: 'var(--game-board-ink)',
      }}
    >
      {/* 머리글 — 표식·이름표·난이도·읽어주기를 반드시 한 줄(44px)에 둔다. 머리글 높이가
          곧 캔버스 크기를 깎는다.

          레퍼런스처럼 "BAUHAUS" 윗줄을 이름 위에 얹었더니 두 줄이 되어, 틀 폭이 560px인
          차시에서 머리글이 114px, 캔버스가 11% 작아졌다. 이름 옆으로 옮기자 이번에는 좁은
          틀에서 게임 이름이 "표지 모아 보…"로 잘렸다. 장식 글자 때문에 이름이 잘리면 안
          되므로 윗줄은 뺐다. 바우하우스라는 표시는 왼쪽 표식 상자가 맡는다. */}
      <div className="flex items-center gap-2.5">
        <GameLogo />
        <span className="game-display min-w-0 truncate text-[22px] font-bold leading-tight">
          {badge}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {stages && stages.length > 1 && (
            <div
              role="group"
              aria-label="난이도 고르기"
              className="game-lift-2 flex shrink-0 items-stretch"
              style={{ border: 'var(--game-hair) solid var(--game-board-line)' }}
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
                    className="game-display flex min-h-11 shrink-0 items-center px-3 text-[15px] font-bold"
                    style={{
                      background: active ? 'var(--game-board-yellow)' : 'var(--game-board-surface)',
                      color: active ? 'var(--game-board-shell)' : 'var(--game-board-ink)',
                      borderLeft: index === 0 ? 'none' : 'var(--game-hair) solid var(--game-board-line)',
                    }}
                  >
                    {stageLabel}
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            onClick={() => speakNow(instruction)}
            aria-label="설명 읽어주기"
            className="game-lift-2 game-press relative grid h-11 w-11 shrink-0 place-items-center"
            style={{
              background: 'var(--game-board-surface)',
              border: 'var(--game-hair) solid var(--game-board-line)',
              color: 'var(--game-board-ink)',
            }}
          >
            <BauhausMark kind="sound" size={22} />
            {/* 레퍼런스의 소리 단추에 붙은 두 점. 장식이라 뜻을 싣지 않는다. */}
            <span aria-hidden="true" className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--game-board-yellow)' }} />
            <span aria-hidden="true" className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--game-board-blue)' }} />
          </button>
        </div>
      </div>

      {/* 안내 문장. 앞의 노랑 사각은 "읽을 것은 여기"라는 자리 표시다. */}
      <div className="flex items-start gap-2.5">
        <span aria-hidden="true" className="mt-[9px] h-2.5 w-2.5 shrink-0" style={{ background: 'var(--game-board-yellow)' }} />
        <p className="flex-1 text-[17px] font-bold leading-relaxed sm:text-[18px]" style={{ color: 'var(--game-board-ink)' }}>
          {instruction}
        </p>
      </div>

      {/* 플레이 보드. 격자는 캔버스(paintBoard)와 DOM 판(GameStage)이 제 좌표로 긋는다.
          바깥 판에도 격자를 깔았더니 캔버스가 높이에 맞춰 줄어든 옆자리에서 크기가 다른
          두 격자가 나란히 보였다. */}
      <div
        className="mini-game-board game-lift-4 relative flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2.5 sm:p-3"
        style={{
          background: 'var(--game-board)',
          border: 'var(--game-hair) solid var(--game-board-line)',
          color: 'var(--game-board-ink)',
        }}
      >
        {/* 남은 기회·시간과 진행 수치는 한 줄에 둔다. 셋 다 "지금 판이 어떤 상태인가"를
            알리는 값이라 판 안에 함께 두는 편이 찾기도 쉽다. */}
        {(hud || progress) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {hud && <div className="min-w-0 flex-1">{hud}</div>}
            {progress && <ProgressMeter {...progress} />}
          </div>
        )}
        {children}
      </div>

      {/* 성공·실패 알림 — 보드 안의 움직임이 1차 피드백이고 이 문구는 보조다.
          잘했을 때는 레퍼런스의 "PERFECT!"처럼 조금 기울인 노랑 딱지로 튀어나오고,
          다시 해 볼 때는 벌처럼 보이지 않게 기울이지 않은 차분한 면에 둔다. */}
      {message && (status === 'success' || status === 'fail') && (
        <div
          role="status"
          className={`${status === 'success' ? 'game-lift-3' : 'game-lift-2'} flex items-center justify-center gap-2.5 px-4 py-2.5 text-center text-[16px] font-bold leading-relaxed sm:text-[17px]`}
          style={status === 'success' ? {
            background: 'var(--game-board-yellow)',
            color: 'var(--game-board-shell)',
            border: 'var(--game-hair) solid var(--game-shadow)',
            transform: 'rotate(-0.8deg)',
          } : {
            background: 'var(--game-board-surface)',
            color: 'var(--game-board-ink)',
            border: 'var(--game-hair) solid var(--game-board-line)',
            borderLeft: 'var(--game-heavy) solid var(--game-board-red)',
          }}
        >
          {/* 잘됐다는 확인 표시, 다시 해 보자는 되돌리기 표시. 색과 모양이 함께 간다. */}
          <BauhausMark kind={status === 'success' ? 'check' : 'retry'} size={22} />
          {message}
        </div>
      )}

      {footer}

      {actions && <div className="flex items-stretch gap-2.5 pb-1 pr-1">{actions}</div>}
    </div>
  );
}

/**
 * 바우하우스 표식. 레퍼런스의 삼각·사각·원 석 점 표식 자리다.
 *
 * 레퍼런스는 칸딘스키의 짝(노랑 삼각·빨강 사각·파랑 원)을 쓰지만, 이 교재의 판에서는
 * 노랑 원이 "나", 파랑 사각이 "목표", 빨강 삼각이 "위험"이다. 표식이 다른 짝을 보여 주면
 * 학생이 판에서 익힌 뜻과 어긋나므로 판의 짝을 그대로 쓴다.
 */
function GameLogo() {
  return (
    <span
      aria-hidden="true"
      className="game-lift-1 inline-flex h-11 shrink-0 items-center gap-0.5 px-1.5"
      style={{ background: 'var(--game-board)', border: 'var(--game-hair) solid var(--game-board-line)' }}
    >
      <span style={{ color: 'var(--game-board-red)' }}><BauhausMark kind="triangle" size={16} /></span>
      <span style={{ color: 'var(--game-board-blue)' }}><BauhausMark kind="square" size={16} /></span>
      <span style={{ color: 'var(--game-board-yellow)' }}><BauhausMark kind="circle" size={16} /></span>
    </span>
  );
}

/**
 * 진행 막대. 이어진 띠가 아니라 셀 수 있는 칸으로 보여 준다.
 *
 * 숫자를 못 읽는 학생도 칸은 센다. 칸이 열여섯을 넘으면 칸이 너무 잘아지므로 열 칸에
 * 비율로 채운다. 숫자는 레퍼런스처럼 크게, 분모는 작게 둔다.
 */
function ProgressMeter({ label, value, max }: Progress) {
  const safeMax = Math.max(1, max);
  const shown = Math.max(0, Math.min(value, safeMax));
  const cells = safeMax <= 16 ? safeMax : 10;
  const filled = safeMax <= 16 ? shown : Math.round((shown / safeMax) * 10);
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span className="game-label" style={{ color: 'var(--game-board-muted)' }}>{label}</span>
      <span aria-hidden="true" className="flex items-center gap-[3px]">
        {Array.from({ length: cells }).map((_, index) => (
          <span
            key={index}
            className="block h-3.5"
            style={{
              width: cells > 10 ? 8 : 12,
              background: index < filled ? 'var(--game-board-yellow)' : 'var(--game-board-high)',
              border: index < filled ? 'none' : '1px solid var(--game-board-line)',
            }}
          />
        ))}
      </span>
      <span className="game-display flex items-baseline gap-0.5 font-bold" aria-label={`${label} ${shown} / ${safeMax}`}>
        <strong className="text-[24px] leading-none" style={{ color: 'var(--game-board-ink)' }}>{shown}</strong>
        <span className="text-[15px]" style={{ color: 'var(--game-board-muted)' }}>/{safeMax}</span>
      </span>
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

/**
 * 미니게임 하단 조작 버튼. 터치 목표를 44px 이상으로 유지한다.
 *
 * 레퍼런스의 큰 조작 판처럼 한 가지 색으로 칠한 면에 딱딱한 어긋남을 받치고, 누르면
 * 그 위로 내려앉는다. 주된 동작은 노랑 면, 나머지는 어두운 면이다.
 */
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
      className={`${primary ? 'game-lift-3' : 'game-lift-2'} game-press relative flex min-h-12 flex-1 items-center justify-center gap-2 px-2 py-1.5 text-[15px] font-bold leading-tight disabled:opacity-45 sm:text-[16px]`}
      style={{
        background: primary ? 'var(--game-board-yellow)' : 'var(--game-board-surface)',
        color: primary ? 'var(--game-board-shell)' : 'var(--game-board-ink)',
        border: `var(--game-hair) solid ${primary ? 'var(--game-shadow)' : 'var(--game-board-line)'}`,
      }}
    >
      <BauhausMark kind={mark} size={20} rotate={markRotate} />
      {label}
      {/* 레퍼런스 조작 판의 오른쪽 위 접힌 귀. 장식이라 뜻을 싣지 않는다. */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 h-3 w-3"
        style={{
          borderBottom: `1px solid ${primary ? 'var(--game-board-shell)' : 'var(--game-board-line)'}`,
          borderLeft: `1px solid ${primary ? 'var(--game-board-shell)' : 'var(--game-board-line)'}`,
        }}
      />
    </button>
  );
}
