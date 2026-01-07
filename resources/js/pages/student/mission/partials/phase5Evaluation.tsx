import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface GallerySubmission {
    id: number;
    group_name: string;
    file_path: string;
    code_answer: string;
    submitted_at: string;
    likes_count: number;
    has_user_liked: boolean;
    feedbacks?: Feedback[];
}

interface Feedback {
    id: number;
    user_name: string;
    message: string;
    created_at: string;
}

interface Phase5EvaluationProps {
    gallerySubmissions: GallerySubmission[];
    currentUserId: number;
    missionSlug: string;
    onSubmitFinalReflection: (reflection: string) => void;
    initialFinalReflection?: string | null;
    submittedPreviously?: boolean;
    onNext?: () => void;
    groupStatus?: string;
    amILeader?: boolean;
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
    const resolveFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };
    const [selectedSubmission, setSelectedSubmission] =
        useState<GallerySubmission | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [finalReflection, setFinalReflection] = useState<string>(
        initialFinalReflection ?? '',
    );
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
        setFeedbackMessage('');

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

    const handleSubmitFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission || !feedbackMessage.trim()) return;

        router.post(
            `/submission/${selectedSubmission.id}/feedback`,
            { message: feedbackMessage },
            {
                preserveScroll: true,
                onSuccess: async () => {
                    setFeedbackMessage('');

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

    const handleSubmitFinalReflection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (finalReflection.length < 20) return;

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
        onSubmitFinalReflection(finalReflection);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg">
                        ⭐
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-black text-slate-800">
                            Evaluasi & Galeri Karya
                        </h3>
                        <p className="text-slate-700">
                            Lihat karya teman-temanmu, berikan apresiasi dengan
                            like, dan bagikan feedback konstruktif untuk saling
                            belajar!
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Grid - Masonry Style */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallerySubmissions.map((submission) => (
                    <div
                        key={submission.id}
                        className={cn(
                            'group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-2xl',
                        )}
                    >
                        {/* Preview Image/Code */}
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                            {submission.file_path.match(
                                /\.(jpg|jpeg|png|gif)$/i,
                            ) ? (
                                <img
                                    src={
                                        resolveFileUrl(submission.file_path) ||
                                        undefined
                                    }
                                    alt={`Karya ${submission.group_name}`}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center p-6">
                                    <div className="rounded-lg bg-slate-800 p-4 font-mono text-xs text-green-400">
                                        <pre className="line-clamp-6">
                                            {submission.code_answer.substring(
                                                0,
                                                150,
                                            )}
                                            ...
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <button
                                    onClick={() => handleViewDetail(submission)}
                                    className="rounded-xl bg-white px-6 py-3 font-bold text-slate-800 shadow-lg transition-transform hover:scale-110"
                                >
                                    👁️ Lihat Detail
                                </button>
                            </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-4">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md">
                                    <span className="font-bold">
                                        {(submission.group_name || '?').charAt(
                                            0,
                                        )}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">
                                        {submission.group_name}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        {new Date(
                                            submission.submitted_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Like Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    amILeader && handleLike(submission.id)
                                }
                                disabled={!amILeader}
                                className={cn(
                                    'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-all duration-200',
                                    submission.is_liked_by_me
                                        ? 'border-2 border-pink-400 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 hover:border-neutral-100'
                                        : 'border-2 border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:bg-red-50',
                                    !amILeader &&
                                        'cursor-not-allowed opacity-60',
                                )}
                            >
                                <span className="text-xl">
                                    {submission.is_liked_by_me ? '🤍' : '❤️'}
                                </span>
                                <span>{submission.likes_count} Likes </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {gallerySubmissions.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                        <span className="text-4xl">📭</span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                        Belum Ada Karya
                    </h4>
                    <p className="text-slate-500">
                        Jadilah yang pertama menyelesaikan misi ini!
                    </p>
                </div>
            )}

            {/* Final Reflection Section */}
            {submittedPreviously ? (
                groupStatus === 'completed' ? (
                    <div className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                        <div className="p-12 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                                <span className="text-5xl">✅</span>
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-slate-800">
                                Misi Telah Diselesaikan
                            </h3>
                            <p className="mx-auto max-w-2xl text-slate-700">
                                Refleksi akhir kelompok telah dikumpulkan.
                                Berikut adalah ringkasan refleksi akhir:
                            </p>

                            <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
                                <pre className="text-sm whitespace-pre-wrap text-slate-800">
                                    {initialFinalReflection &&
                                    initialFinalReflection.length > 0
                                        ? initialFinalReflection
                                        : 'Refleksi akhir belum tersedia.'}
                                </pre>
                            </div>

                            <div className="mt-6 flex justify-center gap-3">
                                {onNext && (
                                    <button
                                        onClick={onNext}
                                        className="w-full max-w-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        ➡️ Kembali ke Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
                        <div className="p-12 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg">
                                <span className="text-5xl">⏳</span>
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-slate-800">
                                Menunggu Anggota Lain
                            </h3>
                            <p className="mx-auto max-w-2xl text-slate-700">
                                Refleksi akhir kamu sudah dikumpulkan.
                                <br />
                                Menunggu anggota lain menyelesaikan refleksi
                                akhir mereka sebelum misi dinyatakan selesai.
                            </p>
                            <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
                                <pre className="text-sm whitespace-pre-wrap text-slate-800">
                                    {initialFinalReflection &&
                                    initialFinalReflection.length > 0
                                        ? initialFinalReflection
                                        : 'Refleksi akhir belum tersedia.'}
                                </pre>
                            </div>
                            <div className="mt-6 flex justify-center gap-3">
                                {onNext && (
                                    <button
                                        onClick={onNext}
                                        className="w-full max-w-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        ⏩ Kembali ke Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-lg">
                    <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Refleksi Akhir
                                </h3>
                                <p className="text-sm text-indigo-100">
                                    Ceritakan pengalaman belajarmu di misi ini
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmitFinalReflection}
                        className="p-6"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    💭 Apa yang kamu pelajari dari misi ini?
                                </label>
                                <textarea
                                    value={finalReflection}
                                    onChange={(e) =>
                                        setFinalReflection(e.target.value)
                                    }
                                    placeholder="Tuliskan refleksi akhirmu... Minimal 20 karakter"
                                    rows={6}
                                    className={cn(
                                        'w-full rounded-xl border px-4 py-3 text-slate-700 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                        'border-slate-300',
                                        finalReflection.length >= 20 &&
                                            'border-green-300 bg-green-50/50',
                                    )}
                                    required
                                />
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span
                                        className={cn(
                                            'font-medium',
                                            finalReflection.length < 20
                                                ? 'text-slate-500'
                                                : 'text-green-600',
                                        )}
                                    >
                                        {finalReflection.length >= 20
                                            ? '✓ '
                                            : ''}
                                        {finalReflection.length} karakter
                                    </span>
                                    {finalReflection.length < 20 && (
                                        <span className="text-amber-600">
                                            Minimal 20 karakter
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isSubmittingReflection ||
                                    finalReflection.length < 20
                                }
                                className={cn(
                                    'w-full rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-200',
                                    isSubmittingReflection ||
                                        finalReflection.length < 20
                                        ? 'cursor-not-allowed bg-slate-300'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl active:scale-[0.98]',
                                )}
                            >
                                {isSubmittingReflection ? (
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
                    </form>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedSubmission && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setShowDetailModal(false)}
                >
                    <div
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎨</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {selectedSubmission.group_name}
                                        </h3>
                                        <p className="text-sm text-indigo-100">
                                            Detail Karya
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Flowchart Preview */}
                                <div>
                                    <h4 className="mb-3 font-bold text-slate-800">
                                        📊 Flowchart
                                    </h4>
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        {/\.(jpg|jpeg|png|gif)$/i.test(
                                            selectedSubmission.file_path || '',
                                        ) ? (
                                            <img
                                                src={
                                                    resolveFileUrl(
                                                        selectedSubmission.file_path,
                                                    ) || undefined
                                                }
                                                alt="Flowchart"
                                                className="w-full"
                                            />
                                        ) : /\.(pdf)$/i.test(
                                              selectedSubmission.file_path ||
                                                  '',
                                          ) ? (
                                            <div className="h-[480px] w-full">
                                                <object
                                                    data={
                                                        resolveFileUrl(
                                                            selectedSubmission.file_path,
                                                        ) || undefined
                                                    }
                                                    type="application/pdf"
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <div className="p-6 text-center">
                                                        <p className="mb-2 text-slate-700">
                                                            Tidak dapat
                                                            menampilkan PDF.
                                                            Klik tautan di bawah
                                                            untuk mengunduh /
                                                            membuka di tab baru.
                                                        </p>
                                                        <a
                                                            href={
                                                                resolveFileUrl(
                                                                    selectedSubmission.file_path,
                                                                ) || '#'
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-md bg-indigo-600 px-4 py-2 text-white"
                                                        >
                                                            Buka PDF
                                                        </a>
                                                    </div>
                                                </object>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-100 p-4 text-center text-slate-600">
                                                <span className="text-4xl">
                                                    📄
                                                </span>
                                                <p className="mt-2">
                                                    File:{' '}
                                                    {
                                                        selectedSubmission.file_path
                                                    }
                                                </p>
                                                <a
                                                    href={
                                                        resolveFileUrl(
                                                            selectedSubmission.file_path,
                                                        ) || '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-block text-sm text-indigo-600"
                                                >
                                                    Buka file
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Source Code */}
                                <div>
                                    <h4 className="mb-3 font-bold text-slate-800">
                                        💻 Source Code
                                    </h4>
                                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                                        <pre className="overflow-x-auto p-6 text-sm text-green-400">
                                            {selectedSubmission.code_answer}
                                        </pre>
                                    </div>
                                </div>

                                {/* Feedback Section */}
                                <div>
                                    <h4 className="mb-3 font-bold text-slate-800">
                                        💬 Feedback (
                                        {selectedSubmission.feedbacks?.length ||
                                            0}
                                        )
                                    </h4>

                                    {/* Feedback List */}
                                    <div className="mb-4 space-y-3">
                                        {selectedSubmission.feedbacks?.map(
                                            (feedback) => (
                                                <div
                                                    key={feedback.id}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                                                            {feedback.user_name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {
                                                                    feedback.user_name
                                                                }
                                                                &nbsp; (
                                                                {
                                                                    selectedSubmission.group_name
                                                                }
                                                                )
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {new Date(
                                                                    feedback.created_at,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-700">
                                                        {feedback.message}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Feedback Form */}
                                    {amILeader ? (
                                        <form
                                            onSubmit={handleSubmitFeedback}
                                            className="space-y-3"
                                        >
                                            <textarea
                                                value={feedbackMessage}
                                                onChange={(e) =>
                                                    setFeedbackMessage(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Berikan feedback konstruktif... (Min: 5 karakter)"
                                                rows={3}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={
                                                    feedbackMessage.length < 5
                                                }
                                                className={cn(
                                                    'w-full rounded-xl px-4 py-3 font-bold text-white transition-all duration-200',
                                                    feedbackMessage.length < 5
                                                        ? 'cursor-not-allowed bg-slate-300'
                                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
                                                )}
                                            >
                                                📤 Kirim Feedback
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                                            Hanya ketua kelompok yang dapat
                                            memberikan feedback.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
