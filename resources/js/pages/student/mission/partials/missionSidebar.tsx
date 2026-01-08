import { MissionStepItem } from '@/components/mission/missionStepItem';
import { ProgressBar } from '@/components/mission/progressBar';
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

function getStepStatus(
    step: number,
    activeTab: number,
    unlockedStep: number,
    groupStatus?: string,
): 'locked' | 'active' | 'completed' | 'available' {
    const isMissionCompleted = groupStatus === 'completed';

    if (step === activeTab) return 'active';
    if (step < unlockedStep || isMissionCompleted) return 'completed';
    if (step > unlockedStep) return 'locked';
    return 'available';
}

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
                isMobile
                    ? 'relative z-0 h-full w-full'
                    : 'sticky top-35 h-full w-full',
                'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:w-1/4',
            )}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                    Mission Timeline
                </h3>
            </div>

            {/* Steps List */}
            <div className="relative p-6">
                {/* Vertical Line */}
                <div className="absolute top-0 left-16 h-full w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-teal-200" />

                <div className="space-y-4">
                    {steps.map((item) => {
                        const status = getStepStatus(
                            item.step,
                            activeTab,
                            unlockedStep,
                            groupStatus,
                        );

                        return (
                            <MissionStepItem
                                key={item.step}
                                step={item.step}
                                label={item.label}
                                icon={item.icon}
                                status={status}
                                onClick={() => {
                                    if (status !== 'locked') {
                                        onTabChange(item.step);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Footer Progress */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <ProgressBar current={Math.min(unlockedStep, 5)} total={5} />
            </div>
        </div>
    );
}
