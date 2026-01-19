import { Step1BasicInfo } from '@/pages/teacher/mission/partials/step1BasicInfo';
import { Step2Scenario } from '@/pages/teacher/mission/partials/step2Scenario';
import { Step3LearningResources } from '@/pages/teacher/mission/partials/step3LearningResources';
import { Step4Review } from '@/pages/teacher/mission/partials/step4Review';

interface StepContentProps {
    currentStep: number;
    data: {
        classroom_id: number | null;
        title: string;
        description: string;
        difficulty_level: number;
        video_url: string;
        case_narrative: string;
        material_pdf: File | string | null;
        lkpd_pdf?: File | string | null;
        collab_url: string;
        simulator_config: string;
        prerequisite_mission_id?: number | null;
        started_at?: string | null;
        finished_at?: string | null;
    };
    errors: Record<string, string>;
    classrooms: Array<{ id: number; name: string }>;
    missions: Array<{ id: number; title: string }>;
    onChange: (field: string, value: string | number | File | null) => void;
}

export function StepContent({
    currentStep,
    data,
    errors,
    classrooms,
    missions,
    onChange,
}: StepContentProps) {
    switch (currentStep) {
        case 1:
            return (
                <Step1BasicInfo
                    data={data}
                    errors={errors}
                    classrooms={classrooms}
                    missions={missions}
                    onChange={onChange}
                />
            );
        case 2:
            return (
                <Step2Scenario
                    data={data}
                    errors={errors}
                    onChange={onChange}
                />
            );
        case 3:
            return (
                <Step3LearningResources
                    data={data}
                    errors={errors}
                    onChange={onChange}
                />
            );
        case 4:
            return <Step4Review data={data} classrooms={classrooms} />;
        default:
            return null;
    }
}
