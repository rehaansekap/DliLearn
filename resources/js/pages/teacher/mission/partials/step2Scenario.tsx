import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AlertCircle, Video } from 'lucide-react';
import { useMemo } from 'react';

interface Step2ScenarioProps {
    data: {
        video_url: string;
        case_narrative: string;
    };
    errors: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

function extractYoutubeVideoId(url: string): string | null {
    if (!url) return null;
    const regex =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function Step2Scenario({ data, errors, onChange }: Step2ScenarioProps) {
    const isMobile = useIsMobile();
    const videoId = useMemo(
        () => extractYoutubeVideoId(data.video_url),
        [data.video_url],
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                {isMobile && (
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        🎬
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'hidden items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg sm:flex',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        🎬
                    </div>
                    <div>
                        <h2
                            className={cn(
                                'font-bold text-slate-800',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            Skenario & Narasi Kasus (Tahap 1 PBL)
                        </h2>
                        <p
                            className={cn(
                                'text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Berikan konteks masalah yang akan diselesaikan siswa
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                {/* Video URL */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Video className="h-5 w-5 text-red-500" />
                        <span>URL Video Orientasi (YouTube)</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        value={data.video_url}
                        onChange={(e) => onChange('video_url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className={cn(
                            'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none',
                            errors.video_url
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.video_url && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.video_url}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Video pengantar untuk menjelaskan konteks masalah kepada
                        siswa
                    </p>
                </div>

                {/* Video Preview */}
                {videoId && (
                    <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-slate-900 shadow-lg">
                        <div className="flex items-center gap-2 border-b border-purple-300 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
                            <Video className="h-5 w-5 text-white" />
                            <span className="text-sm font-medium text-white">
                                Preview Video
                            </span>
                        </div>
                        <div className="relative aspect-video w-full">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="Video Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    </div>
                )}

                {/* Case Narrative */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <span>📖</span>
                        <span>Narasi Kasus (Problem Statement)</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={data.case_narrative}
                        onChange={(e) =>
                            onChange('case_narrative', e.target.value)
                        }
                        placeholder="Contoh: Mall Grand Indonesia mengubah sistem tarif parkirnya. 1 jam pertama Rp5.000, jam berikutnya Rp3.000 flat per jam. Bantu mereka membuat sistem perhitungan otomatis!"
                        rows={8}
                        className={cn(
                            'w-full resize-none rounded-xl border-2 px-4 py-3 font-mono text-sm text-slate-700 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none',
                            errors.case_narrative
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.case_narrative && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.case_narrative}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        {data.case_narrative.length}/1000 karakter
                    </p>
                </div>

                {/* Tips Box */}
                <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 text-2xl shadow">
                            💡
                        </div>
                        <div>
                            <h4 className="mb-2 font-bold text-teal-900">
                                Tips Membuat Narasi Kasus yang Efektif:
                            </h4>
                            <ul className="space-y-1 text-sm text-teal-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-600">→</span>
                                    <span>
                                        Gunakan konteks yang relevan dengan
                                        kehidupan siswa
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-600">→</span>
                                    <span>
                                        Jelaskan masalah dengan jelas dan
                                        spesifik
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-600">→</span>
                                    <span>
                                        Berikan hint tentang konsep coding yang
                                        akan digunakan
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-600">→</span>
                                    <span>
                                        Buat narasi yang menarik dan memotivasi
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
