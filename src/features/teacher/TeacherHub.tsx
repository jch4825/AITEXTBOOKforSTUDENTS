import { useRef, useState, type KeyboardEvent } from 'react';
import Button from '../../components/Button';
import Icon, { type IconName } from '../../components/Icon';
import ProjectCredit from '../../components/ProjectCredit';
import AiStatus from '../../components/controls/AiStatus';
import GeneralizationRecordsPanel from '../../components/mission/GeneralizationRecordsPanel';
import { clearStudioEvidence } from '../studio/evidenceStorage';
import { clearGeneralizationRecords } from '../../utils/generalizationStorage';
import { useProgress } from '../../context/ProgressContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import type { TeacherRecordingSettings } from '../studio/types';
import GeminiConnectionPanel from './GeminiConnectionPanel';
import { ProgressPanel } from './LegacyTeacherPanels';
import StudioEvidencePanel from './StudioEvidencePanel';
import LinkedStandardsGuide from './LinkedStandardsGuide';
import TeacherCurriculumGuide from './TeacherCurriculumGuide';
import TeacherDataManagement from './TeacherDataManagement';
import TeacherOnboarding from './TeacherOnboarding';
import TeacherAnswerModeSetting from './TeacherAnswerModeSetting';
import TeacherOperationGuide from './TeacherOperationGuide';
import TeacherSoundSetting from './TeacherSoundSetting';
import { loadTeacherRecordingSettings } from './recordingSettings';

interface Props {
  onExit: () => void;
}

/**
 * 탭마다 이름·그림·한 줄 안내를 둔다. 안내는 본문 머리글에 그대로 나와, 어느 탭이 무엇을 하는 곳인지
 * 열어 보기 전에 알 수 있다(예전에는 탭 이름만 있어 "연계 성취기준"이 무엇인지 열어 봐야 알았다).
 */
const TEACHER_TABS = [
  { name: '운영 안내', icon: 'bulb', summary: '수업 전에 확인할 운영 원리와, 이 기기의 소리·답하는 방식 설정입니다.' },
  { name: '학생 기록', icon: 'check', summary: '이 기기에서 학생이 마친 차시와 과정기록을 봅니다.' },
  { name: '포트폴리오', icon: 'cards', summary: '과정기록을 학생별 핵심 경험으로 모아 인쇄하거나 PDF로 저장합니다.' },
  { name: 'AI 연결', icon: 'sparkles', summary: 'Gemini 키를 연결하면 실시간 AI 활동이 열립니다. 연결하지 않아도 모든 수업을 할 수 있습니다.' },
  { name: '교육과정·성취기준', icon: 'book', summary: '「인공지능 활용」 교육과정 명세와 차시별 지도·평가 기준입니다.' },
  { name: '연계 성취기준', icon: 'link', summary: '타 교과 성취기준과 이어지는 차시와 그 근거를 확인합니다.' },
  { name: '데이터 관리', icon: 'settings', summary: '기록 기능을 켜고 끄고, 기록을 지우거나 암호화 백업으로 옮깁니다.' },
] as const satisfies ReadonlyArray<{ name: string; icon: IconName; summary: string }>;

type TeacherTab = typeof TEACHER_TABS[number]['name'];

