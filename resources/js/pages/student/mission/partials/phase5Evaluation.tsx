import { BestGroupVote } from '@/components/mission/bestGroupVote';
import { CompletionStatusCard } from '@/components/mission/completionStatusCard';
import { FinalReflectionForm } from '@/components/mission/finalReflectionForm';
import { GalleryCard } from '@/components/mission/galleryCard';
import { SubmissionDetailModal } from '@/components/mission/submissionDetailModal';
import { EmptyGalleryState } from '@/components/mission/ui/emptyGalleryState';
import { MissionButton } from '@/components/mission/ui/missionButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface GallerySubmission {
    id: number;
    group_name: string;
    group_code?: string;
    group_members?: Array<{ name: string; role: string }>;
    file_path: string;
    code_answer: string;
    submitted_at: string;
    likes_count: number;
    is_liked_by_me: boolean;
    feedbacks?: Feedback[];
}

interface Feedback {
    id: number;
    user_name: string;
    group_name: string;
    message: string;
    created_at: string;
}

interface VotableGroup {
    id: number;
    name: string;
    group_code: string;
}

interface VoteData {
    has_voted: boolean;
    my_vote: number | null;
    votable_groups: VotableGroup[];
}

interface Phase5EvaluationProps {
    missionSlug: string;
    gallerySubmissions: GallerySubmission[];
    onSubmitFinalReflection: (reflection: string) => void;
    initialFinalReflection?: string | null;
    submittedPreviously?: boolean;
    onNext?: () => void;
    groupStatus?: string;
    amILeader?: boolean;
    unreviewedSubmissions?: Array<{ group_name: string; group_code: string }>;
    voteData?: VoteData | null;
}

