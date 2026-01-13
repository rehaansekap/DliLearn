import { cn } from '@/lib/utils';
import { CheckCheck, RotateCcw } from 'lucide-react';

interface AttendanceHeaderProps {
    title: string;
    subtitle: string;
    totalStudents: number;
    onMarkAllPresent: () => void;
    onClearAll: () => void;
    isMobile: boolean;
}

export function AttendanceHeader({
    title,
    subtitle,
    totalStudents,
    onMarkAllPresent,
    onClearAll,
    isMobile,
}: AttendanceHeaderProps) {
    return (
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-lg sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Title & Icon */}
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-xl shadow-lg',
                            isMobile
                                ? 'h-12 w-12 text-xl'
                                : 'h-14 w-14 text-2xl',
                        )}
                    >
                        ✅
                    </div>
                    <div>
                        <h2
                            className={cn(
                                'font-bold text-slate-800',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            {title}
                        </h2>
                        <p
                            className={cn(
                                'text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Right: Action Buttons */}
                {totalStudents > 0 && (
                    <div
                        className={cn(
                            'flex gap-2',
                            isMobile ? 'flex-col' : 'flex-row',
                        )}
                    >
                        <button
                            type="button"
                            onClick={onMarkAllPresent}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-all hover:bg-green-50 hover:shadow-md"
                        >
                            <CheckCheck className="h-4 w-4" />
                            <span>Tandai Semua Hadir</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClearAll}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Reset</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
