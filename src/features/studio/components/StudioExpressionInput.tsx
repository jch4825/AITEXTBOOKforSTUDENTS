import ExpressionInput from '../../../components/mission/blocks/ExpressionInput';
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
}

export default function StudioExpressionInput({
  value,
  choices,
  modes,
  prompt,
  accent,
  onChange,
  readingSupport = false,
}: Props) {
  return (
    <ExpressionInput
      value={value}
      choices={choices}
      expressionModes={modes}
      prompt={prompt}
      accent={accent}
      onChange={onChange}
      readingSupport={readingSupport}
    />
  );
}
