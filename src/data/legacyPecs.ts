import { PECS_LABELS } from './pecs';

/**
 * 옛 그림 카드 — `public/lessons/pecs/{id}.webp`(단원 폴더 밖에 있는 127장).
 * 낱말이 그림에 인쇄돼 있고, 교사 도구가 쓴다(활동 아이콘 ActivityIcon은 옛 단계형 렌더러와 함께 지웠다).
 * 학습지 편집기의 그림 고르기에서 단원 그림 카드 판과 함께 고를 수 있게 이름을 모아 둔다.
 * 새 그림 카드는 단원 폴더(`PECS_BY_MODULE`)에 더하고, 여기는 늘리지 않는다.
 */
export const LEGACY_PECS_IDS: readonly string[] = [
  'ai_aimi', 'ai_speaker', 'aircon', 'alarm_clock', 'angry_face', 'apple', 'ask_again', 'ask_more',
  'automatic_door', 'blind_trust', 'book', 'borrow_friend', 'bow_greeting', 'bread', 'bus', 'camera',
  'cat', 'chatbot', 'cheese', 'cheetah', 'chocolate', 'clothes', 'cloud', 'cooking',
  'cool_clothes', 'different_way', 'dinosaur', 'do_nothing', 'dog', 'dont_tell_private', 'drawing', 'eagle',
  'easy_explain', 'electric_fan', 'elephant', 'enter_store', 'eraser', 'example_request', 'fan', 'faucet',
  'flower', 'give_up', 'grocery_shopping', 'ham', 'hand_fan', 'hard_explanation', 'homework', 'jeyuk_bokkeum',
  'job_baker', 'job_chef', 'job_driver', 'job_farmer', 'job_firefighter', 'job_librarian', 'job_painter', 'job_vet',
  'key', 'knife', 'lettuce', 'library_kiosk', 'light_switch', 'long_time', 'map_app', 'meal',
  'medicine', 'milk', 'mistake_retry', 'miyeokguk', 'money_coins', 'music', 'music_app', 'notice_problem',
  'opposite_word', 'pack_bag', 'paper_cup', 'pencil', 'personal_info', 'play', 'polite_request', 'pot',
  'pull_action', 'push_hard', 'rabbit', 'rain', 'ramen', 'random_choice', 'refrigerator', 'robot_vacuum',
  'role_setting', 'rude_words', 'sad_alone', 'safe_to_tell', 'school_lunch', 'secret_screen', 'selfie', 'short_question',
  'sleep', 'smart_light', 'smartphone', 'snack', 'soccer_ball', 'split_steps', 'stranger', 'stranger_car',
  'stuck_problem', 'sunglasses', 'tap_screen', 'tape_fix', 'tell_adult', 'tell_friend', 'tidy_room', 'toaster',
  'toilet', 'translate', 'tube', 'turn_off_stove', 'turtle', 'umbrella', 'unclear_speech', 'unsafe_roof',
  'vague_request', 'warm_clothes', 'wash_face', 'wear_shoes', 'weather', 'window', 'word_meaning',
];

/** `PECS_LABELS`에 없는 옛 카드의 인쇄된 글자. */
const LEGACY_EXTRA_LABELS: Record<string, string> = {
  angry_face: '화난 표정',
  drawing: '그림 그리기',
  play: '놀기',
  rain: '비(우산)',
};

/** 옛 그림 카드에 인쇄된 낱말. */
export function legacyPecsLabel(id: string): string {
  return PECS_LABELS[id] ?? LEGACY_EXTRA_LABELS[id] ?? id;
}
