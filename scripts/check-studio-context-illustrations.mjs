import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const STAGES = [
  'first-attempt',
  'condition-change',
  'ai-compare',
  'decision',
  'artifact',
  'transfer',
];

const vite = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});

try {
  const studios = [];
  for (const moduleId of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']) {
    const module = await vite.ssrLoadModule(`/src/data/studios/${moduleId}/index.ts`);
    studios.push(...module[`${moduleId.toUpperCase()}_STUDIOS`]);
  }

  const {
    cleanStudioIllustrationAlt,
    getStudioContextMedia,
  } = await vite.ssrLoadModule('/src/features/studio/studioIllustrations.ts');

  const errors = [];
  let illustratedPages = 0;
  let twoImagePlans = 0;
  let preparedExceptions = 0;

  for (const studio of studios) {
    const stageSources = new Map();
    const preparedContextCount = [
      studio.encounter.stimuli,
      studio.conditionChange.stimuli,
      studio.transfer.stimuli,
    ].filter((stimuli) => stimuli?.some((stimulus) => stimulus.kind === 'image')).length;

    for (const stage of STAGES) {
      const media = getStudioContextMedia(studio, stage);
      const images = media.stimuli.filter((stimulus) => stimulus.kind === 'image');
      if (images.length === 0) {
        errors.push(`${studio.lessonId} ${stage}: 왼쪽 상황 그림이 없습니다.`);
        continue;
      }

      illustratedPages += 1;
      stageSources.set(stage, images.map((image) => image.src));

      for (const image of images) {
        if (image.alt.includes('빈 이미지 자리')) {
          errors.push(`${studio.lessonId} ${stage}: 대체 텍스트에 빈 이미지 자리 문구가 남았습니다.`);
        }
        if (cleanStudioIllustrationAlt(image.alt).length < 4) {
          errors.push(`${studio.lessonId} ${stage}: 대체 텍스트가 너무 짧습니다.`);
        }
        if (!image.src.startsWith('/')) {
          errors.push(`${studio.lessonId} ${stage}: public 루트 경로가 아닙니다: ${image.src}`);
          continue;
        }
        const assetPath = path.join(process.cwd(), 'public', image.src.replace(/^\/+/, ''));
        if (!fs.existsSync(assetPath)) {
          errors.push(`${studio.lessonId} ${stage}: 이미지 파일이 없습니다: ${assetPath}`);
        }
      }
    }

    if (preparedContextCount === 0) {
      const uniqueSources = new Set([...stageSources.values()].flat());
      if (uniqueSources.size !== 2) {
        errors.push(`${studio.lessonId}: 기본 차시는 그림 두 장이어야 합니다. 현재 ${uniqueSources.size}장입니다.`);
      } else {
        twoImagePlans += 1;
      }

      const changedSource = stageSources.get('condition-change')?.join('|');
      for (const stage of ['ai-compare', 'decision', 'artifact', 'transfer']) {
        if (stageSources.get(stage)?.join('|') !== changedSource) {
          errors.push(`${studio.lessonId}: ${stage}가 두 번째 핵심 그림을 재사용하지 않습니다.`);
        }
      }
    } else {
      preparedExceptions += 1;
    }
  }

  if (studios.length !== 62) {
    errors.push(`스튜디오 차시 수가 62가 아닙니다: ${studios.length}`);
  }
  if (illustratedPages !== studios.length * STAGES.length) {
    errors.push(`그림이 연결된 페이지가 372개가 아닙니다: ${illustratedPages}`);
  }

  if (errors.length > 0) {
    console.error('Studio context illustration contract failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Studio context illustrations passed: ${studios.length} lessons, ${illustratedPages} pages, `
      + `${twoImagePlans} two-image reuse plans, ${preparedExceptions} prepared exceptions.`,
    );
  }
} finally {
  await vite.close();
}
