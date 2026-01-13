import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface GradeFormProps {
    score: number;
    teacherNotes: string;
    onScoreChange: (score: number) => void;
    onNotesChange: (notes: string) => void;
    onSave: () => void;
    isSaving: boolean;
    isMobile?: boolean;
    existingGrade?: {
        score: number;
        teacher_notes: string | null;
    } | null;
}

export function GradeForm({
    score,
    teacherNotes,
    onScoreChange,
    onNotesChange,
    onSave,
    isSaving,
    isMobile = false,
    existingGrade,
}: GradeFormProps) {
    const handleScoreChange = (value: string) => {
        const numValue = Math.min(100, Math.max(0, Number(value) || 0));
        onScoreChange(numValue);
    };

    return (
        <div
            className={cn(
                'rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
                isMobile ? 'p-4' : 'p-6',
            )}
        >
            <div className={cn('mb-4 flex items-center gap-3')}>
                <div
                    className={cn(
                        'flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md',
                        isMobile ? 'h-10 w-10' : 'h-12 w-12',
                    )}
                >
                    <span className={cn(isMobile ? 'text-xl' : 'text-2xl')}>
                        ⭐
                    </span>
                </div>
                <div>
                    <h4
                        className={cn(
                            'font-bold text-slate-800',
                            isMobile ? 'text-base' : 'text-lg',
                        )}
                    >
                        Berikan Nilai
                    </h4>
                    <p
                        className={cn(
                            'text-slate-600',
                            isMobile ? 'text-xs' : 'text-sm',
                        )}
                    >
                        Nilai (0-100) dan catatan untuk kelompok ini
                    </p>
                </div>
            </div>

            {/* Score Input */}
            <div className={cn(isMobile ? 'mb-3' : 'mb-4')}>
                <label
                    className={cn(
                        'block font-bold text-slate-700',
                        isMobile ? 'mb-1.5 text-xs' : 'mb-2 text-sm',
                    )}
                >
                    Nilai (0-100)
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    className={cn(
                        'w-full rounded-xl border-2 border-slate-300 font-bold text-slate-800 transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none',
                        isMobile ? 'px-3 py-2 text-xl' : 'px-4 py-3 text-2xl',
                    )}
                    placeholder="85"
                />
                <div
                    className={cn(
                        'flex items-center justify-between text-slate-500',
                        isMobile ? 'mt-1 text-[10px]' : 'mt-2 text-xs',
                    )}
                >
                    <span>Minimum: 0</span>
                    <span>Maximum: 100</span>
                </div>
            </div>

            {/* Teacher Notes */}
            <div className={cn(isMobile ? 'mb-3' : 'mb-4')}>
                <label
                    className={cn(
                        'block font-bold text-slate-700',
                        isMobile ? 'mb-1.5 text-xs' : 'mb-2 text-sm',
                    )}
                >
                    Catatan Guru (Opsional)
                </label>
                <textarea
                    value={teacherNotes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Berikan feedback konstruktif untuk kelompok..."
                    rows={isMobile ? 3 : 4}
                    maxLength={1000}
                    className={cn(
                        'w-full resize-none rounded-xl border-2 border-slate-300 text-slate-700 transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none',
                        isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
                    )}
                />
                <p
                    className={cn(
                        'text-slate-500',
                        isMobile ? 'mt-1 text-[10px]' : 'mt-1 text-xs',
                    )}
                >
                    {teacherNotes.length}/1000 karakter
                </p>
            </div>

            {/* Save Button - Desktop Only */}
            {!isMobile && (
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-amber-700 hover:to-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                            <span>Simpan Nilai</span>
                        </>
                    )}
                </button>
            )}

            {/* Existing Grade Display */}
            {existingGrade && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <p className="text-sm font-bold text-green-800">
                            Nilai Tersimpan Sebelumnya
                        </p>
                    </div>
                    <p className="text-sm text-green-700">
                        <span className="font-semibold">Nilai:</span>{' '}
                        <span className="text-2xl font-black">
                            {existingGrade.score}
                        </span>
                        <span className="text-slate-500">/100</span>
                    </p>
                    {existingGrade.teacher_notes && (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="mb-1 text-xs font-semibold text-slate-600">
                                Catatan:
                            </p>
                            <p className="text-sm text-slate-700">
                                {existingGrade.teacher_notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
