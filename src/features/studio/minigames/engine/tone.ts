/**
 * 면 색을 글자 색으로 바꾼다.
 *
 * 레퍼런스 팔레트에서 판의 빨강·파랑은 면 전용이다(판 위 대비 3.45·3.35). 칸의 색을 데이터
 * 한 필드(`color`)로 들고 다니는 게임은 그 값을 면에도 글자에도 쓰는데, 글자로 쓰면 읽히지
 * 않는다. 글자 자리에서만 이 함수로 감싸 밝은 글자 색으로 바꾼다.
 */
const INK_OF: Record<string, string> = {
  'var(--game-board-blue)': 'var(--game-board-blue-ink)',
  'var(--game-board-red)': 'var(--game-board-red-ink)',
};

export function inkFor(color: string): string {
  return INK_OF[color] ?? color;
}
