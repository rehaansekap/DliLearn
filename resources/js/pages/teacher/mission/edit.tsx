import {
    BackgroundPattern,
    EditMissionHeader,
    FormContainer,
    FormNavigationButtons,
    PageLayout,
    StepContent,
} from '@/components/teacher/mission/ui/edit';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMissionForm } from '@/hooks/useMissionForm';
import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { MissionFormStepper } from './partials/missionFormStepper';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

interface Mission {
    id: number;
    classroom_id: number | null;
    title: string;
    description: string;
    difficulty_level: number;
    video_url: string;
    case_narrative: string;
    material_pdf: string | null;
    simulator_config: string;
    prerequisite_mission_id?: number | null;
    started_at?: string | null;
    finished_at?: string | null;
}

interface EditProps {
    auth: {
        user: User;
    };
    mission: Mission;
    classrooms: Classroom[];
    ownMissions: { id: number; title: string }[];
}

export default function Edit({
    auth,
    mission,
    classrooms,
    ownMissions,
}: EditProps) {
    const isMobile = useIsMobile();

    const {
        data,
        errors,
        processing,
        isSubmitting,
        currentStep,
        setIsSubmitting,
        handleChange,
        handleNext,
        handleBack,
        handleStepClick,
        validateStep,
        clearErrors,
        put,
    } = useMissionForm({
        initialData: {
            classroom_id: mission.classroom_id,
            title: mission.title,
            description: mission.description,
            difficulty_level: mission.difficulty_level,
            video_url: mission.video_url,
            case_narrative: mission.case_narrative,
            material_pdf: mission.material_pdf,
            simulator_config: mission.simulator_config || '',
            prerequisite_mission_id: mission.prerequisite_mission_id ?? null,
            started_at: mission.started_at ?? '',
            finished_at: mission.finished_at ?? '',
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent | undefined)
            ?.submitter as HTMLButtonElement | null;

        if (!submitter || submitter.dataset.intent !== 'submit-mission') {
            return;
        }

        if (currentStep !== 4) return;

        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            return;
        }

        clearErrors('material_pdf');
        setIsSubmitting(true);

        put(route('teacher.missions.update', mission.id), {
            forceFormData: true,
            transform: (formData) => {
                const next = { ...formData } as typeof formData & {
                    material_pdf?: File | string | null;
                };

                if (!(next.material_pdf instanceof File)) {
                    delete next.material_pdf;
                }

                return next;
            },
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Edit Misi
                    </h2>
                    <p className="text-xs text-slate-500">
                        Perbarui informasi misi pembelajaran
                    </p>
                </div>
            }
        >
            <Head title={`Edit: ${mission.title}`} />

            {/* Background Pattern */}
            <BackgroundPattern />

            <PageLayout>
                {/* Mission Header */}
                <EditMissionHeader
                    missionTitle={mission.title}
                    backUrl="/teacher/dashboard"
                    isMobile={isMobile}
                />

                {/* Stepper */}
                <MissionFormStepper
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />

                {/* Form */}
                <FormContainer onSubmit={handleSubmit}>
                    {/* Step Content */}
                    <StepContent
                        currentStep={currentStep}
                        data={data}
                        errors={errors}
                        classrooms={classrooms}
                        missions={ownMissions}
                        onChange={handleChange}
                    />

                    {/* Navigation Buttons */}
                    <FormNavigationButtons
                        currentStep={currentStep}
                        totalSteps={4}
                        errors={errors}
                        processing={processing}
                        isSubmitting={isSubmitting}
                        onBack={handleBack}
                        onNext={handleNext}
                        isEdit={true}
                    />
                </FormContainer>
            </PageLayout>
        </TeacherLayout>
    );
}
