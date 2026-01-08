import { cn } from '@/lib/utils';

type StepStatus = 'locked' | 'active' | 'completed' | 'available';

interface MissionStepItemProps {
    step: number;
    label: string;
    icon: string;
    status: StepStatus;
    onClick: () => void;
}

export function MissionStepItem({
    label,
    icon,
    status,
    onClick,
}: MissionStepItemProps) {
    const isLocked = status === 'locked';
    const isActive = status === 'active';
    const isCompleted = status === 'completed';

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                'relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300',
                // Active state
                isActive &&
                    'scale-105 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md ring-2 ring-indigo-500',
                // Hover state for available steps
                !isActive && !isLocked && 'hover:bg-slate-50',
                // Locked state
                isLocked && 'cursor-not-allowed opacity-60',
            )}
            aria-label={`${label} - ${status === 'active' ? 'Sedang Aktif' : status === 'completed' ? 'Selesai' : status === 'locked' ? 'Terkunci' : 'Siap Dimulai'}`}
        >
            {/* Step Icon Circle */}
            <div
                className={cn(
                    'relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 text-2xl transition-all duration-300',
                    // Active styling
                    isActive &&
                        'border-indigo-500 bg-indigo-600 shadow-lg shadow-indigo-500/50',
                    // Completed styling
                    isCompleted && !isActive && 'border-teal-400 bg-teal-500',
                    // Available styling
                    !isActive &&
                        !isCompleted &&
                        !isLocked &&
                        'border-slate-300 bg-white',
                    // Locked styling
                    isLocked && 'border-slate-200 bg-slate-100',
                )}
            >
                {isCompleted && !isActive ? (
                    <span className="text-white">✓</span>
                ) : (
                    <span className={cn(isActive && 'scale-110')}>{icon}</span>
                )}
            </div>

            {/* Label Section */}
            <div className="flex-1">
                <p
                    className={cn(
                        'text-sm font-bold transition-colors',
                        isActive && 'text-indigo-700',
                        isCompleted && !isActive && 'text-teal-700',
                        !isActive &&
                            !isCompleted &&
                            !isLocked &&
                            'text-slate-700',
                        isLocked && 'text-slate-400',
                    )}
                >
                    {label}
                </p>
                <p className="text-xs text-slate-500">
                    {isActive
                        ? 'Sedang Aktif'
                        : isCompleted
                          ? 'Selesai'
                          : isLocked
                            ? 'Terkunci'
                            : 'Siap Dimulai'}
                </p>
            </div>

            {/* Lock Icon */}
            {isLocked && (
                <div className="flex-shrink-0">
                    <span className="text-slate-300">🔒</span>
                </div>
            )}

            {/* Active Indicator Pulse */}
            {isActive && (
                <div className="absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                </div>
            )}
        </button>
    );
}
