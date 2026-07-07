import { useEffect, useState } from 'react';
import CharacterAvatar from './CharacterAvatar';
import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';
import type { CharacterId } from '../data/characters';
import type { LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  title: string;          // 차시 제목 (h1은 여기 한 곳에서만 렌더)
  scene: CharacterId[];   // 장면 캐릭터 (이미지 없을 때 폴백)
  text: string;           // 사회상황이야기 (난이도 반영본)
  episodeTitle?: string;  // 모듈 에피소드 제목 (1차시에만)
  accent: string;
  accentText?: string;
  accentSoft: string;
  /** main 패딩 상쇄용 풀블리드 마진 — 호출부(LessonView)가 지정 */
  className?: string;
}

/**
 * 무대(Stage) — 차시 도입 장면의 전폭 히어로 (design-upgrade-plan §4.1).
 * public/lessons/{차시ID}.png 가 있으면 장면 그림으로, 없으면 캐릭터 아바타로.
 * "무대 위 → 책상 위" 2단 구성의 윗단. 영상(mp4)은 에셋 확보 후 연결 예정.
 */
export default function Stage({
  lessonId, title, scene, text, episodeTitle,
  accent, accentText, accentSoft, className = '',
}: Props) {
  const { speak } = useSpeak();
  const [imgMissing, setImgMissing] = useState(false);
  const imgSrc = `${import.meta.env.BASE_URL}lessons/${lessonId}.png`;

  // 차시 이동 시 이미지 존재 여부를 다시 판단한다.
  useEffect(() => { setImgMissing(false); }, [lessonId]);

  return (
    <section className={`story-fade-in ${className}`} aria-label="차시 장면">
      <div style={{ background: accentSoft }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-2 md:pb-4 grid gap-5 lg:gap-8 lg:grid-cols-5 items-center">
          <div className="lg:col-span-3">
            {!imgMissing ? (
              /* 장면 그림 — 이야기 텍스트가 내용을 전달하므로 장식 이미지로 처리 */
              <img
                src={imgSrc}
                alt=""
                aria-hidden
                onError={() => setImgMissing(true)}
                className="w-full aspect-video object-cover rounded-[var(--r-lg)]"
                style={{ boxShadow: 'var(--e-2)' }}
              />
            ) : (
              <div className="flex justify-center items-end -space-x-4 py-6" aria-hidden>
                {scene.map(id => (
                  <span key={id}>
                    <CharacterAvatar character={id} expression="happy" size={120} />
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            {episodeTitle && (
              <p className="t-label mb-2 inline-flex items-center gap-1.5" style={{ color: accentText ?? accent }}><Icon name="book" size={16} /> {episodeTitle}</p>
            )}
            <h1 className="t-h1 mb-3" style={{ color: accentText ?? accent }}>{title}</h1>
            <p className="t-body-lg">{text}</p>
            <button
              onClick={() => speak(text)}
              className="btn btn-secondary mt-4 px-3 text-sm"
              style={{ borderColor: accent, color: accentText ?? accent }}
            ><Icon name="speaker" size={16} /> 이야기 들려줘</button>
          </div>
        </div>
      </div>
      {/* 완만한 언덕 곡선 — 무대와 책상(본문)의 경계 */}
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="block w-full h-6 md:h-10"
        aria-hidden
      >
        <path d="M0 0C480 40 960 40 1440 0V0H0Z" fill={accentSoft} />
      </svg>
    </section>
  );
}
