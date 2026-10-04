import type { LessonId, ModuleId } from '../../../types';

export type WorksheetLevel = 'high' | 'middle' | 'low';

export type WorksheetBlockKind =
  | 'heading'
  | 'text'
  | 'short-answer'
  | 'sentence'
  | 'multiple-choice'
  | 'trace'
  | 'cut-paste'
  | 'draw'
  | 'image'
  | 'divider'
  | 'picture-choice'
  | 'word-trace'
  | 'picture-sort'
  | 'picture-paste';

export interface WorksheetIllustration {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * 그림 카드 한 장. 하·중 수준 학습지의 고르기·붙이기가 쓴다(하는 흐린 그림에 붙이기).
 *
 * 그림은 둘 중 하나다. 그림 카드 판의 카드(`src`)는 낱말이 그림에 이미 인쇄돼 있어(`printed`)
 * 카드 아래에 글자를 또 쓰지 않는다. 이모지 카드(`emoji`)는 인쇄된 글자가 없으니 같은 모양의
 * 글자 띠를 아래에 붙여 두 카드가 한 판에서 같은 모습으로 보이게 한다.
 */
export interface WorksheetCard {
  id: string;
  /** 카드 글자. 그림 카드 판의 카드면 그림에 인쇄된 낱말(PECS_LABELS)과 같다. */
  label: string;
  src?: string;
  emoji?: string;
  /** 그림에 글자가 이미 인쇄돼 있다. */
  printed?: boolean;
  /**
   * 정답 안내용. 고르기에서는 알맞은 카드인지, 붙이기에서는 알맞은 칸(`zone`)이 정해졌는지로 쓴다.
   * 정해진 답이 없는 열린 선택이면 비워 둔다. 학생에게 보이는 인쇄본에는 나오지 않고 정답지에만 나온다.
   */
  suitable?: boolean;
  /** 붙이기에서 이 카드가 들어갈 칸의 id. */
  zone?: string;
  /** 교사가 읽어 줄 문장(카드 글자는 줄인 말이라 뜻을 다 담지 못한다). 정답지의 교사용 안내에 나온다. */
  say?: string;
  /** 흐린 그림에 붙이기에서 이 카드가 붙을 자리의 이름(예: ① 먼저, 사실). 자리 위에 작게 나온다. */
  slotLabel?: string;
}

/** 붙이기판의 칸. `mark`는 칸 머리의 큰 표시(○ 맞아요 / ✕ 아니에요)다. */
export interface WorksheetZone {
  id: string;
  label: string;
  mark?: 'o' | 'x';
  /** 칸 머리에 붙이는 그림 카드(예: 사람이 정해요). 있으면 마크 대신 쓴다. */
  card?: WorksheetCard;
}

export interface WorksheetBlock {
  id: string;
  kind: WorksheetBlockKind;
  title?: string;
  text?: string;
  instruction?: string;
  options?: string[];
  cards?: string[];
  traceText?: string;
  /**
   * 낱말 따라 쓰기에서 문장(`traceText`) 속에 빈칸으로 둘 낱말. 있으면 둘째 줄은 그 낱말만 비운 채 같은 문장을
   * 연하게 보여 주고, 학생이 빈칸에 직접 쓴다(덧쓰기 → 채워 쓰기).
   */
  traceBlank?: string;
  /**
   * 낱말 따라 쓰기에서 둘째 줄부터도 같은 글자를 더 연하게 보여 준다(비워 둔 줄 없이 덧쓰기만 한다).
   * 무오류 학습에서 본보기를 한 번에 거두지 않고 서서히 옅게 하는 단계다.
   */
  traceRepeat?: boolean;
  lineCount?: number;
  image?: WorksheetIllustration;
  /**
   * 그림 고르기·낱말 따라 쓰기·그림 붙이기판의 그림 카드. 흐린 그림에 붙이기(`picture-paste`)에서는 카드 한 장이
   * 흐린 자리와 오릴 카드를 겸하고, 모두 알맞은 카드다(알맞지 않은 카드는 올리지 않는다).
   */
  pictureCards?: WorksheetCard[];
  /** 그림 붙이기판의 칸. */
  zones?: WorksheetZone[];
  /** 그림 카드 한 변(mm). 비워 두면 한 줄에 들어가는 가장 큰 크기로 정한다. */
  cardSize?: number;
  /** 붙이기판의 칸 이름을 연한 글자(덧쓰기)로 그린다. */
  traceZones?: boolean;
  /**
   * 흐린 그림에 붙이기에서 흐린 그림 대신 둘 빈 자리 수. 정해진 답이 없는 열린 선택에서 오릴 카드 중 마음에 드는 것을
   * 붙인다(어느 카드를 붙여도 알맞으므로 이때도 틀릴 수 없다). 비워 두면 카드마다 흐린 그림 자리가 하나씩 생긴다.
   */
  blankSlots?: number;
  /**
   * 흐린 그림에 붙이기에서 한 쪽에 다른 칸(따라 쓰기 등)이 함께 놓일 때: 장면과 흐린 자리를 한 줄에 모으고 카드를
   * 조금 줄여 쪽 높이를 아낀다. 비워 두면 쪽을 이 칸 하나가 쓰는 것으로 보고 장면과 카드를 크게 그린다.
   */
  compact?: boolean;
  /**
   * 흐린 그림에 붙이기에서 붙을 자리가 보여 주는 단서. 'picture'(기본)는 카드와 똑같은 흐린 그림이고(그림만 보고 붙인다),
   * 'word'는 카드에 쓰인 낱말을 연한 글자로 보여 준다(덧쓰고, 같은 낱말의 카드를 찾아 붙인다). 낱말 단서에서는 오릴 카드의
   * 순서를 자리와 어긋나게 섞어 낱말을 읽어야 짝을 찾는다.
   */
  pasteCue?: 'picture' | 'word';
  fontSize?: number;
  fontFamily?: 'sans' | 'serif' | 'hand';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export interface WorksheetPage {
  id: string;
  blocks: WorksheetBlock[];
}

export interface WorksheetVariant {
  level: WorksheetLevel;
  label: string;
  subtitle: string;
  blocks: WorksheetBlock[];
  /** 기존 저장본과의 호환을 위해 blocks를 유지하면서 페이지 단위 편집을 지원한다. */
  pages?: WorksheetPage[];
  /**
   * 이 수준의 기본 구성이 어느 판인지. 저장해 둔 편집본의 판이 지금 기본 구성과 다르면
   * 옛 구성이라는 뜻이므로 새 구성으로 갈아 끼운다(mergeWorksheetDraft).
   */
  template?: string;
}

export interface LessonWorksheet {
  lessonId: LessonId;
  moduleId: ModuleId;
  moduleTitle: string;
  lessonTitle: string;
  objective: string;
  accent: string;
  accentSoft: string;
  illustration?: WorksheetIllustration;
  variants: Record<WorksheetLevel, WorksheetVariant>;
}

export function worksheetPagesForVariant(variant: WorksheetVariant): WorksheetPage[] {
  const savedPages = Array.isArray(variant.pages)
    ? variant.pages.filter(page => page && typeof page.id === 'string' && Array.isArray(page.blocks))
    : [];
  if (savedPages.length > 0) return savedPages;
  return [{ id: `${variant.level}-page-1`, blocks: variant.blocks }];
}

export function worksheetVariantWithPages(variant: WorksheetVariant, pages: WorksheetPage[]): WorksheetVariant {
  return { ...variant, pages, blocks: pages.flatMap(page => page.blocks) };
}
