import React from 'react';
import Icon from './Icon';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 차시 한 단계(게임·활동)에서 렌더 오류가 나도 앱 전체가 백지가 되지 않도록
 * 막아주는 에러 바운더리. 오류가 난 단계만 안내 문구로 대체하고, 사이드바·
 * 상단바·"다음" 버튼 등 나머지는 그대로 살아 있게 한다.
 *
 * 단계 이동 시 상위 LessonView가 `key`(단계 번호)로 remount 시켜 상태를 초기화한다.
 */
export default class StepErrorBoundary extends React.Component<Props, State> {
  // 이 저장소는 @types/react가 없어 base Component가 props/state 타입을 제공하지 않는다.
  // 명시적으로 선언해 tsc를 통과시킨다.
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // 개발 중 진단용 — 학생 화면에는 아래 안내 문구만 보인다.
    console.error('[StepErrorBoundary] 단계 렌더 중 오류:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto">
          <div
            className="card p-6 text-center flex flex-col items-center gap-3"
            style={{ color: 'var(--muted)' }}
          >
            <Icon name="bulb" size={36} color="var(--warn)" />
            <p className="text-lg font-semibold" style={{ color: 'var(--fg)' }}>
              이 활동을 여는 데 문제가 생겼어요.
            </p>
            <p>아래 <b>다음</b> 버튼을 눌러 계속 진행할 수 있어요.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
