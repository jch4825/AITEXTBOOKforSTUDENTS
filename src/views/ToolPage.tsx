import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookCheck,
  Copy,
  FileText,
  ImagePlus,
  Sparkles,
  X,
} from 'lucide-react';
import { m } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolDefinition, ToolInput } from '../tools/ToolRegistry';
import { friendlyApiError } from '../utils/apiError';
import SpeakButton from '../components/SpeakButton';
import { formatStandardForPrompt, getStandardPreview, initCurriculum } from '../utils/curriculumLookup';
import { streamGemini } from '../utils/gemini';
import { getGeminiApiKey, hasGeminiApiKey } from '../services/storage';
import { useExternalStorageState } from '../hooks/useExternalStorageState';

interface ToolPageProps {
  tool: ToolDefinition;
  onBack: () => void;
}

type FileAsset = {
  data: string;
  mimeType: string;
  name: string;
};

function createInitialValues(tool: ToolDefinition): Record<string, string> {
  return Object.fromEntries(tool.inputs.map(input => [input.id, input.options?.[0]?.value ?? '']));
}

function hasInputValue(
  input: ToolInput,
  values: Record<string, string>,
  fileValues: Record<string, FileAsset | null>,
): boolean {
  if (input.type === 'image' || input.type === 'file') {
    return !!fileValues[input.id];
  }
  const value = values[input.id] ?? '';
  if (input.type === 'multiselect') {
    return value.split('|||').filter(Boolean).length > 0;
  }
  return value.trim().length > 0;
}

function readFileAsBase64(file: File): Promise<FileAsset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('\uD30C\uC77C\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.'));
        return;
      }
      const [, data = ''] = result.split(',');
      resolve({
        data,
        mimeType: file.type || 'application/octet-stream',
        name: file.name,
      });
    };
    reader.onerror = () => reject(new Error('\uD30C\uC77C\uC744 \uC77D\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.'));
    reader.readAsDataURL(file);
  });
}

