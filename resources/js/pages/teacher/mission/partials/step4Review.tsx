import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CheckCircle2, FileText, Video } from 'lucide-react';

interface Step4ReviewProps {
    data: {
        classroom_id: number | null;
        title: string;
        description: string;
        difficulty_level: number;
        video_url: string;
        case_narrative: string;
        material_pdf: File | string | null;
        collab_url: string;
        simulator_config: string;
    };
    classrooms: Array<{ id: number; name: string }>;
}

const difficultyLabels: Record<number, string> = {
    1: 'Pemula',
    2: 'Menengah',
    3: 'Mahir',
    4: 'Expert',
    5: 'Master',
};

export function Step4Review({ data, classrooms }: Step4ReviewProps) {
    const isMobile = useIsMobile();
    const selectedClassroom = classrooms.find(
        (c) => c.id === data.classroom_id,
    );
    const fileName =
        data.material_pdf instanceof File
            ? data.material_pdf.name
            : data.material_pdf
              ? data.material_pdf.split('/').pop()
              : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                {isMobile && (
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl shadow-lg',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        ✅
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'hidden items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl shadow-lg sm:flex',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        ✅
                    </div>
                    <div>
                        <h2
                            className={cn(
                                'font-bold text-slate-800',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            Review & Konfirmasi
                        </h2>
                        <p
                            className={cn(
                                'text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Periksa kembali semua informasi sebelum menyimpan
                        </p>
                    </div>
                </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
                {/* Step 1 Review */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
                        <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                        <h3 className="text-lg font-bold text-slate-800">
                            Informasi Dasar
                        </h3>
                    </div>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                                Kelas:
                            </dt>
                            <dd className="font-bold text-slate-800">
                                {selectedClassroom?.name || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                                Judul:
                            </dt>
                            <dd className="font-bold text-slate-800">
                                {data.title || '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="mb-1 font-medium text-slate-600">
                                Deskripsi:
                            </dt>
                            <dd className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                                {data.description || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                                Tingkat Kesulitan:
                            </dt>
                            <dd className="font-bold text-slate-800">
                                Level {data.difficulty_level} -{' '}
                                {difficultyLabels[data.difficulty_level]}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Step 2 Review */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Video className="h-6 w-6 text-purple-600" />
                        <h3 className="text-lg font-bold text-slate-800">
                            Skenario PBL
                        </h3>
                    </div>
                    <dl className="space-y-3">
                        <div>
                            <dt className="mb-1 font-medium text-slate-600">
                                Video URL:
                            </dt>
                            <dd className="rounded-lg bg-slate-50 p-3 font-mono text-sm break-all text-slate-700">
                                {data.video_url || '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="mb-1 font-medium text-slate-600">
                                Narasi Kasus:
                            </dt>
                            <dd className="rounded-lg bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700">
                                {data.case_narrative || '-'}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Step 3 Review */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
                        <FileText className="h-6 w-6 text-cyan-600" />
                        <h3 className="text-lg font-bold text-slate-800">
                            Materi & Resources
                        </h3>
                    </div>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                                Materi PDF:
                            </dt>
                            <dd className="font-bold text-slate-800">
                                {fileName ? (
                                    <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1 text-sm text-green-700">
                                        <FileText className="h-4 w-4" />
                                        {fileName}
                                    </span>
                                ) : (
                                    <span className="text-slate-400">
                                        Tidak ada
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="mb-1 font-medium text-slate-600">
                                Link Kolaborasi:
                            </dt>
                            <dd className="rounded-lg bg-slate-50 p-3 font-mono text-sm break-all text-slate-700">
                                {data.collab_url || '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="mb-1 font-medium text-slate-600">
                                Simulator Config:
                            </dt>
                            <dd className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-green-400">
                                {data.simulator_config || '{}'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Summary Box */}
            <div className="rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-2xl shadow">
                        ℹ️
                    </div>
                    <div>
                        <h4 className="mb-2 font-bold text-emerald-900">
                            Siap untuk disimpan!
                        </h4>
                        <p className="text-sm text-emerald-800">
                            Pastikan semua informasi sudah benar. Klik tombol
                            "Simpan Misi" di bawah untuk menyimpan ke database.
                            Anda masih bisa mengedit misi setelah disimpan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
