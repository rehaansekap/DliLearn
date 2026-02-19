import {
    CodeViewer,
    EmptySubmission,
    FeedbackList,
    FileDisplay,
    GradeForm,
    MembersList,
    StatsCards,
    SubmissionHeader,
    SubmissionTabs,
} from '@/components/teacher/mission/ui/submission';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
    const [score, setScore] = useState<number>(submission?.grade?.score ?? 0);
    const [teacherNotes, setTeacherNotes] = useState<string>(
        submission?.grade?.teacher_notes ?? '',
    );
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when opening/changing submission (prevents stale grade state)
    useEffect(() => {
        setScore(submission?.grade?.score ?? 0);
        setTeacherNotes(submission?.grade?.teacher_notes ?? '');
    }, [submission?.grade?.score, submission?.grade?.teacher_notes]);

    const dedupedFeedbacks = useMemo(() => {
        const raw = submission?.feedbacks ?? [];
        const map = new Map<number, Feedback>();

        for (const f of raw) {
            if (!map.has(f.id)) map.set(f.id, f);
        }

        return Array.from(map.values()).sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );
    }, [submission?.feedbacks]);

    if (!isOpen || !submission) return null;

    const hasSubmission = Boolean(submission.submission_id);

    const handleSaveGrade = async () => {
        if (!submission.submission_id) return;
        setIsSaving(true);
        router.post(
            `/teacher/submission/${submission.submission_id}/grade`,
            {
                score,
                teacher_notes: teacherNotes,
            },
            {
                onSuccess: async () => {
                    setIsSaving(false);
                    onClose();
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'success',
                        title: 'Nilai Disimpan!',
                        text: 'Penilaian berhasil disimpan.',
                        timer: 1400,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-xl' },
                    });
                    router.reload();
                },
                onError: async (errors) => {
                    setIsSaving(false);
                    onClose();
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'error',
                        title: 'Gagal Menyimpan',
                        text:
                            (errors && (errors.message || errors.error)) ||
                            'Gagal menyimpan nilai. Coba lagi.',
                        customClass: { popup: 'rounded-xl' },
                    });
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
                <SubmissionHeader
                    groupName={submission.group_name}
                    groupCode={submission.group_code}
                    submittedAt={submission.submitted_at}
                    hasSubmission={hasSubmission}
                    onClose={onClose}
                    isMobile={isMobile}
                />

                <SubmissionTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    hasSubmission={hasSubmission}
                    isMobile={isMobile}
                />

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
                                <EmptySubmission />
                            ) : (
                                <>
                                    <MembersList
                                        members={submission.members}
                                        isMobile={isMobile}
                                    />

                                    <StatsCards
                                        likesCount={submission.likes_count}
                                        feedbacksCount={dedupedFeedbacks.length}
                                        isMobile={isMobile}
                                    />

                                    <FileDisplay
                                        filePath={submission.file_path}
                                        isMobile={isMobile}
                                    />

                                    <CodeViewer
                                        code={submission.code_answer}
                                        isMobile={isMobile}
                                    />

                                    <FeedbackList
                                        feedbacks={dedupedFeedbacks}
                                        isMobile={isMobile}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'grade' && (
                        <div
                            className={cn(isMobile ? 'space-y-4' : 'space-y-6')}
                        >
                            <GradeForm
                                score={score}
                                teacherNotes={teacherNotes}
                                onScoreChange={setScore}
                                onNotesChange={setTeacherNotes}
                                onSave={handleSaveGrade}
                                isSaving={isSaving}
                                isMobile={isMobile}
                                existingGrade={submission.grade}
                            />
                        </div>
                    )}
                </div>

                {isMobile && activeTab === 'grade' && hasSubmission && (
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 p-3 backdrop-blur-sm sm:hidden">
                        <div className="mx-auto max-w-3xl">
                            <button
                                onClick={handleSaveGrade}
                                disabled={isSaving}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-amber-700 hover:to-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
