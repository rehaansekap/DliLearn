import { cn } from '@/lib/utils';
import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';

interface Mission {
    video_url?: string | null;
    case_narrative?: string | null;
    [key: string]: unknown;
}

interface Phase1OrientationProps {
    mission: Mission;
    initialReflection: string;
    onReflectionSubmit: (reflection: string) => void;
    processing: boolean;
    groupMissingNotice: string | null;
    isLocked: boolean;
    onRefresh: () => void;
    submittedPreviously?: boolean;
    onNext?: () => void;
}

export default function Phase1Orientation({
    mission,
    initialReflection,
    onReflectionSubmit,
    processing,
    groupMissingNotice,
    isLocked,
    onRefresh,
    submittedPreviously = false,
    onNext,
}: Phase1OrientationProps) {
    const [reflection, setReflection] = useState<string>(
        initialReflection ?? '',
    );
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePlayKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVideoPlaying(true);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onReflectionSubmit(reflection);
    };

    const getYouTubeId = (url?: string | null) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(mission.video_url);

    return (
        <div className="space-y-4 px-2 sm:space-y-8 sm:px-0">
            {/* Case Narrative Section */}
            <div className="overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg sm:rounded-2xl">
                <div className="border-b border-amber-200 bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-2 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-lg sm:text-xl">📖</span>
                        <h3 className="text-sm font-bold text-white sm:text-xl">
                            Deskripsi Kasus
                        </h3>
                    </div>
                </div>
                <div className="p-3 sm:p-6">
                    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700 sm:text-base">
                        {mission.case_narrative}
                    </p>
                </div>
            </div>

            {/* Video Section */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl sm:rounded-2xl sm:p-8">
                <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50 sm:h-14 sm:w-14">
                        <span className="text-xl sm:text-2xl">🎬</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white sm:text-xl">
                            Briefing Video
                        </h3>
                        <p className="text-sm text-slate-300">
                            Tonton untuk memahami misi ini
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                    {videoId ? (
                        <div className="relative aspect-video">
                            <iframe
                                title="Briefing Video"
                                src={`https://www.youtube.com/embed/${videoId}${
                                    isVideoPlaying ? '?autoplay=1' : ''
                                }`}
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => {
                                    /* iframe load handler (play detection not available reliably) */
                                }}
                            />
                            {!isVideoPlaying && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handlePlay}
                                    onKeyDown={handlePlayKey}
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm"
                                    aria-label="Play briefing video"
                                >
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                            <svg
                                                className="h-10 w-10 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-bold text-white">
                                            Klik untuk memutar
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex aspect-video items-center justify-center bg-slate-700">
                            <p className="text-slate-400">
                                Video tidak tersedia
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 shadow-lg sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 text-xl shadow sm:h-12 sm:w-12 sm:text-2xl">
                        💡
                    </div>
                    <div>
                        <h4 className="mb-1 font-bold text-teal-900 sm:mb-2 sm:text-base">
                            Tips untuk Refleksi yang Baik:
                        </h4>
                        <ul className="space-y-1 text-xs text-teal-800 sm:text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-teal-600">→</span>
                                <span>
                                    Identifikasi masalah utama dari cerita
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-teal-600">→</span>
                                <span>
                                    Pikirkan bagaimana logika pemrograman bisa
                                    membantu
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-teal-600">→</span>
                                <span>Tuliskan dengan jujur dan lengkap</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reflection Form */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💭</span>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Refleksi Awal
                            </h3>
                            <p className="text-sm text-indigo-100">
                                Ceritakan pendapatmu tentang masalah ini
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {submittedPreviously ? (
                            <div className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                                        <span className="text-4xl">✅</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-slate-800">
                                        Refleksi Terkumpul
                                    </h3>
                                    <p className="mx-auto max-w-xl text-sm text-slate-700">
                                        Terima kasih — refleksi awal sudah
                                        dikumpulkan.
                                    </p>
                                    <div className="mx-auto mt-4 w-full max-w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm">
                                        <pre className="text-sm break-words whitespace-pre-wrap text-slate-800">
                                            {reflection && reflection.length > 0
                                                ? reflection
                                                : 'Refleksi tidak tersedia.'}
                                        </pre>
                                    </div>
                                    {/* Notice if group missing */}
                                    {groupMissingNotice && (
                                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">
                                                    ⚠️
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-amber-800">
                                                        {groupMissingNotice}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isLocked === false && (
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                onClick={onNext}
                                                className="w-full max-w-xs rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700"
                                            >
                                                ▶️ Lanjutkan ke Tahap Berikutnya
                                            </button>
                                        </div>
                                    )}

                                    {/* Refresh button shown when locked */}
                                    {isLocked && (
                                        <button
                                            type="button"
                                            onClick={onRefresh}
                                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-bold text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
                                        >
                                            🔄 Periksa Status Kelompok
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        🤔 Apa yang kamu pikirkan tentang
                                        masalah ini?
                                    </label>
                                    <textarea
                                        value={reflection}
                                        onChange={(
                                            e: ChangeEvent<HTMLTextAreaElement>,
                                        ) => setReflection(e.target.value)}
                                        placeholder="Tuliskan pemikiranmu di sini... Minimal 10 karakter"
                                        rows={6}
                                        className={cn(
                                            'w-full rounded-xl border px-4 py-3 text-slate-700 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                            'border-slate-300',
                                            reflection.length >= 10 &&
                                                'border-green-300 bg-green-50/50',
                                            (submittedPreviously || isLocked) &&
                                                'cursor-not-allowed bg-slate-50 opacity-70',
                                        )}
                                        required
                                        disabled={
                                            submittedPreviously || isLocked
                                        }
                                        readOnly={
                                            submittedPreviously || isLocked
                                        }
                                    />
                                    <div className="mt-2 flex items-center justify-between text-xs">
                                        <span
                                            className={cn(
                                                'font-medium',
                                                reflection.length < 10
                                                    ? 'text-slate-500'
                                                    : 'text-green-600',
                                            )}
                                        >
                                            {reflection.length >= 10
                                                ? '✓ '
                                                : ''}
                                            {reflection.length} karakter
                                        </span>
                                        {reflection.length < 10 && (
                                            <span className="text-amber-600">
                                                Minimal 10 karakter
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        reflection.length < 10 ||
                                        isLocked
                                    }
                                    className={cn(
                                        'w-full rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-200',
                                        processing ||
                                            reflection.length < 10 ||
                                            isLocked
                                            ? 'cursor-not-allowed bg-slate-300'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]',
                                    )}
                                >
                                    {processing ? (
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
                                            <span>Menyimpan...</span>
                                        </div>
                                    ) : (
                                        <span>
                                            🚀 Kirim Refleksi & Lanjutkan
                                        </span>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
