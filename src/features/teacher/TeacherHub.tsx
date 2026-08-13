import { useRef, useState, type KeyboardEvent } from 'react';
import Button from '../../components/Button';
import GeneralizationRecordsPanel from '../../components/mission/GeneralizationRecordsPanel';
import { clearStudioEvidence } from '../studio/evidenceStorage';
import type { TeacherRecordingSettings } from '../studio/types';
import GeminiConnectionPanel from './GeminiConnectionPanel';
import { ObjectivesPanel, ProgressPanel } from './LegacyTeacherPanels';
import StudioEvidencePanel from './StudioEvidencePanel';
import LinkedStandardsGuide from './LinkedStandardsGuide';
import TeacherCurriculumGuide from './TeacherCurriculumGuide';
import TeacherDataManagement from './TeacherDataManagement';
import TeacherOnboarding from './TeacherOnboarding';
import TeacherOperationGuide from './TeacherOperationGuide';
import TeacherSoundSetting from './TeacherSoundSetting';
import { loadTeacherRecordingSettings } from './recordingSettings';

interface Props {
  onExit: () => void;
}

const TEACHER_TABS = [
  '운영 안내',
  '학생 기록',
  '포트폴리오',
  'AI 연결',
  '교육과정·성취기준',
  '연계 성취기준',
  '데이터 관리',
] as const;

type TeacherTab = typeof TEACHER_TABS[number];

export default function TeacherHub({ onExit }: Props) {
  // 상단은 가벼운 쪽(과정기록만)을 두고, 전체 초기화는 데이터 관리 탭에서 문구 입력으로 보호한다.
  function handleClearEvidence() {
    const yes = window.confirm('이 브라우저에 저장된 과정기록을 모두 삭제합니다. 진도·설정·AI 연결은 그대로 남습니다. 계속하시겠습니까?');
    if (yes) {
      clearStudioEvidence();
      window.alert('저장된 과정기록을 모두 삭제했습니다.');
    }
  }
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
          <button onClick={handleClearEvidence} className="btn border-red-300 bg-[color:var(--paper-0)] px-4 text-red-700">과정기록 삭제</button>
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
              className="rounded-full border-2 px-4 py-2 font-bold cursor-pointer transition"
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
                <article className="studio-fact-card"><h3 className="font-bold">68차시 · 현재 62개 스튜디오</h3><p className="mt-1 text-sm leading-relaxed">모듈 마무리 전 차시는 상황→첫 생각→조건 변화→AI 비교→내 판단→산출물→새 상황의 공통 흐름을 따릅니다. 차시에 따라 도구 연습·개념 정리 화면이 더해지며, 여섯 마무리 차시는 성장 포트폴리오입니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">1~6단원 · 전면 전환 완료</h3><p className="mt-1 text-sm leading-relaxed">현재 1~6단원 전면 리모델링이 완성되어 있습니다. 기본 AI 의견은 검수된 준비 예시라 카메라·마이크 권한 없이 활동할 수 있고, 교사가 Gemini를 연결한 경우에만 ‘나의 판단’ 화면에 실시간 AI 영역이 더해집니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">평가 흐름</h3><p className="mt-1 text-sm leading-relaxed">첫 생각 → 조건 변화 → AI 비교 → 내 판단 → 새 상황에 써 보기를 살펴봅니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">지원 수준</h3><p className="mt-1 text-sm leading-relaxed">충분한 지원, 중학, 고등 수준은 정보 수·선택지·힌트·AI 역할의 깊이를 바꿉니다. 중학과 고등은 같은 차시를 각각 9학년군·12학년군 성취기준으로 평가하는 운영 축입니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">저장 원칙</h3><p className="mt-1 text-sm leading-relaxed">교사가 켠 경우에만 정제된 과정증거를 저장하며 음성·사진·그림 원본과 전체 AI 대화는 남기지 않습니다.</p></article>
                <article className="studio-fact-card"><h3 className="font-bold">수업 전 1분 점검</h3><p className="mt-1 text-sm leading-relaxed">학생 별칭, 기록 상태, TTS·STT, AAC 카드, 오늘 사용할 지원 수준을 확인합니다.</p></article>
              </div>
            </section>
            <TeacherSoundSetting />
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

        {activeTab === 'AI 연결' && <GeminiConnectionPanel />}
        {activeTab === '교육과정·성취기준' && (
          <div className="space-y-8">
            <ObjectivesPanel />
            <details className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
              <summary className="cursor-pointer p-5 font-extrabold text-slate-900 hover:bg-slate-50">
                학교 자체 교육과정 설계 문서 전체 보기
                <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-600">
                  이 문서의 교수·학습 사례는 확장 수업 예시이며 현재 앱의 실제 장면 목록이 아닙니다. 현재 차시는 위 일치표를 기준으로 운영합니다.
                </span>
              </summary>
              <div className="border-t border-slate-200"><TeacherCurriculumGuide /></div>
            </details>
          </div>
        )}
        {activeTab === '연계 성취기준' && <LinkedStandardsGuide />}

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
