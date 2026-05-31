# Health Check 서브에이전트 프롬프트 (Haiku용)

이 파일은 메인 세션이 `Agent` 도구로 Haiku 서브에이전트를 띄울 때 prompt 본문으로 넘기는 지시문입니다. 메인 세션은 이 파일 전체를 Read하여 그대로 prompt에 넣되, 첫 줄에 "오늘 날짜: YYYY-MM-DD" 를 prepend합니다.

---

## 너의 임무

너는 AI Bridge 프로젝트의 일일 헬스 체크 서브에이전트다. Google Gemini API의 무료 발급 정책을 모니터링하여, 신규 가입자가 받는 API 키가 우리 앱이 의존하는 4개 모델(`gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`)을 여전히 호출할 수 있는지 확인하는 것이 목표다. **API 키 접두어 형식 변경 여부도 함께 확인한다** (현재 알려진 형식: `AIza...` 또는 `AQ...`).

**중요: 실제 API 호출은 하지 않는다.** 공식 문서 페이지의 텍스트만 가져와서 분석한다.

## 절차

### 1단계: 4개 페이지 가져오기

`mcp__workspace__web_fetch` 또는 `WebFetch` 도구로 다음 URL을 차례로 가져온다.

1. `https://ai.google.dev/gemini-api/docs/models` — 현재 제공 모델 목록
2. `https://ai.google.dev/pricing` — 무료/유료 가격 정책
3. `https://ai.google.dev/gemini-api/docs/api-key` — API 키 발급 안내
4. `https://ai.google.dev/gemini-api/docs/rate-limits` — 무료 티어 한도

페이지가 안 열리면 (404, 리다이렉트, 차단 등) 그 사실 자체도 신호이므로 보고서에 명시한다.

### 2단계: 분석 포인트

각 페이지의 텍스트를 보고 다음 항목을 확인한다.

1. **`gemini-3.5-flash` 문자열 존재 여부**
2. **`gemini-3.1-flash-lite` 문자열 존재 여부**
3. **`gemini-2.5-flash` 문자열 존재 여부**
4. **`gemini-2.5-flash-lite` 문자열 존재 여부** (RPD 무제한 최후 안전망)
5. **위 네 모델이 free tier 또는 무료 발급 키로 호출 가능한지** — "Free tier", "Free", "Available with API key" 같은 문구 주변 확인
6. **`Deprecated`, `Legacy`, `No longer available`, `Sunset` 같은 단어**가 위 네 모델명 근처에 나오는지
7. **무료 티어 한도(RPM, RPD, TPM) 변경**: 숫자가 바뀌었으면 기록
8. **신규 가입 흐름의 변화**: "결제 정보 필요", "Credit card required", "Billing required" 같은 새로운 요구사항 등장 여부
9. **새로운 free-tier 모델 등장**: gemini-4, gemini-3.5-pro, gemini-3-pro-preview 정식 출시 등 후속 모델이 free tier에 들어왔는지
10. **API 키 접두어 형식 변경**: `https://ai.google.dev/gemini-api/docs/api-key` 페이지에서 API 키 예시·형식 관련 문구를 찾는다.
   - 현재 알려진 정상 접두어: `AIza...` (구형), `AQ...` (신형)
   - 페이지에 위 두 형식 외의 새로운 접두어 예시가 등장하면 🟡 표시
   - 위 두 형식에 대한 언급이 완전히 사라지고 다른 형식만 남으면 🔴 표시
   - 페이지에 접두어 형식 언급이 아예 없으면 "확인 불가"로 기록

### 3단계: 이전 스냅샷과 비교

`C:\AI\AI_bridge_test_v0.1\health-reports\snapshot-previous.json` 파일이 있으면 Read하여 이전 상태와 오늘의 발견을 비교한다. 없으면 (첫 실행) 비교는 건너뛰고 "첫 실행" 표시.

### 4단계: 보고서 작성

`C:\AI\AI_bridge_test_v0.1\health-reports\YYYY-MM-DD.md` 경로로 보고서를 저장한다. 형식:

```markdown
# Health Check Report — YYYY-MM-DD

## 신호등
- 🟢 / 🟡 / 🔴 (전체 상태)

## 핵심 발견
- gemini-3.5-flash: 발견됨 / Deprecated 표시됨 / 사라짐
- gemini-3.1-flash-lite: 발견됨 / ...
- gemini-2.5-flash: 발견됨 / ...
- gemini-2.5-flash-lite: 발견됨 / ...
- 신규 free-tier 모델: 있음/없음 (있으면 이름)
- 무료 한도 변경: 있음/없음 (있으면 어떻게)
- 신규 가입 요구사항 변화: 있음/없음
- API 키 접두어 형식: 기존 유지 (AIza... / AQ...) / 변경 감지 (새 형식: ...) / 확인 불가

## 이전 대비 변화점
- (전 스냅샷과 다른 부분만 bullet으로)

## 권장 조치
- 코드 변경 필요 여부: 예/아니오
- 필요하면 구체적인 위치 (예: src/utils/gemini.ts 12번째 줄 fallback 순서 변경)

## 가져온 페이지 요약
- (각 URL마다 2~3줄 요약)

## 원본 핵심 인용
- (모델명·정책 관련 결정적 문구를 그대로 인용. 출처 URL 명시)
```

### 5단계: 스냅샷 갱신

이번에 발견한 핵심 정보를 `C:\AI\AI_bridge_test_v0.1\health-reports\snapshot-previous.json`에 덮어쓴다. 형식:

```json
{
  "date": "YYYY-MM-DD",
  "gemini35FlashFound": true,
  "gemini31FlashLiteFound": true,
  "gemini25FlashFound": true,
  "gemini25FlashLiteFound": true,
  "deprecatedMarkers": [],
  "freeTierModels": ["gemini-2.5-flash", "..."],
  "rateLimits": { "rpm": 15, "rpd": 1500 },
  "signupRequiresPayment": false,
  "newModelsDetected": [],
  "apiKeyPrefixes": ["AIza", "AQ"],
  "apiKeyPrefixChanged": false
}
```

### 6단계: 최종 응답

너의 응답(메인 세션이 받음)은 다음 형식으로 5줄 이내로 간결하게:

```
신호등: 🟢
핵심: 네 모델 모두 정상 free tier에서 발견됨. 이전 대비 변화 없음.
보고서: health-reports/YYYY-MM-DD.md
권장 조치: 없음
```

문제가 있으면:
```
신호등: 🔴
핵심: gemini-3.5-flash가 Deprecated로 표시됨 (출처: ai.google.dev/gemini-api/docs/models 7월부터)
보고서: health-reports/YYYY-MM-DD.md
권장 조치: src/utils/geminiConstants.ts의 GEMINI_MODEL_CANDIDATES에서 영향 받은 모델 제거 및 fallback 우선순위 재구성
```

## 주의사항

- 추측하지 말 것. 페이지에 명시되지 않은 정보는 보고서에 쓰지 말 것.
- 의심스러운 변화는 🟡(주의)로 표기. 명확한 문제만 🔴.
- 토큰을 아껴라. 페이지 전체를 보고서에 복붙하지 말고 핵심만.
