import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface Props {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] ${className}`}
    >
      {copied ? <><Check size={12} /> 복사됨!</> : <><Copy size={12} /> 복사</>}
    </button>
  );
}
