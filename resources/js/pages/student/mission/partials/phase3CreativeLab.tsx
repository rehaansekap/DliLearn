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
    const [showPdfViewer, setShowPdfViewer] = useState(false);

    const resolveFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

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
            <div className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg">
                <div className="flex items-center justify-between border-b border-violet-200 bg-gradient-to-r from-violet-400 to-purple-400 px-6 py-4">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-2xl">📚</span>
                        <h3 className="text-lg font-bold">
                            Materi Pembelajaran
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPdfViewer((s) => !s)}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        aria-expanded={showPdfViewer}
                    >
                        {showPdfViewer ? 'Tutup' : 'Buka'} Viewer
                    </button>
                </div>

                <div
                    className={`overflow-hidden px-6 transition-[max-height,opacity] duration-300 ${
                        showPdfViewer
                            ? 'max-h-[800px] opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                    aria-hidden={!showPdfViewer}
                >
                    <div className="p-6">
                        {(() => {
                            const fileUrl = resolveFileUrl(
                                mission.material_pdf,
                            );
                            // Jika tidak ada file sama sekali
                            if (!fileUrl) {
                                return (
                                    <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                        <p className="mb-2 font-semibold text-slate-800">
                                            PDF tidak tersedia
                                        </p>
                                        <p className="text-sm">
                                            Tidak ada materi PDF yang diunggah
                                            untuk misi ini. Hubungi Guru jika
                                            ini seharusnya tersedia.
                                        </p>
                                    </div>
                                );
                            }

                            // Gambar (jpg/png)
                            if (/\.(jpe?g|png|gif)$/i.test(fileUrl)) {
                                return (
                                    <div className="h-[480px] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                                        <img
                                            src={fileUrl}
                                            alt="Materi"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                );
                            }

                            // PDF (tampilkan object dengan fallback)
                            if (/\.(pdf)$/i.test(fileUrl)) {
                                return (
                                    <div className="h-[480px] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                                        <object
                                            data={fileUrl}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        >
                                            <div className="p-6 text-center">
                                                <p className="mb-2 text-slate-700">
                                                    PDF tidak dapat ditampilkan
                                                    di browser — kemungkinan
                                                    file rusak atau tidak bisa
                                                    diakses.
                                                </p>
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white"
                                                >
                                                    Buka PDF di Tab Baru
                                                </a>
                                            </div>
                                        </object>
                                    </div>
                                );
                            }

                            // Tipe file lain / unknown
                            return (
                                <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                    <p className="mb-2 font-semibold text-slate-800">
                                        File tidak dikenali
                                    </p>
                                    <p className="text-sm">
                                        Tipe file tidak didukung untuk
                                        pratinjau.{' '}
                                        <a
                                            className="text-indigo-600"
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Buka file
                                        </a>
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

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
