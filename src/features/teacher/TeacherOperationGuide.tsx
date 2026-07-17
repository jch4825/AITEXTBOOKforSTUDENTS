const MODULE_EXPERIENCES = [
  ['1단원', '생활 속 AI 찾기', 'AI의 눈과 귀', 'AI에게 맡길 일 판단'],
  ['2단원', '오해한 요청 고치기', '요청 공동 제작', 'AI 답 다시 고치기'],
  ['3단원', '질문 탐정', '이야기 공동창작', '이미지 설명 검토'],
  ['4단원', 'AI 답 검증', '사진 공유 안전', '광고 단서 찾기'],
  ['5단원', '모호한 문제 조정', '뜻을 분명히 말하기', '조건 변화에 계획 수정'],
  ['6단원', '장보기 판단', '교통 변수 대응', '안전한 자기소개'],
] as const;

export default function TeacherOperationGuide() {
  return (
    <details className="studio-editorial mt-6 p-6 md:p-8">
      <summary className="cursor-pointer text-xl font-extrabold">교사용 상세 운영 로직 보기</summary>
      <div className="mt-6 space-y-7 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-extrabold">단원별 세 핵심 경험</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-[color:var(--line-strong)]">
                  <th className="p-2">단원</th><th className="p-2">첫 경험</th><th className="p-2">중간 경험</th><th className="p-2">마지막 경험</th>
                </tr>
              </thead>
              <tbody>
                {MODULE_EXPERIENCES.map(([module, first, middle, last]) => (
                  <tr key={module} className="border-b border-[color:var(--line)]">
                    <th className="p-2 font-bold">{module}</th><td className="p-2">{first}</td><td className="p-2">{middle}</td><td className="p-2">{last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">핵심 경험 차시의 기록 순서</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>생활 장면에서 중요한 정보를 찾습니다.</li>
            <li>말·글·그림·AAC·선택으로 첫 생각을 표현합니다.</li>
            <li>시간·장소·사람·도구 중 바뀐 조건을 확인합니다.</li>
            <li>준비된 AI 예시의 다른 방법이나 확인 질문과 비교합니다.</li>
            <li>AI 의견을 수용·수정·거절하고 최종 판단을 남깁니다.</li>
            <li>행동 카드·수정 카드·시각 계획을 만들고 새 장면에 한 번 더 적용합니다.</li>
          </ol>
          <p className="studio-margin-note mt-3">선택을 바꾸지 않아도 중요한 정보를 살피고 타당한 이유를 표현했다면 성공적인 학습 과정으로 봅니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">설명 차시의 구성</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <article className="studio-fact-card"><strong>1. 개념 만나기</strong><p className="mt-1">기존 쉬운 설명과 예시로 오늘 사용할 개념을 짧게 확인합니다.</p></article>
            <article className="studio-fact-card"><strong>2. 도구 연습하기</strong><p className="mt-1">게임과 선택 활동으로 한 가지 기능을 반복합니다.</p></article>
          </div>
          <p className="studio-margin-note mt-3">지원 차시는 학습목표 뒤에 개념 설명과 활동을 바로 제시합니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">과정중심평가 관찰 기준</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>상황의 중요한 정보를 찾았는가</li>
            <li>자기 방법을 먼저 시도했는가</li>
            <li>AI 의견과 자기 생각을 비교했는가</li>
            <li>조건이 달라졌을 때 방법을 조정했는가</li>
          </ul>
          <p className="mt-2">각 항목은 관찰 안 됨·지원하여 수행·독립 수행으로 기록하고, 정답률보다 시도와 도움 수준을 함께 봅니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">저장·보안·매체 원칙</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>과정 기록은 교사가 기록 기능을 켠 경우에만 같은 브라우저의 로컬 저장소에 남습니다.</li>
            <li>서버로 자동 전송하지 않으므로 다른 기기나 다른 브라우저와 자동 동기화되지 않습니다.</li>
            <li>학생 실명 대신 별칭을 사용하며 음성·사진·그림 원본과 전체 AI 대화는 저장하지 않습니다.</li>
            <li>필요하면 데이터 관리에서 암호화 백업을 만들고, 기록 중지·개별 삭제·전체 삭제를 할 수 있습니다.</li>
            <li>이미지·소리·AI 응답은 준비된 AI 예시이며 카메라·마이크 권한 없이 진행할 수 있습니다.</li>
            <li>음성 예시는 학생이 소리 듣기 버튼을 누를 때만 재생됩니다.</li>
          </ul>
        </section>
      </div>
    </details>
  );
}
