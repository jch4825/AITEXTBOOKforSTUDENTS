import type { VisualNovelStory } from '../../../features/studio/types';

export const M6_L1_VISUAL_STORY: VisualNovelStory = {
  title: '마트에서 무엇을 사야 합니까?',
  objective: 'AI에게 재료 목록을 짜 달라고 하고 확인해 보십시오.',
  scenes: [
    { id: 'plan-shopping', label: '장면 1 · 살 물건 생각하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l1-vn-01.webp', alt: '윤아가 마트에 가기 전 필요한 재료와 예산 그림 카드를 살펴보는 장면', knowledgeStep: 0, copy: {
      full: { text: '윤아는 샌드위치 재료를 사기 위해 목록을 만들려고 합니다.' },
      light: { text: '윤아는 집에서 샌드위치를 만들 계획입니다. 필요한 재료와 사용할 수 있는 돈을 생각하며 아이미에게 목록을 부탁합니다.', perspective: '목록을 부탁하기 전에는 무엇을 만들고 누구와 먹을지 정하면 좋습니다.' },
      challenge: { text: '윤아는 샌드위치 만들기라는 목적, 함께 먹을 사람, 예산, 집에 있는 재료를 확인합니다. 이 조건을 AI 요청에 담으려고 합니다.', perspective: 'AI 목록은 사용자의 목적과 조건에 따라 달라지므로 먼저 실제 상황을 정리해야 합니다.' },
    } },
    { id: 'receive-list', label: '장면 2 · AI 재료 목록 받기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l1-vn-02.webp', alt: '아이미가 빵과 채소와 치즈와 여러 간식 그림 목록을 보여 주고 윤아가 살펴보는 장면', knowledgeStep: 0, copy: {
      full: { text: '아이미는 샌드위치 재료와 여러 간식을 목록에 넣습니다.' },
      light: { text: '아이미는 빵, 채소, 치즈와 함께 여러 간식도 제안합니다. 윤아가 원하는 것과 꼭 필요한 것이 섞여 있습니다.', perspective: 'AI가 만든 목록도 그대로 사지 않고 실제 필요와 비교합니다.' },
      challenge: { text: '목록에는 핵심 재료, 선택 재료, 목적과 관계없는 추가 상품이 함께 있습니다. 가격과 집에 이미 있는 물건은 반영되지 않았습니다.', perspective: '생성된 목록은 초안이므로 항목의 필요성, 중복, 비용을 검토해야 합니다.' },
    } },
    { id: 'check-store', label: '장면 3 · 마트에서 확인하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l1-vn-03.webp', alt: '윤아가 마트에서 AI 목록과 장바구니와 예산 카드를 비교하는 장면', knowledgeStep: 1, copy: {
      full: { text: '윤아는 마트에서 목록, 가격, 집에 있는 재료를 확인합니다.' },
      light: { text: '윤아는 집에 치즈가 있다는 것을 떠올리고 목록에서 뺍니다. 가격과 예산을 보고 간식은 필요한지 다시 생각합니다.', perspective: '필요한 것, 이미 있는 것, 가격과 예산을 함께 확인합니다.' },
      challenge: { text: '윤아는 각 항목을 필수, 선택, 중복으로 나누고 단위 가격과 예산을 비교합니다. 알레르기와 제품 안전 정보도 확인합니다.', perspective: '목록 검토는 단순 삭제가 아니라 목적, 비용, 안전 근거를 기준으로 선택하는 과정입니다.' },
    } },
    { id: 'revise-list', label: '장면 4 · 최종 목록 정하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l1-vn-04.webp', alt: '윤아가 필요한 재료만 담은 장바구니와 수정한 그림 목록을 아이미와 확인하는 장면', knowledgeStep: 2, copy: {
      full: { text: '윤아는 필요한 재료만 남긴 목록으로 장보기를 마칩니다.' },
      light: { text: '윤아는 빵과 필요한 채소만 사고, 집에 있는 치즈와 필요하지 않은 간식은 목록에서 뺍니다. 아이미 목록을 자신의 상황에 맞게 고쳤습니다.', perspective: 'AI 목록을 바꾸거나 일부만 사용하는 것도 올바른 활용입니다.' },
      challenge: { text: '윤아는 목적, 재고, 예산, 안전을 근거로 목록을 수정하고 최종 선택을 직접 결정합니다. 선택 이유도 그림 카드로 남깁니다.', perspective: 'AI는 선택지를 돕지만 실제 구매의 책임과 최종 판단은 사용자에게 있습니다.' },
    } },
  ],
  knowledge: [
    { title: 'AI에게 목록을 어떻게 부탁합니까?', core: '만들 것, 필요한 사람 수, 예산과 이미 있는 재료를 알려 줍니다.', detail: { full: '무엇을 만들지 말합니다.', light: '목적과 필요한 양과 집에 있는 것을 함께 말합니다.', challenge: '목적, 수량, 제약, 보유 재고를 필요한 만큼 제공해 목록 초안을 요청합니다.' } },
    { title: '목록에서 무엇을 확인합니까?', core: '필요한 것, 이미 있는 것, 가격, 제품 안전 정보를 확인합니다.', detail: { full: '필요와 가격을 봅니다.', light: '중복된 물건과 예산을 넘는 물건을 찾습니다.', challenge: '항목의 목적 적합성, 중복, 단위 비용, 알레르기와 안전 정보를 검토합니다.' }, flow: { input: 'AI 재료 목록', process: '필요·가격·안전 확인', output: '수정한 장보기 목록' } },
    { title: '최종 선택은 누가 합니까?', core: 'AI 제안을 비교한 뒤 실제로 살 물건은 내가 결정합니다.', detail: { full: '내가 살 물건을 고릅니다.', light: 'AI 목록에서 필요한 것만 남깁니다.', challenge: '검토 근거에 따라 제안을 수용, 수정, 제외하고 선택의 책임을 집니다.' } },
  ],
};

