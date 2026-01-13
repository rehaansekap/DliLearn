import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { StepIndicator } from './stepIndicator';

interface GroupProgressCardProps {
    group: {
        group_id: number;
        group_name: string;
        group_code: string;
        step1_status: 'locked' | 'in_progress' | 'completed';
        step2_status: 'locked' | 'in_progress' | 'completed';
        step3_status: 'locked' | 'in_progress' | 'completed';
        step4_status: 'locked' | 'in_progress' | 'completed';
        step5_status: 'locked' | 'in_progress' | 'completed';
        current_step: number;
    };
    onViewSubmission: (groupId: number) => void;
}

const STEP_LABELS = [
    'Orientasi',
    'Organisasi',
    'Creative Lab',
    'Penyajian',
    'Evaluasi',
];

export function GroupProgressCard({
    group,
    onViewSubmission,
}: GroupProgressCardProps) {
    const hasSubmission = group.step4_status === 'completed';

    const steps = [
        { status: group.step1_status, label: STEP_LABELS[0] },
        { status: group.step2_status, label: STEP_LABELS[1] },
        { status: group.step3_status, label: STEP_LABELS[2] },
        { status: group.step4_status, label: STEP_LABELS[3] },
        { status: group.step5_status, label: STEP_LABELS[4] },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:border-indigo-300 hover:shadow-xl">
            {/* Header */}
            <div className="border-b-2 border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-800">
                            {group.group_name}
                        </h4>
                        <p className="text-xs text-slate-500">
                            {group.group_code} • Step {group.current_step}/5
                        </p>
                    </div>
                    <div
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full font-bold text-white shadow-md',
                            group.current_step === 5
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-500',
                        )}
                    >
                        {group.group_name.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Body - Progress Steps */}
            <div className="overflow-x-auto px-2 py-4">
                <div className="flex items-center justify-start gap-0">
                    {steps.map((step, index) => (
                        <StepIndicator
                            key={index}
                            step={index + 1}
                            status={step.status}
                            label={step.label}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                <button
                    onClick={() => onViewSubmission(group.group_id)}
                    disabled={!hasSubmission}
                    className={cn(
                        'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                        hasSubmission
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                            : 'cursor-not-allowed border-2 border-slate-200 bg-slate-100 text-slate-400',
                    )}
                >
                    <Eye className="h-4 w-4" />
                    <span>
                        {hasSubmission
                            ? 'Lihat Submission'
                            : 'Belum Ada Submission'}
                    </span>
                </button>
            </div>
        </div>
    );
}
