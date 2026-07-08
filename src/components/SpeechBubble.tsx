import CharacterAvatar from './CharacterAvatar';
import type { Expression } from './CharacterAvatar';
import { CHARACTERS } from '../data/characters';
import type { CharacterId } from '../data/characters';
import { useSpeak } from '../hooks/useSpeak';
import Icon from './Icon';

interface Props {
  speaker: CharacterId;
  text: string;
  expression?: Expression;
  accent?: string;      // 모듈 테마 색 (버튼 테두리)
  accentText?: string;  // 소형 텍스트용 어두운 변형 (이름표) — 없으면 accent 사용
  accentSoft?: string;  // 말풍선 배경
  showSpeakButton?: boolean;
  avatarSize?: number;
  /** 아이미 시그니처 모먼트 (§4.3) — "진짜 AI 응답"에만 true. sim-ai·준비된 답변 금지 */
  aiGlow?: boolean;
}

/**
 * 캐릭터 말풍선 — 아바타 + 이름표 + 대사.
 * sim-ai/real-ai의 AI 응답(아이미), 정리 화면의 캐릭터 반응 등에 사용.
 */
export default function SpeechBubble({
  speaker,
  text,
  expression = 'happy',
  accent = 'var(--accent)',
  accentText,
  accentSoft = 'var(--paper-2)',
  showSpeakButton = false,
  avatarSize = 52,
  aiGlow = false,
}: Props) {
  const meta = CHARACTERS[speaker];
  const { speak } = useSpeak();

  return (
    <div className="flex items-start gap-3 story-fade-in">
      <div className={`shrink-0 ${aiGlow ? 'ai-glow-avatar' : ''}`}>
        <CharacterAvatar character={speaker} expression={expression} size={avatarSize} />
      </div>
      <div className="relative flex-1 min-w-0">
        {/* 말풍선 꼬리 */}
        <div
          className="absolute left-[-6px] top-4 w-3 h-3 rotate-45"
          style={{ background: accentSoft }}
          aria-hidden
        />
        <div className={`rounded-[var(--r-md)] px-4 py-3 ${aiGlow ? 'ai-glow' : ''}`} style={{ background: accentSoft }}>
          <p className="t-label mb-1" style={{ color: accentText ?? accent }}>{meta.shortName}</p>
          <p className="text-lg leading-relaxed">{text}</p>
          {showSpeakButton && (
            <button
              onClick={() => speak(text)}
              className="btn btn-secondary mt-2 px-3 text-sm"
              style={{ borderColor: accent, color: accentText ?? accent }}
            ><Icon name="speaker" size={16} /> 읽어줘</button>
          )}
        </div>
      </div>
    </div>
  );
}
