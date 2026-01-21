import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface FinalReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialValue?: string;
    isSubmitting: boolean;
    onSubmit: (reflection: string) => void;
}

export function FinalReflectionModal({
    isOpen,
    onClose,
    initialValue = '',
    isSubmitting,
    onSubmit,
}: FinalReflectionModalProps) {
    const [reflection, setReflection] = useState(initialValue);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (reflection.length >= 20) {
            onSubmit(reflection);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <div>
                                <h3 className="text-base font-bold text-white sm:text-lg">
                                    Refleksi Akhir
                                </h3>
                                <p className="text-sm text-indigo-100">
                                    Ceritakan pengalaman belajarmu di misi ini
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                💭 Apa yang kamu pelajari dari misi ini?
                            </label>
                            <textarea
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                placeholder="Tuliskan refleksi akhirmu... Minimal 20 karakter"
                                rows={8}
                                className={cn(
                                    'w-full rounded-xl border px-4 py-3 text-slate-700 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                    'border-slate-300',
                                    reflection.length >= 20 &&
                                        'border-green-300 bg-green-50/50',
                                )}
                                required
                                disabled={isSubmitting}
                            />
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span
                                    className={cn(
                                        'font-medium',
                                        reflection.length < 20
                                            ? 'text-slate-500'
                                            : 'text-green-600',
                                    )}
                                >
                                    {reflection.length >= 20 ? '✓ ' : ''}
                                    {reflection.length} karakter
                                </span>
                                {reflection.length < 20 && (
                                    <span className="text-amber-600">
                                        Minimal 20 karakter
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    isSubmitting || reflection.length < 20
                                }
                                className={cn(
                                    'flex-1 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all duration-200',
                                    isSubmitting || reflection.length < 20
                                        ? 'cursor-not-allowed bg-slate-300'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl active:scale-[0.98]',
                                )}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
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
                                        <span>Mengirim...</span>
                                    </div>
                                ) : (
                                    <span>🏆 Selesaikan Misi (+100 XP)</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
