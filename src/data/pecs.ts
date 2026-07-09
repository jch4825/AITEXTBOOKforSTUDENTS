import type { ModuleId } from '../types';

// name = public/lessons/pecs/{name}.webp 의 basename
export const PECS_LABELS: Record<string, string> = {
  toilet: '화장실', faucet: '물', paper_cup: '컵', snack: '간식',
  smartphone: '스마트폰', ai_speaker: '음성비서', ai_aimi: '아이미', refrigerator: '냉장고',
  cat: '고양이', rabbit: '토끼', elephant: '코끼리', dinosaur: '공룡', turtle: '거북이',
  book: '책', pencil: '연필', eraser: '지우개', apple: '사과', bread: '빵', milk: '우유',
  cheese: '치즈', ham: '햄', chocolate: '초콜릿', ramen: '라면', pot: '냄비', toaster: '토스터',
  knife: '칼', lettuce: '상추', bus: '버스', umbrella: '우산', cloud: '구름', clothes: '옷',
  sunglasses: '선글라스', soccer_ball: '축구공', key: '열쇠', light_switch: '전등 스위치',
  cheetah: '치타', eagle: '독수리', fan: '선풍기', hand_fan: '부채', tube: '튜브',
};

// 기본 의사소통 욕구 — 모든 모듈에서 항상 노출
export const PECS_COMMON: string[] = ['toilet', 'faucet', 'paper_cup', 'snack'];

// 모듈별 관련 단어 (초안 — 교사 피드백으로 조정)
export const PECS_BY_MODULE: Record<ModuleId, string[]> = {
  m1: ['smartphone', 'ai_speaker', 'ai_aimi', 'refrigerator', 'cat', 'rabbit', 'elephant', 'dinosaur'],
  m2: ['ai_aimi', 'smartphone', 'book', 'pencil', 'sunglasses'],
  m3: ['book', 'pencil', 'eraser', 'apple', 'cat', 'dinosaur', 'ai_aimi'],
  m4: ['smartphone', 'key', 'light_switch', 'book'],
  m5: ['ramen', 'pot', 'toaster', 'bread', 'knife', 'lettuce', 'cheese', 'ham', 'soccer_ball'],
  m6: ['apple', 'bread', 'milk', 'cheese', 'ham', 'chocolate', 'bus', 'umbrella', 'cloud', 'clothes', 'sunglasses', 'refrigerator', 'pot', 'book'],
};
