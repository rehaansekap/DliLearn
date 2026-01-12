import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Heart, MessageCircle, Save, X } from 'lucide-react';
import { useState } from 'react';

interface GroupMember {
    id: number;
    name: string;
    avatar?: string | null;
}

interface Grade {
    score: number;
    teacher_notes: string | null;
}

interface Feedback {
    id: number;
    user_name: string;
    group_name: string;
    message: string;
    created_at: string;
}

interface Submission {
    group_id: number;
    group_name: string;
    group_code: string | null;
    members: GroupMember[];
    file_path: string | null;
    code_answer: string | null;
    submitted_at: string | null;
    submission_id: number | null;
    likes_count?: number;
    feedbacks?: Feedback[];
    grade?: Grade | null;
}

interface SubmissionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission | null;
}

export function SubmissionDetailModal({
    isOpen,
    onClose,
    submission,
}: SubmissionDetailModalProps) {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<'code' | 'grade'>('code');
    const [score, setScore] = useState<number | undefined>(undefined);
    const [teacherNotes, setTeacherNotes] = useState<string | undefined>(
        undefined,
    );
    const [isSaving, setIsSaving] = useState(false);

    const hasSubmission = Boolean(submission.submission_id);

    const EmptySubmission = (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                <span className="text-2xl">📭</span>
            </div>
            <h4 className="mb-1 text-lg font-semibold text-slate-800">
                Belum Ada Submission
            </h4>
            <p className="text-sm text-slate-500">
                Ketua kelompok belum mengumpulkan tugas akhir untuk kelompok
                ini.
            </p>
        </div>
    );

    if (!isOpen || !submission) return null;

    const handleSaveGrade = () => {
        if (!submission.submission_id) return;

        setIsSaving(true);
        router.post(
            `/teacher/submission/${submission.submission_id}/grade`,
            {
                score: score ?? submission?.grade?.score ?? 0,
                teacher_notes:
                    teacherNotes ?? submission?.grade?.teacher_notes ?? '',
            },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    router.reload();
                },
                onError: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 bg-black/50',
                isMobile
                    ? 'flex flex-col'
                    : 'flex items-center justify-center p-4',
            )}
        >
            <div
                className={cn(
                    'relative bg-white shadow-2xl',
                    isMobile
                        ? 'flex h-full w-full flex-col overflow-hidden'
                        : 'max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl',
                )}
            >
                {/* Header */}
                <div
                    className={cn(
                        'flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500',
                        isMobile ? 'p-4' : 'p-6',
                    )}
                >
                    <div>
                        <h3
                            className={cn(
                                'font-bold text-white',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            {submission.group_name}
                        </h3>
                        <p
                            className={cn(
                                'text-indigo-100',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            {submission.group_code || 'No Code'}
                        </p>
                        {!hasSubmission && (
                            <div
                                className={cn(
                                    'mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 font-semibold text-white/90',
                                    isMobile
                                        ? 'px-2 py-0.5 text-[10px]'
                                        : 'px-3 py-1 text-xs',
                                )}
                            >
                                <span>⌛</span>
                                <span>Belum Dikumpulkan</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        title="Tutup"
                        aria-label="Tutup"
                        className={cn(
                            'rounded-full bg-white/20 text-white transition hover:bg-white/30',
                            isMobile ? 'p-1.5' : 'p-2',
                        )}
                    >
                        <X className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                        <span className="sr-only">Tutup</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            'flex-1 font-semibold transition',
                            isMobile
                                ? 'px-4 py-2 text-xs'
                                : 'px-6 py-3 text-sm',
                            activeTab === 'code'
                                ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-100',
                        )}
                    >
                        📄 Submission
                    </button>
                    <button
                        onClick={() => setActiveTab('grade')}
                        className={cn(
                            'flex-1 font-semibold transition',
                            isMobile
                                ? 'px-4 py-2 text-xs'
                                : 'px-6 py-3 text-sm',
                            !hasSubmission
                                ? 'cursor-not-allowed text-slate-400 opacity-60'
                                : activeTab === 'grade'
                                  ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                                  : 'text-slate-600 hover:bg-slate-100',
                            activeTab === 'grade'
                                ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-100',
                        )}
                    >
                        ⭐ Penilaian
                    </button>
                </div>

                {/* Content */}
                <div
                    className={cn(
                        'overflow-y-auto',
                        isMobile
                            ? 'flex-1 p-4 pb-20'
                            : 'max-h-[calc(90vh-180px)] p-6',
                    )}
                >
                    {activeTab === 'code' && (
                        <div
                            className={cn(isMobile ? 'space-y-4' : 'space-y-6')}
                        >
                            {!hasSubmission ? (
                                EmptySubmission
                            ) : (
                                <>
                                    {/* Members */}
                                    <div>
                                        <h4
                                            className={cn(
                                                'font-bold text-slate-700',
                                                isMobile
                                                    ? 'mb-2 text-xs'
                                                    : 'mb-3 text-sm',
                                            )}
                                        >
                                            👥 Anggota Kelompok
                                        </h4>
                                        <div
                                            className={cn(
                                                'flex flex-wrap',
                                                isMobile ? 'gap-2' : 'gap-3',
                                            )}
                                        >
                                            {submission.members.map(
                                                (member) => (
                                                    <div
                                                        key={member.id}
                                                        className={cn(
                                                            'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50',
                                                            isMobile
                                                                ? 'px-2 py-1'
                                                                : 'px-3 py-2',
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white',
                                                                isMobile
                                                                    ? 'h-6 w-6 text-[10px]'
                                                                    : 'h-8 w-8 text-xs',
                                                            )}
                                                        >
                                                            {member.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                'font-medium text-slate-700',
                                                                isMobile
                                                                    ? 'text-xs'
                                                                    : 'text-sm',
                                                            )}
                                                        >
                                                            {member.name}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Likes & Feedbacks */}
                                    <div
                                        className={cn(
                                            'grid grid-cols-2',
                                            isMobile ? 'gap-2' : 'gap-4',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50',
                                                isMobile ? 'p-3' : 'p-4',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center',
                                                    isMobile
                                                        ? 'gap-2'
                                                        : 'gap-3',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md',
                                                        isMobile
                                                            ? 'h-10 w-10'
                                                            : 'h-12 w-12',
                                                    )}
                                                >
                                                    <Heart
                                                        className={cn(
                                                            'fill-current',
                                                            isMobile
                                                                ? 'h-5 w-5'
                                                                : 'h-6 w-6',
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <p
                                                        className={cn(
                                                            'font-medium text-slate-600',
                                                            isMobile
                                                                ? 'text-xs'
                                                                : 'text-sm',
                                                        )}
                                                    >
                                                        Total Likes
                                                    </p>
                                                    <p
                                                        className={cn(
                                                            'font-black text-pink-700',
                                                            isMobile
                                                                ? 'text-xl'
                                                                : 'text-2xl',
                                                        )}
                                                    >
                                                        {' '}
                                                        {submission.likes_count ??
                                                            0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedbacks Count / Placeholder */}
                                        <div
                                            className={cn(
                                                'rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50',
                                                isMobile ? 'p-3' : 'p-4',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center',
                                                    isMobile
                                                        ? 'gap-2'
                                                        : 'gap-3',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md',
                                                        isMobile
                                                            ? 'h-10 w-10'
                                                            : 'h-12 w-12',
                                                    )}
                                                >
                                                    <MessageCircle
                                                        className={cn(
                                                            isMobile
                                                                ? 'h-5 w-5'
                                                                : 'h-6 w-6',
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <p
                                                        className={cn(
                                                            'font-medium text-slate-600',
                                                            isMobile
                                                                ? 'text-xs'
                                                                : 'text-sm',
                                                        )}
                                                    >
                                                        Total Feedback
                                                    </p>
                                                    <p
                                                        className={cn(
                                                            'font-black text-blue-700',
                                                            isMobile
                                                                ? 'text-xl'
                                                                : 'text-2xl',
                                                        )}
                                                    >
                                                        {submission.feedbacks
                                                            ?.length ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flowchart/File */}
                                    {submission.file_path ? (
                                        <div>
                                            <h4 className="mb-3 text-sm font-bold text-slate-700">
                                                📊 Flowchart / Dokumen
                                            </h4>
                                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                                {submission.file_path.endsWith(
                                                    '.pdf',
                                                ) ? (
                                                    <div className="flex items-center gap-3 p-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500 text-white">
                                                            <span className="text-xl">
                                                                📄
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-700">
                                                                PDF Document
                                                            </p>
                                                            <a
                                                                href={`/storage/${submission.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-indigo-600 hover:underline"
                                                            >
                                                                Buka di Tab Baru
                                                                →
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={`/storage/${submission.file_path}`}
                                                        alt="Flowchart"
                                                        className="w-full"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Code Answer */}
                                    {submission.code_answer ? (
                                        <div>
                                            <h4 className="mb-3 text-sm font-bold text-slate-700">
                                                💻 Source Code
                                            </h4>
                                            <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-900">
                                                <div className="border-b border-slate-700 bg-slate-800 px-4 py-2">
                                                    <span className="text-xs font-medium text-slate-300">
                                                        Code
                                                    </span>
                                                </div>
                                                <pre className="overflow-x-auto p-4 text-sm text-green-400">
                                                    {submission.code_answer}
                                                </pre>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Feedbacks List or empty placeholder */}
                                    <div>
                                        <h4
                                            className={cn(
                                                'font-bold text-slate-700',
                                                isMobile
                                                    ? 'mb-2 text-xs'
                                                    : 'mb-3 text-sm',
                                            )}
                                        >
                                            💬 Feedback dari Siswa (
                                            {submission.feedbacks?.length ?? 0})
                                        </h4>
                                        {submission.feedbacks &&
                                        submission.feedbacks.length > 0 ? (
                                            <div
                                                className={cn(
                                                    isMobile
                                                        ? 'space-y-2'
                                                        : 'space-y-3',
                                                )}
                                            >
                                                {submission.feedbacks.map(
                                                    (feedback) => (
                                                        <div
                                                            key={feedback.id}
                                                            className={cn(
                                                                'rounded-xl border border-blue-200 bg-blue-50',
                                                                isMobile
                                                                    ? 'p-3'
                                                                    : 'p-4',
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    'flex items-center gap-2',
                                                                    isMobile
                                                                        ? 'mb-1.5'
                                                                        : 'mb-2',
                                                                )}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 font-bold text-white',
                                                                        isMobile
                                                                            ? 'h-6 w-6 text-[10px]'
                                                                            : 'h-8 w-8 text-sm',
                                                                    )}
                                                                >
                                                                    {feedback.user_name.charAt(
                                                                        0,
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p
                                                                        className={cn(
                                                                            'text-blue-800',
                                                                            isMobile
                                                                                ? 'text-xs'
                                                                                : 'text-sm',
                                                                        )}
                                                                    >
                                                                        {
                                                                            feedback.user_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-blue-600">
                                                                        dari{' '}
                                                                        {
                                                                            feedback.group_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-blue-800">
                                                                {
                                                                    feedback.message
                                                                }
                                                            </p>
                                                            <p
                                                                className={cn(
                                                                    'text-blue-600',
                                                                    isMobile
                                                                        ? 'mt-1 text-[10px]'
                                                                        : 'mt-2 text-xs',
                                                                )}
                                                            >
                                                                {new Date(
                                                                    feedback.created_at,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    },
                                                                )}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                                                <span className="mb-2 block text-2xl">
                                                    📝
                                                </span>
                                                <p className="text-sm text-slate-500">
                                                    Belum ada feedback untuk
                                                    karya ini
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submission Date */}
                                    {submission.submitted_at && (
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600">
                                                <span className="font-semibold">
                                                    Dikumpulkan pada:
                                                </span>{' '}
                                                {new Date(
                                                    submission.submitted_at,
                                                ).toLocaleString('id-ID', {
                                                    dateStyle: 'long',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === 'grade' && (
                        <div
                            className={cn(isMobile ? 'space-y-4' : 'space-y-6')}
                        >
                            {/* Grade Form */}
                            <div
                                className={cn(
                                    'rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
                                    isMobile ? 'p-4' : 'p-6',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex items-center gap-3',
                                        isMobile ? 'mb-3' : 'mb-4',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md',
                                            isMobile
                                                ? 'h-10 w-10'
                                                : 'h-12 w-12',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                isMobile
                                                    ? 'text-xl'
                                                    : 'text-2xl',
                                            )}
                                        >
                                            ⭐
                                        </span>
                                    </div>
                                    <div>
                                        <h4
                                            className={cn(
                                                'font-bold text-slate-800',
                                                isMobile
                                                    ? 'text-base'
                                                    : 'text-lg',
                                            )}
                                        >
                                            Berikan Nilai
                                        </h4>
                                        <p
                                            className={cn(
                                                'text-slate-600',
                                                isMobile
                                                    ? 'text-xs'
                                                    : 'text-sm',
                                            )}
                                        >
                                            Nilai (0-100) dan catatan untuk
                                            kelompok ini
                                        </p>
                                    </div>
                                </div>

                                {/* Score Input */}
                                <div className={cn(isMobile ? 'mb-3' : 'mb-4')}>
                                    <label
                                        className={cn(
                                            'block font-bold text-slate-700',
                                            isMobile
                                                ? 'mb-1.5 text-xs'
                                                : 'mb-2 text-sm',
                                        )}
                                    >
                                        Nilai (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                            score ??
                                            submission?.grade?.score ??
                                            0
                                        }
                                        onChange={(e) =>
                                            setScore(
                                                Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(e.target.value),
                                                    ),
                                                ),
                                            )
                                        }
                                        className={cn(
                                            'w-full rounded-xl border-2 border-slate-300 font-bold text-slate-800 transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none',
                                            isMobile
                                                ? 'px-3 py-2 text-xl'
                                                : 'px-4 py-3 text-2xl',
                                        )}
                                        placeholder="85"
                                    />
                                    <div
                                        className={cn(
                                            'flex items-center justify-between text-slate-500',
                                            isMobile
                                                ? 'mt-1 text-[10px]'
                                                : 'mt-2 text-xs',
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
                                            isMobile
                                                ? 'mb-1.5 text-xs'
                                                : 'mb-2 text-sm',
                                        )}
                                    >
                                        Catatan Guru (Opsional)
                                    </label>
                                    <textarea
                                        value={
                                            teacherNotes ??
                                            submission?.grade?.teacher_notes ??
                                            ''
                                        }
                                        onChange={(e) =>
                                            setTeacherNotes(e.target.value)
                                        }
                                        placeholder="Berikan feedback konstruktif untuk kelompok..."
                                        rows={isMobile ? 3 : 4}
                                        className={cn(
                                            'w-full resize-none rounded-xl border-2 border-slate-300 text-slate-700 transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none',
                                            isMobile
                                                ? 'px-3 py-2 text-xs'
                                                : 'px-4 py-3 text-sm',
                                        )}
                                    />
                                    <p
                                        className={cn(
                                            'text-slate-500',
                                            isMobile
                                                ? 'mt-1 text-[10px]'
                                                : 'mt-1 text-xs',
                                        )}
                                    >
                                        {
                                            (
                                                teacherNotes ??
                                                submission?.grade
                                                    ?.teacher_notes ??
                                                ''
                                            ).length
                                        }
                                        /1000 karakter
                                    </p>
                                </div>

                                {/* Save Button */}
                                {!isMobile && (
                                    <button
                                        onClick={handleSaveGrade}
                                        disabled={isSaving || !hasSubmission}
                                        className={cn(
                                            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition',
                                            !hasSubmission
                                                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                                                : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700',
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
                                                <span>
                                                    {!hasSubmission
                                                        ? 'Tidak Tersedia'
                                                        : 'Simpan Nilai'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Current Grade Display (if exists) */}
                            {submission.grade && (
                                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="text-3xl">✅</span>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-700">
                                                Nilai Tersimpan
                                            </h5>
                                            <p className="text-xs text-slate-500">
                                                Anda sudah memberikan nilai
                                                sebelumnya
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white p-4">
                                        <p className="mb-2 text-sm text-slate-600">
                                            <span className="font-semibold">
                                                Nilai:
                                            </span>{' '}
                                            <span className="text-2xl font-black text-green-700">
                                                {submission.grade.score}
                                            </span>
                                            <span className="text-slate-500">
                                                /100
                                            </span>
                                        </p>
                                        {submission.grade.teacher_notes && (
                                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                <p className="mb-1 text-xs font-semibold text-slate-600">
                                                    Catatan:
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    {
                                                        submission.grade
                                                            .teacher_notes
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Sticky Save Button (only on Grade tab) */}
                {isMobile && activeTab === 'grade' && hasSubmission && (
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 p-3 backdrop-blur-sm sm:hidden">
                        <div className="mx-auto max-w-3xl">
                            <button
                                onClick={handleSaveGrade}
                                disabled={isSaving}
                                className={cn(
                                    'w-full rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition',
                                    'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:cursor-not-allowed disabled:opacity-50',
                                )}
                            >
                                {isSaving ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        <Save className="mr-2 inline h-4 w-4" />
                                        <span>Simpan Nilai</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
