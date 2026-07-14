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
  job_painter: '화가', blind_trust: '무조건 믿어요', tell_friend: '친구한테 자랑해요',
  tap_screen: '화면 두드리기', unclear_speech: '잘 못 말해요', vague_request: '애매하게 물어요',
  ask_again: '다시 물어봐요', easy_explain: '쉽게 설명해요', short_question: '짧게 물어봐요',
  example_request: '예시를 보여줘요', role_setting: '역할을 정해요', split_steps: '작게 나눠요',
  word_meaning: '뜻을 물어봐요', hard_explanation: '어려운 설명', opposite_word: '반대말',
  ask_more: '더 물어봐요', dont_tell_private: '말하면 안 돼요', safe_to_tell: '말해도 괜찮아요',
  rude_words: '나쁜 말', polite_request: '부탁해요', unsafe_roof: '위험한 곳',
  secret_screen: '몰래 계속 봐요', sad_alone: '혼자 힘들어요', stranger_car: '모르는 차',
  wash_face: '세수해요', pack_bag: '가방 챙겨요', wear_shoes: '신발 신어요',
  turn_off_stove: '불을 꺼요', notice_problem: '문제를 봐요', stuck_problem: '막혔어요',
  mistake_retry: '다시 해요', different_way: '다른 방법', pull_action: '당겨요',
  push_hard: '세게 밀어요', tape_fix: '테이프로 붙여요', borrow_friend: '친구에게 빌려요',
  money_coins: '돈 계산', warm_clothes: '두꺼운 옷', cool_clothes: '시원한 옷',
  enter_store: '가게에 들어가요', do_nothing: '아무것도 안 해요', give_up: '포기해요',
  random_choice: '아무거나 골라요', long_time: '오래 걸려요',
};

// 기본 의사소통 욕구 — 모든 모듈에서 항상 노출
export const PECS_COMMON: string[] = ['toilet', 'faucet', 'paper_cup', 'snack'];

// 모듈별 관련 단어 (초안 — 교사 피드백으로 조정)
export const PECS_BY_MODULE: Record<ModuleId, string[]> = {
  m1: ['smartphone', 'ai_speaker', 'ai_aimi', 'refrigerator', 'cat', 'rabbit', 'elephant', 'dinosaur', 'alarm_clock', 'window', 'tap_screen'],
  m2: [
    'ai_aimi', 'smartphone', 'book', 'pencil', 'sunglasses', 'unclear_speech',
    'vague_request', 'ask_again', 'easy_explain', 'short_question', 'example_request',
    'role_setting', 'split_steps', 'bow_greeting',
  ],
  m3: [
    'book', 'pencil', 'eraser', 'apple', 'cat', 'dinosaur', 'ai_aimi', 'unclear_speech',
    'easy_explain', 'word_meaning', 'hard_explanation', 'opposite_word', 'ask_more',
    'money_coins', 'do_nothing', 'give_up', 'blind_trust',
  ],
  m4: [
    'smartphone', 'key', 'light_switch', 'book', 'bow_greeting', 'blind_trust',
    'tell_friend', 'ask_again', 'dont_tell_private', 'safe_to_tell', 'rude_words',
    'polite_request', 'unsafe_roof', 'secret_screen', 'sad_alone', 'stranger_car',
  ],
  m5: [
    'ramen', 'pot', 'toaster', 'bread', 'knife', 'lettuce', 'cheese', 'ham',
    'soccer_ball', 'cooking', 'split_steps', 'wash_face', 'pack_bag', 'wear_shoes',
    'turn_off_stove', 'notice_problem', 'stuck_problem', 'mistake_retry',
    'different_way', 'pull_action', 'push_hard', 'tape_fix', 'borrow_friend',
    'do_nothing', 'give_up',
  ],
  m6: [
    'apple', 'bread', 'milk', 'cheese', 'ham', 'chocolate', 'bus', 'umbrella', 'cloud',
    'clothes', 'sunglasses', 'refrigerator', 'pot', 'book', 'bow_greeting', 'medicine',
    'cooking', 'job_chef', 'job_driver', 'job_librarian', 'job_farmer', 'job_baker',
    'job_firefighter', 'job_vet', 'job_painter', 'grocery_shopping', 'money_coins',
    'random_choice', 'long_time', 'stranger_car', 'warm_clothes', 'cool_clothes',
    'enter_store', 'polite_request', 'rude_words', 'safe_to_tell', 'wear_shoes',
  ],
};