export default function ToolPage({ tool, onBack }: ToolPageProps) {
  const Icon = tool.icon;
  const [values, setValues] = useState<Record<string, string>>(() => createInitialValues(tool));
  const [fileValues, setFileValues] = useState<Record<string, FileAsset | null>>({});
  const [result, setResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const runIdRef = useRef(0);

  // 언마운트 시 진행 중인 스트림 소비를 무효화한다 (스트림 자체는 GC가 회수).
  useEffect(() => () => { runIdRef.current += 1; }, []);

  const hasCurriculumInput = useMemo(
    () => tool.inputs.some(i => i.enrichWith === 'curriculumStandard'),
    [tool],
  );
  const [curriculumReady, setCurriculumReady] = useState(false);

  useEffect(() => {
    if (!hasCurriculumInput) return;
    let cancelled = false;
    initCurriculum()
      .then(() => { if (!cancelled) setCurriculumReady(true); })
      .catch(() => { /* 실패 시 미리보기 없이 동작. initCurriculum이 캐시를 비워 다음 진입에서 재시도된다. */ });
    return () => { cancelled = true; };
  }, [hasCurriculumInput]);

  const hasApiKey = useExternalStorageState(hasGeminiApiKey, 'api-key-changed');

  const setValue = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const setFileValue = (id: string, value: FileAsset | null) => {
    setFileValues(prev => ({ ...prev, [id]: value }));
  };

  const buildUserMessage = () => {
    const lines = tool.inputs
      .filter(input => input.type !== 'image' && input.type !== 'file')
      .map(input => {
        const value = values[input.id];
        if (!value) return null;
        const display = input.type === 'multiselect' ? value.split('|||').filter(Boolean).join(', ') : value;
        return `${input.label}: ${display}`;
      })
      .filter(Boolean);

    const enrichments: string[] = [];
    for (const input of tool.inputs) {
      if (input.enrichWith === 'curriculumStandard') {
        const preview = getStandardPreview(values[input.id] || '');
        if (preview.found) {
          enrichments.push(formatStandardForPrompt(preview.standard));
        }
      }
    }

    const baseMessage =
      enrichments.length > 0 ? `${lines.join('\n')}\n\n---\n\n${enrichments.join('\n\n')}` : lines.join('\n');

    if (tool.id === 'math-word-problem') {
      return `${baseMessage}

---

수식을 문장제 문제로 바꿔 주세요.
- 업로드 파일이 있으면 파일 속 수식을 먼저 읽습니다.
- 업로드 파일에 있는 주변 문장, 명사, 단위도 함께 읽고 가능한 한 그대로 유지합니다.
- OCR 원문에 우유, 리본, m, L, 개, 병, 명 같은 말이 있으면 다른 소재로 바꾸지 않습니다.
- 초등 분수 문제는 짧고 자연한 교과서식 문장으로만 만듭니다.
- "2도막", "3조각으로 절단", "분절", "비율적으로 나눈다" 같은 어색한 표현은 쓰지 않습니다.
- OCR 원문이 "우유 4/7L를 2개"처럼 어색하면 뜻을 유지한 채 "우유 4/7L를 2명이 똑같이 나누어 가지려고 합니다"처럼 자연스럽게 고칩니다.
- 단, 원문의 대상과 단위는 유지하고 조사와 서술어만 고칩니다.
- 대분수는 특히 주의해서 읽습니다.
- "1 3/4", "1-3/4", "1¾"처럼 보이면 모두 "1과 3/4"인 대분수로 해석합니다.
- 대분수의 정수 부분과 분수 부분을 따로 떨어진 두 수로 해석하지 않습니다.
- OCR 때문에 대분수 표기가 애매하면 가장 자연스러운 대분수로 우선 해석하고, 확신이 낮으면 마지막 줄에 "확인 필요:"를 붙입니다.
- 여러 수식이면 번호를 붙여 각각 문제를 만듭니다.
- 문제만 출력하고 풀이와 정답은 쓰지 않습니다.`;
    }

    if (tool.id !== 'text-leveler-ocr') {
      return baseMessage;
    }

    const transformMode = values.transformMode;

    if (transformMode === '심화') {
      return `${baseMessage}

---

당신은 원문의 뜻과 맥락을 유지하면서 글의 수준을 한 단계 높여 주는 문해력 편집자입니다.
사용자가 입력한 텍스트를 바탕으로 아래 형식에 맞춰 출력해 주세요.

[작업 지시]
1. 먼저 사용자가 입력한 원문을 수정하지 말고 그대로 출력하세요.
2. 그 아래에 구분선을 넣으세요.
3. 그 아래에 '(심화)'라는 제목을 붙이고, 원문보다 더 깊고 정교한 어휘와 문장 구조를 사용해 다시 쓴 글을 출력하세요.
4. 원문의 핵심 정보와 맥락은 유지해야 합니다.
5. 지나치게 난해한 표현보다는, 읽기 수준이 한 단계 올라간 글처럼 자연스럽게 조정하세요.

[출력 형식]
[원문]
(입력한 텍스트 그대로)

---

[심화]
(더 어려워진 글)`;
    }

    if (transformMode === '기초') {
      return `${baseMessage}

---

당신은 느린 학습자(발달장애, 경계선 지능 등)를 위한 '쉬운 글(Easy-to-Read)' 전문 작가이자 특수 교육 전문가입니다. 
사용자가 텍스트를 입력하면, 다음 [작성 규칙]을 엄격하게 적용하여 이해하기 쉬운 글로 변환해 주세요.

[작성 규칙]
1. 문장 구조: 한 문장에는 하나의 정보만 담아 짧게 끊어 쓰세요(단문 위주).
2. 어휘 선택: 어려운 한자어, 비유, 추상적인 단어를 피하고, 일상생활에서 자주 쓰는 구체적이고 익숙한 단어로 바꾸세요. 
3. 표현 방식: 수동태(~되어지다, ~당하다)를 피하고 능동태(~하다)를 사용하세요.
4. 시각적 구조화: 내용이 길거나 복잡한 경우, 번호나 글머리 기호(불릿 포인트)를 사용해 정보를 시각적으로 나누어 주세요.
5. 내용 유지: 문장은 쉬워지더라도 원문이 전달하고자 하는 핵심 정보와 맥락은 누락 없이 포함해야 합니다.

[출력 형식]
[쉬운 글]
(변환된 텍스트를 여기에 출력)`;
    }

    if (transformMode === '설명') {
      return `${baseMessage}

---

당신은 느린 학습자의 어휘력 향상을 돕는 친절한 교육 보조 교사입니다. 
사용자가 텍스트를 입력하면, 텍스트의 내용을 바탕으로 다음 두 가지 파트로 나누어 결과물을 출력해 주세요.

[작업 지시]
1. 첫 번째 파트: 사용자가 입력한 원문을 아무것도 수정하지 말고 그대로 출력하세요.
2. 두 번째 파트: 원문 안에서 느린 학습자가 이해하기 어려운 단어(전문 용어, 어려운 한자어, 관용 표현 등)를 3~5개 찾아내어 아주 쉽게 설명해 주세요.

[단어 설명 규칙]
- 단어의 뜻을 설명할 때 국어사전의 어려운 뜻풀이를 그대로 가져오지 마세요.
- 초등학교 저학년 수준의 학생도 단번에 이해할 수 있도록 일상적이고 구체적인 예시를 활용해 풀어서 설명하세요.

[출력 형식]
###  [원문 읽어보기]
(입력받은 텍스트 원문 그대로 출력)

---
###  [어려운 단어 풀이]
* **[단어]**: (느린 학습자의 눈높이에 맞춘 아주 쉬운 의미 설명)
* **[단어]**: (느린 학습자의 눈높이에 맞춘 아주 쉬운 의미 설명)
* **[단어]**: (느린 학습자의 눈높이에 맞춘 아주 쉬운 의미 설명)`;
    }

    return baseMessage;
  };

  const handleRun = async () => {
    if (!hasApiKey) {
      alert('API 키가 없습니다. 먼저 API 키를 등록해 주세요.');
      return;
    }

    const missing = tool.inputs
      .filter(input => input.required)
      .find(input => !hasInputValue(input, values, fileValues));
    if (missing) {
      alert(`"${missing.label}" 항목을 입력해 주세요.`);
      return;
    }

    if (tool.requireOneOf?.length) {
      const hasAny = tool.requireOneOf.some(id => {
        const input = tool.inputs.find(item => item.id === id);
        return input ? hasInputValue(input, values, fileValues) : false;
      });
      if (!hasAny) {
        const labels = tool.requireOneOf
          .map(id => tool.inputs.find(input => input.id === id)?.label)
          .filter(Boolean)
          .join(' 또는 ');
        alert(`${labels} 중 하나는 입력해 주세요.`);
        return;
      }
    }

    setIsRunning(true);
    setResult('');
    const myRunId = ++runIdRef.current;

    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
      { text: buildUserMessage() },
    ];
    for (const input of tool.inputs) {
      if (input.type !== 'image' && input.type !== 'file') continue;
      const file = fileValues[input.id];
      if (!file) continue;
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType,
        },
      });
    }

    try {
      const response = await streamGemini({
        apiKey: getGeminiApiKey(),
        systemInstruction: tool.systemPrompt,
        contents: [{ role: 'user', parts }],
      });

      let full = '';
      for await (const chunk of response) {
        if (myRunId !== runIdRef.current) return;
        full += chunk.text ?? '';
        setResult(full);
      }
      if (myRunId !== runIdRef.current) return;
      if (!full.trim()) setResult('답변을 생성할 수 없습니다.');
    } catch (error: any) {
      if (myRunId !== runIdRef.current) return;
      const friendly = friendlyApiError(error, { markdown: true });
      const rawMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.statusText || error?.cause?.message || '';
      setResult(
        rawMessage && !friendly.includes(rawMessage)
          ? `${friendly}\n\n---\n\n원본 오류: \`${rawMessage}\``
          : friendly,
      );
    } finally {
      if (myRunId === runIdRef.current) setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDocs = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      window.open('https://docs.new', '_blank');
    } catch {
      alert('클립보드 복사에 실패했습니다. 결과를 직접 복사해 주세요.');
    }
  };

  const renderInput = (input: ToolInput) => {
    const value = values[input.id] ?? '';
    const preview = input.enrichWith === 'curriculumStandard' ? getStandardPreview(value) : null;
    const file = fileValues[input.id];
    const isFileUpload = input.type === 'file';
    const uploadLabel = isFileUpload ? '\uD30C\uC77C \uC5C5\uB85C\uB4DC' : '\uC0AC\uC9C4 \uC5C5\uB85C\uB4DC';
    const replaceLabel = isFileUpload ? '\uB2E4\uB978 \uD30C\uC77C\uB85C \uBC14\uAFB8\uAE30' : '\uB2E4\uB978 \uC774\uBBF8\uC9C0\uB85C \uBC14\uAFB8\uAE30';
    const statusLabel = isFileUpload ? '\uC5C5\uB85C\uB4DC\uD55C \uD30C\uC77C\uC774 \uC900\uBE44\uB418\uC5C8\uC2B5\uB2C8\uB2E4.' : 'OCR\uC5D0 \uC0AC\uC6A9\uD560 \uC774\uBBF8\uC9C0\uAC00 \uC900\uBE44\uB418\uC5C8\uC2B5\uB2C8\uB2E4.';

    return (
      <div key={input.id}>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {input.label}
          {input.required && <span className="ml-1 text-red-400">*</span>}
        </label>

        {input.type === 'textarea' && (
          <textarea
            value={value}
            onChange={event => setValue(input.id, event.target.value)}
            placeholder={input.placeholder}
            rows={input.rows ?? 3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
          />
        )}

        {input.type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={event => setValue(input.id, event.target.value)}
            placeholder={input.placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
          />
        )}

        {input.type === 'number' && (
          <input
            type="number"
            value={value}
            onChange={event => setValue(input.id, event.target.value)}
            placeholder={input.placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
          />
        )}

        {(input.type === 'image' || input.type === 'file') && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <ImagePlus size={16} />
              <span>{file ? replaceLabel : uploadLabel}</span>
              <input
                type="file"
                accept={input.accept ?? 'image/*'}
                className="hidden"
                onChange={async event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  // Gemini inlineData 요청 한도(~20MB) 초과를 사전 차단
                  if (file.size > 15 * 1024 * 1024) {
                    alert('파일이 너무 큽니다. 15MB 이하의 파일을 사용해 주세요.');
                    event.target.value = '';
                    return;
                  }
                  try {
                    const asset = await readFileAsBase64(file);
                    setFileValue(input.id, asset);
                  } catch (error) {
                    alert(error instanceof Error ? error.message : '\uD30C\uC77C\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');
                  } finally {
                    event.target.value = '';
                  }
                }}
              />
            </label>

            {file && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{statusLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFileValue(input.id, null)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="이미지 제거"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {input.type === 'select' && input.options && input.ui === 'buttons' && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {input.options.map(option => {
              const active = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue(input.id, option.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                    active
                      ? 'border-canva-purple bg-canva-purple text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {input.type === 'select' && input.options && input.ui !== 'buttons' && (
          <select
            value={value}
            onChange={event => setValue(input.id, event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
          >
            <option value="">선택해 주세요</option>
            {input.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {input.type === 'multiselect' && input.options && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input.options.map(option => {
              const current = (values[input.id] || '').split('|||').filter(Boolean);
              const checked = current.includes(option.value);
              return (
                <label
                  key={option.value}
                  onClick={() => {
                    const next = checked ? current.filter(item => item !== option.value) : [...current, option.value];
                    setValue(input.id, next.join('|||'));
                  }}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                    checked
                      ? 'border-canva-purple/50 bg-canva-purple/5 text-canva-purple'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[10px] ${
                      checked ? 'border-canva-purple bg-canva-purple text-white' : 'border-gray-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-snug">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {input.hint && <p className="mt-1.5 text-[11px] text-gray-400">{input.hint}</p>}

        {preview?.found && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <BookCheck size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[11px] font-bold text-emerald-700">
                성취기준 인식됨: {preview.standard.code} ({preview.standard.gradeGroup}학년 {preview.standard.subject})
              </div>
              <div className="text-xs leading-snug text-emerald-900">{preview.standard.title}</div>
            </div>
          </div>
        )}

        {curriculumReady && preview && !preview.found && 'reason' in preview && preview.reason === 'invalid' && /\d/.test(value) && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <div className="flex-1 text-[11px] leading-snug text-amber-800">
              코드 형식이 맞지 않습니다.
              <span className="mt-0.5 block text-amber-700/70">
                예: <code className="rounded bg-amber-100 px-1 font-mono">[6국01-07]</code>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft size={16} />
        도구 목록으로
      </button>

      <div className="mb-8 flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{tool.title}</h1>
          <p className="text-sm text-gray-500">{tool.description}</p>
        </div>
        <SpeakButton text={`${tool.title}. ${tool.description}`} label="도구 설명 듣기" />
      </div>

      {!hasApiKey && (
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 font-bold">API 키가 등록되지 않았습니다.</p>
            <p className="text-xs opacity-90">AI 도구를 사용하려면 먼저 API 키를 입력해 주세요.</p>
          </div>
          <button
            onClick={() => {
              window.location.href = '?lesson=l1-4';
            }}
            className="whitespace-nowrap rounded-lg bg-red-100 px-4 py-2 text-xs font-bold transition-colors hover:bg-red-200"
          >
            등록 방법 보기
          </button>
        </div>
      )}

      <div className="mb-6 space-y-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <p>
          <strong>개인 정보는 입력하지 마세요.</strong>
        </p>
        <p>AI 결과는 수업에 쓰기 전에 한 번 더 확인하는 편이 안전합니다.</p>
      </div>

      <div className="mb-6 space-y-5">
        {tool.inputs.map(renderInput)}
      </div>

      <button
        onClick={handleRun}
        disabled={isRunning || !hasApiKey}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all ${
          !hasApiKey
            ? 'cursor-not-allowed bg-gray-200 text-gray-400'
            : `bg-gradient-to-r ${tool.gradient} text-white disabled:opacity-60`
        }`}
      >
        {isRunning ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            생성 중...
          </>
        ) : !hasApiKey ? (
          <>
            <Sparkles size={18} />
            API 키 등록 후 사용 가능
          </>
        ) : (
          <>
            <Sparkles size={18} />
            생성하기
          </>
        )}
      </button>

      {(result || isRunning) && (
        <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">결과</span>
            {result && !isRunning && (
              <div className="flex gap-2">
                <SpeakButton text={result} label="결과 읽어주기" />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <Copy size={13} />
                  {copied ? '복사됨' : '복사'}
                </button>
                <button
                  onClick={handleExportDocs}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <FileText size={13} />
                  Docs 열기 + Ctrl+V
                </button>
              </div>
            )}
          </div>

          <div className="markdown-container rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm leading-relaxed text-gray-800">
            {result ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-canva-purple" />
                생성 중...
              </div>
            )}
            {isRunning && result && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-canva-purple" />}
          </div>
        </m.div>
      )}
    </div>
  );
}
