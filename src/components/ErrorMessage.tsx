import Icon from './Icon';

interface Props {
  studentMessage: string;
  technicalDetail?: string;
}

export default function ErrorMessage({ studentMessage, technicalDetail }: Props) {
  return (
    <div
      role="alert"
      className="my-4 p-4 rounded-[var(--r-md)] border-2 border-orange-300 bg-orange-50"
    >
      <p className="text-lg font-semibold text-orange-900 flex items-center gap-2"><Icon name="warning" size={22} className="shrink-0" /> {studentMessage}</p>
      {technicalDetail && (
        <details className="mt-2">
          <summary className="text-sm text-orange-700 cursor-pointer">선생님에게: 자세한 오류</summary>
          <pre className="mt-1 text-xs text-orange-800 whitespace-pre-wrap">{technicalDetail}</pre>
        </details>
      )}
    </div>
  );
}
