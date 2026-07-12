$ErrorActionPreference = 'Stop'

$project = 'C:\AI\AITEXTBOOKforSTUDENTS'
$codex = 'C:\Users\jch48\AppData\Roaming\npm\codex.cmd'
$log = 'C:\tmp\pc-comic-redesign-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.log'

$prompt = @'
Continue the approved PC comic-spread lesson redesign in C:\AI\AITEXTBOOKforSTUDENTS.

Read AGENTS.md, CLAUDE.md, docs/superpowers/specs/2026-07-12-pc-comic-spread-lessons-design.md, and docs/superpowers/plans/2026-07-12-pc-comic-spread-lessons.md completely before editing. Follow the plan task by task and use test-first changes. Preserve Home and the current mobile module accordion. Replace the awkward black comic borders in lessons with a PC-first digital comic-book spread using page surfaces, gutters, low-contrast screentones, image ratios, and editorial typography. Keep existing data, TTS, dictionary, progress, teacher tools, reduced-motion, and WebP-to-PNG fallbacks. Reuse existing public/lessons and assets images before generating new images. If new images are required, keep PNG originals under public/lessons/png/webtoon and WebP service copies under public/lessons/webtoon.

Verify at 1280x900, 768x1024, and 390x844, then run npm run check:ui-polish, npm run lint, npm run check:encoding, npm run build, and git diff --check. Commit coherent tasks if the environment permits Git writes; otherwise leave the verified working tree changes intact and report the log summary.
'@

Set-Location $project
& $codex -a never -s workspace-write -C $project exec $prompt *>> $log
exit $LASTEXITCODE
