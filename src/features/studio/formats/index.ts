import type { StudioFormat, StudioStage } from '../types';

/**
 * 포맷별 화면 순서 선언 (docs/remodel2/01-FORMATS.md, 05-ENGINE-SPEC §1).
 *
 * 여기서 바뀌는 것은 **보여 주는 순서와 화면 옷**뿐이다. `STUDIO_STAGES`·리듀서·
 * `StudioEvidenceV2`는 그대로 두므로 여러 뷰가 같은 기록 단계를 가리킬 수 있다.
 * 예를 들어 '정리 노트'는 첫 시도와 같은 단계에 속한 별도 화면이다.
 */

export type StudioViewId =
  | 'lab-intro'
  | 'cold-open'
  | 'story'
  | 'first-attempt'
  | 'concept-note'
  | 'condition-change'
  | 'ai-compare'
  | 'decision'
  | 'artifact'
  | 'transfer'
  | 'complete';

export interface StudioView {
  id: StudioViewId;
  /** 이 뷰가 기록되는 단계. 뷰가 늘어도 기록 의미는 그대로다. */
  stage: StudioStage;
  label: string;
}

export interface FormatBehavior {
  views: StudioView[];
  /** 이야기 화면에 개념 카드를 나란히 둘지. 포맷 미지정 차시만 true(현행 화면 유지). */
  knowledgeInStory: boolean;
  /** D · 이야기와 첫 시도를 대화창 한 프레임으로 합성한다. */
  dialogueFrame: boolean;
  /** E · 결과물 빈 틀을 첫 화면부터 옆에 고정하고 단계마다 채운다. */
  persistentCanvas: boolean;
}

const VIEW: Record<StudioViewId, StudioView> = {
  'lab-intro': { id: 'lab-intro', stage: 'encounter', label: '먼저 겪어 보기' },
  'cold-open': { id: 'cold-open', stage: 'encounter', label: '먼저 해 보기' },
  story: { id: 'story', stage: 'encounter', label: '상황 만나기' },
  'first-attempt': { id: 'first-attempt', stage: 'first-attempt', label: '첫 생각' },
  'concept-note': { id: 'concept-note', stage: 'first-attempt', label: '정리 노트' },
  'condition-change': { id: 'condition-change', stage: 'condition-change', label: '조건이 달라졌습니다' },
  'ai-compare': { id: 'ai-compare', stage: 'ai-compare', label: 'AI의 제안과 내 판단' },
  decision: { id: 'decision', stage: 'decision', label: '실시간 AI 아이미와 대화하기' },
  artifact: { id: 'artifact', stage: 'artifact', label: '생각을 결과물로' },
  transfer: { id: 'transfer', stage: 'transfer', label: '다른 상황에 적용하기' },
  complete: { id: 'complete', stage: 'complete', label: '과정 돌아보기' },
};

/** 이야기 뒤로 이어지는 공통 꼬리. 포맷이 바꾸는 것은 이 앞부분뿐이다. */
const TAIL: StudioView[] = [
  VIEW['first-attempt'],
  VIEW['concept-note'],
  VIEW['condition-change'],
  VIEW['ai-compare'],
  VIEW.decision,
  VIEW.artifact,
  VIEW.transfer,
  VIEW.complete,
];

/** 포맷을 지정하지 않은 차시. 개념 카드가 이야기 옆에 남아 지금 화면과 같다. */
const LEGACY: FormatBehavior = {
  views: [
    VIEW.story,
    VIEW['first-attempt'],
    VIEW['condition-change'],
    VIEW['ai-compare'],
    VIEW.decision,
    VIEW.artifact,
    VIEW.transfer,
    VIEW.complete,
  ],
  knowledgeInStory: true,
  dialogueFrame: false,
  persistentCanvas: false,
};

const BEHAVIORS: Record<StudioFormat, FormatBehavior> = {
  // A · 이야기 우선형 — 이야기를 풀블리드로 두고 개념은 첫 시도 뒤 정리 노트로 미룬다.
  A: {
    views: [VIEW.story, ...TAIL],
    knowledgeInStory: false,
    dialogueFrame: false,
    persistentCanvas: false,
  },
  // B · 실험 우선형 — 미니게임을 마무리 보상에서 도입 실험으로 전진 배치한다.
  B: {
    views: [VIEW['lab-intro'], VIEW.story, ...TAIL],
    knowledgeInStory: false,
    dialogueFrame: false,
    persistentCanvas: false,
  },
  // C · 미션 콜드오픈형 — 전이 과제를 먼저 겪고(기록하지 않음) 이야기로 들어간다.
  C: {
    views: [VIEW['cold-open'], VIEW.story, ...TAIL],
    knowledgeInStory: false,
    dialogueFrame: false,
    persistentCanvas: false,
  },
  // D · 대화 주도형 — 이야기와 첫 시도를 대화창으로 합성하고 반응 대사로 합류한다.
  D: {
    views: [VIEW.story, ...TAIL],
    knowledgeInStory: false,
    dialogueFrame: true,
    persistentCanvas: false,
  },
  // E · 제작 공방형 — 결과물 빈 틀을 첫 화면부터 보여 주고 단계마다 채운다.
  E: {
    views: [VIEW.story, ...TAIL],
    knowledgeInStory: false,
    dialogueFrame: false,
    persistentCanvas: true,
  },
};

export function getFormatBehavior(format: StudioFormat | undefined): FormatBehavior {
  return format ? BEHAVIORS[format] : LEGACY;
}

/**
 * 뷰 이동이 기록 단계를 넘는지 판단한다.
 * 같은 단계 안의 이동이면 리듀서를 건드리지 않아 기록이 흔들리지 않는다.
 */
export function crossesStage(from: StudioView | undefined, to: StudioView | undefined): boolean {
  if (!from || !to) return false;
  return from.stage !== to.stage;
}
