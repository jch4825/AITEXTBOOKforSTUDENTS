import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const ROOT = process.cwd();
const STUDIO_DIR = path.join(ROOT, 'src', 'data', 'studios');
const MANIFEST_PATH = path.join(ROOT, 'docs', 'asset-prompts', 'story-scenes.json');
const REPORT_PATH = path.join(ROOT, 'docs', 'asset-prompts', 'story-scenes.md');
const MODULE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];

const CHARACTER_META = [
  {
    id: 'jinwoo',
    name: '강진우',
    aliases: ['강진우', '진우'],
    sheet: 'docs/character-sheets/jinwoo-sheet.png',
    description: '강진우의 얼굴, 짧고 자연스러운 갈색 머리, 체형, 남학생 교복과 색상',
  },
  {
    id: 'yoona',
    name: '서윤아',
    aliases: ['서윤아', '윤아'],
    sheet: 'docs/character-sheets/yoona-sheet.png',
    description: '서윤아의 얼굴, 단정한 갈색 단발, 체형, 여학생 교복과 색상',
  },
  {
    id: 'minjun',
    name: '박민준 선생님',
    aliases: ['박민준', '민준 선생님', '민준'],
    sheet: 'docs/character-sheets/minjun-sheet.png',
    description: '박민준 선생님의 얼굴, 검은 머리, 안경, 성인 체형, 교사 정장과 색상',
  },
  {
    id: 'aimi',
    name: '아이미',
    aliases: ['아이미', 'Aimi', 'AI 로봇', '로봇'],
    sheet: 'docs/character-sheets/aimi-sheet.png',
    description: '아이미의 분홍색 둥근 몸체, 검은 LED 얼굴, 파란 표정 조명, 안테나와 비율',
  },
];

function getArguments() {
  const [command = 'audit', ...args] = process.argv.slice(2);
  const filters = {};
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (item === '--module' || item === '--lesson') {
      filters[item.slice(2)] = args[index + 1];
      index += 1;
    }
  }
  return { command, filters };
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) {
    return node.text;
  }
  return '';
}

function getProperty(objectNode, name) {
  return objectNode.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  );
}

function stringValue(node) {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return '';
}

function numberValue(node) {
  if (!node) return 0;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  return 0;
}

function objectString(objectNode, name) {
  const property = getProperty(objectNode, name);
  return property && ts.isPropertyAssignment(property)
    ? stringValue(property.initializer)
    : '';
}

