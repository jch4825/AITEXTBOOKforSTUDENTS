export type ViewType = 'home' | 'resources' | 'tools' | 'tutorial';

export type Persona = 'novice' | 'newbie' | 'lead' | 'expert';
export type DiagnosticPurpose = 'class' | 'admin' | 'share' | 'ethics' | 'explore';
export type ModuleVisibility = 'recommended' | 'visible' | 'collapsed' | 'hidden';

export interface DiagnosticAnswers {
  q1?: DiagnosticPurpose;
  q2?: 0 | 1 | 3;
  q3?: 0 | 1 | 3 | 4;
  q4?: 0 | 1 | 2;
  q5?: 0 | 1 | 2;
  q6?: -1 | 0 | 1;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  estimatedTime: string;
  order: number;
}
