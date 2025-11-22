import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/10 dark:border-white/20 bg-white/60 dark:bg-black/90 shadow-inner font-mono text-sm transition-colors duration-300">
      {/* Line Numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/5 dark:bg-white/5 border-r border-black/5 dark:border-white/10 flex flex-col items-center py-4 text-xs text-slate-400 dark:text-gray-500 select-none transition-colors duration-300">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="h-6">{i + 1}</div>
        ))}
      </div>

      {/* Text Area Overlay */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="absolute inset-0 left-10 w-[calc(100%-2.5rem)] h-full bg-transparent text-slate-800 dark:text-gray-300 p-4 focus:outline-none resize-none leading-6 font-mono placeholder:text-slate-400"
        style={{ tabSize: 4 }}
      />
    </div>
  );
};