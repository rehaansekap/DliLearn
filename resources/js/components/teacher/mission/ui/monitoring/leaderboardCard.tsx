import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface LeaderboardItem {
    group_id: number;
    group_name: string;
    group_code: string | null;
    vote_count: number;
}

interface LeaderboardCardProps {
    results: LeaderboardItem[];
    totalVotes: number;
}

export function LeaderboardCard({ results, totalVotes }: LeaderboardCardProps) {
    if (totalVotes === 0) {
        return (
            <div className="sticky top-20 overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-lg">
                <div className="border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-600" />
                        <h3 className="font-bold text-slate-800">
                            🏆 Leaderboard
                        </h3>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                        <span className="text-2xl">🗳️</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                        Belum Ada Vote
                    </p>
                    <p className="text-xs text-slate-500">
                        Siswa belum memberikan vote
                    </p>
                </div>
            </div>
        );
    }

    const top3 = results.slice(0, 3);
    const rest = results.slice(3);

    return (
        <div className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-600" />
                    <h3 className="font-bold text-slate-800">🏆 Leaderboard</h3>
                </div>
                <p className="text-xs text-slate-500">
                    Total {totalVotes} votes
                </p>
            </div>

            {/* Top 3 */}
            <div className="space-y-2 p-4">
                {top3.map((item, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const gradients = [
                        'from-amber-500 to-yellow-500',
                        'from-slate-400 to-gray-500',
                        'from-orange-400 to-amber-600',
                    ];

                    return (
                        <div
                            key={item.group_id}
                            className={cn(
                                'flex items-center gap-3 rounded-xl border-2 p-3 transition-all hover:scale-[1.02]',
                                index === 0
                                    ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50'
                                    : 'border-slate-200 bg-slate-50',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-black text-white shadow-md',
                                    `bg-gradient-to-br ${gradients[index]}`,
                                )}
                            >
                                <span className="text-xl">{medals[index]}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p
                                    className={cn(
                                        'truncate font-bold',
                                        index === 0
                                            ? 'text-amber-900'
                                            : 'text-slate-800',
                                    )}
                                >
                                    {item.group_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.group_code || 'No Code'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={cn(
                                        'text-2xl font-black',
                                        index === 0
                                            ? 'text-amber-700'
                                            : 'text-slate-700',
                                    )}
                                >
                                    {item.vote_count}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.vote_count === 1 ? 'vote' : 'votes'}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {/* Rest of the list */}
                {rest.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">
                        {rest.map((item, index) => (
                            <div
                                key={item.group_id}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-6 text-center font-bold text-slate-400">
                                        #{index + 4}
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {item.group_name}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-600">
                                    {item.vote_count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
