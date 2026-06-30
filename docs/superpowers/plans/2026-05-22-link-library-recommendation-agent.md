# Link Library Recommendation Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin-only Python script that recommends new AI-related links for the AI Bridge link library without directly editing the app data.

**Architecture:** Keep the tool as a focused standard-library Python script in `C:\AI\ai-bridge-monitor`. Extract pure functions for parsing, deduplication, scoring, category suggestion, and report writing so they can be tested without network access. Network search is isolated behind one function and can fail gracefully.

**Tech Stack:** Python 3 standard library, optional `python-dotenv`, PowerShell execution, existing TypeScript resource data file as read-only input.

---

## File Structure

- Create: `C:\AI\ai-bridge-monitor\recommend-resources.py`
  - CLI entrypoint and pure helper functions.
  - Reads `C:\AI\AI_bridge_test_v0.1\src\data\resourcesData.ts`.
  - Writes reports under `C:\AI\AI_bridge_test_v0.1\pending-resources`.
- Create: `C:\AI\ai-bridge-monitor\test_recommend_resources.py`
  - Standard `unittest` tests for non-network behavior.
- Modify: `C:\AI\ai-bridge-monitor\README.md`
  - Add usage instructions for the recommendation script.

### Task 1: Add Pure Recommendation Helpers

**Files:**
- Create: `C:\AI\ai-bridge-monitor\recommend-resources.py`
- Test: `C:\AI\ai-bridge-monitor\test_recommend_resources.py`

- [ ] **Step 1: Write tests for resource parsing and URL normalization**

Create `test_recommend_resources.py` with tests that import the module through `importlib.util` because the script filename contains a hyphen.

```python
import importlib.util
from pathlib import Path
import unittest

MODULE_PATH = Path(__file__).with_name("recommend-resources.py")
spec = importlib.util.spec_from_file_location("recommend_resources", MODULE_PATH)
recommend_resources = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recommend_resources)


class RecommendationHelperTests(unittest.TestCase):
    def test_extract_existing_links_reads_urls_and_categories(self):
        source = """
export const resourceCategories = [
  {
    id: 'ai-basics',
    title: 'AI 기초 자료',
    subCategories: [
      {
        id: 'ai-chat',
        label: '1. 대화형 AI',
        items: [
          { id: 'chatgpt', title: '챗GPT', url: 'https://chatgpt.com', description: '대화형 AI' },
        ],
      },
    ],
  },
];
"""
        result = recommend_resources.extract_existing_links(source)
        self.assertIn("https://chatgpt.com", result.urls)
        self.assertIn("chatgpt.com", result.hosts)
        self.assertEqual(result.subcategories[0]["category_id"], "ai-basics")
        self.assertEqual(result.subcategories[0]["subcategory_id"], "ai-chat")

    def test_normalize_url_removes_tracking_and_trailing_slash(self):
        url = "https://example.com/path/?utm_source=test&b=2#section"
        self.assertEqual(
            recommend_resources.normalize_url(url),
            "https://example.com/path?b=2",
        )


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: FAIL because `recommend-resources.py` does not exist yet.

- [ ] **Step 3: Implement parsing and normalization helpers**

Add dataclasses and helper functions to `recommend-resources.py`:

```python
@dataclass
class ExistingLinks:
    urls: set[str]
    normalized_urls: set[str]
    hosts: set[str]
    subcategories: list[dict[str, str]]


def normalize_url(url: str) -> str:
    parsed = urllib.parse.urlsplit(url.strip())
    query_pairs = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    kept = [(k, v) for k, v in query_pairs if not k.lower().startswith("utm_")]
    query = urllib.parse.urlencode(kept, doseq=True)
    path = parsed.path.rstrip("/") or ""
    return urllib.parse.urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), path, query, ""))
```

Implement `extract_existing_links(source: str) -> ExistingLinks` with regex scanning for category IDs, subcategory IDs/labels, and `url: '...'` values.

- [ ] **Step 4: Run tests and verify they pass**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: 2 tests pass.

### Task 2: Add Candidate Scoring and Category Suggestion

**Files:**
- Modify: `C:\AI\ai-bridge-monitor\recommend-resources.py`
- Modify: `C:\AI\ai-bridge-monitor\test_recommend_resources.py`

- [ ] **Step 1: Add tests for scoring, deduplication, and category suggestions**

Add tests:

```python
    def test_score_candidate_prioritizes_elementary_ai_education(self):
        candidate = recommend_resources.Candidate(
            title="초등학생을 위한 AI 윤리 교육 자료",
            url="https://example.edu/ai-ethics",
            snippet="초등 교사와 학생이 함께 쓰는 인공지능 윤리 수업 자료",
            source_query="초등 AI 교육 자료",
        )
        scored = recommend_resources.score_candidate(candidate)
        self.assertEqual(scored.stars, 5)
        self.assertIn("초등", scored.reason)

    def test_suggest_location_prefers_ethics_for_safety_resource(self):
        candidate = recommend_resources.Candidate(
            title="AI 안전과 저작권 안내서",
            url="https://example.org/safety",
            snippet="생성형 AI 윤리 저작권 개인정보 교육 자료",
            source_query="AI 윤리 교육",
        )
        location = recommend_resources.suggest_location(candidate)
        self.assertEqual(location[0], "ethics")

    def test_mark_duplicate_detects_normalized_url(self):
        existing = recommend_resources.ExistingLinks(
            urls={"https://example.com/tool"},
            normalized_urls={"https://example.com/tool"},
            hosts={"example.com"},
            subcategories=[],
        )
        candidate = recommend_resources.Candidate(
            title="Tool",
            url="https://example.com/tool/?utm_source=x",
            snippet="",
            source_query="",
        )
        self.assertEqual(recommend_resources.get_duplicate_status(candidate, existing), "same-url")
