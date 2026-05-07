import { ModuleVisibility, Persona } from '../types';

export const moduleVisibility: Record<Persona, Record<string, ModuleVisibility>> = {
  novice: {
    m0: 'recommended',
    m1: 'visible',
    m2: 'visible',
    m3: 'visible',
    m4: 'visible',
    m5: 'visible',
  },
  newbie: {
    m0: 'hidden',
    m1: 'recommended',
    m2: 'visible',
    m3: 'visible',
    m4: 'visible',
    m5: 'visible',
  },
  lead: {
    m0: 'hidden',
    m1: 'visible',
    m2: 'recommended',
    m3: 'recommended',
    m4: 'recommended',
    m5: 'recommended',
  },
  expert: {
    m0: 'hidden',
    m1: 'collapsed',
    m2: 'visible',
    m3: 'visible',
    m4: 'visible',
    m5: 'recommended',
  },
};

export function getModuleVisibility(persona: Persona | null, moduleId: string): ModuleVisibility {
  if (!persona) return moduleId === 'm0' ? 'hidden' : 'visible';
  return moduleVisibility[persona][moduleId] ?? 'visible';
}

