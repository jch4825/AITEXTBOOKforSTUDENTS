import { PROJECT_CREDIT, PROJECT_CREDIT_AUXILIARY_SENTENCE, PROJECT_CREDIT_TOOLS_SENTENCE } from '../data/projectCredit';

interface Props {
  /**
   * cover: 표지 바닥글. 학생이 보는 자리라 밖으로 나가는 링크를 두지 않는다.
   * teacher: 교사 허브. 라이선스 조건과 출처 표시 방법까지 밝히고 링크를 건다.
   */
  variant: 'cover' | 'teacher';
}

/** 저작자와 제작 방식(인공지능 바이브코딩 도구·보조 도구 사용)을 밝히는 표시. 문구는 data/projectCredit.ts 한 곳에서 온다. */
export default function ProjectCredit({ variant }: Props) {
  const { author, year, title, license, repoUrl } = PROJECT_CREDIT;

  if (variant === 'cover') {
    return (
      <p className="text-xs leading-relaxed text-[color:var(--ink-2)]" data-project-credit="cover">
        <strong className="font-bold">저작자 {author}</strong>
        {' · '}
        {PROJECT_CREDIT_TOOLS_SENTENCE} {PROJECT_CREDIT_AUXILIARY_SENTENCE}
        <br />
        © {year} {author} · {license.name}
      </p>
    );
  }

  return (
    <section className="studio-editorial mt-8 p-6 md:p-8" aria-label="이 교재에 대하여" data-project-credit="teacher">
      <h2 className="text-xl font-extrabold">이 교재에 대하여</h2>
      <dl className="hub-credit-list mt-4 text-sm leading-relaxed">
        <dt className="font-bold">저작자</dt>
        <dd>{author} (© {year})</dd>
        <dt className="font-bold">제작 방식</dt>
        <dd>{PROJECT_CREDIT_TOOLS_SENTENCE}</dd>
        <dt className="font-bold">보조 도구</dt>
        <dd>{PROJECT_CREDIT_AUXILIARY_SENTENCE}</dd>
        <dt className="font-bold">라이선스</dt>
        <dd>
          <a className="font-bold underline underline-offset-2" href={license.deedUrl} target="_blank" rel="noopener noreferrer">
            {license.name}
          </a>
          {' — '}
          저작자를 밝혀야 하고, 영리 목적으로 쓸 수 없으며, 고쳐서 공유할 때는 같은 라이선스를 적용해야 합니다.
          전문은 <a className="underline underline-offset-2" href={license.licenseUrl} target="_blank" rel="noopener noreferrer">LICENSE</a>에 있습니다.
        </dd>
        <dt className="font-bold">예외</dt>
        <dd>효과음은 Humble Bundle로 구매한 자료라 이 라이선스에 포함되지 않습니다. 이 앱 안에서만 쓰고 공개 저장소에는 두지 않으며, 꺼내 쓰거나 다시 배포할 수 없습니다.</dd>
        <dt className="font-bold">출처 표시</dt>
        <dd>
          다른 곳에 옮기거나 고쳐 쓸 때는 이렇게 밝혀 주세요. 「{title}」, {author},{' '}
          <a className="underline underline-offset-2" href={repoUrl} target="_blank" rel="noopener noreferrer">{repoUrl}</a>, {license.name}
        </dd>
      </dl>
    </section>
  );
}
