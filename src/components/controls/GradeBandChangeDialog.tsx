import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GradeBand } from '../../types';

const BAND_LABEL: Record<GradeBand, string> = { normal: '중학', hard: '고등' };
const BAND_YEARS: Record<GradeBand, string> = { normal: '9학년군', hard: '12학년군' };

interface Props {
  /** 건너가려는 학년군. null이면 대화 상자를 닫아 둔다. */
  target: GradeBand | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 학년군을 바꾸기 전에 한 번 묻는 확인 창.
 *
 * 학년군은 표지에서 고르는 운영 결정이지 차시 화면에서 가볍게 오갈 값이 아니다.
 * 그래서 지원 수준 스티커는 중학·고등 사이를 곧바로 건너뛰지 않고 늘 충분한 지원을
 * 거치며, 거기서 한 번 더 눌렀을 때만 이 창으로 확인을 받는다.
 *
 * 학년군이 무엇을 바꾸는지도 여기서 알려 준다. 배우는 뼈대는 그대로이고
 * 성취기준과 표현의 난이도가 달라진다는 점이 교사가 알아야 할 핵심이다.
 */
export default function GradeBandChangeDialog({ target, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // onCancel은 부모가 매 렌더 새로 만드는 인라인 함수다. 이것을 아래 effect의 의존성에 두면
  // 부모가 다시 그려질 때마다 effect가 정리·재실행되면서 초점을 '아니요'로 되돌린다.
  // 교실 도크 타이머가 1초마다 상단 전체를 다시 그리므로, 그동안 키보드 사용자는 확인
  // 버튼에 초점을 유지할 수 없었다. 최신 함수는 ref로 넘기고 effect는 target만 본다.
  const latestCancel = useRef(onCancel);
  // 배경을 눌러서 시작한 클릭만 취소로 친다. 본문 글을 끌어서 선택하다 배경에서 손을 떼면
  // click 이벤트의 대상이 배경이 되어, 이 구분이 없으면 창이 제멋대로 닫힌다.
  const pressedBackdrop = useRef(false);

  useEffect(() => { latestCancel.current = onCancel; }, [onCancel]);

  useEffect(() => {
    if (!target) return;
    const restoreTo = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { latestCancel.current(); return; }
      if (event.key !== 'Tab') return;
      // 확인을 받기 전에는 초점이 창 밖으로 나가지 않는다.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      // 창을 닫은 뒤 초점을 원래 누르던 스티커로 돌려 놓는다. 그러지 않으면
      // 키보드로 조작하던 교사가 문서 맨 앞으로 튕겨 나간다.
      restoreTo?.focus?.();
    };
  }, [target]);

  if (!target) return null;

  const label = BAND_LABEL[target];
  const from: GradeBand = target === 'hard' ? 'normal' : 'hard';

  const dialog = (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => { pressedBackdrop.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedBackdrop.current) onCancel();
        pressedBackdrop.current = false;
      }}
    >
      <div
        ref={panelRef}
        /* 가로로 눕힌 휴대전화(844x390)에 글자 125%면 내용이 화면보다 높아진다. 배경층이
           fixed라 문서 스크롤로는 되돌릴 수 없으므로 패널 자신이 스크롤을 가져야 한다.
           tabIndex는 본문 글을 눌렀을 때 초점이 body로 떨어지지 않게 한다. */
        tabIndex={-1}
        className="surface-a4 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl p-5 outline-none md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="grade-band-change-title"
        aria-describedby="grade-band-change-body"
      >
        <p className="text-xs font-black tracking-[0.08em] text-[color:var(--accent)]">학년군 바꾸기</p>
        <h2
          id="grade-band-change-title"
          className="mt-1 text-xl font-black text-[color:var(--editorial-ink)] md:text-2xl"
        >
          {label} 과정으로 바꿀까요?
        </h2>

        <div id="grade-band-change-body" className="mt-4 space-y-3 text-sm leading-relaxed font-semibold text-[color:var(--editorial-ink)] md:text-base">
          <p>
            {BAND_LABEL[from]}과 {label}은 배우는 뼈대가 같습니다. 여섯 단원 68차시를 그대로 씁니다.
          </p>
          <p>
            달라지는 것은 성취기준의 난이도입니다. 중학은 {BAND_YEARS.normal}, 고등은 {BAND_YEARS.hard}
            {' '}기준으로 평가합니다. 그래서 설명하는 말과 표현의 난이도가 달라지고, 해내야 하는
            수행의 요구 수준도 함께 달라집니다.
          </p>
          <p className="text-[color:var(--muted)]">
            학년군은 보통 표지에서 한 번 고릅니다. 여기서 바꾸면 이 브라우저의 모든 차시에 함께 적용돼요.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="surface-choice min-h-11 rounded-xl px-5 text-sm font-bold"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="surface-choice is-primary min-h-11 rounded-xl px-5 text-sm font-black"
          >
            네, {label}으로 바꿔요
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
