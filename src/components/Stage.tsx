import { useEffect, useState } from 'react';
import CharacterAvatar from './CharacterAvatar';
import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';
import { moduleIdFromLessonId } from '../data/modules';
import type { CharacterId } from '../data/characters';
import type { LessonId, ModuleId } from '../types';

/**
 * 모듈별 무대 하단 곡선 — 색뿐 아니라 "모양(각도·비대칭)과 높이(크기)"로도 모듈을 구별한다.
 * viewBox 0 0 1440 100, 상단은 직선(밴드와 붙음)·하단은 모듈 고유 곡선. y는 0~100 안에서 그려
 * 잘리지 않게 한다. h 클래스가 실제 픽셀 높이를 정해 크기 차이를 만든다.
 */
const MODULE_CURVE: Record<ModuleId, { h: string; d: string }> = {
  // 완만한 대칭 골 (기준)
  m1: { h: 'h-8 md:h-12',  d: 'M0 0 H1440 V56 Q720 96 0 56 Z' },
  // 왼쪽으로 기운 비대칭 (각도감)
  m2: { h: 'h-6 md:h-8',   d: 'M0 0 H1440 V68 Q470 100 0 34 Z' },
  // 가운데가 위로 솟은 언덕 (반대 방향)
  m3: { h: 'h-10 md:h-16', d: 'M0 0 H1440 V40 Q720 4 0 40 Z' },
  // 오른쪽으로 기운 비대칭
  m4: { h: 'h-7 md:h-10',  d: 'M0 0 H1440 V38 Q980 100 0 72 Z' },
  // S자 물결 (역동적)
  m5: { h: 'h-9 md:h-14',  d: 'M0 0 H1440 V52 C1040 96 400 16 0 60 Z' },
  // 가장 크고 깊은 대칭 골
  m6: { h: 'h-12 md:h-20', d: 'M0 0 H1440 V48 Q720 100 0 48 Z' },
};

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
  const { speakNow } = useSpeak();
  const curve = MODULE_CURVE[moduleIdFromLessonId(lessonId) ?? 'm1'];
  // 장면 그림 후보 체인: webp(경량, 전 차시 존재) → png(원본, png/ 폴더) → 아바타 폴백
  const candidates = [
    `${import.meta.env.BASE_URL}lessons/${lessonId}.webp`,
    `${import.meta.env.BASE_URL}lessons/png/${lessonId}.png`,
  ];
  const [srcIdx, setSrcIdx] = useState(0);
  const imgMissing = srcIdx >= candidates.length;

  // 차시 이동 시 이미지 존재 여부를 다시 판단한다.
  useEffect(() => { setSrcIdx(0); }, [lessonId]);

  return (
    <section className={`story-fade-in ${className}`} aria-label="차시 장면">
      <div style={{ background: accentSoft }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-2 md:pb-4 grid gap-5 lg:gap-8 lg:grid-cols-5 items-center">
          <div className="lg:col-span-2">
            {!imgMissing ? (
              /* 장면 그림 — 원본이 정사각(1024²)이라 프레임도 정사각으로 맞춰 잘림·여백 없이 채운다.
                 크기는 max-w로 제한해 히어로가 과하게 커지지 않게 한다. 혹시 비정사각 그림이
                 들어와도 contain으로 전체를 보여주고 남는 여백은 확대·블러 배경이 채운다. */
              <div
                className="relative w-full max-w-[420px] mx-auto aspect-square rounded-[var(--r-lg)] overflow-hidden"
                style={{ boxShadow: 'var(--e-2)' }}
              >
                <img
                  src={candidates[srcIdx]}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'blur(24px)', transform: 'scale(1.12)' }}
                />
                <img
                  src={candidates[srcIdx]}
                  alt=""
                  aria-hidden
                  onError={() => setSrcIdx(i => i + 1)}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
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
          <div className="lg:col-span-3">
            {episodeTitle && (
              <p className="t-label mb-2 inline-flex items-center gap-1.5" style={{ color: accentText ?? accent }}><Icon name="book" size={16} /> {episodeTitle}</p>
            )}
            <h1 className="t-h1 mb-3" style={{ color: accentText ?? accent }}>{title}</h1>
            <p className="t-body-lg">{text}</p>
            <button
              onClick={() => speakNow(text)}
              className="btn btn-secondary mt-4 px-3 text-sm"
              style={{ borderColor: accent, color: accentText ?? accent }}
            ><Icon name="speaker" size={16} /> 이야기 들려줘</button>
          </div>
        </div>
      </div>
      {/* 모듈별 곡선 — 무대와 책상(본문)의 경계. 모양·높이가 모듈마다 다르다 */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={`block w-full ${curve.h}`}
        aria-hidden
      >
        <path d={curve.d} fill={accentSoft} />
      </svg>
    </section>
  );
}
