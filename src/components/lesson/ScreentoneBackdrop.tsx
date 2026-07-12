import type { CSSProperties, ReactNode } from 'react';
import type { ModuleId } from '../../types';
import { themeFor } from '../../utils/moduleThemes';

interface Props {
  moduleId: ModuleId;
  children: ReactNode;
}

export default function ScreentoneBackdrop({ moduleId, children }: Props) {
  const theme = themeFor(moduleId);
  const accent = theme?.accent ?? '#5A7DA0';

  // 6 modules' low-contrast CSS screentone patterns using 8% to 14% of the accent color mixed with transparent
  const getPatternStyle = (modId: ModuleId) => {
    const color = `color-mix(in srgb, ${accent} 10%, transparent)`;
    switch (modId) {
      case 'm1': // Dots
        return {
          backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
          backgroundSize: '16px 16px',
        };
      case 'm2': // Grid
        return {
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'm3': // Diagonal stripes
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color}, ${color} 1px, transparent 1px, transparent 10px)`,
        };
      case 'm4': // Checkerboard/Cross dots
        return {
          backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px), radial-gradient(${color} 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        };
      case 'm5': // Diagonal waves / thin stripes
        return {
          backgroundImage: `repeating-linear-gradient(-45deg, ${color}, ${color} 1.5px, transparent 1.5px, transparent 8px)`,
        };
      case 'm6': // Double grid
        return {
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
        };
      default:
        return {
          backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
          backgroundSize: '16px 16px',
        };
    }
  };

  const patternStyle = getPatternStyle(moduleId);

  return (
    <div
      className="w-full h-full min-h-screen bg-[color:var(--paper-2)] relative overflow-x-hidden"
      style={{ ...patternStyle, '--accent': accent } as CSSProperties}
    >
      {/* 옅은 비네트 효과 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 60%, color-mix(in srgb, ${accent} 4%, transparent) 100%)`
        }}
      />
      <div className="relative z-10 w-full h-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
