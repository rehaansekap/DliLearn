import { cn } from '@/lib/utils';

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div className="space-y-2">
            <p className="text-center text-xs text-slate-600">
                🚀 Progress:{' '}
                <span className="font-bold text-indigo-600">
                    {current}/{total}
                </span>
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                    className={cn(
                        'h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500',
                    )}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={current}
                    aria-valuemin={0}
                    aria-valuemax={total}
                />
            </div>
        </div>
    );
}
