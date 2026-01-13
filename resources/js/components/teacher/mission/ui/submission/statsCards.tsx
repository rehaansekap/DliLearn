import { cn } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';

interface StatsCardsProps {
    likesCount?: number;
    feedbacksCount?: number;
    isMobile?: boolean;
}

export function StatsCards({
    likesCount = 0,
    feedbacksCount = 0,
    isMobile = false,
}: StatsCardsProps) {
    return (
        <div className={cn('grid grid-cols-2', isMobile ? 'gap-2' : 'gap-4')}>
            {/* Likes */}
            <div
                className={cn(
                    'rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50',
                    isMobile ? 'p-3' : 'p-4',
                )}
            >
                <div
                    className={cn(
                        'flex items-center',
                        isMobile ? 'gap-2' : 'gap-3',
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md',
                            isMobile ? 'h-10 w-10' : 'h-12 w-12',
                        )}
                    >
                        <Heart
                            className={cn(
                                'fill-current',
                                isMobile ? 'h-5 w-5' : 'h-6 w-6',
                            )}
                        />
                    </div>
                    <div>
                        <p
                            className={cn(
                                'font-medium text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Total Likes
                        </p>
                        <p
                            className={cn(
                                'font-black text-pink-700',
                                isMobile ? 'text-xl' : 'text-2xl',
                            )}
                        >
                            {likesCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Feedbacks */}
            <div
                className={cn(
                    'rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50',
                    isMobile ? 'p-3' : 'p-4',
                )}
            >
                <div
                    className={cn(
                        'flex items-center',
                        isMobile ? 'gap-2' : 'gap-3',
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md',
                            isMobile ? 'h-10 w-10' : 'h-12 w-12',
                        )}
                    >
                        <MessageCircle
                            className={cn(isMobile ? 'h-5 w-5' : 'h-6 w-6')}
                        />
                    </div>
                    <div>
                        <p
                            className={cn(
                                'font-medium text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Total Feedback
                        </p>
                        <p
                            className={cn(
                                'font-black text-blue-700',
                                isMobile ? 'text-xl' : 'text-2xl',
                            )}
                        >
                            {feedbacksCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
