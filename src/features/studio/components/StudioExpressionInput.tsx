import { useMemo } from 'react';
import ExpressionInput from '../../../components/mission/blocks/ExpressionInput';
import { getChoiceCardSet } from '../../../data/choiceCards';
import type { ExpressionMode, StudioChoice, StudioExpression } from '../types';

interface Props {
  value?: StudioExpression;
  choices: StudioChoice[];
  modes: ExpressionMode[];
  prompt: string;
  accent: string;
  onChange: (value: StudioExpression) => void;
  /** 읽기 지원 단원이면 선택지마다 듣기 단추를 단다(data/readingSupport.ts). */
  readingSupport?: boolean;
  /** 이 선택지들이 속한 차시. 그림 카드가 있는 차시에서만 '그림 카드' 방식이 보인다(data/choiceCards/). */
  lessonId?: string;
}

export default function StudioExpressionInput({
  value,
  choices,
  modes,
  prompt,
  accent,
  onChange,
  readingSupport = false,
  lessonId,
}: Props) {
  // 카드는 읽기 지원 단원의 차시에만 있다. 카드가 없으면 '그림 카드' 탭을 걸러 낸다 —
  // 남겨 두면 문장 고르기와 같은 문장을 한 번 더 보여 주는 빈 탭이 된다.
  const cardSet = useMemo(() => (readingSupport ? getChoiceCardSet(lessonId) : undefined), [readingSupport, lessonId]);
  const availableModes = useMemo(() => (cardSet ? modes : modes.filter((mode) => mode !== 'aac')), [cardSet, modes]);
  return (
    <ExpressionInput
      value={value}
      choices={choices}
      expressionModes={availableModes}
      prompt={prompt}
      accent={accent}
      onChange={onChange}
      readingSupport={readingSupport}
      cardSet={cardSet}
    />
  );
}
