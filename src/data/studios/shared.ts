import type { StudioDefinition, SupportLevel, VisualNovelCopy } from '../../features/studio/types';

export const STUDIO_SUPPORT_PROFILES = {
  full: {
    visibleFactCount: 2,
    choiceLimit: 2,
    hint: '중요한 정보 두 가지부터 함께 찾아봅니다.',
    aiRoleDepth: 'direct',
  },
  light: {
    visibleFactCount: 3,
    choiceLimit: 3,
    hint: '달라진 조건을 보고 내 방법을 다시 살펴봅니다.',
    aiRoleDepth: 'prompting',
  },
  challenge: {
    visibleFactCount: 4,
    choiceLimit: 4,
    hint: '인공지능의 의견에서 좋은 점과 조심할 점을 찾아 내 생각을 말해 봅니다.',
    aiRoleDepth: 'counterpoint',
  },
} satisfies StudioDefinition['supportProfiles'];

export const STUDIO_EXPRESSION_MODES = ['choice', 'text', 'speech', 'draw'] as const;

// 장면 텍스트를 지원 수준별 사본으로 만드는 공용 헬퍼. 분할 전에는 각 모듈 파일에 중복 정의되어 있었다.
// 한 칸짜리 각본을 만든다. 아직 대사 칸으로 다시 쓰지 않은 차시가 이 헬퍼를 쓴다.
export function sceneCopy(
  full: string,
  light: string,
  challenge: string,
  perspective?: string,
): Record<SupportLevel, VisualNovelCopy[]> {
  return {
    full: [{ text: full, perspective }],
    light: [{ text: light, perspective }],
    challenge: [{ text: challenge, perspective }],
  };
}

/** 대사 칸 한 개를 지원 수준 순서(충분한 지원 · 중학 · 고등)로 적은 것. */
export type SceneBeat = readonly [full: string, light: string, challenge: string];

/**
 * 한 장면을 여러 대사 칸으로 나눈 각본을 만든다.
 *
 * 세 지원 수준은 **같은 칸 수**를 가진다. 사건과 배경은 누구에게나 똑같이 전달되어야
 * 하고, 지원 수준이 바꾸는 것은 문장의 길이와 낱말뿐이기 때문이다. 쉬운 글은 정보를
 * 덜어 낸 글이 아니라 빠진 맥락을 채워 넣은 글이다(피치마켓 쉬운 글 원칙).
 *
 * `perspective`(학생에게 건네는 관찰 힌트)는 장면의 마지막 칸에만 붙는다. 칸마다
 * 붙이면 이야기를 넘길 때마다 힌트가 끼어들어 사건의 흐름이 끊긴다.
 */
export function sceneBeats(
  beats: readonly SceneBeat[],
  perspective?: string,
): Record<SupportLevel, VisualNovelCopy[]> {
  const build = (index: 0 | 1 | 2): VisualNovelCopy[] =>
    beats.map((beat, beatIndex) => ({
      text: beat[index],
      perspective: beatIndex === beats.length - 1 ? perspective : undefined,
    }));

  return { full: build(0), light: build(1), challenge: build(2) };
}
