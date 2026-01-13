import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface SaveButtonProps {
    isSaving: boolean;
    disabled: boolean;
    onClick: () => void;
    isMobile?: boolean;
    isSticky?: boolean;
}

export function SaveButton({
    isSaving,
    disabled,
    onClick,
    isMobile = false,
    isSticky = false,
}: SaveButtonProps) {
    const buttonContent = (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isSaving}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50',
                isMobile && isSticky ? 'w-full' : 'w-full sm:w-auto',
            )}
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
                    <span>Simpan Kehadiran</span>
                </>
            )}
        </button>
    );

    // Sticky Mobile Bottom Bar
    if (isMobile && isSticky) {
        return (
            <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 px-4 py-3 backdrop-blur-sm sm:hidden">
                <div className="mx-auto max-w-3xl">{buttonContent}</div>
            </div>
        );
    }

    // Desktop Footer
    return (
        <div className="hidden rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-4 sm:block">
            {buttonContent}
        </div>
    );
}
