import type { LessonId } from '../types';

/**
 * 그림 카드 학습지 — 교사 도구 → 학습지의 하 수준(오리고 찾아요)과 중 수준(덧쓰고 붙여요) 구성, 68차시 각각.
 *
 * 두 수준 모두 글이 아니라 그림과 손으로 끝낼 수 있어야 한다. 그래서 한 차시를 세 칸으로 줄이고,
 * 앞장(쓰기 칸이 있는 면)과 뒷장(오려 붙이기) 두 장에 나눈다. 학생 화면에서 이미 만난 선택지 두 목록을 쓴다.
 *   `first`    — 첫 생각 선택지. 앞장의 첫 칸.
 *   `transfer` — 적용 선택지. 뒷장.
 *
 * 하 — 무오류 학습이 바탕이다. 틀릴 수 있는 활동(여러 카드 중 고르기, 맞아요·아니에요 분류)을 두지 않는다.
 *   1. 붙여요   — `first`의 알맞은 카드(`right`)만 오려, 장면 옆의 똑같은 흐린 그림 위에 붙인다.
 *   2. 따라 써요 — 핵심 낱말(`word`) 하나를 그림 카드와 함께 큰 연한 글자 위에 덧쓴다(둘째 줄도 더 연한 글자 위에).
 *   3. 붙여요   — `transfer`의 알맞은 카드(`right`, 또는 순서·분류 칸이 정해진 카드 모두)만 오려 흐린 그림 위에 붙인다.
 *   정해진 답이 없는 열린 선택(`right` 없음)만 카드 세 장 가운데 마음에 드는 한 장을 빈 자리에 붙인다.
 * 중 — 하의 한 단계 위로, 본보기가 그림에서 글자로 바뀌고 판단은 앞장에 있다. 맞아요·아니에요 분류는 중에도 없다.
 *   1. 골라요   — `first` 세 장 가운데 알맞은 카드에 ○ 한다.
 *   2. 덧써요   — 핵심 문장(`sentence`)을 따라 쓰고, 둘째 줄에서는 핵심 낱말(`word`)만 빈칸에 직접 쓴다.
 *   3. 붙여요   — 하와 같은 알맞은 카드만 오려 붙인다. 자리마다 카드에 쓰인 낱말이 연한 글자로 있어 덧쓰고 같은 낱말의
 *                카드를 찾아 붙인다(오릴 카드는 순서가 섞여 있다).
 * 카드는 `data/choiceCards/`의 선택지 카드(그림 카드 판의 카드 또는 이모지)를 그대로 쓴다. 학생 화면에서
 * 이미 만난 그림과 낱말이 종이에서도 같아야 하기 때문이다. 여기서 정하는 것은 어떤 선택지를 올릴지,
 * 무엇이 알맞은지, 물음을 어떻게 짧게 줄일지다.
 *
 * `right`는 이 학습지를 위해 정한 안내다. 스튜디오 2~6단원의 선택지에는 `isCorrect`가 없다(고른 뒤의 반응 대사가
 * 결과를 말해 준다). 그 반응이 좋은 결과를 말하는 선택지를 알맞은 것으로 삼았고, 모두 괜찮은 열린 선택은
 * `right`를 비워 두었다. 중 수준 앞장의 ○ 고르기에서는 정답지에만 나오지만, **붙이기에서는 `right`가 하·중 학생용 인쇄본에
 * 어떤 카드가 오르는지를 정한다**(알맞지 않은 카드는 붙이기 어디에도 오르지 않는다). 그러니 `right`를 고칠 때는 두 수준의 붙이기도 함께 본다.
 *
 * 글 규칙: 물음은 해요체로 두 문장 이내, 마지막 문장이 물음이다. 하 수준은 마지막 물음을 뗀 서술만 상황 글로 쓴다
 * (붙이기에는 물을 것이 없다). 물음 하나가 알맞은 카드 하나(또는 `right`로 센 장수)로 이어지게 묻는다.
 * `npm run check:worksheet-picture`가 선택지 id, 그림 파일, 글자 길이, 하 수준의 무오류 구성을 지킨다.
 */

/** 그림 한 장을 가리키는 말. */
export type WorksheetPicRef =
  /** 그 단원 그림 카드 판의 카드(public/lessons/pecs/{단원}/ 아래). 글자가 그림에 인쇄돼 있다. */
  | { pecs: string }
  /** 옛 그림 카드(public/lessons/pecs/ 바로 아래). 글자가 그림에 인쇄돼 있다. */
  | { legacy: string }
  /** 공개 폴더의 그림 한 장(글자 없음). */
  | { image: string }
  | { emoji: string };

/** 선택지에서 만들지 않고 이 학습지를 위해 따로 그린 카드. */
export interface PictureCustomCard {
  id: string;
  label: string;
  pic: WorksheetPicRef;
  /** 붙이기에서 들어갈 칸의 id. 고르기에서는 쓰지 않는다. */
  zone?: string;
  /** 고르기에서 알맞은 카드. */
  right?: boolean;
  /** 교사가 읽어 줄 문장(정답지에 나온다). */
  say?: string;
}

export interface PictureZone {
  id: string;
  label: string;
  /** 칸 머리에 붙일 그림 카드. */
  pic?: WorksheetPicRef;
}

export interface PictureList {
  /** 학습지에 올릴 선택지 id(보이는 순서). 생략하면 그 목록의 선택지를 앞에서부터 세 장 쓴다. */
  show?: string[];
  /** 알맞은 선택지 id. 생략하면 정해진 답이 없는 열린 선택이다. */
  right?: string[];
  /** 선택지에서 만들지 않고 따로 그린 카드. 있으면 `show`·`right` 대신 이것을 쓴다. */
  cards?: PictureCustomCard[];
  /** ○ 맞아요 / ✕ 아니에요가 아닌 칸(붙이기 전용). 카드가 들어갈 칸은 `place`나 카드의 `zone`으로 정한다. */
  zones?: PictureZone[];
  /**
   * 선택지 id → 이 학습지에서만 바꿔 쓸 그림. 이모지 카드의 글자와 낱말이 똑같은 옛 그림 카드가 있을 때만 쓴다
   * (그림에 인쇄된 글자와 카드 글자가 달라지면 안 된다).
   */
  pics?: Record<string, WorksheetPicRef>;
  /** 선택지 id → 들어갈 칸 id. 선택지를 그대로 쓰면서 칸만 따로 정할 때(순서 붙이기 등). */
  place?: Record<string, string>;
  /** 머리줄 안내(‘오려서 순서대로 붙여요’ 같은 한 줄). 생략하면 칸의 모양에서 정한다. */
  hint?: string;
}

