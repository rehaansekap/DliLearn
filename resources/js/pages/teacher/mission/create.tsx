import {
    BackgroundPattern,
    FormContainer,
    FormNavigationButtons,
    PageLayout,
    StepContent,
} from '@/components/teacher/mission/ui/edit';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMissionForm } from '@/hooks/useMissionForm';
import TeacherLayout from '@/layouts/teacher-layout';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { MissionFormStepper } from './partials/missionFormStepper';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

interface CreateProps {
    auth: {
        user: User;
    };
    classrooms: Classroom[];
    ownMissions: { id: number; title: string }[];
}

export default function Create({ auth, classrooms, ownMissions }: CreateProps) {
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
        post,
    } = useMissionForm({
        initialData: {
            classroom_id: null,
            title: '',
            description: '',
            difficulty_level: 1,
            video_url: '',
            case_narrative: '',
            material_pdf: null,
            collab_url: '',
            simulator_config: '',
            prerequisite_mission_id: null,
            started_at: '',
            finished_at: '',
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent | undefined)
            ?.submitter as HTMLButtonElement | null;

        if (!submitter || submitter.dataset.intent !== 'submit-mission') {
            return;
        }

        if (currentStep !== 4) {
            return;
        }

        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            return;
        }

        const payload: Partial<typeof data> = { ...data };
        if (!(payload.material_pdf instanceof File)) {
            delete payload.material_pdf;
        }

        clearErrors('material_pdf');
        setIsSubmitting(true);

        post(
            route('teacher.missions.store'),
            payload as Record<string, unknown>,
            {
                forceFormData: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Buat Misi Baru
                    </h2>
                    <p className="text-xs text-slate-500">
                        Rancang misi pembelajaran berbasis PBL untuk siswa Anda
                    </p>
                </div>
            }
        >
            <Head title="Buat Misi Baru" />

            {/* Background Pattern */}
            <BackgroundPattern />

            <PageLayout>
                {/* Page Title */}
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8">
                    {isMobile && (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/teacher/dashboard"
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/70 backdrop-blur-sm transition hover:bg-purple-500/90"
                            >
                                <ArrowLeft className="h-5 w-5 text-white" />
                            </Link>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                                🎯
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex">
                            <Link
                                href="/teacher/dashboard"
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/70 backdrop-blur-sm transition hover:bg-purple-500/90"
                            >
                                <ArrowLeft className="h-5 w-5 text-white" />
                            </Link>
                        </div>
                        <div className="mb-3 hidden h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg sm:flex sm:h-16 sm:w-16 sm:text-3xl">
                            🎯
                        </div>
                        <div>
                            <h1
                                className={cn(
                                    'font-black text-slate-800',
                                    isMobile ? 'text-xl' : 'text-3xl',
                                )}
                            >
                                Buat Misi Pembelajaran Baru
                            </h1>
                            <p
                                className={cn(
                                    'mt-1 text-slate-600',
                                    isMobile ? 'text-xs' : 'text-sm',
                                )}
                            >
                                Ikuti 4 langkah untuk merancang misi PBL yang
                                menarik
                            </p>
                        </div>
                    </div>
                </div>

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
                        isEdit={false}
                    />
                </FormContainer>
            </PageLayout>
        </TeacherLayout>
    );
}
