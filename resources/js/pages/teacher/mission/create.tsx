import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useState } from 'react';
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

interface CreateProps {
    auth: {
        user: User;
    };
    classrooms: Classroom[];
    ownMissions: { id: number; title: string }[];
}

export default function Create({ auth, classrooms, ownMissions }: CreateProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        classroom_id: null as number | null,
        title: '',
        description: '',
        difficulty_level: 1,
        video_url: '',
        case_narrative: '',
        material_pdf: null as File | null,
        collab_url: '',
        simulator_config: '',
        prerequisite_mission_id: null as number | null,
        started_at: '' as string | null,
        finished_at: '' as string | null,
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
            Object.entries(newErrors).forEach(([key, value]) => {
                console.error(`Validation Error [${key}]: ${value}`);
            });
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

        if (currentStep !== 4) {
            return;
        }

        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            setCurrentStep(1);
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
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Back Button */}
                    <a
                        href="/teacher/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Dashboard</span>
                    </a>

                    {/* Page Title */}
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl shadow-lg">
                                🎯
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 sm:text-3xl">
                                    Buat Misi Pembelajaran Baru
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Ikuti 4 langkah untuk merancang misi PBL
                                    yang menarik
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
                                    {/* Error Summary */}
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
                                            disabled={processing}
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
                                                    <span>Simpan Misi</span>
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
