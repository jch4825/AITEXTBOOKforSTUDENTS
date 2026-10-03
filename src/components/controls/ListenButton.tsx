import { useEffect, type CSSProperties } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import { useSpeakingState } from '../../hooks/useSpeakingState';
import { getSpeakingState, speakSequence, stopSpeaking, type SequenceItem } from '../../utils/tts';
import { toSpeechText } from '../../utils/speechText';
import Icon from '../Icon';

interface ListenProps {
  /** 읽을 글. 화면에 보이는 글을 그대로 넣는다. 읽기용으로 풀어 쓰는 일은 여기서 한다. */
  text: string;
  /** 이 단추가 읽는 소리의 이름. 같은 화면의 다른 단추와 겹치지 않게 짓는다. */
  speakKey: string;
  /** 화면 읽기 프로그램이 읽는 이름. 같은 단추가 여럿이면 어느 것인지 알리게 짓는다. */
  label?: string;
  accent: string;
  className?: string;
}

/**
 * 글 옆에 붙는 듣기 단추. 눌러서 읽고, 읽는 동안 다시 누르면 멈춘다.
 *
 * 글을 못 읽는 학생에게 듣기는 덤이 아니라 글을 만나는 길이므로 크기를 줄이지 않는다
 * (44px 이상). 선택과는 늘 다른 단추다 — 듣다가 답이 정해져 버리지 않게 한다.
 * 효과음·자동 읽기를 끈 상태와 상관없이 누르면 읽는다(학생이 직접 청한 소리다).
 */
export default function ListenButton({ text, speakKey, label = '듣기', accent, className = '' }: ListenProps) {
  const { speakNow } = useSpeak();
  const { key } = useSpeakingState();
  const speaking = key === speakKey;
  const name = speaking ? '듣기 멈추기' : label;

  // 화면을 떠나면(차례에서 다른 차시를 고르는 일 등) 이 단추가 시작한 소리도 멈춘다.
  // 단추가 사라진 뒤에 남의 화면에서 글이 계속 읽히지 않게 한다.
  useEffect(() => () => {
    if (getSpeakingState().key === speakKey) stopSpeaking();
  }, [speakKey]);

  return (
    <button
      type="button"
      className={`listen-button ${className}`}
      data-speaking={speaking ? 'true' : undefined}
      style={{ '--listen-accent': accent } as CSSProperties}
      onClick={() => {
        if (speaking) stopSpeaking();
        else speakNow(toSpeechText(text), { key: speakKey });
      }}
      aria-label={name}
      title={name}
    >
      <Icon name={speaking ? 'stop' : 'speaker'} size={22} />
    </button>
  );
}

interface ListenAllProps {
  /** 차례대로 읽을 칸들. 각 칸의 key는 그 칸을 강조하는 데 쓴다. */
  items: SequenceItem[];
  /** 이 묶음의 이름. 읽는 동안 이 단추가 "멈추기"로 바뀐다. */
  group: string;
  accent: string;
  label?: string;
  /** 글자 없이 아이콘만 둔다. 물음 옆에 붙이는 단추는 줄을 더 잡지 않게 이렇게 쓴다. */
  compact?: boolean;
  className?: string;
}

/** 여러 칸을 처음부터 끝까지 차례로 들려 주는 단추("모두 듣기"). */
export function ListenAllButton({
  items,
  group,
  accent,
  label = '모두 듣기',
  compact = false,
  className = '',
}: ListenAllProps) {
  const { group: activeGroup } = useSpeakingState();
  const running = activeGroup === group;
  const name = running ? '듣기 멈추기' : label;

  // 차례 읽기도 같다. 화면을 떠나면 남은 칸을 읽지 않는다.
  useEffect(() => () => {
    if (getSpeakingState().group === group) stopSpeaking();
  }, [group]);

  return (
    <button
      type="button"
      className={`listen-button ${compact ? '' : 'listen-button--wide'} ${className}`}
      data-speaking={running ? 'true' : undefined}
      style={{ '--listen-accent': accent } as CSSProperties}
      onClick={() => {
        if (running) {
          stopSpeaking();
          return;
        }
        speakSequence(
          items.map((item) => ({ key: item.key, text: toSpeechText(item.text) })),
          { group },
        );
      }}
      aria-label={name}
      title={name}
    >
      <Icon name={running ? 'stop' : 'speaker'} size={22} />
      {compact ? null : <span>{name}</span>}
    </button>
  );
}
