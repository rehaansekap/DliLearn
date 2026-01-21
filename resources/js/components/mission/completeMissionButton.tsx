import { cn } from '@/lib/utils';
import { MissionButton } from './ui/missionButton';
import { MissionCard } from './ui/missionCard';

interface CompleteMissionButtonProps {
    isLocked: boolean;
    lockReason?: string;
    amILeader: boolean;
    hasVoted: boolean;
    unreviewedCount: number;
    onClick: () => void;
}

export function CompleteMissionButton({
    isLocked,
    lockReason,
    amILeader,
    hasVoted,
    unreviewedCount,
    onClick,
}: CompleteMissionButtonProps) {
    if (isLocked) {
        return (
            <MissionCard
                className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
                bodyClassName="p-4 sm:p-6"
            >
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <div>
                        <h4 className="mb-2 text-lg font-bold text-amber-900">
                            Misi Belum Dapat Diselesaikan
                        </h4>
                        <p className="text-sm text-amber-800">
                            {lockReason ||
                                'Menunggu ketua kelompok menyelesaikan semua persyaratan.'}
                        </p>
                    </div>

                    {/* Detail persyaratan untuk ketua */}
                    {amILeader && (
                        <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-white p-4">
                            <p className="mb-3 text-sm font-bold text-slate-800">
                                Persyaratan yang harus diselesaikan:
                            </p>
                            <div className="space-y-2 text-left text-sm">
                                <div
                                    className={cn(
                                        'flex items-center gap-2',
                                        unreviewedCount === 0
                                            ? 'text-green-700'
                                            : 'text-slate-700',
                                    )}
                                >
                                    <span className="text-lg">
                                        {unreviewedCount === 0 ? '✅' : '❌'}
                                    </span>
                                    <span>
                                        Memberikan feedback ke semua kelompok
                                        {unreviewedCount > 0 && (
                                            <span className="ml-1 font-bold text-amber-600">
                                                ({unreviewedCount} tersisa)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        'flex items-center gap-2',
                                        hasVoted
                                            ? 'text-green-700'
                                            : 'text-slate-700',
                                    )}
                                >
                                    <span className="text-lg">
                                        {hasVoted ? '✅' : '❌'}
                                    </span>
                                    <span>
                                        Memberikan vote untuk kelompok terbaik
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info untuk anggota non-ketua */}
                    {!amILeader && (
                        <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-white p-4">
                            <p className="text-sm text-slate-700">
                                ⏳ Menunggu ketua kelompok menyelesaikan:
                            </p>
                            <ul className="mt-2 space-y-1 text-left text-xs text-slate-600">
                                <li>• Memberikan feedback ke semua kelompok</li>
                                <li>
                                    • Memberikan vote untuk kelompok terbaik
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </MissionCard>
        );
    }

    return (
        <MissionCard
            className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
            bodyClassName="p-4 sm:p-6"
        >
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                    <span className="text-3xl">🎯</span>
                </div>
                <div>
                    <h4 className="mb-2 text-lg font-bold text-green-900">
                        Siap Menyelesaikan Misi!
                    </h4>
                    <p className="text-sm text-green-800">
                        Semua persyaratan telah terpenuhi. Klik tombol di bawah
                        untuk mengisi refleksi akhir dan menyelesaikan misi ini.
                    </p>
                </div>
                <MissionButton
                    onClick={onClick}
                    icon="🏆"
                    size="lg"
                    variant="success"
                >
                    Selesaikan Misi
                </MissionButton>
            </div>
        </MissionCard>
    );
}