export interface PictureWorksheetSpec {
  /** 2. 따라 쓸 낱말. 그림 카드를 쓰면 카드에 인쇄된 글자와 같게 쓴다. */
  word: string;
  wordPic: WorksheetPicRef;
  /**
   * 중 수준 2. 따라 쓸 핵심 문장. 해요체, 열다섯 글자 안팎의 한 줄이며 `word`를 그대로 품는다
   * (둘째 줄에서 그 낱말을 빈칸으로 두고 직접 쓰게 한다).
   */
  sentence: string;
  /** 1. 상황과 물음. 해요체, 두 문장 이내. 알맞은 카드가 정해지도록 묻는다. */
  ask: string;
  /** 1. 이야기 장면 번호(1~4). 생략하면 2(문제가 드러나는 장면). */
  scene?: number;
  first: PictureList;
  /** 3. 상황과 판단 기준. 해요체, 두 문장 이내. */
  situation: string;
  transfer: PictureList;
}

const p = (id: string): WorksheetPicRef => ({ pecs: id });
const l = (id: string): WorksheetPicRef => ({ legacy: id });
const e = (char: string): WorksheetPicRef => ({ emoji: char });

/** 순서 붙이기 칸. */
const STEP_ZONES: PictureZone[] = [
  { id: 'step1', label: '① 먼저' },
  { id: 'step2', label: '② 다음' },
  { id: 'step3', label: '③ 마지막' },
];

