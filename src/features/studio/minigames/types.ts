import type { SupportLevel } from '../types';

/**
 * 미니게임 공통 타입.
 *
 * 게임성 판정 5원칙(조작·시뮬레이션·다중 해·비텍스트 피드백·재시도)을 만족하는
 * 컴포넌트만 registry에 등록한다. "선택지 N개 중 택1 + 정답 표시"는 미니게임이 아니라
 * 문제 풀이이므로 스튜디오 본문(P02·P05)에서 다루고 이 슬롯에는 넣지 않는다.
 */

/** 게임 진행 상태. running은 시뮬레이션 재생 중이라 조작을 막는 구간. */
export type MiniGameStatus = 'playing' | 'running' | 'success' | 'fail';

/** 난이도 스테이지 탭 하나. label은 학생에게 그대로 보이는 짧은 이름. */
export interface MiniGameStageTab {
  id: string;
  label: string;
}

/** registry가 모든 미니게임에 넘겨주는 props. 게임은 이 외의 외부 상태에 의존하지 않는다. */
export interface MiniGameProps {
  supportLevel: SupportLevel;
}
