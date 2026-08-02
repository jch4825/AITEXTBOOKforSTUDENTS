export interface AacCardAsset {
  id: string;
  label: string;
  imageSrc: string;
}

export const BODY_ZONE_AAC_CARDS: AacCardAsset[] = [
  { id: 'head', label: '머리', imageSrc: '/lessons/aac/body-head.webp' },
  { id: 'chest', label: '가슴', imageSrc: '/lessons/aac/body-chest.webp' },
  { id: 'belly', label: '배', imageSrc: '/lessons/aac/body-belly.webp' },
  { id: 'leg', label: '다리', imageSrc: '/lessons/aac/body-leg.webp' },
];

export const BODY_FEELING_AAC_CARDS: AacCardAsset[] = [
  { id: 'pain', label: '아파요', imageSrc: '/lessons/aac/feeling-pain.webp' },
  { id: 'dizzy', label: '어지러워요', imageSrc: '/lessons/aac/feeling-dizzy.webp' },
  { id: 'chest-tight', label: '답답해요', imageSrc: '/lessons/aac/feeling-chest-tight.webp' },
  { id: 'hot', label: '뜨거워요', imageSrc: '/lessons/aac/feeling-hot.webp' },
];

export const TRUSTED_ADULT_AAC_CARDS: AacCardAsset[] = [
  { id: 'teacher', label: '선생님', imageSrc: '/lessons/aac/trusted-teacher.webp' },
  { id: 'health-teacher', label: '보건 선생님', imageSrc: '/lessons/aac/trusted-health-teacher.webp' },
  { id: 'family', label: '가족', imageSrc: '/lessons/aac/trusted-family.webp' },
];

export const EXPRESSION_MESSAGE_AAC_CARDS: Record<string, AacCardAsset> = {
  help: { id: 'help', label: '도와주세요', imageSrc: '/lessons/aac/message-help.webp' },
  stop: { id: 'stop', label: '싫어요. 멈춰 주세요', imageSrc: '/lessons/aac/message-stop.webp' },
  again: { id: 'again', label: '다시 쉽게 말해 주세요', imageSrc: '/lessons/aac/message-repeat-simply.webp' },
};
