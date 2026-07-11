import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';

interface Props {
  text: string;
  accent: string;       // 모듈 테마색
  compact?: boolean;    // 정리 화면 재확인용 (체크 아이콘 + 작게)
}

/** 오늘의 목표 — 도입(제시)과 정리(재확인)에 쓰는 학습목표 카드. 전 난이도 노출 (spec §5). */
export default function LessonGoal({ text, accent, compact }: Props) {
  const { speakNow } = useSpeak();
  return (
    <div
      className={`card3d rounded-[var(--r-md)] flex items-center gap-3 ${compact ? 'p-3 max-w-md mx-auto' : 'p-4 my-5'}`}
      style={{
        background: 'var(--paper-0)',
        border: `2.5px solid ${accent}`,
        ['--edge' as string]: accent,
      }}
    >
      <Icon name={compact ? 'check' : 'star'} size={compact ? 20 : 24} filled={!compact} color={accent} />
      <div className="flex-1 min-w-0">
        <p className="t-label" style={{ color: accent }}>{compact ? '오늘의 목표 확인' : '오늘의 목표'}</p>
        <p className={compact ? 'text-base' : 'text-lg font-semibold'}>{text}</p>
      </div>
      <button
        onClick={() => speakNow(`오늘의 목표. ${text}`)}
        aria-label="목표 읽어주기"
        className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center hover:bg-[color:var(--paper-2)]"
        style={{ color: accent }}
      ><Icon name="speaker" size={20} /></button>
    </div>
  );
}
