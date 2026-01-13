import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
    TextAreaInput,
    TextInput,
} from '@/components/teacher/mission/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArrowRight, Video } from 'lucide-react';
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
            <div
                className={cn(
                    'rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
                    isMobile ? 'p-4' : 'p-6',
                )}
            >
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

            {/* Main Content - Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Form Fields (2/3 width) */}
                <div className="space-y-6 lg:col-span-2">
                    <div
                        className={cn(
                            'space-y-6 rounded-2xl border border-slate-200 bg-white shadow-lg',
                            isMobile ? 'p-4' : 'p-6',
                        )}
                    >
                        {/* Video URL Field */}
                        <FormField>
                            <InputLabel
                                value="URL Video Orientasi (YouTube)"
                                icon="🎬"
                                required
                                htmlFor="video-url-input"
                            />
                            <TextInput
                                id="video-url-input"
                                type="url"
                                value={data.video_url}
                                onChange={(e) =>
                                    onChange('video_url', e.target.value)
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                                isError={!!errors.video_url}
                            />
                            <InputError message={errors.video_url} />
                            <FormHint>
                                Video pengantar untuk menjelaskan konteks
                                masalah kepada siswa
                            </FormHint>
                        </FormField>

                        {/* Video Preview */}
                        {data.video_url && (
                            <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
                                <div className="flex items-center gap-2 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
                                    <Video className="h-4 w-4 text-white" />
                                    <span className="text-sm font-semibold text-white">
                                        Preview Video
                                    </span>
                                </div>
                                <div className="p-2">
                                    {videoId ? (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title="Video Preview"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="h-full w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white">
                                            <div className="text-center">
                                                <Video className="mx-auto mb-2 h-12 w-12 text-purple-300" />
                                                <p className="text-sm text-slate-500">
                                                    Video akan muncul di sini
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Masukkan URL YouTube yang
                                                    valid
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Case Narrative Field */}
                        <FormField>
                            <InputLabel
                                value="Narasi Kasus (Problem Statement)"
                                icon="📖"
                                required
                                htmlFor="case-narrative-input"
                            />
                            <TextAreaInput
                                id="case-narrative-input"
                                value={data.case_narrative}
                                onChange={(e) =>
                                    onChange('case_narrative', e.target.value)
                                }
                                placeholder="Contoh: Mall Grand Indonesia mengubah sistem tarif parkirnya. 1 jam pertama Rp5.000, jam berikutnya Rp3.000 flat per jam. Bantu mereka membuat sistem perhitungan otomatis!"
                                rows={10}
                                isError={!!errors.case_narrative}
                                className="font-mono text-sm"
                            />
                            <InputError message={errors.case_narrative} />
                            <FormHint>
                                {data.case_narrative.length}/1000 karakter •
                                Deskripsikan masalah yang harus diselesaikan
                                siswa
                            </FormHint>
                        </FormField>
                    </div>
                </div>

                {/* Right Column - Tips Sidebar (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        {/* Tips Card */}
                        <div className="overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg">
                            <div className="border-b border-teal-200 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">💡</span>
                                    <h3 className="font-bold text-white">
                                        Tips Efektif
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-4">
                                <h4 className="font-semibold text-teal-900">
                                    Membuat Skenario PBL:
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-teal-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                                        <span>
                                            Gunakan konteks yang relevan dengan
                                            kehidupan siswa
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-teal-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                                        <span>
                                            Jelaskan masalah dengan jelas dan
                                            spesifik
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-teal-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                                        <span>
                                            Berikan hint tentang konsep coding
                                            yang akan digunakan
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-teal-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                                        <span>
                                            Buat narasi yang menarik dan
                                            memotivasi
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Best Practice Example */}
                        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
                            <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">✨</span>
                                    <h3 className="font-bold text-white">
                                        Contoh Bagus
                                    </h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="mb-2 text-xs font-semibold text-indigo-900">
                                    Narasi Kasus Efektif:
                                </p>
                                <div className="rounded-lg bg-white p-3 text-xs text-slate-700">
                                    <p className="italic">
                                        "Sebuah rumah sakit memiliki 3 ruang
                                        tunggu dengan kapasitas berbeda. Sistem
                                        antrean saat ini manual dan sering
                                        terjadi penumpukan. Buatlah program yang
                                        dapat mengatur distribusi pasien secara
                                        otomatis berdasarkan kondisi urgensi."
                                    </p>
                                </div>
                                <p className="mt-2 text-xs text-indigo-700">
                                    ✓ Konteks nyata, masalah jelas, ada
                                    constraint
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
