import { cn } from '@/lib/utils';

interface CodeActionButtonsProps {
    onRun: () => void;
    onSave: () => void;
    isRunning: boolean;
    hasRunCode: boolean;
}

export function CodeActionButtons({
    onRun,
    onSave,
    isRunning,
    hasRunCode,
}: CodeActionButtonsProps) {
    return (
        <div className="flex flex-col items-stretch gap-2 rounded-b-xl border-t border-slate-700 bg-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:rounded-b-2xl sm:px-6 sm:py-4">
            <button
                onClick={onRun}
                disabled={isRunning}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 font-bold shadow transition-all duration-200 sm:px-6 sm:py-3',
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
                onClick={onSave}
                disabled={!hasRunCode}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 font-bold shadow transition-all duration-200 sm:px-6 sm:py-3',
                    !hasRunCode
                        ? 'cursor-not-allowed bg-slate-600 text-slate-400'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]',
                )}
            >
                <span className="text-xl">💾</span>
                <span>{hasRunCode ? 'Simpan & Lanjut' : 'Jalankan Dulu'}</span>
            </button>
        </div>
    );
}
