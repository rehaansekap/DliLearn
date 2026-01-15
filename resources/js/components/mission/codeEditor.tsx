import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';

interface Language {
    value: string;
    label: string;
    icon: string;
}

interface CodeEditorProps {
    value: string;
    language: string;
    languages: Language[];
    onValueChange: (value: string) => void;
    onLanguageChange: (language: string) => void;
    height?: string;
}

export function CodeEditor({
    value,
    language,
    languages,
    onValueChange,
    onLanguageChange,
    height = '220px',
}: CodeEditorProps) {
    const isMobile = useIsMobile();
    return (
        <div className="overflow-hidden rounded-t-xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-t-2xl">
            {/* Editor Header */}
            <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex gap-1 sm:gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 sm:h-3 sm:w-3" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 sm:text-sm">
                        💻 Code Editor
                    </span>
                </div>

                {/* Language Selector */}
                <div
                    className={`${isMobile ? 'mt-2 flex items-center align-middle' : ''} flex gap-1 sm:gap-2`}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.value}
                            onClick={() => onLanguageChange(lang.value)}
                            className={cn(
                                'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm',
                                language === lang.value
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                            )}
                        >
                            <span>{lang.icon}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="relative">
                <Editor
                    // height="520px"
                    className={`sm:!h-[${height}]`}
                    language={language}
                    value={value}
                    onChange={(val) => onValueChange(val || '')}
                    theme="vs-dark"
                    options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>
        </div>
    );
}
