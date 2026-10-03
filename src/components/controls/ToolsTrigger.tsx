import React from 'react';
import Icon from '../Icon';

interface Props {
  onClick: () => void;
}

/**
 * 교실 도구(판서·타이머·그림 카드·학습지)를 여는 상단 스티커.
 * 도구 시트가 닫힐 때 포커스를 돌려받을 수 있게 data-teacher-tools-trigger를 단다.
 * 좁은 태블릿 폭에서는 글자를 감추고 아이콘만 둬 상단 바가 비좁아지지 않게 한다.
 */
export default function ToolsTrigger({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-teacher-tools-trigger
      className="chrome-sticker"
      style={{ '--chrome-tint': 'var(--chrome-tools)' } as React.CSSProperties}
      title="교실 도구 열기 (판서·타이머·그림 카드·학습지)"
      aria-label="교실 도구 열기"
      aria-haspopup="dialog"
    >
      <span className="chrome-sticker-badge" aria-hidden>
        <Icon name="pen" size={16} />
      </span>
      <span className="hidden font-extrabold text-[color:var(--brand-ink)] lg:inline">
        도구
      </span>
    </button>
  );
}
