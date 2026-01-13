import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface SaveButtonProps {
    isSaving: boolean;
    disabled: boolean;
    onClick: () => void;
    isMobile?: boolean;
}

export function SaveButton({
    isSaving,
    disabled,
    onClick,
    isMobile = false,
}: SaveButtonProps) {
    return (
        <div
            className={cn(
                'sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur-sm',
                isMobile ? 'p-4' : 'px-6 py-4',
            )}
        >
            <button
                type="button"
                onClick={onClick}
                disabled={disabled || isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
                {isSaving ? (
                    <>
                        <svg
                            className="h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Menyimpan...</span>
                    </>
                ) : (
                    <>
                        <Save className="h-5 w-5" />
                        <span>Simpan Perubahan Kelompok</span>
                    </>
                )}
            </button>
        </div>
    );
}