function findStudioObjects(sourceFile) {
  const studios = [];

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const lessonId = objectString(node, 'lessonId');
      const visualNovel = getProperty(node, 'visualNovel');
      if (
        /^m[1-6]-l\d+$/.test(lessonId)
        && visualNovel
        && ts.isPropertyAssignment(visualNovel)
        && ts.isObjectLiteralExpression(visualNovel.initializer)
      ) {
        studios.push(node);
        return;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return studios;
}

function parseSceneCopy(sceneNode) {
  const copyProperty = getProperty(sceneNode, 'copy');
  if (
    !copyProperty
    || !ts.isPropertyAssignment(copyProperty)
    || !ts.isCallExpression(copyProperty.initializer)
  ) {
    throw new Error('sceneCopy(...) 형식이 아닌 장면이 있습니다.');
  }
  const [full, light, challenge, perspective] = copyProperty.initializer.arguments;
  return {
    full: stringValue(full),
    light: stringValue(light),
    challenge: stringValue(challenge),
    perspective: stringValue(perspective),
  };
}

function detectCharacters(text) {
  return CHARACTER_META.filter((character) =>
    character.aliases.some((alias) => text.includes(alias)),
  );
}

function imageSafeNarrative(text) {
  return text
    .replace(/[“"][^”"]*[”"]/g, '대화 내용은 표정과 몸짓으로만 표현했습니다')
    .replace(/'[^']*'/g, '말한 내용')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPrompt(scene) {
  const references = scene.characters.length > 0
    ? scene.characters
      .map((character, index) =>
        `Image ${index + 1}: identity reference for ${character.name}; preserve ${character.description}`,
      )
      .join('; ')
    : 'No character reference is required for this object- or environment-led scene.';

  const continuity = scene.characters.length > 0
    ? `Do not redesign ${scene.characters.map((character) => character.name).join(', ')}. Preserve the exact facial features, age, body proportions, hair, outfit, colors, and robot construction shown in the reference images.`
    : 'Keep the setting and objects plausible for a contemporary Korean secondary-school learning environment.';

  return [
    'Use case: illustration-story',
    'Asset type: 16:9 visual-novel scene for a digital AI textbook for secondary students with developmental disabilities',
    `Primary request: ${scene.alt}`,
    `Input images: ${references}`,
    `Scene beat: ${scene.copy.light}`,
    scene.copy.perspective ? `Perspective cue: ${scene.copy.perspective}` : null,
    'Style/medium: polished Korean educational animation illustration, clean 2D rendering with soft painterly light, clear silhouettes, restrained warm colors, natural human proportions; mature enough for teenagers; not toddler art, not chibi, not photorealistic',
    'Composition/framing: landscape 16:9, medium-wide or wide shot; the key action, facial expression, and evidence object must be readable immediately; keep important subjects away from the extreme edges',
    'Lighting/mood: warm, calm, supportive classroom-story atmosphere with enough contrast for easy visual comprehension',
    `Continuity: ${continuity}`,
    'Constraints: show only the people and objects needed for this scene; no readable text, letters, numbers, speech bubbles, captions, UI overlays, logos, trademarks, or watermark; no thick black comic borders; no split panels',
    'Avoid: character redesign, wrong school uniforms, extra limbs or fingers, duplicated people, unreadable pseudo-text, exaggerated distress, babyish proportions, dense background clutter',
  ].filter(Boolean).join('\n');
}

function collectStoryboards(scenes) {
  const byLesson = new Map();
  for (const scene of scenes) {
    const entries = byLesson.get(scene.lessonId) ?? [];
    entries.push(scene);
    byLesson.set(scene.lessonId, entries);
  }

  return [...byLesson.values()].map((lessonScenes) => {
    const first = lessonScenes[0];
    const characters = CHARACTER_META.filter((character) =>
      lessonScenes.some((scene) =>
        scene.characters.some((sceneCharacter) => sceneCharacter.id === character.id),
      ),
    );
    const referencedImagePaths = characters.map((character) =>
      path.join(ROOT, character.sheet).replaceAll('\\', '/'),
    );
    const inputDescription = characters.length > 0
      ? characters.map((character, index) =>
        `Image ${index + 1}: strict identity reference for ${character.name}; preserve ${character.description}`,
      ).join('; ')
      : 'No character identity image is required.';
    const positions = ['top left', 'top right', 'bottom left', 'bottom right'];
    const panelLines = lessonScenes.map((scene, index) => {
      const panelCharacters = scene.characters.length > 0
        ? scene.characters.map((character) => character.name).join(', ')
        : 'use only the same lesson protagonist when a hand or observer is necessary; otherwise show no person or robot';
      return [
        `Panel ${index + 1}, ${positions[index]}: ${scene.alt}.`,
        `Narrative beat to depict visually without written dialogue: ${imageSafeNarrative(scene.copy.light)}`,
        scene.copy.perspective ? `Perspective cue: ${scene.copy.perspective}` : null,
        `Characters allowed in this panel: ${panelCharacters}.`,
      ].filter(Boolean).join(' ');
    });
    const prompt = [
      'Use case: illustration-story',
      'Asset type: production storyboard sheet containing four 16:9 visual-novel scenes for one lesson in a digital AI textbook for secondary students with developmental disabilities',
      `Primary request: Create the four current story scenes for "${first.lessonTitle}" as a precise 2-by-2 grid of four equal landscape panels, with a clean straight gutter at exactly the horizontal and vertical center. Each quadrant is a complete 16:9 scene.`,
      `Input images: ${inputDescription}`,
      `Shared story context: ${first.storyTitle}. Use a plausible contemporary Korean secondary-school or everyday-life setting required by the scene.`,
      ...panelLines,
      'Style/medium: polished Korean educational animation illustration, clean 2D rendering with soft painterly light, clear silhouettes, restrained warm colors, natural teenage and adult proportions; mature enough for teenagers; not toddler art, not chibi, not photorealistic',
      'Composition/framing: exact 2x2 equal grid; each quadrant must work when cropped independently; keep every face, hand, and evidence object safely inside its own quadrant with generous inner margins; no element may cross the center gutters',
      characters.length > 0
        ? `Continuity: Do not redesign ${characters.map((character) => character.name).join(', ')}. Preserve their exact facial features, age, body proportions, hair, outfit colors, and robot construction from the reference images. Keep the same location, time of day, and palette across all four panels unless the story explicitly changes location.`
        : 'Continuity: Keep the same location, time of day, palette, materials, and rendering style across all four panels.',
      'Constraints: show only the characters allowed for each panel; do not add a robot merely because the lesson is about AI; absolutely no readable text, letters, numbers, formulas, speech bubbles, captions, UI labels, logos, trademarks, or watermark; no panel captions; no thick black comic borders',
      'Avoid: extra characters, character redesign, wrong school uniforms, inconsistent hairstyle, duplicated people, duplicated limbs, extra fingers, pseudo-text, babyish proportions, distress exaggeration, dense clutter, objects crossing gutters',
    ].join('\n');
    const outputPath = path.join(
      ROOT,
      'docs',
      'storyboards',
      'generated',
      first.moduleId,
      `${first.lessonId}-storyboard.webp`,
    ).replaceAll('\\', '/');

    return {
      id: `${first.lessonId}-storyboard`,
      moduleId: first.moduleId,
      lessonId: first.lessonId,
      lessonTitle: first.lessonTitle,
      storyTitle: first.storyTitle,
      referencedImagePaths,
      prompt,
      outputPath,
      status: fs.existsSync(outputPath) ? 'generated' : 'pending',
    };
  });
}

function collectManifest() {
  const scenes = [];

  for (const moduleId of MODULE_IDS) {
    const sourcePath = path.join(STUDIO_DIR, `${moduleId}.ts`);
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      sourcePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    for (const studioNode of findStudioObjects(sourceFile)) {
      const lessonId = objectString(studioNode, 'lessonId');
      const lessonTitle = objectString(studioNode, 'title');
      const visualNovelProperty = getProperty(studioNode, 'visualNovel');
      const visualNovel = visualNovelProperty.initializer;
      const storyTitle = objectString(visualNovel, 'title');
      const scenesProperty = getProperty(visualNovel, 'scenes');

      if (
        !scenesProperty
        || !ts.isPropertyAssignment(scenesProperty)
        || !ts.isArrayLiteralExpression(scenesProperty.initializer)
      ) {
        throw new Error(`${lessonId}: scenes 배열을 찾지 못했습니다.`);
      }

      scenesProperty.initializer.elements.forEach((element, sceneIndex) => {
        if (!ts.isObjectLiteralExpression(element)) {
          throw new Error(`${lessonId}: 장면 ${sceneIndex + 1}이 객체가 아닙니다.`);
        }
        const copy = parseSceneCopy(element);
        const alt = objectString(element, 'alt');
        const searchText = [
          lessonTitle,
          storyTitle,
          alt,
          copy.full,
          copy.light,
          copy.challenge,
          copy.perspective,
        ].join(' ');
        const characters = detectCharacters(searchText);
        const sceneNumber = sceneIndex + 1;
        const filename = `${lessonId}-scene-${String(sceneNumber).padStart(2, '0')}.webp`;
        const src = `/lessons/story/${moduleId}/${filename}`;
        const entry = {
          id: `${lessonId}-scene-${String(sceneNumber).padStart(2, '0')}`,
          moduleId,
          lessonId,
          lessonTitle,
          storyTitle,
          sceneNumber,
          sceneId: objectString(element, 'id'),
          label: objectString(element, 'label'),
          alt,
          knowledgeStep: numberValue(
            getProperty(element, 'knowledgeStep')?.initializer,
          ),
          copy,
          characters: characters.map(({ aliases, ...character }) => character),
          referencedImagePaths: characters.map((character) =>
            path.join(ROOT, character.sheet).replaceAll('\\', '/'),
          ),
          src,
          outputPath: path.join(ROOT, 'public', src).replaceAll('\\', '/'),
          status: fs.existsSync(path.join(ROOT, 'public', src.slice(1)))
            ? 'generated'
            : 'pending',
        };
        entry.prompt = buildPrompt(entry);
        scenes.push(entry);
      });
    }
  }

  return scenes;
}

function writeManifest(scenes) {
  const storyboards = collectStoryboards(scenes);
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalScenes: scenes.length,
      generatedScenes: scenes.filter((scene) => scene.status === 'generated').length,
      pendingScenes: scenes.filter((scene) => scene.status === 'pending').length,
      totalStoryboards: storyboards.length,
      generatedStoryboards: storyboards.filter((storyboard) => storyboard.status === 'generated').length,
      pendingStoryboards: storyboards.filter((storyboard) => storyboard.status === 'pending').length,
      storyboards,
      scenes,
    }, null, 2)}\n`,
    'utf8',
  );

  const moduleRows = MODULE_IDS.map((moduleId) => {
    const entries = scenes.filter((scene) => scene.moduleId === moduleId);
    const lessonCount = new Set(entries.map((scene) => scene.lessonId)).size;
    const generated = entries.filter((scene) => scene.status === 'generated').length;
    return `| ${moduleId.toUpperCase()} | ${lessonCount} | ${entries.length} | ${generated} | ${entries.length - generated} |`;
  });

  const lessonRows = [...new Set(scenes.map((scene) => scene.lessonId))].map((lessonId) => {
    const entries = scenes.filter((scene) => scene.lessonId === lessonId);
    const generated = entries.filter((scene) => scene.status === 'generated').length;
    return `| ${lessonId} | ${entries[0].lessonTitle} | ${entries.length} | ${generated}/${entries.length} |`;
  });

  const report = [
    '# 스토리 모드 이미지 제작 현황',
    '',
    '> 단일 진실 원천: `src/data/studios/m1.ts` ~ `m6.ts`의 현재 `visualNovel.scenes`',
    '',
    '## 모듈별 현황',
    '',
    '| 모듈 | 차시 | 장면 | 제작 완료 | 남음 |',
    '|---|---:|---:|---:|---:|',
    ...moduleRows,
    '',
    '## 차시별 현황',
    '',
    '| 차시 | 제목 | 장면 수 | 완료 |',
    '|---|---|---:|---:|',
    ...lessonRows,
    '',
    '## 제작 규칙',
    '',
    '- 모든 장면은 16:9 WebP로 저장합니다.',
    '- 등장인물이 있는 장면은 해당 `docs/character-sheets/*.png`를 정체성 참조로 사용합니다.',
    '- 이미지 안에는 읽을 수 있는 글자, 말풍선, UI, 로고, 워터마크를 넣지 않습니다.',
    '- 실제 파일이 존재하는 장면만 `imageSrc`에 연결합니다.',
    '- 기존 `public/lessons/remodel/` 에셋은 과거 서사 보존용으로 덮어쓰지 않습니다.',
    '',
  ].join('\n');
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
}

function filterScenes(scenes, filters) {
  if (filters.lesson) {
    return scenes.filter((scene) => scene.lessonId === filters.lesson);
  }
  if (filters.module) {
    return scenes.filter((scene) => scene.moduleId === filters.module);
  }
  return scenes;
}

function attachScenes(scenes, filters) {
  const targets = filterScenes(scenes, filters);
  if (targets.length === 0) {
    throw new Error('연결할 장면을 찾지 못했습니다.');
  }
  const missing = targets.filter((scene) => !fs.existsSync(scene.outputPath));
  if (missing.length > 0) {
    const preview = missing.slice(0, 8).map((scene) => scene.outputPath).join('\n');
    throw new Error(`WebP 파일 ${missing.length}개가 아직 없습니다.\n${preview}`);
  }

  const lessons = new Set(targets.map((scene) => scene.lessonId));
  const expectedByLesson = new Map();
  for (const scene of targets) {
    const entries = expectedByLesson.get(scene.lessonId) ?? [];
    entries.push(scene);
    expectedByLesson.set(scene.lessonId, entries);
  }

  let attached = 0;
  for (const moduleId of new Set(targets.map((scene) => scene.moduleId))) {
    const sourcePath = path.join(STUDIO_DIR, `${moduleId}.ts`);
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    let currentLesson = '';
    let currentSceneIndex = 0;
    const updated = sourceText.split(/\r?\n/).map((line) => {
      const lessonMatch = line.match(/^\s*lessonId:\s*'([^']+)',\s*$/);
      if (lessonMatch) {
        currentLesson = lessonMatch[1];
        currentSceneIndex = 0;
        return line;
      }
      const imageMatch = line.match(/^(\s*)imageSrc:\s*'[^']*',\s*$/);
      if (!imageMatch || !lessons.has(currentLesson)) {
        return line;
      }
      const expected = expectedByLesson.get(currentLesson);
      const scene = expected[currentSceneIndex];
      if (!scene) {
        throw new Error(`${currentLesson}: 예상보다 imageSrc 항목이 많습니다.`);
      }
      currentSceneIndex += 1;
      attached += 1;
      return `${imageMatch[1]}imageSrc: '${scene.src}',`;
    }).join('\n');

    fs.writeFileSync(sourcePath, updated, 'utf8');
  }

  if (attached !== targets.length) {
    throw new Error(`연결 수가 일치하지 않습니다. 예상 ${targets.length}, 실제 ${attached}`);
  }
  console.log(`스토리 장면 ${attached}개를 연결했습니다.`);
}

function audit(scenes, filters) {
  const targets = filterScenes(scenes, filters);
  const generated = targets.filter((scene) => fs.existsSync(scene.outputPath));
  const attached = targets.filter((scene) => {
    const sourcePath = path.join(STUDIO_DIR, `${scene.moduleId}.ts`);
    return fs.readFileSync(sourcePath, 'utf8').includes(`imageSrc: '${scene.src}'`);
  });
  console.log(`대상 장면: ${targets.length}`);
  console.log(`WebP 존재: ${generated.length}`);
  console.log(`코드 연결: ${attached.length}`);
  console.log(`남은 제작: ${targets.length - generated.length}`);
}

const { command, filters } = getArguments();
const scenes = collectManifest();

if (command === 'manifest') {
  writeManifest(scenes);
  console.log(`장면 명세 ${scenes.length}개를 기록했습니다.`);
  console.log(MANIFEST_PATH);
  console.log(REPORT_PATH);
} else if (command === 'attach') {
  attachScenes(scenes, filters);
  const refreshed = collectManifest();
  writeManifest(refreshed);
  audit(refreshed, filters);
} else if (command === 'audit') {
  writeManifest(scenes);
  audit(scenes, filters);
} else {
  throw new Error(`알 수 없는 명령: ${command}`);
}
