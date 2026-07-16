import { useRef, useState, type KeyboardEvent } from 'react';
import Button from '../../components/Button';
import GeneralizationRecordsPanel from '../../components/mission/GeneralizationRecordsPanel';
import type { TeacherRecordingSettings } from '../studio/types';
import { ApiKeyPanel, ObjectivesPanel, ProgressPanel } from './LegacyTeacherPanels';
import StudioEvidencePanel from './StudioEvidencePanel';
import TeacherDataManagement from './TeacherDataManagement';
import TeacherOnboarding from './TeacherOnboarding';
import TeacherOperationGuide from './TeacherOperationGuide';
import { loadTeacherRecordingSettings } from './recordingSettings';

interface Props {
  onExit: () => void;
  onLogout: () => void;
}

const TEACHER_TABS = [
  '운영 안내',
  '학생 기록',
  '포트폴리오',
  'AI 연결',
  '학습목표·성취기준',
  '데이터 관리',
] as const;

type TeacherTab = typeof TEACHER_TABS[number];

export default function TeacherHub({ onExit, onLogout }: Props) {
  const initialSettings = loadTeacherRecordingSettings();
  const [activeTab, setActiveTab] = useState<TeacherTab>('운영 안내');
  const [settings, setSettings] = useState<TeacherRecordingSettings>(initialSettings);
  const [showOnboarding, setShowOnboarding] = useState(!initialSettings.processRecording && !initialSettings.acknowledgedAt);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + offset + TEACHER_TABS.length) % TEACHER_TABS.length;
    setActiveTab(TEACHER_TABS[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  function openOnboarding() {
    setShowOnboarding(true);
    setActiveTab('운영 안내');
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 md:p-8">
      <header className="teacher-hub-chrome mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="studio-kicker text-[color:var(--accent)]">교사용</p>
          <h1 className="text-2xl font-extrabold">수업 운영 허브</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onExit}>학생 화면으로</Button>
          <button onClick={onLogout} className="btn border-red-300 bg-[color:var(--paper-0)] px-4 text-red-700">로그아웃</button>
        </div>
      </header>

      <p className="teacher-hub-chrome studio-margin-note mb-5 text-sm">
        이 비밀번호는 학생 화면과 교사 화면을 나누기 위한 장치이며 데이터 암호화 기능이 아닙니다.
      </p>

      <div className="teacher-hub-chrome mb-6 overflow-x-auto" role="tablist" aria-label="교사 허브 메뉴">
        <div className="flex min-w-max gap-2 border-b border-[color:var(--line)] pb-2">
          {TEACHER_TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(element) => { tabRefs.current[index] = element; }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className="rounded-full border-2 px-4 py-2 font-bold"
              style={{
                borderColor: activeTab === tab ? 'var(--accent)' : 'var(--line)',
                color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
                background: activeTab === tab ? 'var(--paper-0)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" aria-label={activeTab}>
        {activeTab === '운영 안내' && (
          <>
            {showOnboarding && !settings.processRecording && (
              <TeacherOnboarding
                onEnabled={(next) => { setSettings(next); setShowOnboarding(false); }}
                onSkip={() => setShowOnboarding(false)}
              />
            )}
            <section className="studio-editorial p-6 md:p-8">
              <h2 className="text-2xl font-extrabold">경험 중심 교과서 운영 원리</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <article className="studio-fact-card"><h3 className="font-bold">68차시와 18개 핵심 경험</h3><p className="mt-1 text-sm leading-relaxed">행정적 차시 수는 유지하고, 단원마다 세 개의 핵심 경험을 중심으로 준비·연습·전이 활동을 연결합니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">6단원 · 18개 핵심 경험 운영</h3><p className="mt-1 text-sm leading-relaxed">1~6단원의 핵심 경험이 모두 완성되어 있습니다. 이미지·소리·AI 응답은 준비된 AI 예시이며 카메라·마이크 권한 없이 모든 활동을 진행할 수 있습니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">평가 흐름</h3><p className="mt-1 text-sm leading-relaxed">첫 생각 → 조건 변화 → AI 비교 → 내 판단 → 새 상황의 전이를 살펴봅니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">지원 수준</h3><p className="mt-1 text-sm leading-relaxed">충분한 지원, 약한 지원, 도전적 수준은 정보 수·선택지·힌트·AI 역할의 깊이를 바꿉니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">저장 원칙</h3><p className="mt-1 text-sm leading-relaxed">교사가 켠 경우에만 정제된 과정증거를 저장하며 음성·사진·그림 원본과 전체 AI 대화는 남기지 않습니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">수업 전 1분 점검</h3><p className="mt-1 text-sm leading-relaxed">학생 별칭, 기록 상태, TTS·STT, AAC 카드, 오늘 사용할 지원 수준을 확인합니다.</p></article>
              </div>
            </section>
            <TeacherOperationGuide />
          </>
        )}

        {activeTab === '학생 기록' && (
          <div className="space-y-6">
            <ProgressPanel />
            <StudioEvidencePanel mode="teacher" />
            <details className="studio-editorial p-6">
              <summary className="cursor-pointer text-xl font-extrabold">이전 일반화 기록</summary>
              <p className="mt-2 text-sm text-[color:var(--muted)]">기존 v1 기록은 자동 변환하지 않고 읽기 전용으로 보존합니다.</p>
              <div className="mt-4"><GeneralizationRecordsPanel /></div>
            </details>
          </div>
        )}

        {activeTab === '포트폴리오' && <StudioEvidencePanel mode="portfolio" />}

        {activeTab === 'AI 연결' && <ApiKeyPanel />}
        {activeTab === '학습목표·성취기준' && <ObjectivesPanel />}

        {activeTab === '데이터 관리' && (
          <TeacherDataManagement
            settings={settings}
            onSettingsChanged={setSettings}
            onRequestEnable={openOnboarding}
          />
        )}
      </div>
    </main>
  );
}