export default function Phase5Evaluation({
    missionSlug,
    gallerySubmissions,
    onSubmitFinalReflection,
    initialFinalReflection = '',
    submittedPreviously = false,
    onNext,
    groupStatus,
    amILeader = false,
    unreviewedSubmissions = [],
    voteData = null,
}: Phase5EvaluationProps) {
    const isMobile = useIsMobile();
    const [selectedSubmission, setSelectedSubmission] =
        useState<GallerySubmission | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

    const itemsPerPage = isMobile ? 3 : 6;
    const [currentPage, setCurrentPage] = useState(1);

    const sortedSubmissions = [...gallerySubmissions].sort(
        (a, b) =>
            new Date(a.submitted_at).getTime() -
            new Date(b.submitted_at).getTime(),
    );

    const totalPages = Math.max(
        1,
        Math.ceil(sortedSubmissions.length / itemsPerPage),
    );
    const pageItems = sortedSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const handleLike = (submissionId: number) => {
        router.post(
            `/submission/${submissionId}/like`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {},
            },
        );
    };

    const handleViewDetail = async (submission: GallerySubmission) => {
        setSelectedSubmission({ ...submission, feedbacks: [] });
        setShowDetailModal(true);

        try {
            const res = await fetch(`/submission/${submission.id}/feedbacks`, {
                credentials: 'same-origin',
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedSubmission((prev) =>
                    prev ? { ...prev, feedbacks: data } : prev,
                );
            }
        } catch (err) {
            console.error('Failed to load feedbacks', err);
        }
    };

    const handleSubmitFeedback = (message: string) => {
        if (!selectedSubmission) return;

        router.post(
            `/submission/${selectedSubmission.id}/feedback`,
            { message },
            {
                preserveScroll: true,
                onSuccess: async () => {
                    try {
                        const res = await fetch(
                            `/submission/${selectedSubmission.id}/feedbacks`,
                            { credentials: 'same-origin' },
                        );
                        if (res.ok) {
                            const data = await res.json();
                            setSelectedSubmission((prev) =>
                                prev ? { ...prev, feedbacks: data } : prev,
                            );
                        }
                    } catch (err) {
                        console.error('Failed to refresh feedbacks', err);
                    }
                },
            },
        );
    };

    const handleFinalReflectionSubmit = async (reflection: string) => {
        if (amILeader && unreviewedSubmissions.length > 0) {
            const SwalModule = await import('sweetalert2');
            await import('sweetalert2/dist/sweetalert2.min.css');
            const Swal = SwalModule.default;

            const htmlList = unreviewedSubmissions
                .map(
                    (s) =>
                        `<span style="display:inline-block;margin:2px 0;padding:2px 8px;border-radius:8px;background:#fbbf24;color:#78350f;font-weight:bold;">${s.group_name} (${s.group_code})</span>`,
                )
                .join('<br/>');

            await Swal.fire({
                icon: 'error',
                title: 'Belum Semua Feedback!',
                html:
                    'Kamu harus memberikan feedback pada semua karya kelompok lain sebelum submit refleksi akhir.<br><br>' +
                    htmlList,
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-xl',
                    title: 'font-bold',
                    confirmButton:
                        'bg-gradient-to-r from-indigo-600 to-purple-600',
                },
            });
            return;
        }

        if (amILeader && voteData && !voteData.has_voted) {
            const SwalModule = await import('sweetalert2');
            await import('sweetalert2/dist/sweetalert2.min.css');
            const Swal = SwalModule.default;

            await Swal.fire({
                icon: 'warning',
                title: 'Belum Vote!',
                text: 'Sebagai ketua, kamu harus memberikan vote untuk kelompok terbaik sebelum menyelesaikan misi.',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-xl',
                    title: 'font-bold',
                    confirmButton:
                        'bg-gradient-to-r from-amber-500 to-yellow-500',
                },
            });
            return;
        }

        setIsSubmittingReflection(true);
        onSubmitFinalReflection(reflection);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [gallerySubmissions.length, isMobile]);

    return (
        <div className="space-y-6 px-2 sm:space-y-8 sm:px-0">
            {/* Header Section */}
            <div className="overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 shadow-lg sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl shadow-lg sm:rounded-2xl sm:text-2xl">
                        ⭐
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-black text-slate-800 sm:mb-2 sm:text-2xl">
                            Evaluasi & Galeri Karya
                        </h3>
                        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700 sm:text-base">
                            Lihat karya teman-temanmu, berikan apresiasi dengan
                            like, dan bagikan feedback konstruktif untuk saling
                            belajar!
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Grid (paginated) */}
            {sortedSubmissions.length > 0 ? (
                <>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Menampilkan{' '}
                            <span className="font-bold text-slate-800">
                                {sortedSubmissions.length === 0
                                    ? 0
                                    : Math.min(
                                          (currentPage - 1) * itemsPerPage + 1,
                                          sortedSubmissions.length,
                                      )}
                                {' – '}
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    sortedSubmissions.length,
                                )}
                            </span>{' '}
                            dari{' '}
                            <span className="font-bold text-slate-800">
                                {sortedSubmissions.length}
                            </span>{' '}
                            karya
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pageItems.map((submission) => (
                            <GalleryCard
                                key={submission.id}
                                groupName={submission.group_name}
                                submittedAt={submission.submitted_at}
                                filePath={submission.file_path}
                                codeAnswer={submission.code_answer}
                                likesCount={submission.likes_count}
                                isLikedByMe={submission.is_liked_by_me}
                                amILeader={amILeader}
                                onLike={() => handleLike(submission.id)}
                                onViewDetail={() =>
                                    handleViewDetail(submission)
                                }
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Halaman{' '}
                            <span className="font-medium text-slate-800">
                                {currentPage}
                            </span>{' '}
                            /{' '}
                            <span className="font-medium text-slate-800">
                                {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span className="text-sm">←</span>
                                <span className="hidden sm:inline">Prev</span>
                            </button>

                            {!isMobile ? (
                                <div className="flex items-center gap-2 rounded-lg border border-indigo-50 bg-white/60 p-1">
                                    {Array.from({ length: totalPages }).map(
                                        (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    setCurrentPage(i + 1)
                                                }
                                                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                                                    currentPage === i + 1
                                                        ? 'bg-indigo-600 text-white shadow'
                                                        : 'border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="px-2 text-sm text-slate-500">
                                    {/* compact mobile */}
                                </div>
                            )}

                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <span className="text-sm">→</span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyGalleryState />
            )}

            {/* Best Group Vote Section */}
            {sortedSubmissions.length > 0 && voteData && (
                <BestGroupVote
                    missionSlug={missionSlug}
                    votableGroups={voteData.votable_groups}
                    hasVoted={voteData.has_voted}
                    myVote={voteData.my_vote}
                    amILeader={amILeader}
                />
            )}

            {/* Final Reflection Section */}
            {submittedPreviously ? (
                groupStatus === 'completed' ? (
                    <CompletionStatusCard
                        type="completed"
                        icon="✅"
                        title="Misi Telah Diselesaikan"
                        description="Refleksi akhir kelompok telah dikumpulkan. Berikut adalah ringkasan refleksi akhir:"
                        reflection={initialFinalReflection || undefined}
                    >
                        {onNext && (
                            <MissionButton
                                onClick={onNext}
                                icon="➡️"
                                size="lg"
                                className="max-w-xs"
                            >
                                Kembali ke Dashboard
                            </MissionButton>
                        )}
                    </CompletionStatusCard>
                ) : (
                    <CompletionStatusCard
                        type="waiting"
                        icon="⏳"
                        title="Menunggu Anggota Lain"
                        description="Refleksi akhir kamu sudah dikumpulkan. Menunggu anggota lain menyelesaikan refleksi akhir mereka sebelum misi dinyatakan selesai."
                        reflection={initialFinalReflection || undefined}
                    >
                        {onNext && (
                            <MissionButton
                                onClick={onNext}
                                icon="⏩"
                                size="lg"
                                className="max-w-xs"
                            >
                                Kembali ke Dashboard
                            </MissionButton>
                        )}
                    </CompletionStatusCard>
                )
            ) : (
                <FinalReflectionForm
                    initialValue={initialFinalReflection || ''}
                    isSubmitting={isSubmittingReflection}
                    onSubmit={handleFinalReflectionSubmit}
                />
            )}

            {/* Detail Modal */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    isOpen={showDetailModal}
                    groupName={selectedSubmission.group_name}
                    groupCode={selectedSubmission.group_code}
                    groupMembers={selectedSubmission.group_members}
                    filePath={selectedSubmission.file_path}
                    codeAnswer={selectedSubmission.code_answer}
                    feedbacks={selectedSubmission.feedbacks}
                    amILeader={amILeader}
                    onClose={() => setShowDetailModal(false)}
                    onSubmitFeedback={handleSubmitFeedback}
                />
            )}
        </div>
    );
}
