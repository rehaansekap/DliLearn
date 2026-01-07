import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MissionStep {
    step: number;
    label: string;
    icon: string;
}

interface MissionSidebarProps {
    activeTab: number;
    unlockedStep: number;
    onTabChange: (step: number) => void;
    hasSubmittedInitial: boolean;
    groupStatus?: string;
}

const steps: MissionStep[] = [
    { step: 1, label: 'Orientasi Masalah', icon: '🎬' },
    { step: 2, label: 'Organisasi Tim', icon: '👥' },
    { step: 3, label: 'Creative Lab', icon: '💡' },
    { step: 4, label: 'Penyajian Hasil', icon: '🎨' },
    { step: 5, label: 'Evaluasi & Galeri', icon: '⭐' },
];

export default function MissionSidebar({
    activeTab,
    unlockedStep,
    onTabChange,
    groupStatus,
}: MissionSidebarProps) {
    const isMobile = useIsMobile();

    return (
        <div
            className={cn(
                isMobile ? 'h-full w-full' : 'sticky top-4 h-full w-full',
                'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:w-1/4',
            )}
        >
            {' '}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                    Mission Timeline
                </h3>
            </div>
            <div className="relative p-6">
                {/* Vertical Line */}
                <div className="absolute top-0 left-16 h-full w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-teal-200" />

                <div className="space-y-4">
                    {steps.map((item) => {
                        const isActive = activeTab === item.step;
                        const isMissionCompleted = groupStatus === 'completed';
                        const isCompleted =
                            item.step < unlockedStep || isMissionCompleted;

                        const isLocked = item.step > unlockedStep;

                        return (
                            <button
                                key={item.step}
                                onClick={() =>
                                    !isLocked && onTabChange(item.step)
                                }
                                disabled={isLocked}
                                className={cn(
                                    'relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300',
                                    isActive &&
                                        'scale-105 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md ring-2 ring-indigo-500',
                                    !isActive &&
                                        !isLocked &&
                                        'hover:bg-slate-50',
                                    isLocked && 'cursor-not-allowed',
                                )}
                            >
                                <div
                                    className={cn(
                                        'relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 text-2xl transition-all duration-300',
                                        isActive &&
                                            'border-indigo-500 bg-indigo-600 shadow-lg shadow-indigo-500/50',
                                        isCompleted &&
                                            !isActive &&
                                            'border-teal-400 bg-teal-500',
                                        !isActive &&
                                            !isCompleted &&
                                            !isLocked &&
                                            'border-slate-300 bg-white',
                                        isLocked &&
                                            !isMissionCompleted &&
                                            'border-slate-200 bg-slate-100',
                                    )}
                                >
                                    {!isActive && !isLocked && isCompleted ? (
                                        <span className="text-slate-100">
                                            ✓
                                        </span>
                                    ) : (
                                        <span
                                            className={cn(
                                                isActive && 'scale-110',
                                            )}
                                        >
                                            {item.icon}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className="flex-1">
                                    <p
                                        className={cn(
                                            'text-sm font-bold transition-colors',
                                            isActive && 'text-indigo-700',
                                            isCompleted &&
                                                !isActive &&
                                                'text-teal-700',
                                            !isActive &&
                                                !isCompleted &&
                                                !isLocked &&
                                                'text-slate-700',
                                            isLocked && 'text-slate-400',
                                        )}
                                    >
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {isLocked &&
                                        !isCompleted &&
                                        item.step !== 1 &&
                                        !isActive
                                            ? 'Terkunci'
                                            : isCompleted && !isActive
                                              ? 'Selesai'
                                              : isActive
                                                ? 'Sedang Aktif'
                                                : isLocked
                                                  ? 'Terkunci'
                                                  : 'Siap Dimulai'}
                                    </p>
                                </div>

                                {/* Lock Icon */}
                                {isLocked && (
                                    <div className="flex-shrink-0">
                                        <span className="text-slate-300">
                                            🔒
                                        </span>
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
                    })}
                </div>
            </div>
            {/* Footer Info */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <p className="text-center text-xs text-slate-600">
                    🚀 Progress:{' '}
                    <span className="font-bold text-indigo-600">
                        {Math.min(unlockedStep, 5)}/5
                    </span>
                </p>
            </div>
        </div>
    );
}
