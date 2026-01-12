import { useIsMobile } from '@/hooks/use-mobile';
import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { MissionFormStepper } from './partials/missionFormStepper';
import { Step1BasicInfo } from './partials/step1BasicInfo';
import { Step2Scenario } from './partials/step2Scenario';
import { Step3LearningResources } from './partials/step3LearningResources';
import { Step4Review } from './partials/step4Review';

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
    collab_url: string;
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
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        classroom_id: mission.classroom_id,
        title: mission.title,
        description: mission.description,
        difficulty_level: mission.difficulty_level,
        video_url: mission.video_url,
        case_narrative: mission.case_narrative,
        material_pdf: null as File | string | null,
        collab_url: mission.collab_url || '',
        simulator_config: mission.simulator_config || '',
        prerequisite_mission_id: mission.prerequisite_mission_id ?? null,
        started_at: mission.started_at ?? '',
        finished_at: mission.finished_at ?? '',
    });

    useState(() => {
        if (mission.material_pdf) {
            setData('material_pdf', mission.material_pdf);
        }
    });

    const handleChange = (
        field: string,
        value: string | number | File | null,
    ) => {
        setData(field as keyof typeof data, value as never);
        if (errors[field as keyof typeof errors]) {
            clearErrors(field as keyof typeof errors);
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!data.classroom_id)
                newErrors.classroom_id = 'Kelas wajib dipilih';
            if (!data.title.trim()) newErrors.title = 'Judul misi wajib diisi';
            if (!data.description.trim())
                newErrors.description = 'Deskripsi wajib diisi';
            if (data.description.length > 500)
                newErrors.description = 'Deskripsi maksimal 500 karakter';
            if (!data.difficulty_level)
                newErrors.difficulty_level = 'Tingkat kesulitan wajib dipilih';
        }

        if (step === 2) {
            if (!data.video_url.trim())
                newErrors.video_url = 'URL video wajib diisi';
            if (
                !data.video_url.includes('youtube.com') &&
                !data.video_url.includes('youtu.be')
            ) {
                newErrors.video_url = 'URL harus dari YouTube';
            }
            if (!data.case_narrative.trim())
                newErrors.case_narrative = 'Narasi kasus wajib diisi';
            if (data.case_narrative.length > 1000)
                newErrors.case_narrative = 'Narasi maksimal 1000 karakter';
        }

        if (Object.keys(newErrors).length > 0) {
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(4, prev + 1));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1));
    };

    const handleStepClick = (step: number) => {
        if (step <= currentStep || step >= currentStep) {
            setCurrentStep(step);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent | undefined)
            ?.submitter as HTMLButtonElement | null;

        if (!submitter || submitter.dataset.intent !== 'submit-mission') {
            return;
        }

        if (currentStep !== 4) return;

        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            setCurrentStep(1);
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
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Mission Header */}
                    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            {isMobile && (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/teacher/dashboard"
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/70 backdrop-blur-sm transition hover:bg-orange-500/90"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-white" />
                                    </Link>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                                        ✏️
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex">
                                    <Link
                                        href="/teacher/dashboard"
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/70 backdrop-blur-sm transition hover:bg-orange-500/90"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-white" />
                                    </Link>
                                </div>
                                <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg sm:flex sm:h-16 sm:w-16 sm:text-3xl">
                                    ✏️
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-slate-800 sm:text-3xl">
                                        Edit Misi: {mission.title}
                                    </h1>
                                    <p className="mt-1 text-xs text-slate-600 sm:block sm:text-sm">
                                        Perbarui informasi misi pembelajaran
                                        Anda
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stepper */}
                    <MissionFormStepper
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                            {/* Step Content */}
                            {currentStep === 1 && (
                                <Step1BasicInfo
                                    data={data}
                                    errors={errors}
                                    classrooms={classrooms}
                                    missions={ownMissions}
                                    onChange={handleChange}
                                />
                            )}

                            {currentStep === 2 && (
                                <Step2Scenario
                                    data={data}
                                    errors={errors}
                                    onChange={handleChange}
                                />
                            )}

                            {currentStep === 3 && (
                                <Step3LearningResources
                                    data={data}
                                    errors={errors}
                                    onChange={handleChange}
                                />
                            )}

                            {currentStep === 4 && (
                                <Step4Review
                                    data={data}
                                    classrooms={classrooms}
                                />
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span>Kembali</span>
                                </button>

                                <div className="flex items-center gap-3">
                                    {Object.keys(errors).length > 0 && (
                                        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>
                                                Ada {Object.keys(errors).length}{' '}
                                                error
                                            </span>
                                        </div>
                                    )}

                                    {currentStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                                        >
                                            <span>Lanjutkan</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            data-intent="submit-mission"
                                            disabled={
                                                processing || isSubmitting
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing || isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="h-5 w-5 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    <span>Menyimpan...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5" />
                                                    <span>Perbarui Misi</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}
