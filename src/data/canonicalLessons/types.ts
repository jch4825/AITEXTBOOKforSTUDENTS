import type { LessonId, ModuleId } from '../../types';

export type CharacterId = 'jinwoo' | 'yuna' | 'minjun' | 'aimi' | string;
export type SupportLevel = 'full' | 'light' | 'challenge' | 'easy' | 'normal' | 'hard';

export type CanonicalLessonRole = 'flagship' | 'guided' | 'project';
export type CanonicalPhase =
  | 'encounter'
  | 'first-attempt'
  | 'concept'
  | 'condition-change'
  | 'compare'
  | 'decision'
  | 'artifact'
  | 'transfer'
  | 'complete';

export type CanonicalActivityKind =
  | 'single-choice'
  | 'multi-choice'
  | 'sort'
  | 'sequence'
  | 'compare'
  | 'annotate'
  | 'adjust'
  | 'calculate'
  | 'build'
  | 'expression'
  | 'ai-compare';

export interface BaseActivity {
  id: string;
  kind: CanonicalActivityKind;
  prompt: string;
  evidenceIds?: string[];
}

export interface ChoiceItem {
  id: string;
  label: string;
  emoji?: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface SingleChoiceActivity extends BaseActivity {
  kind: 'single-choice';
  choices: ChoiceItem[];
}

export interface MultiChoiceActivity extends BaseActivity {
  kind: 'multi-choice';
  choices: ChoiceItem[];
}

export interface SortBin {
  id: string;
  label: string;
  emoji?: string;
}

export interface SortCard {
  id: string;
  label: string;
  binId: string;
  emoji?: string;
  image?: string;
}

export interface SortActivity extends BaseActivity {
  kind: 'sort';
  bins: SortBin[];
  cards: SortCard[];
}

export interface SequenceItem {
  id: string;
  label: string;
  correctOrder: number;
  emoji?: string;
}

export interface SequenceActivity extends BaseActivity {
  kind: 'sequence';
  items: SequenceItem[];
}

export interface CompareActivity extends BaseActivity {
  kind: 'compare';
  left: { title: string; content: string; image?: string };
  right: { title: string; content: string; image?: string };
  criteria: { id: string; label: string; leftMatch?: boolean; rightMatch?: boolean }[];
}

export interface AnnotateMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  kind?: 'fact' | 'guess' | 'error' | 'check';
}

export interface AnnotateActivity extends BaseActivity {
  kind: 'annotate';
  targetId: string;
  targetImage?: string;
  markers: AnnotateMarker[];
}

export interface AdjustControl {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  options?: { value: string | number; label: string }[];
}

export interface AdjustState {
  conditions: Record<string, any>;
  resultText: string;
  resultImage?: string;
  confidence?: number;
}

export interface AdjustActivity extends BaseActivity {
  kind: 'adjust';
  controls: AdjustControl[];
  states: AdjustState[];
}

export interface CalculateActivity extends BaseActivity {
  kind: 'calculate';
  values: number[];
  operation: '+' | '-' | '*' | '/';
  unit?: string;
  expectedResult?: number;
  aiProposedResult?: number;
}

export interface BuildSlot {
  id: string;
  label: string;
}

export interface BuildPiece {
  id: string;
  label: string;
  slotId: string;
  quality?: 'good' | 'weak';
}

export interface BuildActivity extends BaseActivity {
  kind: 'build';
  slots: BuildSlot[];
  pieces: BuildPiece[];
}

export interface ExpressionActivity extends BaseActivity {
  kind: 'expression';
  modes: ('choice' | 'text' | 'speech' | 'draw' | 'aac')[];
  choiceCards?: { id: string; label: string; emoji?: string }[];
}

export interface AiCompareActivity extends BaseActivity {
  kind: 'ai-compare';
  source: { title: string; text: string };
  response: { title: string; text: string; isPrepared?: boolean };
  criteria: { id: string; label: string }[];
  decisions: ('accept' | 'modify' | 'reject')[];
}

export type CanonicalActivity =
  | SingleChoiceActivity
  | MultiChoiceActivity
  | SortActivity
  | SequenceActivity
  | CompareActivity
  | AnnotateActivity
  | AdjustActivity
  | CalculateActivity
  | BuildActivity
  | ExpressionActivity
  | AiCompareActivity;

export interface CanonicalScenario {
  characters: CharacterId[];
  location: string;
  purpose: string;
  mismatch: string;
  evidence: string[];
  conditionChange?: string;
  resolution: string;
}

export interface CanonicalAssetSpec {
  id: string;
  kind: 'story' | 'evidence' | 'concept' | 'artifact';
  renderAs: 'image' | 'html' | 'audio';
  src?: string;
  alt: string;
  purpose: string;
  required: boolean;
}

export interface SupportAdjustment {
  hint?: string;
  visibleEvidenceIds?: string[];
  choiceLimit?: number;
  reasonCards?: { id: string; label: string }[];
  extraEvidenceIds?: string[];
}

export interface CanonicalStage {
  id: string;
  phase: CanonicalPhase;
  title: string;
  instruction: string;
  activity: CanonicalActivity;
  assetIds: string[];
  support: Partial<Record<SupportLevel, SupportAdjustment>>;
}

export interface LessonArtifactField {
  id: string;
  label: string;
  input: 'choice' | 'text' | 'speech' | 'draw' | 'computed';
  sourceStageId?: string;
  required: boolean;
}

export interface LessonArtifact {
  id: string;
  title: string;
  portfolioLabel: string;
  fields: LessonArtifactField[];
}

export interface TransferTask {
  title: string;
  scenario: string;
  activity: CanonicalActivity;
}

export interface CanonicalLessonDesign {
  lessonId: LessonId;
  moduleId: ModuleId;
  number: number;
  role: CanonicalLessonRole;
  title: string;
  masterObjective: string;
  standards?: string[];
  coreConcepts: [string, ...string[]];
  canonicalScenario: CanonicalScenario;
  stages: CanonicalStage[];
  artifact: LessonArtifact;
  transfer: TransferTask;
  assets: CanonicalAssetSpec[];
  wrapUp: string;
}
