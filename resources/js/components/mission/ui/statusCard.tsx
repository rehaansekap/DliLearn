import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type StatusType = 'waiting' | 'success' | 'info' | 'warning';

interface StatusCardProps {
    type: StatusType;
    icon: string;
    title: string;
    description: string | ReactNode;
    children?: ReactNode;
}

const statusStyles: Record<StatusType, { bg: string; iconBg: string }> = {
    waiting: {
        bg: 'from-slate-50 to-slate-100',
        iconBg: 'from-indigo-100 to-purple-100',
    },
    success: {
        bg: 'from-green-50 to-emerald-50',
        iconBg: 'from-green-400 to-emerald-500',
    },
    info: {
        bg: 'from-blue-50 to-cyan-50',
        iconBg: 'from-blue-400 to-cyan-500',
    },
    warning: {
        bg: 'from-amber-50 to-orange-50',
        iconBg: 'from-amber-400 to-orange-500',
    },
};

export function StatusCard({
    type,
    icon,
    title,
    description,
    children,
}: StatusCardProps) {
    const styles = statusStyles[type];

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-slate-200 shadow-lg sm:rounded-2xl',
                `bg-gradient-to-br ${styles.bg}`,
            )}
        >
            <div className="p-8 text-center sm:p-12">
                <div
                    className={cn(
                        'mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg sm:mb-6 sm:h-24 sm:w-24',
                        `bg-gradient-to-br ${styles.iconBg}`,
                    )}
                >
                    <span className="text-4xl sm:text-5xl">{icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800 sm:mb-3 sm:text-2xl">
                    {title}
                </h3>
                <div className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
                    {description}
                </div>
                {children && <div className="mt-6">{children}</div>}
            </div>
        </div>
    );
}
