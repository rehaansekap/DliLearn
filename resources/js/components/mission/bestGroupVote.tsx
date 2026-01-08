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
                    Voting kelompok terbaik. Hanya Ketua yang dapat memilih —
                    tampilan ini bersifat read-only untuk anggota.
                </p>

                {/* Status for who voted (if applicable) */}
                {hasVoted && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                        <span className="text-3xl">✅</span>
                        <p className="mt-2 font-bold text-green-800">
                            Vote Tersimpan!
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                            Telah dipilih:{' '}
                            <span className="font-bold">{votedGroupName}</span>
                        </p>
                    </div>
                )}

                {/* Votable Groups (buttons disabled for non-leaders) */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                        Kelompok yang dapat dipilih:
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {votableGroups.map((group) => {
                            const selected = selectedGroupId === group.id;
                            const disabled =
                                isSubmitting || (!amILeader && true);
                            return (
                                <button
                                    key={group.id}
                                    onClick={() =>
                                        amILeader &&
                                        setSelectedGroupId(group.id)
                                    }
                                    disabled={disabled}
                                    aria-disabled={disabled}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200',
                                        selected
                                            ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300'
                                            : 'border-slate-200 bg-white',
                                        disabled
                                            ? 'cursor-not-allowed opacity-70'
                                            : 'hover:border-amber-300 hover:bg-amber-50',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-full text-white',
                                            selected
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
                                    {selected && (
                                        <span className="text-xl text-amber-500">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button (only visible/active for leaders) */}
                {amILeader && (
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
                )}
            </div>
        </MissionCard>
    );
}