/** 운영 안내 첫 화면의 운영 원리 카드. 글이 짧아 한 줄에 여러 장이 놓여도 읽기 쉽다. */
const OPERATION_PRINCIPLES = [
  {
    title: '68차시 · 현재 62개 스튜디오',
    body: '단원 마무리를 뺀 차시는 상황→첫 생각→조건 변화→AI 비교→내 판단→산출물→새 상황의 흐름을 함께 따릅니다. 차시에 따라 도구 연습이나 개념 정리 화면이 더 붙고, 여섯 마무리 차시는 성장 포트폴리오입니다.',
  },
  {
    title: '1~6단원 · 전면 전환 완료',
    body: '1~6단원을 모두 새 얼개로 바꾸어 두었습니다. 기본 AI 의견은 미리 검수한 준비된 AI 예시라 카메라·마이크 권한 없이 활동할 수 있고, 교사가 Gemini를 연결했을 때만 ‘나의 판단’ 화면에 실시간 AI 영역이 붙습니다.',
  },
  {
    title: '평가 흐름',
    body: '첫 생각 → 조건 변화 → AI 비교 → 내 판단 → 새 상황에 써 보기를 살펴봅니다.',
  },
  {
    title: '지원 수준',
    body: '충분한 지원, 중학, 고등은 정보의 수와 선택지, 힌트, AI가 맡는 몫의 깊이를 바꿉니다. 중학과 고등은 같은 차시를 각각 9학년군과 12학년군 성취기준으로 평가하는 축이기도 합니다.',
  },
  {
    title: '저장 원칙',
    body: '교사가 켰을 때만 다듬은 과정증거를 저장하며 음성·사진·그림 원본과 전체 AI 대화는 남기지 않습니다.',
  },
  {
    title: '수업 전 1분 점검',
    body: '학생 별칭, 기록 상태, TTS·STT, AAC 카드, 오늘 사용할 지원 수준을 확인합니다.',
  },
] as const;

