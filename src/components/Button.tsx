import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'choice';

interface Props {
  variant?: ButtonVariant;
  /** 핵심 학습 조작은 'lg' (64px) — 다음/보내기/시작 등 */
  size?: 'md' | 'lg';
  /** 모듈 테마색 — 없으면 브랜드 잉크(--accent) */
  accent?: string;
  /** 소형 텍스트 대비용 어두운 변형 (secondary 글자색) */
  accentText?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
  title?: string;
  'aria-label'?: string;
  children?: ReactNode;
}

/**
 * 버튼 4종 체계 (토큰 v2) — 스타일 정의는 index.css의 .btn-* 클래스가 단일 진실 원천.
 * 게임의 정답/오답 상태색(ok-bg/bad-bg)처럼 동적인 면색은 style prop으로 덧입힌다.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  accent,
  accentText,
  type = 'button',
  disabled,
  onClick,
  className = '',
  style,
  title,
  'aria-label': ariaLabel,
  children,
}: Props) {
  const themeVars = {
    ...(accent ? { '--btn-accent': accent } : {}),
    ...(accentText ? { '--btn-accent-text': accentText } : {}),
  } as CSSProperties;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`btn btn-${variant} ${size === 'lg' ? 'btn-lg' : ''} ${className}`}
      style={{ ...themeVars, ...style }}
    >
      {children}
    </button>
  );
}
