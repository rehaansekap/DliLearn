import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { useState } from 'react';

interface Mission {
    material_pdf?: string | null;
    collab_url?: string | null;
    [key: string]: unknown;
}

interface Phase3CreativeLabProps {
    mission: Mission;
    onSaveCode: (code: string, language: string) => void;
    onRunCode: (code: string, language: string) => void;
    isRunning: boolean;
    terminalOutput: string;
    hasRunCode: boolean;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'php', label: 'PHP', icon: '🐘' },
];

export default function Phase3CreativeLab({
    mission,
    onSaveCode,
    onRunCode,
    isRunning,
    terminalOutput,
    hasRunCode,
}: Phase3CreativeLabProps) {
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeValue, setCodeValue] = useState(getDefaultCode(codeLanguage));

    function getDefaultCode(lang: string) {
        switch (lang) {
            case 'javascript':
                return '// Tulis kode eksperimenmu di sini\nconsole.log("Hello World!");';
            case 'python':
                return '# Tulis kode eksperimenmu di sini\nprint("Hello World!")';
            case 'php':
                return '<?php\n// Tulis kode eksperimenmu di sini\necho "Hello World!";';
            default:
                return '// Start coding...';
        }
    }

    const handleLanguageChange = (newLang: string) => {
        setCodeLanguage(newLang);
        setCodeValue(getDefaultCode(newLang));
    };

    const handleRunCode = () => {
        onRunCode(codeValue, codeLanguage);
    };

    const handleSaveCode = () => {
        onSaveCode(codeValue, codeLanguage);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg">
                        💡
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-black text-slate-800">
                            Creative Lab - Eksperimen Kode
                        </h3>
                        <p className="text-slate-600">
                            Eksperimen dengan berbagai pendekatan dan algoritma.
                            Jangan takut mencoba! Ini adalah tempat untuk
                            belajar dari kesalahan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Material PDF Section */}
            {mission.material_pdf && (
                <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg">
                    <div className="border-b border-violet-200 bg-gradient-to-r from-violet-400 to-purple-400 px-6 py-4">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <span className="text-2xl">📚</span>
                            Materi Pembelajaran
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="mb-4 text-slate-700">
                            Pelajari konsep-konsep penting sebelum mulai coding:
                        </p>
                        <a
                            href={mission.material_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-violet-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]"
                        >
                            <span className="text-xl">📖</span>
                            <span>Buka Materi PDF</span>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            )}

            {/* Code Editor Section */}
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                {/* Editor Header */}
                <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                            💻 Code Editor
                        </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex gap-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.value}
                                onClick={() => handleLanguageChange(lang.value)}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                    codeLanguage === lang.value
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
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
                        height="400px"
                        language={codeLanguage}
                        value={codeValue}
                        onChange={(value) => setCodeValue(value || '')}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 border-t border-slate-700 bg-slate-800 px-6 py-4">
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className={cn(
                            'flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all duration-200',
                            isRunning
                                ? 'cursor-not-allowed bg-slate-600 text-slate-400'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] hover:from-green-600 hover:to-emerald-600 hover:shadow-xl active:scale-[0.98]',
                        )}
                    >
                        {isRunning ? (
                            <>
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl">▶️</span>
                                <span>Run Code</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleSaveCode}
                        disabled={!hasRunCode}
                        className={cn(
                            'flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all duration-200',
                            !hasRunCode
                                ? 'cursor-not-allowed bg-slate-600 text-slate-400'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]',
                        )}
                    >
                        <span className="text-xl">💾</span>
                        <span>
                            {hasRunCode ? 'Simpan & Lanjut' : 'Jalankan Dulu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Terminal Output */}
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-6 py-4">
                    <span className="text-xl">🖥️</span>
                    <span className="text-sm font-medium text-slate-300">
                        Terminal Output
                    </span>
                </div>
                <div className="p-6">
                    {terminalOutput ? (
                        <pre className="overflow-x-auto text-sm text-green-400">
                            {terminalOutput}
                        </pre>
                    ) : (
                        <p className="text-slate-500">
                            Output akan muncul di sini setelah kamu menjalankan
                            kode...
                        </p>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl shadow-lg">
                        🔥
                    </div>
                    <div>
                        <h4 className="mb-2 font-bold text-amber-900">
                            Tips Coding:
                        </h4>
                        <ul className="space-y-1 text-sm text-amber-800">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>
                                    Mulai dengan pseudocode atau flowchart
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>Test kode dengan berbagai input</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>
                                    Jangan ragu bertanya ke teman satu tim
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
