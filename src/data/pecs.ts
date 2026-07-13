import type { ModuleId } from '../types';

// name = public/lessons/pecs/{name}.webp 의 basename
// 라벨은 카드 이미지 안에 인쇄된 글자와 반드시 일치시킨다(싱크). 이미지 확인 후 맞춤.
export const PECS_LABELS: Record<string, string> = {
  toilet: '화장실', faucet: '수도꼭지', paper_cup: '종이컵', snack: '과자',
  smartphone: '핸드폰(스마트폰)', ai_speaker: 'AI 스피커', ai_aimi: '인공지능', refrigerator: '냉장고',
  cat: '고양이', rabbit: '토끼', elephant: '코끼리', dinosaur: '공룡', turtle: '거북이',
  book: '책', pencil: '연필', eraser: '지우개', apple: '사과', bread: '식빵', milk: '우유',
  cheese: '치즈', ham: '햄', chocolate: '초콜릿', ramen: '라면', pot: '냄비', toaster: '토스터',
  knife: '칼', lettuce: '상추', bus: '버스', umbrella: '우산', cloud: '구름', clothes: '옷',
  sunglasses: '선글라스', soccer_ball: '축구공', key: '열쇠', light_switch: '전등 스위치',
  cheetah: '치타', eagle: '독수리', fan: '선풍기', hand_fan: '부채', tube: '튜브',
  alarm_clock: '알람시계', window: '창문', bow_greeting: '인사하기', medicine: '약',
  cooking: '요리하기', job_chef: '요리사', job_driver: '운전기사', job_librarian: '사서',
  job_farmer: '농부', job_baker: '제빵사', job_firefighter: '소방관', job_vet: '수의사',
  job_painter: '화가',
};

// 기본 의사소통 욕구 — 모든 모듈에서 항상 노출
export const PECS_COMMON: string[] = ['toilet', 'faucet', 'paper_cup', 'snack'];

// 모듈별 관련 단어 (초안 — 교사 피드백으로 조정)
export const PECS_BY_MODULE: Record<ModuleId, string[]> = {
  m1: ['smartphone', 'ai_speaker', 'ai_aimi', 'refrigerator', 'cat', 'rabbit', 'elephant', 'dinosaur', 'alarm_clock', 'window'],
  m2: ['ai_aimi', 'smartphone', 'book', 'pencil', 'sunglasses'],
  m3: ['book', 'pencil', 'eraser', 'apple', 'cat', 'dinosaur', 'ai_aimi'],
  m4: ['smartphone', 'key', 'light_switch', 'book', 'bow_greeting'],
  m5: ['ramen', 'pot', 'toaster', 'bread', 'knife', 'lettuce', 'cheese', 'ham', 'soccer_ball', 'cooking'],
  m6: [
    'apple', 'bread', 'milk', 'cheese', 'ham', 'chocolate', 'bus', 'umbrella', 'cloud',
    'clothes', 'sunglasses', 'refrigerator', 'pot', 'book', 'bow_greeting', 'medicine',
    'cooking', 'job_chef', 'job_driver', 'job_librarian', 'job_farmer', 'job_baker',
    'job_firefighter', 'job_vet', 'job_painter',
  ],
};