export const PICTURE_WORKSHEET_SPECS: Partial<Record<LessonId, PictureWorksheetSpec>> = {
  // ───────────────────────── 1단원 · 인공지능 알아보기 ─────────────────────────
  'm1-l1': {
    word: '인공지능',
    wordPic: p('ai_aimi'),
    sentence: '인공지능은 돕는 도구예요.',
    ask: '아이미가 어려운 말로 인사했어요. 쉽게 어떻게 소개할까요?',
    first: { show: ['tool-with-input', 'magic-friend', 'just-machine'], right: ['tool-with-input'] },
    situation: '도서관 AI 추천 기계를 소개해요. 알맞은 소개일까요?',
    transfer: { show: ['describe-input-output', 'check-recommendation', 'call-all-knowing'], right: ['describe-input-output', 'check-recommendation'] },
  },
  'm1-l2': {
    word: '기계',
    wordPic: p('machine'),
    sentence: '기계는 정해진 대로 움직여요.',
    ask: '선풍기, 자동문, 추천 앱 중 AI를 찾아요. 어떻게 알아볼까요?',
    first: { show: ['inspect-input-output', 'automatic-means-ai', 'app-only-by-name'], right: ['inspect-input-output'] },
    situation: '스마트 조명 속 기능을 설명해요. 알맞은 설명일까요?',
    transfer: { show: ['separate-sensor-action', 'combine-sensor-ai', 'call-whole-device-ai'], right: ['separate-sensor-action', 'combine-sensor-ai'] },
  },
  'm1-l3': {
    word: '확인해요',
    wordPic: p('check_answer'),
    sentence: 'AI의 말은 확인해요.',
    ask: '아이미가 엉뚱한 급식 메뉴를 말했어요. 어떻게 할까요?',
    first: { show: ['verify-facts-and-fix', 'publish-smooth-copy', 'reject-everything'], right: ['verify-facts-and-fix'] },
    situation: 'AI가 검색해서 알려 준 정보예요. 알맞은 행동일까요?',
    transfer: { show: ['check-official-forecast', 'rewrite-with-source', 'trust-weather-tone'], right: ['check-official-forecast', 'rewrite-with-source'] },
  },
  'm1-l4': {
    word: '사진',
    wordPic: p('photo'),
    sentence: '사진이 바뀌면 답도 바뀌어요.',
    ask: 'AI가 사진을 보고 첫 대답을 했어요. 먼저 무엇을 할까요?',
    first: { show: ['change-one-condition', 'accept-first', 'ignore-conditions'], right: ['change-one-condition'] },
    situation: '흐린 표지판을 AI가 잘못 읽었어요. 알맞은 행동일까요?',
    transfer: { show: ['change-sign-angle', 'ask-staff', 'follow-first-sign'], right: ['change-sign-angle', 'ask-staff'] },
  },
  'm1-l5': {
    word: '말소리',
    wordPic: p('speech_sound'),
    sentence: '말소리가 잘못 들리면 다시 해요.',
    ask: '시끄러운 곳에서 AI가 말을 잘못 받아 적었어요. 어떻게 할까요?',
    first: { show: ['listen-again', 'trust-transcript', 'shout-loudly'], right: ['listen-again'] },
    situation: '체육관 안내 방송이 잘 안 들려요. 알맞은 행동일까요?',
    transfer: { show: ['replay-gym-audio', 'use-accessible-option', 'follow-gym-text'], right: ['replay-gym-audio', 'use-accessible-option'] },
  },
  'm1-l6': {
    word: '학습 자료',
    wordPic: p('learning_data'),
    sentence: 'AI는 학습 자료로 배워요.',
    ask: 'AI가 동그라미 과자를 세모라고 했어요. 까닭을 어떻게 찾을까요?',
    first: { show: ['inspect-data', 'blame-random', 'change-test-only'], right: ['inspect-data'] },
    situation: 'AI의 배움 자료를 고치려고 해요. 알맞은 방법일까요?',
    transfer: { show: ['balance-recycle-data', 'compare-recycle-test', 'accept-recycle-result'], right: ['balance-recycle-data', 'compare-recycle-test'] },
  },
  'm1-l7': {
    word: '요약해요',
    wordPic: p('summarize'),
    sentence: '요약해요. 빠진 곳을 찾아요.',
    ask: 'AI 요약에서 준비물이 빠졌어요. 어떻게 할까요?',
    first: { show: ['add-missing-items', 'share-fast-result', 'ignore-ai-help'], right: ['add-missing-items'] },
    situation: 'AI가 준비물 안내를 짧게 줄였어요. 알맞은 행동일까요?',
    transfer: { show: ['check-supply-source', 'repair-supply-summary', 'send-short-supply'], right: ['check-supply-source', 'repair-supply-summary'] },
  },
  'm1-l8': {
    word: '사람이 정해요',
    wordPic: p('human_decides'),
    sentence: '마지막은 사람이 정해요.',
    ask: 'AI가 먼저 의견을 냈어요. 마지막 결정은 누가 할까요?',
    first: { show: ['human-final', 'ai-final-for-all', 'ai-first-pass'], right: ['human-final'] },
    situation: '비 오는 날 체험회를 열지 정해요. 누가 해야 할까요?',
    transfer: {
      zones: [
        { id: 'fact', label: '원래 자료', pic: p('original_source') },
        { id: 'ai', label: 'AI가 먼저 해요', pic: p('ai_first_pass') },
        { id: 'human', label: '사람이 정해요', pic: p('human_decides') },
      ],
      cards: [
        { id: 'rain-chance', label: '비 올 확률', pic: e('🌧️'), zone: 'fact', say: '공식 일기예보의 비 올 확률은 근거로 확인하는 사실이에요.' },
        { id: 'tip-items', label: '준비물 추천', pic: e('🎒'), zone: 'ai', say: '준비물과 대체 활동 추천은 AI가 먼저 판단하고 사람이 검토해요.' },
        { id: 'open-event', label: '체험회 열기', pic: e('🎪'), zone: 'human', say: '체험회를 열지 말지는 안전과 현장 상황을 아는 사람이 정해요.' },
      ],
    },
  },
  'm1-l9': {
    word: '도구',
    wordPic: e('🧰'),
    sentence: '일에 맞는 도구를 골라요.',
    ask: '할 일에 맞는 AI 도구를 골라요. 어떻게 고를까요?',
    first: { show: ['match-input-output', 'choose-famous-tool', 'choose-fastest-tool'], right: ['match-input-output'] },
    situation: '여행 사진을 AI에게 설명받아요. 알맞은 행동일까요?',
    transfer: { show: ['plan-photo-tools', 'verify-photo-description', 'upload-private-photo'], right: ['plan-photo-tools', 'verify-photo-description'] },
  },
  'm1-l10': {
    word: '고쳐서 쓰기',
    wordPic: p('fix_and_use'),
    sentence: '결과를 고쳐서 쓰기도 해요.',
    ask: '댄스 시간에 AI가 자장가를 추천했어요. 어떻게 할까요?',
    first: { show: ['modify-prompt-conditions', 'use-all', 'reject-all'], right: ['modify-prompt-conditions'] },
    situation: 'AI가 만든 안내에 틀린 시간이 있어요. 알맞은 행동일까요?',
    transfer: { show: ['modify-time', 'reject-unsafe', 'publish-now'], right: ['modify-time', 'reject-unsafe'] },
  },
  'm1-l11': {
    word: '아이미',
    wordPic: p('aimi_character'),
    sentence: '아이미는 돕는 도구예요.',
    scene: 1,
    ask: '새 안내 AI가 알려 준 행사 시간이 공식 공지와 달라요. 어떻게 할까요?',
    first: {
      cards: [
        { id: 'compare-source', label: '원래 자료', pic: p('original_source'), right: true, say: '행사 시간을 공식 공지(원래 자료)와 비교해 확인해요.' },
        { id: 'asis', label: '그대로 쓰기', pic: p('use_as_is'), say: 'AI가 알려 준 행사 시간을 확인 없이 그대로 써요.' },
        { id: 'drop', label: '쓰지 않기', pic: p('dont_use'), say: 'AI가 알려 준 내용을 전혀 쓰지 않아요.' },
      ],
    },
    situation: 'AI와 함께 지낼 나의 약속을 정해요. 마음에 드는 약속은 무엇일까요?',
    transfer: { show: ['find-input', 'check-result', 'decide-with-human'] },
  },

  // ───────────────────────── 2단원 · 인공지능과 말하기 ─────────────────────────
  'm2-l1': {
    word: '빠졌어요',
    wordPic: p('missing_part'),
    sentence: '정보가 빠졌어요. 채워요.',
    ask: '아이미가 엉뚱한 안내를 보여 줬어요. 먼저 무엇을 할까요?',
    first: { show: ['repeat-vague', 'find-missing-info', 'share-private-info'], right: ['find-missing-info'] },
    situation: '이름을 모르는 물건을 AI에게 찾아 달라고 해요. 알맞은 말일까요?',
    transfer: { show: ['say-that-object', 'describe-object', 'share-home-address'], right: ['describe-object'] },
  },
  'm2-l2': {
    word: '마감',
    wordPic: p('deadline'),
    sentence: '마감이 빠른 일부터 부탁해요.',
    ask: '세 가지 부탁이 있어요. 어떤 부탁부터 할까요?',
    first: { show: ['repeat-all', 'start-deadline', 'start-music'], right: ['start-deadline'] },
    situation: '교통편, 준비물, 소개 글을 AI에게 부탁해요. 알맞은 방법일까요?',
    transfer: { show: ['travel-all-at-once', 'travel-order', 'travel-no-check'], right: ['travel-order'] },
  },
  'm2-l3': {
    word: '구체적으로 말해요',
    wordPic: p('be_specific'),
    sentence: '필요한 것을 구체적으로 말해요.',
    ask: '“재미있는 걸로”만 말했더니 엉뚱한 놀이가 나왔어요. 어떻게 말할까요?',
    first: { show: ['say-fun-only', 'add-target-conditions', 'accept-hard-game'], right: ['add-target-conditions'] },
    situation: '긴 준비물 메모를 AI로 정리해요. 알맞은 부탁일까요?',
    transfer: { show: ['repeat-organize-that', 'name-note-format', 'add-unneeded-name'], right: ['name-note-format'] },
  },
  'm2-l4': {
    word: '예시를 보여 줘요',
    wordPic: p('example_request'),
    sentence: '원하는 모양은 예시를 보여 줘요.',
    ask: 'AI가 모양이 제각각인 결과를 줬어요. 어떻게 부탁할까요?',
    first: { show: ['no-example', 'verified-example', 'wrong-date-example'], right: ['verified-example'] },
    situation: '표의 칸 제목을 AI에게 부탁해요. 알맞은 부탁일까요?',
    transfer: { show: ['table-no-example', 'table-good-example', 'table-wrong-example'], right: ['table-good-example'] },
  },
  'm2-l5': {
    word: '말투',
    wordPic: p('tone'),
    sentence: '읽을 사람에 맞게 말투를 바꿔요.',
    ask: '동생과 선생님께 같은 안내 글을 보내요. 어떻게 쓸까요?',
    first: { show: ['same-notice-both', 'two-tones-one-fact', 'expert-role-trust'], right: ['two-tones-one-fact'] },
    situation: '친구와 선생님께 같은 부탁을 해요. 알맞은 방법일까요?',
    transfer: { show: ['same-request-both', 'adapt-request-tone', 'change-request-fact'], right: ['adapt-request-tone'] },
  },
  'm2-l6': {
    word: '단계로 나눠요',
    wordPic: p('split_steps'),
    sentence: '큰 부탁은 단계로 나눠요.',
    ask: '준비표를 빠짐없이 만들고 싶어요. 어떤 일부터 할까요?',
    first: { show: ['ask-whole-plan-again', 'confirm-purpose-place', 'decorate-table-first'], right: ['confirm-purpose-place'] },
    situation: '나들이 계획을 AI에게 부탁해요. 알맞은 방법일까요?',
    transfer: { show: ['outing-all-at-once', 'outing-stepwise', 'outing-skip-check'], right: ['outing-stepwise'] },
  },
  'm2-l7': {
    word: '고쳐서 부탁해요',
    wordPic: p('revise_request'),
    sentence: '부족하면 고쳐서 부탁해요.',
    ask: 'AI 안내에서 중요한 정보가 빠졌어요. 어떻게 다시 부탁할까요?',
    first: { show: ['say-dislike-only', 'lock-and-revise', 'use-missing-notice'], right: ['lock-and-revise'] },
    situation: '준비물 안내가 정확한데 너무 길어요. 알맞은 방법일까요?',
    transfer: { show: ['shorten-anything', 'preserve-items', 'ignore-long-text'], right: ['preserve-items'] },
  },
  'm2-l8': {
    word: '번호 목록',
    wordPic: p('numbered_list'),
    sentence: '순서는 번호 목록으로 써요.',
    ask: '표, 번호 목록, 한 문장 중에서 골라요. 어떻게 고를까요?',
    first: { show: ['all-short-sentences', 'match-purpose-format', 'keep-long-paragraphs'], right: ['match-purpose-format'] },
    situation: '세 번의 모임 일정을 비교하기 쉽게 정리해요. 알맞은 모양일까요?',
    transfer: { show: ['schedule-long-story', 'schedule-table', 'schedule-one-word'], right: ['schedule-table'] },
  },
  'm2-l9': {
    word: '원래 자료',
    wordPic: p('original_source'),
    sentence: '답은 원래 자료로 확인해요.',
    ask: 'AI가 말한 종료 시간이 맞는지 알고 싶어요. 어떻게 확인할까요?',
    first: { show: ['ask-ai-really', 'check-latest-official', 'trust-confident-tone'], right: ['check-latest-official'] },
    situation: 'AI가 동아리 장소를 알려 줬어요. 알맞은 확인일까요?',
    transfer: { show: ['ask-ai-place-again', 'check-latest-place-notice', 'use-old-place-post'], right: ['check-latest-place-notice'] },
  },
  'm2-l10': {
    word: '목적',
    wordPic: p('purpose'),
    sentence: '먼저 목적을 정하고 부탁해요.',
    ask: '아이미와 첫 대화를 시작해요. 어떤 과제를 고를까요?',
    first: { show: ['choose-promo-copy', 'choose-activity-list', 'choose-intro-script'] },
    situation: '동아리 모집 문구를 만들어요. 알맞은 방법일까요?',
    transfer: { show: ['transfer-one-shot', 'transfer-full-cycle', 'transfer-repeat-only'], right: ['transfer-full-cycle'] },
  },
  'm2-l11': {
    word: '부탁해요',
    wordPic: l('polite_request'),
    sentence: '목적과 조건을 넣어 부탁해요.',
    scene: 1,
    ask: '새 동아리 친구가 AI에게 처음 부탁해요. 먼저 무엇을 말할까요?',
    first: {
      cards: [
        { id: 'say-purpose', label: '목적', pic: p('purpose'), right: true, say: '무엇을 왜 만들지 목적을 먼저 말해요.' },
        { id: 'say-vague', label: '모호한 말', pic: p('vague_request'), say: '“그거 해 줘”처럼 모호하게 말해요.' },
        { id: 'use-first', label: '그대로 쓰기', pic: p('use_as_is'), say: 'AI의 첫 결과를 확인하지 않고 그대로 써요.' },
      ],
    },
    situation: '나만의 프롬프트 노트에 쓸 약속을 정해요. 마음에 드는 약속은 무엇일까요?',
    transfer: { show: ['purpose-first', 'repair-with-criteria', 'verify-before-use'] },
  },

  // ───────────────────────── 3단원 · 공부 도우미 AI ─────────────────────────
  'm3-l1': {
    word: '까닭을 물어봐요',
    wordPic: p('ask_why'),
    sentence: '궁금하면 까닭을 물어봐요.',
    scene: 1,
    ask: '펭귄은 새인데 날지 못해요. 어떤 질문이 도움이 될까요?',
    first: { show: ['repeat-yes-no', 'open-why', 'specific-flight'], right: ['open-why', 'specific-flight'] },
    situation: '책에서 “서식지”라는 낱말을 만났어요. 알맞은 질문일까요?',
    transfer: {
      show: ['habitat-yes-no', 'habitat-meaning', 'habitat-example'],
      right: ['habitat-meaning', 'habitat-example'],
      // 옛 그림 카드 “뜻을 물어봐요”가 이 선택지의 카드 글자와 낱말까지 같다.
      pics: { 'habitat-meaning': l('word_meaning') },
    },
  },
  'm3-l2': {
    word: '사전',
    wordPic: p('dictionary'),
    sentence: '모르는 낱말은 사전을 찾아요.',
    ask: '“생태계”의 뜻을 짐작해요. 알맞은 뜻은 무엇일까요?',
    first: { show: ['only-animals', 'living-and-environment', 'exhibition-tool'], right: ['living-and-environment'] },
    situation: '“서식지를 보호해요”의 뜻을 알아봐요. 어떤 순서로 할까요?',
    transfer: {
      show: ['guess-context', 'compare-dictionary', 'own-example'],
      zones: STEP_ZONES,
      place: { 'guess-context': 'step1', 'compare-dictionary': 'step2', 'own-example': 'step3' },
      hint: '오려서 순서대로 붙여요',
    },
  },
  'm3-l3': {
    word: '쉬운 말',
    wordPic: p('easy_words'),
    sentence: '어려운 설명은 쉬운 말로 바꿔요.',
    ask: '식물이 양분을 만드는 쉬운 설명이에요. 꼭 남길 내용은 무엇일까요?',
    first: { show: ['sun-only', 'materials-result', 'green-color'], right: ['materials-result'] },
    situation: '물의 순환을 쉬운 말로 바꿔요. 알맞은 방법일까요?',
    transfer: { show: ['keep-cycle', 'rain-only', 'check-diagram'], right: ['keep-cycle', 'check-diagram'] },
  },
  'm3-l4': {
    word: '예문',
    wordPic: p('example_sentence'),
    sentence: '낱말을 배우면 예문을 만들어요.',
    ask: '“선명하다”가 어울리는 장면은 어느 것일까요?',
    first: { show: ['clear-photo', 'blur-photo', 'quiet-hall'], right: ['clear-photo'] },
    situation: '“조용하다”를 새 장면에 써요. 어울리는 장면일까요?',
    transfer: {
      cards: [
        { id: 'library', label: '도서관 장면', pic: e('📚'), zone: 'yes', say: '도서관 장면에 어울리는 문장을 만들어요.' },
        { id: 'sports-day', label: '운동회 장면', pic: e('📣'), zone: 'no', say: '응원 소리가 큰 운동회 장면과 비교해요.' },
        { id: 'lightning', label: '번개 사진', pic: e('⚡'), zone: 'no', say: '번개가 치는 사진은 소리가 커서 “조용하다”가 어울리지 않아요.' },
      ],
    },
  },
  'm3-l5': {
    word: '이야기',
    wordPic: e('📖'),
    sentence: 'AI와 함께 이야기를 지어요.',
    ask: '작은 로봇 이야기의 결말을 정해요. 마음에 드는 결말은 무엇일까요?',
    first: { show: ['find-umbrella', 'mystery-map', 'own-ending'] },
    situation: '비 오는 학교 이야기의 분위기를 바꿔요. 마음에 드는 분위기는 무엇일까요?',
    transfer: { show: ['joyful-version', 'curious-version', 'quiet-version'] },
  },
  'm3-l6': {
    word: '계산기',
    wordPic: p('calculator'),
    sentence: '계산 결과는 계산기로 확인해요.',
    scene: 1,
    ask: '간식 값 합계를 계산하기 전에 예상해요. 얼마쯤일까요?',
    first: { show: ['under-4000', 'around-6000', 'over-10000'], right: ['around-6000'] },
    situation: '거스름돈을 확인해요. 어떤 순서로 할까요?',
    transfer: {
      show: ['estimate-change', 'calculator-change', 'compare-receipt'],
      zones: STEP_ZONES,
      place: { 'estimate-change': 'step1', 'calculator-change': 'step2', 'compare-receipt': 'step3' },
      hint: '오려서 순서대로 붙여요',
    },
  },
  'm3-l7': {
    word: '요약해요',
    wordPic: p('summarize'),
    sentence: '긴 글은 중요한 것만 요약해요.',
    ask: '전시 안내문을 짧게 줄여요. 꼭 남길 내용은 무엇일까요?',
    first: { show: ['place', 'decoration', 'arrival'], right: ['place', 'arrival'] },
    situation: '학급 안내문을 두 문장으로 줄여요. 어떤 순서로 할까요?',
    transfer: {
      show: ['mark-required', 'compare-source', 'restore-missing'],
      zones: STEP_ZONES,
      place: { 'mark-required': 'step1', 'compare-source': 'step2', 'restore-missing': 'step3' },
      hint: '오려서 순서대로 붙여요',
    },
  },
  'm3-l8': {
    word: '먼저 생각해요',
    wordPic: p('think_first'),
    sentence: '정답을 보기 전에 먼저 생각해요.',
    ask: '퀴즈를 풀 때 어떤 순서가 좋을까요?',
    first: { show: ['answer-first', 'respond-first', 'only-score'], right: ['respond-first'] },
    situation: '친구가 만든 낱말 퀴즈를 풀어요. 어떤 순서로 할까요?',
    transfer: {
      show: ['hide-answer', 'explain-reason', 'retry'],
      zones: STEP_ZONES,
      place: { 'hide-answer': 'step1', 'explain-reason': 'step2', retry: 'step3' },
      hint: '오려서 순서대로 붙여요',
    },
  },
  'm3-l9': {
    word: '추측',
    wordPic: p('guess'),
    sentence: '보이지 않는 것은 추측이에요.',
    ask: '“두 학생은 소풍을 간다”는 말은 그림에서 무엇일까요?',
    first: { show: ['fact', 'inference', 'unknown'], right: ['inference', 'unknown'] },
    situation: '해바라기 그림을 설명해요. 어느 칸에 붙일까요?',
    transfer: {
      zones: [
        { id: 'fact', label: '사실', pic: p('fact') },
        { id: 'guess', label: '추측', pic: p('guess') },
        { id: 'unknown', label: '모름', pic: p('unknown') },
      ],
      cards: [
        { id: 'one-flower', label: '꽃이 한 송이예요', pic: e('🌻'), zone: 'fact', say: '해바라기가 한 송이 있어요. 눈에 보이는 사실이에요.' },
        { id: 'happy-flower', label: '꽃이 행복해요', pic: e('😊'), zone: 'guess', say: '꽃이 행복하다는 건 마음을 짐작한 추측이에요.' },
        { id: 'which-day', label: '언제 그렸을까요', pic: e('🕒'), zone: 'unknown', say: '언제 그린 그림인지는 그림만으로 알 수 없어요. 모름이에요.' },
      ],
    },
  },
  'm3-l10': {
    word: '내 말로 설명해요',
    wordPic: p('own_words'),
    sentence: '배운 것은 내 말로 설명해요.',
    ask: '오늘 배운 것을 떠올려요. 무엇부터 말해 볼까요?',
    first: { show: ['word-card-recall', 'calculation-recall', 'summary-recall'] },
    situation: '배운 것을 복습해요. 어떤 순서로 할까요?',
    transfer: {
      show: ['recall-first', 'check-source', 'explain-own-words'],
      zones: STEP_ZONES,
      place: { 'recall-first': 'step1', 'check-source': 'step2', 'explain-own-words': 'step3' },
      hint: '오려서 순서대로 붙여요',
    },
  },
  'm3-l11': {
    word: '확인해요',
    wordPic: p('check_answer'),
    sentence: 'AI의 답은 근거로 확인해요.',
    scene: 1,
    ask: '새 친구가 과학 숙제에서 모르는 낱말을 만났어요. 먼저 무엇을 할까요?',
    first: {
      cards: [
        { id: 'think-first', label: '먼저 생각해요', pic: p('think_first'), right: true, say: 'AI를 보기 전에 내 생각을 먼저 해요.' },
        { id: 'look-answer', label: '정답', pic: p('answer_key'), say: '정답을 먼저 봐요.' },
        { id: 'copy-ai', label: '그대로 쓰기', pic: p('use_as_is'), say: 'AI의 답을 그대로 가져다 써요.' },
      ],
    },
    situation: '나의 공부 도구함에 넣을 약속을 정해요. 마음에 드는 약속은 무엇일까요?',
    transfer: { show: ['think-first', 'check-source', 'own-expression'] },
  },

  // ───────────────────────── 4단원 · 안전하게 쓰기 ─────────────────────────
  'm4-l1': {
    word: '확인해요',
    wordPic: p('check_answer'),
    sentence: '자신 있게 말해도 확인해요.',
    ask: '아이미가 시간을 자신 있게 말했어요. 친구에게 알리기 전에 무엇을 할까요?',
    first: { show: ['trust-tone', 'check-official', 'ask-ai-again'], right: ['check-official'] },
    situation: 'AI가 체험 장소를 2층이라고 했어요. 알맞은 행동일까요?',
    transfer: { show: ['follow-old-room', 'check-latest-board', 'ask-same-answer'], right: ['check-latest-board'] },
  },
  'm4-l2': {
    word: '날짜',
    wordPic: p('date'),
    sentence: '출처와 날짜를 먼저 봐요.',
    ask: '같은 소식을 알려 주는 자료가 세 개예요. 어떤 자료를 믿을까요?',
    first: { show: ['anonymous-capture', 'latest-official', 'old-official'], right: ['latest-official'] },
    situation: '친구 메시지와 선생님 공지가 서로 달라요. 알맞은 기준일까요?',
    transfer: { show: ['friend-message', 'today-teacher', 'yesterday-class'], right: ['today-teacher'] },
  },
  'm4-l3': {
    word: '개인정보',
    wordPic: p('personal_info'),
    sentence: '개인정보는 가려서 보내요.',
    ask: '나를 알 수 있는 이름, 학교, 시간을 가려요. 어떻게 가릴까요?',
    first: { show: ['hide-name-only', 'hide-identifiers', 'hide-task'], right: ['hide-identifiers'] },
    situation: '분실물 사진을 찾는 글을 고쳐요. 알맞은 방법일까요?',
    transfer: { show: ['share-all-details', 'keep-item-details', 'remove-purpose'], right: ['keep-item-details'] },
  },
  'm4-l4': {
    word: '거절해요',
    wordPic: p('refuse'),
    sentence: '비밀번호를 물으면 거절해요.',
    ask: '“선생님 확인”이라며 인증 코드를 보내 달래요. 어떻게 할까요?',
    first: { show: ['send-code', 'refuse-tell', 'ask-more'], right: ['refuse-tell'] },
    situation: '낯선 메시지가 링크를 보내요. 알맞은 행동일까요?',
    transfer: { show: ['open-message-link', 'official-route', 'send-old-password'], right: ['official-route'] },
  },
  'm4-l5': {
    word: '가려요',
    wordPic: p('cover_up'),
    sentence: '보내기 전에 이름을 가려요.',
    ask: '친구 이름표가 보이는 사진을 보내려 해요. 어떻게 할까요?',
    first: { show: ['send-as-is', 'crop-redact', 'wait-consent'], right: ['crop-redact', 'wait-consent'] },
    situation: '간식 사진 유리창에 친구 얼굴이 비쳐요. 알맞은 행동일까요?',
    transfer: { show: ['safe-by-subject', 'check-reflection', 'share-more'], right: ['check-reflection'] },
  },
  'm4-l6': {
    word: '불편해요',
    wordPic: p('uncomfortable'),
    sentence: '불편해요. 멈추고 알려요.',
    ask: '화면이 갑자기 불편해졌어요. 먼저 무엇을 할까요?',
    first: { show: ['read-again', 'stop-and-tell', 'handle-alone'], right: ['stop-and-tell'] },
    situation: '자동으로 켜진 영상이 불편해요. 알맞은 행동일까요?',
    transfer: { show: ['watch-to-explain', 'stop-distance-tell', 'reopen-alone'], right: ['stop-distance-tell'] },
  },
  'm4-l7': {
    word: '부탁해요',
    wordPic: l('polite_request'),
    sentence: '예의 바르고 분명하게 부탁해요.',
    ask: '아이미에게 부탁하는 글을 고쳐요. 먼저 무엇을 보탤까요?',
    first: { show: ['polite-only', 'clear-structure', 'stronger-order'], right: ['clear-structure'] },
    situation: '친구에게 색종이를 빌려요. 알맞은 말일까요?',
    transfer: { show: ['rough-friend', 'clear-friend', 'no-action'], right: ['clear-friend'] },
  },
  'm4-l8': {
    word: '멈춰요',
    wordPic: p('stop_now'),
    sentence: '많이 썼으면 멈춰요.',
    ask: 'AI를 오래 써서 쉬는 계획을 세워요. 무엇이 필요할까요?',
    first: { show: ['one-number', 'signal-action', 'willpower-only'], right: ['signal-action'] },
    situation: '주말에는 계획을 바꿔야 해요. 알맞은 행동일까요?',
    transfer: { show: ['ignore-change', 'adjust-plan', 'no-plan'], right: ['adjust-plan'] },
  },
  'm4-l9': {
    word: '어른에게 알리기',
    wordPic: p('tell_adult'),
    sentence: '어른에게 알리기부터 해요.',
    ask: '낯선 사람이 선물을 주겠다며 만나자고 해요. 어떻게 할까요?',
    first: { show: ['accept-gift', 'stop-block-tell', 'test-account'], right: ['stop-block-tell'] },
    situation: '낯선 계정이 얼굴 사진을 보내라고 해요. 알맞은 행동일까요?',
    transfer: { show: ['send-photo', 'refuse-and-alert', 'keep-chatting'], right: ['refuse-and-alert'] },
  },
  'm4-l10': {
    word: '광고',
    wordPic: p('advertisement'),
    sentence: '광고는 사라고 하는 글이에요.',
    ask: '추천 영상을 보니 물건을 사고 싶어졌어요. 어떻게 할까요?',
    first: { show: ['buy-now', 'inspect-compare', 'reject-all-ads'], right: ['inspect-compare'] },
    situation: '좋아하는 사람이 추천한 게임 영상이에요. 알맞은 행동일까요?',
    transfer: { show: ['buy-because-favorite', 'find-ad-clues', 'believe-guarantee'], right: ['find-ad-clues'] },
  },
  'm4-l11': {
    word: '도와주세요',
    wordPic: p('help_please'),
    sentence: '도와주세요 하고 말해요.',
    scene: 1,
    ask: 'AI의 답이 오늘 공지와 달라요. 어떻게 할까요?',
    first: {
      cards: [
        { id: 'compare-official', label: '원래 자료', pic: p('original_source'), right: true, say: 'AI의 답을 오늘의 공식 공지와 비교해요.' },
        { id: 'asis', label: '그대로 쓰기', pic: p('use_as_is'), say: 'AI의 답을 확인 없이 그대로 써요.' },
        { id: 'ask-ai-again', label: 'AI에게 또 물어요', pic: e('🔁'), say: '같은 AI에게 맞는지 다시 물어요.' },
      ],
    },
    situation: '나의 안전 수칙을 정해요. 마음에 드는 약속은 무엇일까요?',
    transfer: { show: ['verify-official', 'protect-before-send', 'stop-and-ask'] },
  },

  // ───────────────────────── 5단원 · 문제 해결 ─────────────────────────
  'm5-l1': {
    word: '지금 모습',
    wordPic: p('now_state'),
    sentence: '지금 모습과 목표를 나눠요.',
    ask: '행사 물품이 오지 않았어요. 문제를 정확히 알려면 어떻게 할까요?',
    first: { show: ['buy-immediately', 'define-gap', 'cancel-event'], right: ['define-gap'] },
    situation: '활동 전에 색종이가 한 묶음 모자라요. 알맞은 행동일까요?',
    transfer: { show: ['blame-preparer', 'check-missing-item', 'stop-all-work'], right: ['check-missing-item'] },
  },
  'm5-l2': {
    word: '단계로 나눠요',
    wordPic: p('split_steps'),
    sentence: '큰 일은 단계로 나눠요.',
    ask: '“부스 설치”라는 큰 일을 어떻게 나눌까요?',
    first: { show: ['pick-random-order', 'list-needed-tasks', 'one-person-all'], right: ['list-needed-tasks'] },
    situation: '학급 발표 준비라는 큰 일이 있어요. 알맞은 시작일까요?',
    transfer: { show: ['start-slides-only', 'separate-presentation-tasks', 'set-order-first'], right: ['separate-presentation-tasks'] },
  },
  'm5-l3': {
    word: '번호 목록',
    wordPic: p('numbered_list'),
    sentence: '차례는 번호 목록으로 정해요.',
    ask: '부스 설치 순서를 정해요. 무엇을 기준으로 정할까요?',
    first: { show: ['prettiest-first', 'dependencies-first', 'alphabetical'], right: ['dependencies-first'] },
    situation: '프로젝터 설치 카드의 순서를 정해요. 알맞은 시작일까요?',
    transfer: { show: ['turn-on-first', 'safe-projector-order', 'decorate-projector'], right: ['safe-projector-order'] },
  },
  'm5-l4': {
    word: '먼저 할 일',
    wordPic: p('first_task'),
    sentence: '안전한 일이 먼저 할 일이에요.',
    ask: '한꺼번에 세 가지 일이 왔어요. 가장 먼저 할 일은 무엇일까요?',
    first: { show: ['favorite-first', 'safety-first', 'random-first'], right: ['safety-first'] },
    situation: '발표 마감이 앞당겨졌어요. 알맞은 행동일까요?',
    transfer: { show: ['keep-old-order', 'recheck-criteria', 'only-easy-task'], right: ['recheck-criteria'] },
  },
  'm5-l5': {
    word: '힌트',
    wordPic: p('hint'),
    sentence: '막히면 작은 힌트를 받아요.',
    ask: '막힌 문제를 풀어요. 어떤 도움을 먼저 받을까요?',
    first: { show: ['complete-answer', 'small-hint', 'start-over'], right: ['small-hint'] },
    situation: '순서 퍼즐에서 막혔어요. 알맞은 도움일까요?',
    transfer: { show: ['show-full-order', 'choose-process-question', 'quit-puzzle'], right: ['choose-process-question'] },
  },
  'm5-l6': {
    word: '장소',
    wordPic: p('place'),
    sentence: '장소 단서를 더해 다시 말해요.',
    ask: '아이미가 다른 장소로 알아들었어요. 어떻게 다시 말할까요?',
    first: { show: ['add-school-address', 'safe-location-clues', 'blame-student'], right: ['safe-location-clues'] },
    situation: '“체육관 부스”가 여러 곳을 뜻해요. 알맞은 방법일까요?',
    transfer: { show: ['share-home-route', 'use-building-clues', 'repeat-same-request'], right: ['use-building-clues'] },
  },
  'm5-l7': {
    word: '다 됐어요',
    wordPic: p('done_mark'),
    // 표시의 이름(다 됐어요)이 문장 끝말처럼 읽혀 뒤의 말과 끊기지 않게 따옴표로 묶는다.
    sentence: '‘다 됐어요’ 표시를 확인해요.',
    ask: '아이미가 안내를 길게 해 줬어요. 어떻게 진행할까요?',
    first: { show: ['do-all-at-once', 'check-each-step', 'skip-confusing-step'], right: ['check-each-step'] },
    situation: '작품 파일을 올려요. 알맞은 진행일까요?',
    transfer: { show: ['upload-all-fast', 'upload-checkpoints', 'skip-upload-check'], right: ['upload-checkpoints'] },
  },
  'm5-l8': {
    word: '빠졌어요',
    wordPic: p('missing_part'),
    sentence: '무엇이 빠졌어요? 찾아요.',
    ask: '아이미가 안내문을 완성했다고 했어요. 어떻게 확인할까요?',
    first: { show: ['trust-finished-message', 'use-checklist', 'judge-by-look'], right: ['use-checklist'] },
    situation: 'AI가 모둠 인원의 합계를 알려 줬어요. 알맞은 확인일까요?',
    transfer: { show: ['ask-ai-same-total', 'calculator-check', 'choose-neat-number'], right: ['calculator-check'] },
  },
  'm5-l9': {
    word: '다른 방법',
    wordPic: p('different_way'),
    sentence: '막히면 다른 방법을 찾아요.',
    ask: '프린터가 고장 났어요. 어떻게 할까요?',
    first: { show: ['wait-for-printer', 'compare-options', 'pick-favorite-tool'], right: ['compare-options'] },
    situation: '화면 안내를 갑자기 쓸 수 없어요. 알맞은 행동일까요?',
    transfer: { show: ['stop-all-guidance', 'switch-non-screen', 'hide-screen-problem'], right: ['switch-non-screen'] },
  },
  'm5-l10': {
    word: '고쳐서 쓰기',
    wordPic: p('fix_and_use'),
    sentence: '틀린 곳은 고쳐서 쓰기 해요.',
    ask: '방문객이 엉뚱한 화면으로 갔어요. 오류를 어떻게 찾을까요?',
    first: { show: ['rewrite-everything', 'reproduce-error', 'assume-user-mistake'], right: ['reproduce-error'] },
    situation: '고친 안내가 한 번 성공했어요. 다음에 무엇을 할까요?',
    transfer: { show: ['declare-fixed-once', 'test-other-user', 'remove-result-record'], right: ['test-other-user'] },
  },
  'm5-l11': {
    word: '멈춰요',
    wordPic: p('stop_now'),
    sentence: '조건이 바뀌면 멈춰요.',
    ask: '친구의 알레르기 정보를 아직 몰라요. 어떻게 할까요?',
    first: { show: ['continue-original-plan', 'stop-and-replan', 'ask-ai-to-guess-allergy'], right: ['stop-and-replan'] },
    situation: '설치 장소가 좁아지고 시간이 줄었어요. 알맞은 행동일까요?',
    transfer: { show: ['keep-plan-secretly', 'check-new-conditions', 'ignore-time-change'], right: ['check-new-conditions'] },
  },
  'm5-l12': {
    word: '다른 방법',
    wordPic: p('different_way'),
    sentence: '막히면 다른 방법을 비교해요.',
    scene: 1,
    ask: '준비물 하나가 빠졌어요. 먼저 무엇을 할까요?',
    first: {
      cards: [
        { id: 'check-missing', label: '확인해요', pic: p('check_answer'), right: true, say: '빠진 물건과 필요한 수량을 확인해요.' },
        { id: 'stop-all', label: '멈춰요', pic: p('stop_now'), say: '준비물이 모자라서 모든 활동을 멈춰요.' },
        { id: 'find-culprit', label: '잘못한 사람 찾기', pic: e('📣'), say: '누가 잘못했는지부터 찾아요.' },
      ],
    },
    situation: '나의 문제 해결 약속을 정해요. 마음에 드는 약속은 무엇일까요?',
    transfer: { show: ['define-before-action', 'compare-and-check', 'revise-when-changed'] },
  },

  // ───────────────────────── 6단원 · 생활 속 AI ─────────────────────────
  'm6-l1': {
    word: '예산',
    wordPic: p('budget'),
    sentence: '예산에 맞게 목록을 고쳐요.',
    ask: 'AI가 장보기 목록을 만들어 줬어요. 어떻게 할까요?',
    first: { show: ['buy-ai-list', 'revise-shopping-list', 'choose-cheapest-only'], right: ['revise-shopping-list'] },
    situation: 'AI가 공책, 색연필, 풀을 추천했어요. 알맞은 행동일까요?',
    transfer: { show: ['buy-school-list', 'check-school-supplies', 'pick-brightest-supplies'], right: ['check-school-supplies'] },
  },
  'm6-l2': {
    word: '계산기',
    wordPic: p('calculator'),
    sentence: '돈 계산은 계산기로 확인해요.',
    ask: 'AI가 말한 합계가 맞는지 모르겠어요. 어떻게 확인할까요?',
    first: { show: ['trust-ai-money', 'calculator-check', 'guess-round-money'], right: ['calculator-check'] },
    situation: '공책 두 권과 풀 한 개를 사요. 알맞은 확인일까요?',
    transfer: { show: ['accept-new-ai-total', 'verify-new-purchase', 'pay-all-budget'], right: ['verify-new-purchase'] },
  },
  'm6-l3': {
    word: '표지판',
    wordPic: p('sign'),
    sentence: '표지판을 보고 길을 확인해요.',
    ask: 'AI가 지도에 없는 지름길을 알려 줬어요. 어떻게 할까요?',
    first: { show: ['follow-ai-shortcut', 'use-fixed-map', 'share-live-location'], right: ['use-fixed-map'] },
    situation: '지도에 없는 뒷길을 AI가 알려 줬어요. 알맞은 행동일까요?',
    transfer: { show: ['take-clinic-backroad', 'check-clinic-map', 'send-private-location'], right: ['check-clinic-map'] },
  },
  'm6-l4': {
    word: '버스',
    wordPic: l('bus'),
    sentence: '버스는 번호와 방향을 봐요.',
    ask: '비슷한 번호의 버스가 먼저 왔어요. 어떻게 할까요?',
    first: { show: ['board-similar-number', 'check-route-direction', 'follow-old-ai-route'], right: ['check-route-direction'] },
    situation: '지하철 승강장 방향이 헷갈려요. 알맞은 행동일까요?',
    transfer: { show: ['take-any-platform', 'ask-station-staff', 'guess-from-crowd'], right: ['ask-station-staff'] },
  },
  'm6-l5': {
    word: '날씨',
    wordPic: p('weather'),
    sentence: '날씨 예보를 보고 옷을 골라요.',
    ask: '“따뜻해요”라는 AI의 말만 듣고 옷을 골랐어요. 어떻게 할까요?',
    first: { show: ['use-vague-weather', 'official-forecast', 'copy-friend-outfit'], right: ['official-forecast'] },
    situation: '오후에 비가 빨리 온다는 소식이 나왔어요. 알맞은 행동일까요?',
    transfer: { show: ['keep-morning-plan', 'update-afternoon-prep', 'ask-ai-without-place'], right: ['update-afternoon-prep'] },
  },
  'm6-l6': {
    word: '확인해요',
    wordPic: p('check_answer'),
    sentence: '요리 전에 재료를 확인해요.',
    ask: 'AI가 요리 순서를 알려 줬어요. 어떻게 할까요?',
    first: { show: ['follow-ai-recipe', 'check-food-conditions', 'let-ai-guess-allergy'], right: ['check-food-conditions'] },
    situation: '계획한 과일이 없어요. 알맞은 행동일까요?',
    transfer: { show: ['use-unknown-food', 'substitute-missing-fruit', 'hide-missing-fruit'], right: ['substitute-missing-fruit'] },
  },
  'm6-l7': {
    word: '바꿔요',
    wordPic: p('swap_item'),
    sentence: '도움 시간에 맞게 계획을 바꿔요.',
    ask: 'AI가 하루 일정을 빽빽하게 짰어요. 어떻게 할까요?',
    first: { show: ['pack-all-activities', 'balanced-personal-plan', 'copy-friend-schedule'], right: ['balanced-personal-plan'] },
    situation: '도와줄 사람이 오전에만 올 수 있어요. 알맞은 행동일까요?',
    transfer: { show: ['ignore-help-time', 'revise-help-time', 'remove-all-breaks'], right: ['revise-help-time'] },
  },
  'm6-l8': {
    word: '아파요',
    wordPic: p('hurt'),
    sentence: '아파요 하고 어른에게 알려요.',
    ask: '몸이 불편해요. 가장 먼저 무엇을 할까요?',
    first: { show: ['ask-ai-diagnosis', 'tell-trusted-adult', 'hide-discomfort'], right: ['tell-trusted-adult'] },
    situation: '갑자기 어지러워요. 알맞은 행동일까요?',
    transfer: { show: ['search-disease-name', 'report-dizziness', 'walk-alone-away'], right: ['report-dizziness'] },
  },
  'm6-l9': {
    word: '안녕하세요',
    wordPic: p('bow_greeting'),
    sentence: '안녕하세요 하고 먼저 인사해요.',
    ask: '내 마음을 전하고 싶어요. 어떻게 표현할까요?',
    first: { show: ['always-say-yes-politely', 'use-own-expression', 'leave-without-expression'], right: ['use-own-expression'] },
    situation: '직원이 빠르게 설명해서 잘 모르겠어요. 알맞은 행동일까요?',
    transfer: { show: ['pretend-understood', 'ask-repeat-at-stop', 'agree-with-all-directions'], right: ['ask-repeat-at-stop'] },
  },
  'm6-l10': {
    word: '일하는 사람',
    wordPic: p('worker'),
    sentence: '일하는 사람의 이야기를 들어요.',
    ask: 'AI는 이 직업을 한 가지 일로만 말했어요. 어떻게 알아볼까요?',
    first: { show: ['trust-job-stereotype', 'compare-real-worker', 'pick-job-by-tool'], right: ['compare-real-worker'] },
    situation: '마을 제빵사를 만나기 전이에요. 알맞은 준비일까요?',
    transfer: { show: ['repeat-ai-job-answer', 'prepare-next-interview', 'predict-job-disappears'], right: ['prepare-next-interview'] },
  },
  'm6-l11': {
    word: '거절해요',
    wordPic: p('refuse'),
    sentence: '개인정보 질문은 거절해요.',
    ask: 'AI가 자기소개에 학교와 연락처를 넣었어요. 어떻게 할까요?',
    first: { show: ['copy-ai-introduction', 'audience-safe-intro', 'share-same-everywhere'], right: ['audience-safe-intro'] },
    situation: '처음 만난 게임 친구가 학교를 물어봐요. 알맞은 행동일까요?',
    transfer: { show: ['share-school-location', 'safe-game-intro', 'let-ai-send-profile'], right: ['safe-game-intro'] },
  },
  'm6-l12': {
    word: '확인해요',
    wordPic: p('check_answer'),
    sentence: '돈·이동·날씨는 확인해요.',
    scene: 1,
    ask: 'AI가 알려 준 버스 방향이 오늘 공지와 달라요. 어떻게 할까요?',
    first: {
      cards: [
        { id: 'check-notice', label: '확인해요', pic: p('check_answer'), right: true, say: 'AI가 알려 준 버스 방향을 오늘 공지와 확인해요.' },
        { id: 'asis', label: '그대로 쓰기', pic: p('use_as_is'), say: 'AI가 말한 방향으로 확인 없이 그대로 가요.' },
        { id: 'follow-crowd', label: '사람 따라가요', pic: e('👥'), say: '사람이 많은 쪽을 따라가요.' },
      ],
    },
    situation: '나의 AI 생활 원칙을 정해요. 마음에 드는 원칙은 무엇일까요?',
    transfer: { show: ['verify-life-info', 'human-first-safety', 'own-choice-and-boundary'] },
  },
};