export const M6_L4_VISUAL_STORY: VisualNovelStory = {
  title: '늦은 버스를 계속 기다려야 합니까?',
  objective: '버스나 지하철이 언제 도착하는지 앱으로 알아봅니다.',
  scenes: [
    { id: 'check-arrival', label: '장면 1 · 앱으로 도착 알아보기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l4-vn-01.webp', alt: '진우가 밝은 버스 정류장에서 앱의 버스 도착 그림을 확인하는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 정류장에서 앱으로 버스 도착 정보를 알아봅니다.' },
      light: { text: '진우는 집으로 가기 전에 버스 앱을 엽니다. 앱에는 버스가 곧 도착하는 것처럼 표시됩니다.', perspective: '교통 앱은 현재 이동을 계획하는 데 도움을 줍니다.' },
      challenge: { text: '진우는 현재 정류장과 타려는 버스 방향을 확인한 뒤 실시간 도착 정보를 조회합니다.', perspective: '도착 정보는 정류장, 노선, 방향이 맞을 때 현재 이동 계획에 사용할 수 있습니다.' },
    } },
    { id: 'keep-waiting', label: '장면 2 · 바뀌지 않는 앱 보기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l4-vn-02.webp', alt: '진우가 버스가 오지 않는데 같은 도착 표시만 보는 장면', knowledgeStep: 0, copy: {
      full: { text: '앱은 곧 도착한다고 하지만 버스가 보이지 않습니다.' },
      light: { text: '시간이 지나도 버스가 오지 않고 앱의 표시도 달라지지 않습니다. 진우는 계속 기다려야 하는지 생각합니다.', perspective: '교통 정보는 통신이나 운행 상황에 따라 늦게 바뀔 수 있습니다.' },
      challenge: { text: '앱의 예측과 현장 상황이 일치하지 않습니다. 진우는 앱 하나만 반복해서 보기보다 다른 정보를 찾기로 합니다.', perspective: '실시간 정보도 오류와 지연이 있을 수 있으므로 불일치가 생기면 확인 범위를 넓힙니다.' },
    } },
    { id: 'check-site', label: '장면 3 · 현장과 공식 정보 확인하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l4-vn-03.webp', alt: '진우가 정류장 운행 공지와 안전한 주변과 도움을 줄 수 있는 사람을 함께 확인하는 장면', knowledgeStep: 1, copy: {
      full: { text: '진우는 정류장 공지와 공식 운행 정보를 함께 확인합니다.' },
      light: { text: '정류장에는 운행이 늦어진다는 그림 공지가 있습니다. 진우는 밝은 장소와 주변의 안전요원도 확인합니다.', perspective: '앱, 현장 공지, 믿을 수 있는 사람의 정보를 함께 봅니다.' },
      challenge: { text: '진우는 앱 예측, 현장 공지, 공식 운행 상태를 교차 확인하고 현재 장소의 안전과 연락 가능성도 평가합니다.', perspective: '이동 정보 판단에는 정확성뿐 아니라 기다리는 환경의 안전도 포함됩니다.' },
    } },
    { id: 'adjust-trip', label: '장면 4 · 안전하게 이동 계획 바꾸기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l4-vn-04.webp', alt: '진우가 보호자와 안전요원에게 연락하며 다음 버스와 지하철 대안을 비교하는 장면', knowledgeStep: 2, copy: {
      full: { text: '진우는 보호자에게 알리고 안전한 이동 방법을 다시 고릅니다.' },
      light: { text: '진우는 보호자에게 지연을 알립니다. 밝은 정류장에서 다음 버스를 기다릴지 가까운 지하철을 이용할지 안전요원과 확인합니다.', perspective: '도착 정보가 달라지면 안전을 먼저 보고 이동 계획을 바꿀 수 있습니다.' },
      challenge: { text: '진우는 대기 시간, 환승 경로, 현재 위치의 안전, 연락 가능성을 비교해 대안을 선택합니다. 혼자 낯선 길로 가지 않습니다.', perspective: '교통 앱은 결정을 돕는 자료이며 최종 계획은 현장 조건과 안전 기준에 따라 조정합니다.' },
    } },
  ],
  knowledge: [
    { title: '앱에서 무엇을 확인합니까?', core: '정류장, 노선, 방향과 예상 도착 정보를 확인합니다.', detail: { full: '버스가 언제 오는지 봅니다.', light: '내가 있는 정류장과 버스 방향도 함께 확인합니다.', challenge: '조회 대상이 현재 위치와 목적지 방향에 맞는지 검증한 뒤 예측 시간을 사용합니다.' } },
    { title: '앱과 현장이 다르면 어떻게 합니까?', core: '현장 공지, 공식 운행 정보와 믿을 수 있는 사람을 함께 확인합니다.', detail: { full: '다른 정보도 확인합니다.', light: '정류장 공지와 안전요원에게도 알아봅니다.', challenge: '데이터 지연 가능성을 고려해 독립된 공식·현장 정보로 교차 확인합니다.' }, flow: { input: '앱 도착 정보', process: '현장·공식 정보 비교', output: '현재 운행 판단' } },
    { title: '이동 계획은 어떻게 바꿉니까?', core: '시간과 경로뿐 아니라 현재 장소의 안전을 먼저 비교합니다.', detail: { full: '안전한 방법을 고릅니다.', light: '보호자에게 알리고 기다리기와 다른 교통을 비교합니다.', challenge: '대기, 환승, 도움 요청 대안의 시간·안전·실행 가능성을 종합해 조정합니다.' } },
  ],
};

