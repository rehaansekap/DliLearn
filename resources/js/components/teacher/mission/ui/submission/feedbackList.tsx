import { cn } from '@/lib/utils';

interface Feedback {
    id: number;
    user_name: string;
    group_name: string;
    message: string;
    created_at: string;
}

interface FeedbackListProps {
    feedbacks: Feedback[];
    isMobile?: boolean;
}

export function FeedbackList({
    feedbacks,
    isMobile = false,
}: FeedbackListProps) {
    if (feedbacks.length === 0) {
        return (
            <div>
                <h4
                    className={cn(
                        'mb-2 font-bold text-slate-700',
                        isMobile ? 'text-xs' : 'text-sm',
                    )}
                >
                    💬 Feedback dari Siswa (0)
                </h4>
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                    <span className="mb-2 block text-2xl">📝</span>
                    <p className="text-sm text-slate-500">
                        Belum ada feedback untuk karya ini
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h4
                className={cn(
                    'mb-2 font-bold text-slate-700',
                    isMobile ? 'text-xs' : 'text-sm',
                )}
            >
                💬 Feedback dari Siswa ({feedbacks.length})
            </h4>
            <div className={cn(isMobile ? 'space-y-2' : 'space-y-3')}>
                {feedbacks.map((feedback) => (
                    <div
                        key={feedback.id}
                        className={cn(
                            'rounded-xl border border-blue-200 bg-blue-50',
                            isMobile ? 'p-3' : 'p-4',
                        )}
                    >
                        <div
                            className={cn(
                                'mb-2 flex items-center gap-2',
                                isMobile ? 'mb-1.5' : 'mb-2',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 font-bold text-white',
                                    isMobile
                                        ? 'h-6 w-6 text-[10px]'
                                        : 'h-8 w-8 text-sm',
                                )}
                            >
                                {feedback.user_name.charAt(0)}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        'text-blue-800',
                                        isMobile ? 'text-xs' : 'text-sm',
                                    )}
                                >
                                    {feedback.user_name}
                                </p>
                                <p
                                    className={cn(
                                        'text-blue-600',
                                        isMobile ? 'text-[10px]' : 'text-xs',
                                    )}
                                >
                                    dari {feedback.group_name}
                                </p>
                            </div>
                        </div>
                        <p
                            className={cn(
                                'text-blue-800',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            {feedback.message}
                        </p>
                        <p
                            className={cn(
                                'text-blue-600',
                                isMobile ? 'mt-1 text-[10px]' : 'mt-2 text-xs',
                            )}
                        >
                            {new Date(feedback.created_at).toLocaleDateString(
                                'id-ID',
                                {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