```

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: FAIL because candidate scoring objects are not implemented.

- [ ] **Step 3: Implement Candidate, ScoredCandidate, scoring, duplicate status, and location suggestion**

Add:

```python
@dataclass
class Candidate:
    title: str
    url: str
    snippet: str
    source_query: str


@dataclass
class ScoredCandidate(Candidate):
    stars: int
    reason: str
    duplicate_status: str
    suggested_category_id: str
    suggested_subcategory_id: str
    suggested_location_label: str
```

Implement keyword scoring where elementary/student/teacher/classroom AI education terms receive the highest weight, public education and ethics terms receive strong weight, practical AI tools receive medium weight, and industry/developer terms receive lower weight.

- [ ] **Step 4: Run tests and verify they pass**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: all tests pass.

### Task 3: Add Search, Report Writing, and CLI

**Files:**
- Modify: `C:\AI\ai-bridge-monitor\recommend-resources.py`
- Modify: `C:\AI\ai-bridge-monitor\test_recommend_resources.py`

- [ ] **Step 1: Add tests for Markdown report formatting**

Add a test that builds one scored candidate and asserts the report contains stars, URL, insertion location, and a TypeScript item snippet.

```python
    def test_render_report_contains_candidate_details(self):
        scored = recommend_resources.ScoredCandidate(
            title="초등 AI 수업 자료",
            url="https://example.edu/ai-class",
            snippet="초등 인공지능 수업 자료",
            source_query="초등 AI 교육",
            stars=5,
            reason="초등 AI 교육과 직접 연결됨",
            duplicate_status="new",
            suggested_category_id="lesson",
            suggested_subcategory_id="recommended-lesson-tools",
            suggested_location_label="수업 활용 자료 > 추천 수업 지원 도구",
        )
        report = recommend_resources.render_report([scored], warnings=[])
        self.assertIn("★★★★★", report)
        self.assertIn("https://example.edu/ai-class", report)
        self.assertIn("수업 활용 자료 > 추천 수업 지원 도구", report)
        self.assertIn("{ id:", report)
```

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: FAIL because report rendering is not implemented.

- [ ] **Step 3: Implement search, report rendering, and main CLI**

Implement:

- `search_web(query: str, limit: int) -> tuple[list[Candidate], list[str]]`
- `render_report(candidates: list[ScoredCandidate], warnings: list[str]) -> str`
- `main() -> int`

Use `urllib.request` against Bing HTML search with a normal user-agent. Parse result anchors conservatively. If parsing yields no results, return a warning instead of raising.

CLI options:

```text
--resource-file PATH
--out-dir PATH
--max-results N
--no-network
```

Defaults:

```text
C:\AI\AI_bridge_test_v0.1\src\data\resourcesData.ts
C:\AI\AI_bridge_test_v0.1\pending-resources
20
False
```

- [ ] **Step 4: Run tests and verify they pass**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: all tests pass.

### Task 4: Document Usage and Verify Dry Run

**Files:**
- Modify: `C:\AI\ai-bridge-monitor\README.md`

- [ ] **Step 1: Update README**

Add:

```markdown
- `recommend-resources.py` — AI Bridge 링크 도서관에 추가할 후보 링크를 검색·채점하고 Markdown 보고서를 생성
- `test_recommend_resources.py` — 추천 스크립트의 비네트워크 단위 테스트

### 링크 추천 스크립트

```powershell
cd C:\AI\ai-bridge-monitor
python recommend-resources.py --no-network
python recommend-resources.py --max-results 20
```

결과 보고서는 `C:\AI\AI_bridge_test_v0.1\pending-resources\`에 생성됩니다. 이 스크립트는 `resourcesData.ts`를 직접 수정하지 않습니다.
```

- [ ] **Step 2: Run unit tests**

Run:

```powershell
python C:\AI\ai-bridge-monitor\test_recommend_resources.py
```

Expected: all tests pass.

- [ ] **Step 3: Run no-network dry run**

Run:

```powershell
python C:\AI\ai-bridge-monitor\recommend-resources.py --no-network
```

Expected: a Markdown report is created with a warning that network search was skipped.

- [ ] **Step 4: Run lint/build for app safety**

Run:

```powershell
npm run lint
npm run build
```

Expected: both commands pass. No app source behavior should change.

## Self-Review

Spec coverage:

- Reads current `resourcesData.ts`: Task 1 and Task 3.
- Searches mixed education-first queries: Task 3.
- Deduplicates candidates: Task 2.
- Scores stars by elementary/AI education relevance: Task 2.
- Suggests insertion location: Task 2.
- Writes Markdown report: Task 3.
- Does not edit `resourcesData.ts`: Task 3 and Task 4 dry-run expectation.

Placeholder scan: no placeholders remain.

Type consistency: `Candidate`, `ScoredCandidate`, and `ExistingLinks` are defined before use and referenced consistently.
