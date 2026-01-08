import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MissionCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
}

export function MissionCard({
    children,
    className,
    title,
    subtitle,
    icon,
    headerClassName,
    bodyClassName,
}: MissionCardProps) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg',
                className,
            )}
        >
            {(title || icon) && (
                <div
                    className={cn(
                        'border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 sm:px-6 sm:py-4',
                        headerClassName,
                    )}
                >
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="flex-shrink-0 text-2xl">{icon}</div>
                        )}
                        {title && (
                            <div>
                                <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="text-xs text-slate-600 sm:text-sm">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={cn('p-4 sm:p-6', bodyClassName)}>{children}</div>
        </div>
    );
}
