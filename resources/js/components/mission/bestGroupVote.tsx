import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { MissionButton } from './ui/missionButton';
import { MissionCard } from './ui/missionCard';

interface VotableGroup {
    id: number;
    name: string;
    group_code: string;
}

interface BestGroupVoteProps {
    missionSlug: string;
    votableGroups: VotableGroup[];
    hasVoted: boolean;
    myVote: number | null;
    amILeader: boolean;
}

export function BestGroupVote({
    missionSlug,
    votableGroups,
    hasVoted,
    myVote,
    amILeader,
}: BestGroupVoteProps) {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
        myVote,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!amILeader) {
        return (
            <MissionCard
                title="Vote Kelompok Terbaik"
                icon="🏆"
                headerClassName="bg-gradient-to-r from-amber-400 to-yellow-400 border-amber-200"
                className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
            >
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                    <span className="text-2xl">🔒</span>
                    <p className="mt-2 text-sm text-amber-800">
                        Hanya ketua kelompok yang dapat memberikan vote untuk
                        kelompok terbaik.
                    </p>
                </div>
            </MissionCard>
        );
    }

    const handleSubmitVote = async () => {
        if (!selectedGroupId) return;

        setIsSubmitting(true);
        router.post(
            `/mission/${missionSlug}/vote`,
            { voted_group_id: selectedGroupId },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const votedGroupName = votableGroups.find((g) => g.id === myVote)?.name;

    return (
        <MissionCard
            title="Vote Kelompok Terbaik"
            icon="🏆"
            headerClassName="bg-gradient-to-r from-amber-400 to-yellow-400 border-amber-200"
            className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-700">
                    Sebagai ketua kelompok, kamu dapat memberikan vote untuk
                    kelompok yang menurutmu memiliki karya terbaik.{' '}
                    <span className="font-medium text-amber-700">
                        Kamu tidak dapat memilih kelompokmu sendiri.
                    </span>
                </p>

                {hasVoted ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                        <span className="text-3xl">✅</span>
                        <p className="mt-2 font-bold text-green-800">
                            Vote Tersimpan!
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                            Kamu telah memilih:{' '}
                            <span className="font-bold">{votedGroupName}</span>
                        </p>
                        <p className="mt-2 text-xs text-green-600">
                            Kamu masih bisa mengubah pilihanmu sebelum misi
                            berakhir.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                        <span className="text-xl">⚠️</span>
                        <p className="mt-1 text-sm text-amber-800">
                            Kamu belum memberikan vote. Pilih kelompok terbaik
                            di bawah ini.
                        </p>
                    </div>
                )}

                {/* Votable Groups */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                        Pilih kelompok terbaik:
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {votableGroups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => setSelectedGroupId(group.id)}
                                disabled={isSubmitting}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200',
                                    selectedGroupId === group.id
                                        ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300'
                                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50',
                                    isSubmitting &&
                                        'cursor-not-allowed opacity-60',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full text-white',
                                        selectedGroupId === group.id
                                            ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                                            : 'bg-gradient-to-br from-slate-400 to-slate-500',
                                    )}
                                >
                                    <span className="font-bold">
                                        {group.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800">
                                        {group.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {group.group_code}
                                    </p>
                                </div>
                                {selectedGroupId === group.id && (
                                    <span className="text-xl">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                    <MissionButton
                        onClick={handleSubmitVote}
                        disabled={!selectedGroupId || isSubmitting}
                        isLoading={isSubmitting}
                        icon={!isSubmitting ? '🗳️' : undefined}
                        variant="warning"
                        size="lg"
                    >
                        {isSubmitting
                            ? 'Menyimpan...'
                            : hasVoted
                              ? 'Ubah Vote'
                              : 'Submit Vote'}
                    </MissionButton>
                </div>
            </div>
        </MissionCard>
    );
}
