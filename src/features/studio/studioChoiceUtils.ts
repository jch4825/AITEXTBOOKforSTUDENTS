import type { StudioChoice } from './types';

/**
 * Safely scopes choice options according to support profile choiceLimit (2 for full, 3 for light, 4 for challenge)
 * while strictly guaranteeing that at least one correct choice (isCorrect === true) is ALWAYS included in the sliced choices.
 */
export function getScopedChoices(choices: StudioChoice[] = [], limit?: number): StudioChoice[] {
  if (!choices || choices.length === 0) return [];
  if (!limit || choices.length <= limit) return choices;

  const sliced = choices.slice(0, limit);
  const hasCorrectInSlice = sliced.some((c) => c.isCorrect === true);

  if (hasCorrectInSlice) {
    return sliced;
  }

  // If the correct choice is located beyond the slice limit, swap it in
  const correctChoice = choices.find((c) => c.isCorrect === true);
  if (!correctChoice) {
    return sliced;
  }

  const incorrectChoices = choices.filter((c) => c.isCorrect !== true);
  return [correctChoice, ...incorrectChoices.slice(0, limit - 1)];
}
