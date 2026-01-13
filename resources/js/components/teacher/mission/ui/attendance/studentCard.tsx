import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface StudentCardProps {
    student: Student;
    isPresent: boolean;
    onToggle: () => void;
    isMobile: boolean;
}

export function StudentCard({
    student,
    isPresent,
    onToggle,
    isMobile,
}: StudentCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border-2 p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
                isPresent
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300',
            )}
        >
            {/* Decorative Circle */}
            <div
                className={cn(
                    'absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-all group-hover:scale-150',
                    isPresent ? 'bg-green-400' : 'bg-slate-300',
                )}
            />

            <div className="relative z-10 space-y-3">
                {/* Student Info */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                        className={cn(
                            'flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md',
                            isPresent
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                : 'bg-gradient-to-br from-slate-400 to-gray-500',
                        )}
                    >
                        <span className="text-sm font-bold text-white">
                            {student.name.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Name & Username */}
                    <div className="flex-1">
                        <p
                            className={cn(
                                'font-semibold',
                                isPresent ? 'text-green-900' : 'text-slate-800',
                            )}
                        >
                            {student.name}
                        </p>
                        <p
                            className={cn(
                                'text-sm',
                                isPresent ? 'text-green-700' : 'text-slate-500',
                            )}
                        >
                            @{student.username}
                        </p>
                    </div>

                    {/* Status Badge (Desktop Only) */}
                    {!isMobile && (
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full',
                                isPresent
                                    ? 'bg-green-500'
                                    : 'bg-slate-300 opacity-50',
                            )}
                        >
                            {isPresent ? (
                                <Check className="h-4 w-4 text-white" />
                            ) : (
                                <X className="h-4 w-4 text-slate-600" />
                            )}
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={onToggle}
                    className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all',
                        isPresent
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                            : 'border-2 border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
                    )}
                    aria-pressed={isPresent}
                    aria-label={`${student.name} ${isPresent ? 'hadir' : 'tidak hadir'}`}
                >
                    {isPresent ? (
                        <>
                            <Check className="h-4 w-4" />
                            <span>Hadir</span>
                        </>
                    ) : (
                        <>
                            <X className="h-4 w-4" />
                            <span>Tandai Hadir</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
