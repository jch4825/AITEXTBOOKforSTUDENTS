// 2022 개정 교육과정 성취기준 lookup 유틸
// curriculumStandards.json (611개 표준) 에서 코드로 조회
// JSON은 최초 사용 시 동적 로드(지연 로딩)되어 초기 번들에서 제외됩니다.

export interface AchievementLevel {
  description: string;
  evaluationCriteria: string;
  formativeAssessment: string[];
  summativeAssessment: string[];
}

export interface CurriculumStandard {
  code: string;
  gradeGroup: string;
  subject: string;
  domain: string;
  title: string;
  coreIdea?: string;
  contentElements?: string;
  achievementLevels: {
    A: AchievementLevel;
    B: AchievementLevel;
    C: AchievementLevel;
  };
}

let INDEX: Map<string, CurriculumStandard> | null = null;
let loadPromise: Promise<void> | null = null;

export function initCurriculum(): Promise<void> {
  if (INDEX !== null) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = import('../data/curriculumStandards.json')
    .then(mod => {
      const standards = (mod.default as { standards: CurriculumStandard[] }).standards;
      INDEX = new Map<string, CurriculumStandard>();
      for (const s of standards) {
        INDEX.set(normalizeCode(s.code), s);
      }
    })
    .catch(err => {
      // 로드 실패한 promise를 캐시에 남기면 영구 실패가 된다. 비워서 다음 호출이 재시도하게 한다.
      loadPromise = null;
      throw err;
    });
  return loadPromise;
}

/**
 * 사용자 입력 코드를 정규화한다.
 * 예: " [6수01-07] " → "[6수01-07]"
 *     "6수01-07"     → "[6수01-07]"
 *     "6수01—07"     → "[6수01-07]"  (em dash → hyphen)
 */
export function normalizeCode(input: string): string {
  if (!input) return '';
  let s = input.trim().replace(/[‒–—―−]/g, '-'); // 다양한 dash → 표준 hyphen
  s = s.replace(/\s+/g, '');
  // 이미 [ ]로 감싸졌으면 그대로, 아니면 추가
  if (!s.startsWith('[')) s = '[' + s;
  if (!s.endsWith(']')) s = s + ']';
  return s;
}

/**
 * 코드(예: '[6수01-07]')로 성취기준 조회. 못 찾으면 null.
 */
export function lookupStandard(input: string): CurriculumStandard | null {
  if (!input || !INDEX) return null;
  return INDEX.get(normalizeCode(input)) || null;
}

/**
 * Gemini 시스템 프롬프트에 주입할 형식으로 변환.
 */
export function formatStandardForPrompt(s: CurriculumStandard): string {
  return [
    `[2022 개정 교육과정 공식 성취기준 — 자동 조회됨]`,
    `- 코드: ${s.code}`,
    `- 학년군: ${s.gradeGroup}학년 / 교과: ${s.subject} / 영역: ${s.domain}`,
    `- 성취기준 전문: "${s.title}"`,
    s.contentElements ? `- 내용 요소: ${s.contentElements.replace(/\n/g, ', ')}` : '',
    ``,
    `[수준별 평가 기준 — 루브릭 작성 시 반드시 이 공식 기준에 맞춰 상·중·하를 작성한다]`,
    `▣ A 수준 (상): ${s.achievementLevels.A.description}`,
    `   - 평가 관점: ${s.achievementLevels.A.evaluationCriteria}`,
    `   - 형성 평가 도구: ${s.achievementLevels.A.formativeAssessment.join(', ')}`,
    `   - 총괄 평가 도구: ${s.achievementLevels.A.summativeAssessment.join(', ')}`,
    `▣ B 수준 (중): ${s.achievementLevels.B.description}`,
    `   - 평가 관점: ${s.achievementLevels.B.evaluationCriteria}`,
    `▣ C 수준 (하): ${s.achievementLevels.C.description}`,
    `   - 평가 관점: ${s.achievementLevels.C.evaluationCriteria}`,
  ].filter(Boolean).join('\n');
}

/**
 * 라이브 미리보기용 짧은 요약. 입력란 아래에 노출.
 */
export function getStandardPreview(input: string): { found: true; standard: CurriculumStandard } | { found: false; reason: 'empty' | 'invalid' } {
  if (!input || !input.trim()) return { found: false, reason: 'empty' };
  const found = lookupStandard(input);
  if (!found) return { found: false, reason: 'invalid' };
  return { found: true, standard: found };
}