export default function TeacherHub({ onExit }: Props) {
  const { reset: resetProgress } = useProgress();
  // 상단은 학생의 수행 흔적을 지우는 쪽이고, 전체 초기화(API 키·설정까지)는 데이터 관리 탭에서
  // 문구 입력으로 보호한다.
  //
  // 학생의 흔적은 저장소가 셋이다. 스튜디오 과정기록, 일반화 기록, 그리고 진도(완료한 차시)다.
  // 셋을 함께 지우지 않으면 지운 줄 알았던 기록이 남는다. 특히 진도가 남으면 다음 학생이
  // 첫 화면에서 「이어서 학습하기」와 남의 완료 표시를 보게 된다.
  //
  // 진도는 반드시 ProgressContext의 reset으로 지운다. 공급자가 상태를 저장소에 되쓰므로
  // localStorage만 지우면 곧바로 되살아난다.
  function handleClearEvidence() {
    const yes = window.confirm('이 브라우저에 저장된 학생의 수행 기록을 모두 삭제합니다. 과정기록, 일반화 기록, 진도(완료한 차시)가 지워집니다. 설정과 AI 연결은 그대로 남습니다. 계속하시겠습니까?');
    if (yes) {
      clearStudioEvidence();
      clearGeneralizationRecords();
      resetProgress();
      window.alert('과정기록과 일반화 기록, 진도를 모두 삭제했습니다.');
    }
  }
  const initialSettings = loadTeacherRecordingSettings();
  const [activeTab, setActiveTab] = useState<TeacherTab>('운영 안내');
  const [settings, setSettings] = useState<TeacherRecordingSettings>(initialSettings);
  const [showOnboarding, setShowOnboarding] = useState(!initialSettings.processRecording && !initialSettings.acknowledgedAt);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // 큰 화면에서는 탭이 왼쪽 세로 메뉴라 위·아래 화살표가 이동 키다(배치는 CSS가 바꾸고, 이것만 알려 준다).
  const verticalMenu = useMediaQuery('(min-width: 1024px)');

  const activeIndex = TEACHER_TABS.findIndex((tab) => tab.name === activeTab);
  const active = TEACHER_TABS[activeIndex];

  function selectTab(tab: TeacherTab) {
    setActiveTab(tab);
    // 긴 탭(교육과정)에서 짧은 탭으로 옮길 때 이전 탭의 스크롤 위치가 남지 않게 한다.
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TEACHER_TABS.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    selectTab(TEACHER_TABS[next].name);
    tabRefs.current[next]?.focus();
  }

  function openOnboarding() {
    setShowOnboarding(true);
    selectTab('운영 안내');
  }

  return (
    <div className="hub-shell">
      <aside className="hub-rail teacher-hub-chrome">
        <div className="hub-brand">
          <p className="studio-kicker text-[color:var(--accent)]">교사용</p>
          <h1>수업 운영 허브</h1>
        </div>

        <div className="hub-actions">
          <AiStatus />
          <Button variant="secondary" onClick={onExit}>학생 화면으로</Button>
          <button type="button" onClick={handleClearEvidence} className="btn hub-danger">과정기록 삭제</button>
        </div>

        <div
          className="hub-tabs"
          role="tablist"
          aria-label="교사 허브 메뉴"
          aria-orientation={verticalMenu ? 'vertical' : 'horizontal'}
        >
          {TEACHER_TABS.map((tab, index) => (
            <button
              key={tab.name}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`hub-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.name}
              aria-controls={`hub-panel-${index}`}
              tabIndex={activeTab === tab.name ? 0 : -1}
              onClick={() => selectTab(tab.name)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className="hub-tab"
            >
              <span className="hub-tab-icon" aria-hidden="true"><Icon name={tab.icon} size={18} /></span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="hub-main">
        <header className="hub-panel-head">
          <h2>{active.name}</h2>
          <p>{active.summary}</p>
          {/* 비밀번호의 한계는 모든 탭에서 보여야 한다. 좁은 메뉴 안에서는 다섯 줄로 꺾여 메뉴를 낮은 화면의
              높이 밖으로 밀어냈으므로 본문 머리글 아래 한 줄로 둔다. */}
          <p className="hub-note teacher-hub-chrome">
            이 비밀번호는 학생 화면과 교사 화면을 나누기 위한 장치이며 데이터 암호화 기능이 아닙니다.
          </p>
        </header>

        <div role="tabpanel" id={`hub-panel-${activeIndex}`} aria-labelledby={`hub-tab-${activeIndex}`}>
          {activeTab === '운영 안내' && (
            <div className="hub-stack">
              {showOnboarding && !settings.processRecording && (
                <TeacherOnboarding
                  onEnabled={(next) => { setSettings(next); setShowOnboarding(false); }}
                  onSkip={() => setShowOnboarding(false)}
                />
              )}
              <section className="studio-editorial p-6 md:p-8" aria-labelledby="hub-principles-title">
                <h3 id="hub-principles-title" className="text-xl font-extrabold">경험 중심 교과서 운영 원리</h3>
                <div className="hub-grid hub-grid--cards mt-5">
                  {OPERATION_PRINCIPLES.map((principle) => (
                    <article key={principle.title} className="studio-fact-card">
                      <h4 className="font-bold">{principle.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed">{principle.body}</p>
                    </article>
                  ))}
                </div>
              </section>
              <div className="hub-grid hub-grid--settings">
                <TeacherSoundSetting />
                <div className="hub-stack">
                  <TeacherAnswerModeSetting />
                  <TeacherOperationGuide />
                </div>
              </div>
            </div>
          )}

          {activeTab === '학생 기록' && (
            <div className="hub-stack">
              <ProgressPanel />
              <StudioEvidencePanel mode="teacher" />
              <details className="studio-editorial p-6">
                <summary className="cursor-pointer text-xl font-extrabold">이전 일반화 기록</summary>
                <p className="mt-2 text-sm text-[color:var(--muted)]">예전 v1 기록은 자동으로 바꾸지 않고 읽기 전용으로 그대로 둡니다.</p>
                <div className="mt-4"><GeneralizationRecordsPanel /></div>
              </details>
            </div>
          )}

          {activeTab === '포트폴리오' && <StudioEvidencePanel mode="portfolio" />}

          {activeTab === 'AI 연결' && <GeminiConnectionPanel />}

          {activeTab === '교육과정·성취기준' && <TeacherCurriculumGuide />}

          {activeTab === '연계 성취기준' && <LinkedStandardsGuide />}

          {activeTab === '데이터 관리' && (
            <TeacherDataManagement
              settings={settings}
              onSettingsChanged={setSettings}
              onRequestEnable={openOnboarding}
            />
          )}
        </div>

        <ProjectCredit variant="teacher" />
      </main>
    </div>
  );
}
