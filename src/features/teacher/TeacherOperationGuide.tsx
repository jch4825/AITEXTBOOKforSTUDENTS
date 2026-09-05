const MODULE_EXPERIENCES = [
  ['1단원', '생활 속 인공지능 찾기', '사진과 소리 알아보기', '인공지능에 맡길 일 판단'],
  ['2단원', '오해한 요청 고치기', '단계를 나누어 부탁하기', '답을 직접 확인하고 고치기'],
  ['3단원', '깊이 있게 질문하기', '함께 이야기 짓기', '사실과 생각 구별하기'],
  ['4단원', '그럴듯한 답변 확인하기', '사진과 개인정보 보호하기', '알맞은 정보와 광고 구별하기'],
  ['5단원', '문제 정확하게 찾기', '순서와 대안 정하기', '상황에 맞게 계획 바꾸기'],
  ['6단원', '알맞게 장보기', '교통 정보 확인하기', '나를 소개하기'],
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
            <li>생활 속 이야기에서 중요한 정보를 찾습니다.</li>
            <li>말·글·그림·AAC·선택으로 첫 생각을 표현합니다.</li>
            <li>시간·장소·사람·도구 중 바뀐 조건을 확인합니다.</li>
            <li>준비된 인공지능 예시의 다른 방법이나 확인 질문과 비교합니다.</li>
            <li>인공지능의 의견을 살펴보고 받아들이기·고치기·거절하기 중 하나를 골라 최종 결정을 남깁니다.</li>
            <li>행동 카드·수정 카드·시각 계획을 만들고 새 장면에 한 번 더 적용합니다.</li>
          </ol>
          <p className="studio-margin-note mt-3">선택을 바꾸지 않았더라도 중요한 정보를 살피고 그럴 만한 이유를 밝혔다면 잘 배운 것으로 봅니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">설명 차시의 구성</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <article className="studio-fact-card"><strong>1. 개념 만나기</strong><p className="mt-1">쉬운 설명과 예시로 오늘 쓸 개념을 짧게 확인합니다.</p></article>
            <article className="studio-fact-card"><strong>2. 도구 연습하기</strong><p className="mt-1">게임과 선택 활동으로 한 가지 기능을 반복합니다.</p></article>
          </div>
          <p className="studio-margin-note mt-3">지원 차시는 학습목표 뒤에 개념 설명과 활동을 바로 잇습니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">과정중심평가 관찰 기준</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>상황의 중요한 정보를 찾았는가</li>
            <li>자기 방법을 먼저 시도했는가</li>
            <li>인공지능 의견과 자기 생각을 비교하였는가</li>
            <li>조건이 달라졌을 때 방법을 조정하였는가</li>
          </ul>
          <p className="mt-2">항목마다 관찰 안 됨·지원하여 수행·독립 수행으로 적고, 정답률보다 얼마나 시도했고 어느 만큼 도왔는지를 함께 봅니다.</p>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">저장·보안·매체 원칙</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>과정 기록은 교사가 기록 기능을 켠 경우에만 같은 브라우저의 로컬 저장소에 남습니다.</li>
            <li>서버로 자동 전송하지 않으므로 다른 기기나 다른 브라우저와 자동 동기화되지 않습니다.</li>
            <li>학생 실명 대신 별칭을 사용하며 음성·사진·그림 원본과 전체 인공지능 대화는 저장하지 않습니다.</li>
            <li>필요하면 데이터 관리에서 암호화 백업을 만들고 기록 중지·초기화를, 학생 기록에서 개별 삭제를, 화면 위 ‘과정기록 삭제’ 버튼으로 과정기록·일반화 기록·진도를 한 번에 삭제할 수 있습니다.</li>
            <li>기본 이미지·소리·인공지능 의견은 준비된 예시라 권한 없이 진행할 수 있습니다. Gemini를 연결한 경우에만 학생이 선택한 실시간 질문·음성·사진이 Google 서버로 전송됩니다.</li>
            <li>음성 예시는 학생이 소리 듣기 버튼을 누를 때만 재생됩니다.</li>
          </ul>
        </section>
      </div>
    </details>
  );
}
