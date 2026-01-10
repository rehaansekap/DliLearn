import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
    number: number;
    title: string;
    description: string;
    icon: string;
}

interface MissionFormStepperProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

const steps: Step[] = [
    {
        number: 1,
        title: 'Info Dasar',
        description: 'Judul & tingkat kesulitan',
        icon: '📝',
    },
    {
        number: 2,
        title: 'Skenario',
        description: 'Video & narasi kasus',
        icon: '🎬',
    },
    {
        number: 3,
        title: 'Materi',
        description: 'PDF & kolaborasi',
        icon: '📚',
    },
    {
        number: 4,
        title: 'Review',
        description: 'Periksa & simpan',
        icon: '✅',
    },
];

export function MissionFormStepper({
    currentStep,
    onStepClick,
}: MissionFormStepperProps) {
    return (
        <div className="w-full">
            {/* Desktop Stepper */}
            <div className="hidden md:block">
                <div className="relative flex items-center justify-between">
                    {/* Progress Line */}
                    <div className="absolute top-6 right-12 left-12 h-1 bg-slate-200">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{
                                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            }}
                        />
                    </div>

                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;
                        const isClickable =
                            step.number <= currentStep ||
                            step.number >= currentStep;

                        return (
                            <div
                                key={step.number}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        isClickable &&
                                        onStepClick?.(step.number)
                                    }
                                    disabled={!isClickable}
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-full border-4 text-lg font-bold transition-all duration-300',
                                        isCompleted
                                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
                                            : isCurrent
                                              ? 'border-indigo-500 bg-white text-indigo-600 shadow-lg ring-4 ring-indigo-100'
                                              : 'border-slate-200 bg-white text-slate-400',
                                        isClickable
                                            ? 'cursor-pointer hover:scale-110'
                                            : 'cursor-not-allowed',
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-6 w-6" />
                                    ) : (
                                        <span>{step.icon}</span>
                                    )}
                                </button>
                                <div className="mt-3 text-center">
                                    <p
                                        className={cn(
                                            'text-sm font-bold',
                                            isCurrent || isCompleted
                                                ? 'text-indigo-700'
                                                : 'text-slate-500',
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Stepper */}
            <div className="md:hidden">
                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-lg">
                            {steps[currentStep - 1].icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                Step {currentStep} of {steps.length}
                            </p>
                            <p className="text-xs text-slate-500">
                                {steps[currentStep - 1].title}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className={cn(
                                    'h-2 w-6 rounded-full transition-all',
                                    step.number <= currentStep
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                        : 'bg-slate-200',
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
