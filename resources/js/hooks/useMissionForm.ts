import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface MissionFormData {
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
}

interface UseMissionFormOptions {
    initialData: Partial<MissionFormData>;
    onSuccessCallback?: () => void;
}

export function useMissionForm({ initialData }: UseMissionFormOptions) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm<MissionFormData>({
            classroom_id: initialData.classroom_id ?? null,
            title: initialData.title ?? '',
            description: initialData.description ?? '',
            difficulty_level: initialData.difficulty_level ?? 1,
            video_url: initialData.video_url ?? '',
            case_narrative: initialData.case_narrative ?? '',
            material_pdf: initialData.material_pdf ?? null,
            lkpd_pdf: initialData.lkpd_pdf ?? null,
            collab_url: initialData.collab_url ?? '',
            simulator_config: initialData.simulator_config ?? '',
            prerequisite_mission_id:
                initialData.prerequisite_mission_id ?? null,
            started_at: initialData.started_at ?? null,
            finished_at: initialData.finished_at ?? null,
        });

    const handleChange = (
        field: string,
        value: string | number | File | null,
    ) => {
        setData(field as keyof MissionFormData, value as never);

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
            if (data.description.length > 5000)
                newErrors.description = 'Deskripsi maksimal 5000 karakter';
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

        return Object.keys(newErrors).length === 0;
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
        setCurrentStep(step);
    };

    return {
        data,
        errors,
        processing,
        isSubmitting,
        currentStep,
        setCurrentStep,
        setIsSubmitting,
        handleChange,
        handleNext,
        handleBack,
        handleStepClick,
        validateStep,
        clearErrors,
        post,
        put,
    };
}