export const M6_L11_VISUAL_STORY: VisualNovelStory = {
  title: '나를 어떻게 소개하면 좋습니까?',
  objective: '내가 쓴 자기소개를 AI에게 보여주고 고쳐서 다시 써 봅니다.',
  scenes: [
    { id: 'write-intro', label: '장면 1 · 나의 소개 만들기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l11-vn-01.webp', alt: '윤아가 그림 그리기와 식물 돌보기와 장점을 나타낸 자기소개 그림 카드를 만드는 장면', knowledgeStep: 0, copy: {
      full: { text: '윤아는 새 동아리 친구에게 보여 줄 자기소개를 씁니다.' },
      light: { text: '윤아는 자신의 이름, 좋아하는 그림 그리기, 잘하는 식물 돌보기를 자기소개에 넣습니다. 아직 문장이 길고 순서가 섞여 있습니다.', perspective: '자기소개에는 내가 알리고 싶은 특성과 경험을 고를 수 있습니다.' },
      challenge: { text: '윤아는 동아리 첫 만남이라는 목적에 맞게 흥미, 강점, 함께 하고 싶은 활동을 초안에 담습니다.', perspective: '자기소개는 모든 정보를 나열하는 글이 아니라 상대와 장소에 맞게 나를 표현하는 글입니다.' },
    } },
    { id: 'receive-edit', label: '장면 2 · AI의 고칠 점 받기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l11-vn-02.webp', alt: '아이미가 윤아의 자기소개 카드에 순서와 짧게 줄이기와 개인정보 주의 그림 제안을 보여 주는 장면', knowledgeStep: 0, copy: {
      full: { text: '아이미는 소개 순서를 바꾸고 더 짧게 쓰는 방법을 제안합니다.' },
      light: { text: '아이미는 인사, 좋아하는 것, 잘하는 것, 함께 하고 싶은 일 순서로 정리하자고 제안합니다. 자세한 주소 같은 정보는 넣지 말자고 알려 줍니다.', perspective: 'AI의 수정 제안도 내 뜻과 소개할 장소에 맞는지 살펴봅니다.' },
      challenge: { text: '아이미는 구조화, 중복 삭제, 구체적 활동 추가, 개인정보 최소화를 제안합니다. 윤아는 각 제안의 이유를 검토합니다.', perspective: 'AI 편집은 문장을 대신 결정하는 것이 아니라 사용자가 비교할 수 있는 수정안을 제공하는 일입니다.' },
    } },
    { id: 'choose-revisions', label: '장면 3 · 남기고 고칠 내용 정하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l11-vn-03.webp', alt: '윤아가 자기소개 카드에서 취미와 장점은 남기고 집 위치 그림은 빼며 순서를 다시 놓는 장면', knowledgeStep: 1, copy: {
      full: { text: '윤아는 취미와 장점은 남기고 필요 없는 개인정보는 뺍니다.' },
      light: { text: '윤아는 그림 그리기와 식물 돌보기는 남깁니다. 집 위치와 자세한 학교 정보는 빼고, 자신의 말투에 맞게 문장을 고칩니다.', perspective: 'AI 의견은 받아들이거나 고치거나 사용하지 않을 수 있습니다.' },
      challenge: { text: '윤아는 소개 목적, 자신의 목소리, 개인정보 범위를 기준으로 AI 제안을 부분 수용합니다. 원하지 않는 표현은 직접 바꿉니다.', perspective: '좋은 수정은 AI 문장을 그대로 복사하는 것이 아니라 자기표현의 주도권을 유지하는 과정입니다.' },
    } },
    { id: 'share-revised-intro', label: '장면 4 · 다시 쓴 소개 사용하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m6-l11-vn-04.webp', alt: '윤아가 학교 동아리 친구들에게 수정한 자기소개 그림 카드를 보여 주고 아이미가 곁에서 보는 장면', knowledgeStep: 2, copy: {
      full: { text: '윤아는 다시 쓴 자기소개로 동아리 친구들에게 자신을 소개합니다.' },
      light: { text: '윤아는 짧고 분명해진 소개를 읽습니다. 친구들은 윤아가 그림과 식물 돌보기를 좋아한다는 것을 알게 됩니다.', perspective: '고친 글이 내가 알리고 싶은 모습을 잘 보여 주는지 실제로 사용하며 확인합니다.' },
      challenge: { text: '윤아는 수정본을 소리 내어 읽고 자연스러움과 목적 적합성을 최종 점검합니다. 필요하면 사용한 뒤에도 다시 고칠 수 있습니다.', perspective: '자기소개는 한 번에 완성되는 정답이 아니라 상황과 경험에 따라 계속 다듬을 수 있는 자기표현입니다.' },
    } },
  ],
  knowledge: [
    { title: '자기소개에는 무엇을 넣습니까?', core: '소개 목적에 맞는 나의 흥미, 장점, 경험을 고릅니다.', detail: { full: '좋아하는 것과 잘하는 것을 말합니다.', light: '상대가 나를 이해하는 데 필요한 내용을 고릅니다.', challenge: '청중과 맥락에 맞게 정체성, 흥미, 강점, 참여 의도를 선택합니다.' } },
    { title: 'AI의 수정 의견을 어떻게 봅니까?', core: '더 분명한 순서와 표현인지 보고 수용, 수정, 거절합니다.', detail: { full: 'AI 의견에서 쓸 것을 고릅니다.', light: '내 뜻과 말투에 맞는 제안만 사용합니다.', challenge: '구조, 명료성, 정확성, 개인정보 범위를 기준으로 제안을 평가합니다.' }, flow: { input: '내 자기소개 초안', process: 'AI 제안과 비교해 고치기', output: '나의 수정본' } },
    { title: '다시 쓴 글은 어떻게 확인합니까?', core: '소리 내어 읽고 내가 알리고 싶은 모습이 잘 드러나는지 봅니다.', detail: { full: '읽어 보고 다시 고칩니다.', light: '짧고 자연스러운지와 개인정보가 없는지 확인합니다.', challenge: '목적 적합성, 자기 목소리, 청중의 이해, 정보 범위를 최종 검토합니다.' } },
  ],
};
