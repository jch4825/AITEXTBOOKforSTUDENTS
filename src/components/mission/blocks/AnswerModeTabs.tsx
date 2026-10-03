import Icon, { type IconName } from '../../Icon';
import type { GeneralizationExpressionMode } from '../../../types';

/** 탭을 글자 없이도 알아보게 하는 그림. 글을 못 읽는 학생은 탭의 글자 대신 이 그림으로 방식을 찾는다. */
const MODE_ICONS: Record<GeneralizationExpressionMode, IconName> = {
  choice: 'book',
  aac: 'cards',
  text: 'pen',
  speech: 'mic',
  draw: 'brush',
};

interface Props {
  modes: GeneralizationExpressionMode[];
  active: GeneralizationExpressionMode;
  /** 방식마다 탭에 쓰는 글자. */
  labels: Record<GeneralizationExpressionMode, string>;
  accent: string;
  onSelect: (mode: GeneralizationExpressionMode) => void;
  /**
   * 글자 옆에 그림을 단다(읽기 지원 단원). 좁은 칸(30rem 미만)에서는 고른 탭만 글자를 보이고
   * 나머지는 그림만 남긴다 — 다섯 탭의 글자가 석 줄을 먹어 선택지가 접힌 아래로 밀리기 때문이다.
   */
  withIcons?: boolean;
}

/** 생각을 표현하는 방식(문장 고르기·그림 카드·글·말·그림)을 바꾸는 탭. */
export default function AnswerModeTabs({ modes, active, labels, accent, onSelect, withIcons = false }: Props) {
  const tabs = (
    <div className={`flex flex-wrap ${withIcons ? 'gap-1.5' : 'gap-2'}`} role="tablist" aria-label="생각을 표현하는 방법">
      {modes.map((mode) => (
        <button
          type="button"
          key={mode}
          role="tab"
          aria-selected={active === mode}
          aria-label={withIcons ? labels[mode] : undefined}
          title={withIcons ? labels[mode] : undefined}
          onClick={() => onSelect(mode)}
          className={`answer-tab inline-flex items-center justify-center gap-1 rounded-[var(--r-pill)] border-2 text-sm font-bold cursor-pointer ${withIcons ? 'min-h-11 min-w-10 px-2 py-1.5' : 'px-3 py-2'}`}
          style={{
            borderColor: active === mode ? accent : 'var(--line)',
            background: active === mode ? 'var(--paper-1)' : 'var(--paper-0)',
            color: active === mode ? accent : 'var(--muted)',
          }}
        >
          {withIcons ? <Icon name={MODE_ICONS[mode]} size={18} /> : null}
          <span className="answer-tab-label">{labels[mode]}</span>
        </button>
      ))}
    </div>
  );
  // 좁은 칸에서 글자를 줄이는 규칙은 칸 폭(@container)을 본다. 그림 없는 탭은 늘 글자만 있으니 감쌀 필요가 없다.
  return withIcons ? <div className="answer-tabs-box">{tabs}</div> : tabs;
}
