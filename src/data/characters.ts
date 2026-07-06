/**
 * AI 동아리 캐릭터 — 사용자 제공 캐릭터 시트 기준.
 * 시각 표현은 components/CharacterAvatar.tsx 한 곳에서만 렌더한다
 * (추후 실제 일러스트로 교체 시 그 파일만 수정).
 */

export type CharacterId = 'jinwoo' | 'yoona' | 'minjun' | 'aimi';

export interface CharacterMeta {
  id: CharacterId;
  name: string;      // 전체 이름
  shortName: string; // 말풍선 이름표용
  role: string;      // 학생에게 보여줄 역할 설명
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  jinwoo: {
    id: 'jinwoo',
    name: '강진우',
    shortName: '진우',
    role: '동아리 친구',
  },
  yoona: {
    id: 'yoona',
    name: '서윤아',
    shortName: '윤아',
    role: '동아리 친구',
  },
  minjun: {
    id: 'minjun',
    name: '박민준 선생님',
    shortName: '민준쌤',
    role: '동아리 선생님',
  },
  aimi: {
    id: 'aimi',
    name: '아이미',
    shortName: '아이미',
    role: 'AI 로봇 친구',
  },
};
