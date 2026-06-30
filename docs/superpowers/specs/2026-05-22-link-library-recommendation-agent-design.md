# Link Library Recommendation Agent Design

## Goal
Build an admin-only recommendation agent for the AI Bridge link library. The agent reads the existing `resourcesData.ts` structure, searches for AI-related educational links, scores candidates by relevance, and writes a review report. It does not modify the link library unless a human later chooses candidates.

## Context
The link library data lives in `C:\AI\AI_bridge_test_v0.1\src\data\resourcesData.ts` as `resourceCategories[]`, with this hierarchy:

- `ResourceCategory`
- `ResourceSubCategory`
- `ResourceItem`

Each `ResourceItem` currently has `id`, `title`, optional `url`, and optional `description`. The library already mixes teacher-facing resources, AI tools, policy/ethics resources, research/news, and expert/industry references.

The admin tooling lives outside the app at `C:\AI\ai-bridge-monitor`. It currently uses simple Python scripts and `.env` for local secrets. The new script should follow that style.

## Scope
Create a script named `recommend-resources.py` in `C:\AI\ai-bridge-monitor`.

The script will:

1. Read `resourcesData.ts`.
2. Extract existing URLs, domains, category IDs, and subcategory labels.
3. Search using a mixed education-first query set.
4. Normalize and deduplicate candidates.
5. Score each candidate with stars from 1 to 5.
6. Suggest the best category/subcategory insertion point.
7. Write a Markdown report to `C:\AI\AI_bridge_test_v0.1\pending-resources\YYYY-MM-DD-resource-recommendations.md`.
8. Print a concise console summary.

The script will not directly edit `resourcesData.ts`.

## Recommendation Model
The script uses a conservative keyword scoring model rather than an LLM dependency. This keeps the tool reproducible, cheap, and easy to inspect.

Star ratings:

- 5 stars: Directly useful for elementary teachers, elementary students, elementary AI education, or classroom-ready student AI learning.
- 4 stars: Strong teacher AI education, AI ethics/safety, education ministry, education office, KERIS, SW education, or public-sector education guidance.
- 3 stars: Practical general AI tool that teachers can use for class preparation, production, research, or accessibility.
- 2 stars: AI industry, developer, research, or infrastructure reference with indirect value.
- 1 star: AI-adjacent but weakly connected to the current link library.

## Search Strategy
Use a mixed query set:

- Elementary AI education and student AI learning.
- Teacher-facing generative AI tools and lesson resources.
- AI ethics, copyright, safety, and policy resources.
- Public education institutions and SW/AI learning portals.
- A small number of broader AI tool discovery queries.

The first implementation may use Bing HTML search through `urllib.request` and standard-library HTML parsing. If search blocks or changes markup, the script should fail gracefully and still produce a report explaining the failure.

## Candidate Output
Each candidate in the report includes:

- Title
- URL
- Host
- Description snippet
- Stars
- Recommended insertion location
- Reason
- Duplicate status
- Suggested `ResourceItem` code snippet

## Error Handling
The script should keep partial results where possible. Network failures, invalid URLs, and search parsing failures are reported in a `Warnings` section. Missing `resourcesData.ts` is a hard failure.

## Verification
Verification consists of:

- Unit tests for parsing, deduplication, scoring, and insertion suggestion.
- A dry-run script execution that writes a Markdown report.
- No changes to `resourcesData.ts` after script execution.
