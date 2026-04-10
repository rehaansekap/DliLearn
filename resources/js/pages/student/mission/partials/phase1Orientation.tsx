import { ReflectionStatusCard } from '@/components/mission/reflectionStatusCard';
import { MissionButton } from '@/components/mission/ui/missionButton';
import { MissionCard } from '@/components/mission/ui/missionCard';
import { MissionPageTitle } from '@/components/mission/ui/missionPageTitle';
import { cn } from '@/lib/utils';
import { ChangeEvent, FormEvent, useState } from 'react';

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onReflectionSubmit(reflection);
    };

    return (
        <div className="space-y-4 px-2 sm:space-y-8 sm:px-0">
            {/* Page Title */}
            <MissionPageTitle
                step={1}
                title="Orientasi Masalah"
                subtitle="Pahami konteks dan tantangan yang akan diselesaikan"
                icon="🎬"
                color="amber"
            />

            {/* Case Narrative Section */}
            <MissionCard
                title="Deskripsi Kasus"
                icon="📖"
                headerClassName="bg-gradient-to-r from-amber-400 to-orange-400 border-amber-200"
                className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
            >
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700 sm:text-base">
                    {mission.case_narrative}
                </p>
            </MissionCard>

            {/* Video Section */}
            {/* <VideoPlayer videoUrl={mission.video_url} /> */}

            {/* Tips Section */}
            <MissionCard
                className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50"
                bodyClassName="p-4 sm:p-6"
            >
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
            </MissionCard>

            {/* Reflection Form */}
            <MissionCard
                title="Refleksi Awal"
                subtitle="Ceritakan pendapatmu tentang masalah ini"
                icon="💭"
                headerClassName="bg-gradient-to-r from-indigo-500 to-purple-500 border-none"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {submittedPreviously ? (
                        <ReflectionStatusCard
                            reflection={reflection}
                            groupMissingNotice={groupMissingNotice}
                            isLocked={isLocked}
                            onRefresh={onRefresh}
                            onNext={onNext}
                        />
                    ) : (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    🤔 Apa yang kamu pikirkan tentang masalah
                                    ini?
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
                                    disabled={submittedPreviously || isLocked}
                                    readOnly={submittedPreviously || isLocked}
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
                                        {reflection.length >= 10 ? '✓ ' : ''}
                                        {reflection.length} karakter
                                    </span>
                                    {reflection.length < 10 && (
                                        <span className="text-amber-600">
                                            Minimal 10 karakter
                                        </span>
                                    )}
                                </div>
                            </div>
                            <MissionButton
                                type="submit"
                                disabled={
                                    processing ||
                                    reflection.length < 10 ||
                                    isLocked
                                }
                                isLoading={processing}
                                icon={!processing ? '🚀' : undefined}
                                fullWidth
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Kirim Refleksi & Lanjutkan'}
                            </MissionButton>
                        </>
                    )}
                </form>
            </MissionCard>
        </div>
    );
}
