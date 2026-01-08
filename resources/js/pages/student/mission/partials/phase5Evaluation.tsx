import { CompletionStatusCard } from '@/components/mission/completionStatusCard';
import { FinalReflectionForm } from '@/components/mission/finalReflectionForm';
import { GalleryCard } from '@/components/mission/galleryCard';
import { SubmissionDetailModal } from '@/components/mission/submissionDetailModal';
import { EmptyGalleryState } from '@/components/mission/ui/emptyGalleryState';
import { MissionButton } from '@/components/mission/ui/missionButton';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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

interface Phase5EvaluationProps {
    gallerySubmissions: GallerySubmission[];
    onSubmitFinalReflection: (reflection: string) => void;
    initialFinalReflection?: string | null;
    submittedPreviously?: boolean;
    onNext?: () => void;
    groupStatus?: string;
    amILeader?: boolean;
    unreviewedSubmissions?: Array<{ group_name: string; group_code: string }>;
}

export default function Phase5Evaluation({
    gallerySubmissions,
    onSubmitFinalReflection,
    initialFinalReflection = '',
    submittedPreviously = false,
    onNext,
    groupStatus,
    amILeader = false,
    unreviewedSubmissions = [],
}: Phase5EvaluationProps) {
    const [selectedSubmission, setSelectedSubmission] =
        useState<GallerySubmission | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

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

        setIsSubmittingReflection(true);
        onSubmitFinalReflection(reflection);
    };

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

            {/* Gallery Grid */}
            {gallerySubmissions.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gallerySubmissions.map((submission) => (
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
                            onViewDetail={() => handleViewDetail(submission)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyGalleryState />
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
