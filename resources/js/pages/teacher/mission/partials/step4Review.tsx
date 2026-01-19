import {
    ConfirmationBox,
    DateDisplay,
    DifficultyBadge,
    ExternalLink,
    FileBadge,
    ReviewCard,
    ReviewItem,
} from '@/components/teacher/mission/ui/review';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { BookOpen, Code2, Info } from 'lucide-react';

interface Step4ReviewProps {
    data: {
        classroom_id: number | null;
        title: string;
        description: string;
        difficulty_level: number;
        video_url: string;
        case_narrative: string;
        material_pdf: File | string | null;
        simulator_config: string;
        prerequisite_mission_id?: number | null;
        started_at?: string | null;
        finished_at?: string | null;
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
    const materialFileName =
        data.material_pdf instanceof File
            ? data.material_pdf.name
            : data.material_pdf
              ? data.material_pdf.split('/').pop()
              : null;

    const lkpdFileName =
        data.lkpd_pdf instanceof File
            ? data.lkpd_pdf.name
            : data.lkpd_pdf
              ? data.lkpd_pdf.split('/').pop()
              : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div
                className={cn(
                    'rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
                    isMobile ? 'p-4' : 'p-6',
                )}
            >
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
            <div className="space-y-6">
                {/* Card 1: Basic Information */}
                <ReviewCard
                    title="Informasi Dasar"
                    icon={<Info className="h-6 w-6 text-indigo-600" />}
                    borderColor="border-indigo-100"
                    bgColor="bg-indigo-50/30"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ReviewItem label="Kelas">
                            <div className="flex items-center gap-2">
                                <span className="text-base">🏫</span>
                                <span className="font-semibold">
                                    {selectedClassroom?.name || '-'}
                                </span>
                            </div>
                        </ReviewItem>

                        <ReviewItem label="Tingkat Kesulitan">
                            <DifficultyBadge
                                level={data.difficulty_level}
                                label={difficultyLabels[data.difficulty_level]}
                            />
                        </ReviewItem>

                        <ReviewItem
                            label="Judul Misi"
                            className="md:col-span-2"
                        >
                            <p className="rounded-lg bg-white/60 p-3 text-base font-semibold text-slate-800">
                                {data.title || '-'}
                            </p>
                        </ReviewItem>

                        <ReviewItem label="Deskripsi" className="md:col-span-2">
                            <p className="rounded-lg bg-white/60 p-3 text-sm leading-relaxed text-slate-700">
                                {data.description || '-'}
                            </p>
                        </ReviewItem>

                        {(data.started_at || data.finished_at) && (
                            <>
                                <ReviewItem label="Tanggal Mulai">
                                    <DateDisplay
                                        date={data.started_at}
                                        type="start"
                                    />
                                </ReviewItem>

                                <ReviewItem label="Tanggal Selesai">
                                    <DateDisplay
                                        date={data.finished_at}
                                        type="end"
                                    />
                                </ReviewItem>
                            </>
                        )}
                    </div>
                </ReviewCard>

                {/* Card 2: Scenario & Problem */}
                <ReviewCard
                    title="Skenario & Masalah (PBL)"
                    icon={<BookOpen className="h-6 w-6 text-pink-600" />}
                    borderColor="border-pink-100"
                    bgColor="bg-pink-50/30"
                >
                    <div className="space-y-4">
                        <ReviewItem label="Video Orientasi (YouTube)">
                            <ExternalLink href={data.video_url}>
                                {data.video_url || '-'}
                            </ExternalLink>
                        </ReviewItem>

                        <ReviewItem label="Narasi Kasus / Problem Statement">
                            <div className="rounded-lg border border-pink-200 bg-white/50 p-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                                    {data.case_narrative || '-'}
                                </p>
                            </div>
                        </ReviewItem>
                    </div>
                </ReviewCard>

                {/* Card 3: Resources & Simulator */}
                <ReviewCard
                    title="Sumber Daya & Simulator"
                    icon={<Code2 className="h-6 w-6 text-amber-600" />}
                    borderColor="border-amber-100"
                    bgColor="bg-amber-50/30"
                >
                    <div className="space-y-4">
                        <ReviewItem label="Materi Pembelajaran (PDF)">
                            <FileBadge fileName={materialFileName} />
                        </ReviewItem>

                        <ReviewItem label="LKPD - Lembar Kerja (PDF)">
                            {lkpdFileName ? (
                                <FileBadge fileName={lkpdFileName} />
                            ) : (
                                <span className="text-sm text-slate-500">
                                    Tidak ada LKPD
                                </span>
                            )}
                        </ReviewItem>
                    </div>
                </ReviewCard>
            </div>

            {/* Confirmation Box */}
            <ConfirmationBox />
        </div>
    );
}
