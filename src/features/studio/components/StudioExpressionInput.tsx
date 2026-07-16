import ExpressionInput from '../../../components/mission/blocks/ExpressionInput';
import type { ExpressionMode, StudioChoice, StudioExpression } from '../types';

interface Props {
  value?: StudioExpression;
  choices: StudioChoice[];
  modes: ExpressionMode[];
  prompt: string;
  accent: string;
  onChange: (value: StudioExpression) => void;
}

export default function StudioExpressionInput({
  value,
  choices,
  modes,
  prompt,
  accent,
  onChange,
}: Props) {
  return (
    <ExpressionInput
      value={value}
      choices={choices}
      expressionModes={modes}
      prompt={prompt}
      accent={accent}
      onChange={onChange}
    />
  );
}
