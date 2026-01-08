import { MissionButton } from './ui/missionButton';

interface ReflectionStatusCardProps {
    reflection: string;
    groupMissingNotice?: string | null;
    isLocked: boolean;
    onRefresh: () => void;
    onNext?: () => void;
}

export function ReflectionStatusCard({
    reflection,
    groupMissingNotice,
    isLocked,
    onRefresh,
    onNext,
}: ReflectionStatusCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                    <span className="text-4xl">✅</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">
                    Refleksi Terkumpul
                </h3>
                <p className="mx-auto max-w-xl text-sm text-slate-700">
                    Terima kasih — refleksi awal sudah dikumpulkan.
                </p>
                <div className="mx-auto mt-4 w-full max-w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm">
                    <pre className="text-sm break-words whitespace-pre-wrap text-slate-800">
                        {reflection && reflection.length > 0
                            ? reflection
                            : 'Refleksi tidak tersedia.'}
                    </pre>
                </div>

                {groupMissingNotice && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    {groupMissingNotice}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isLocked === false && onNext && (
                    <div className="mt-4">
                        <MissionButton
                            onClick={onNext}
                            icon="▶️"
                            fullWidth
                            className="max-w-xs"
                        >
                            Lanjutkan ke Tahap Berikutnya
                        </MissionButton>
                    </div>
                )}

                {isLocked && (
                    <div className="mt-4">
                        <MissionButton
                            onClick={onRefresh}
                            variant="success"
                            icon="🔄"
                            fullWidth
                        >
                            Periksa Status Kelompok
                        </MissionButton>
                    </div>
                )}
            </div>
        </div>
    );
}
