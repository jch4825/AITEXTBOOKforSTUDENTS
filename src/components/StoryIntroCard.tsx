import CharacterAvatar from './CharacterAvatar';
import { useSpeak } from '../hooks/useSpeak';
import type { CharacterId } from '../data/characters';

interface Props {
  scene: CharacterId[];   // 장면에 등장하는 캐릭터 (1~2명)
  text: string;           // 상황 이야기 (난이도 반영본)
  episodeTitle?: string;  // 모듈 에피소드 제목 (작게 표시)
  accent: string;
  accentSoft: string;
}

/**
 * 차시 도입 장면 카드 — 사회상황이야기 프레임.
 * 회색 이미지 placeholder를 대체하는 캐릭터 장면 + 상황 서술.
 */
export default function StoryIntroCard({ scene, text, episodeTitle, accent, accentSoft }: Props) {
  const { speak } = useSpeak();

  return (
    <div
      className="rounded-2xl border-2 p-5 mb-4 story-fade-in"
      style={{ background: accentSoft, borderColor: accent }}
    >
      {episodeTitle && (
        <p className="text-sm font-bold mb-3" style={{ color: accent }}>📖 {episodeTitle}</p>
      )}
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 -space-x-3">
          {scene.map(id => (
            <span key={id}>
              <CharacterAvatar character={id} expression="happy" size={72} />
            </span>
          ))}
        </div>
        <p className="text-lg leading-relaxed flex-1 min-w-0">{text}</p>
      </div>
      <button
        onClick={() => speak(text)}
        className="mt-3 px-3 py-1.5 rounded text-sm font-semibold border-2 bg-white"
        style={{ borderColor: accent, color: accent }}
      >🔊 이야기 들려줘</button>
    </div>
  );
}
