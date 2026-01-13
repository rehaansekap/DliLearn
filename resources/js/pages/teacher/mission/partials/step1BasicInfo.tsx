import {
    BasicInfoFormFields,
    BasicInfoHeader,
} from '@/components/teacher/mission/ui/basicInfo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Step1BasicInfoProps {
    data: {
        title: string;
        description: string;
        difficulty_level: number;
        classroom_id: number | null;
        prerequisite_mission_id?: number | null;
        started_at?: string | null;
        finished_at?: string | null;
    };
    errors: Record<string, string>;
    classrooms: Array<{ id: number; name: string }>;
    missions: Array<{ id: number; title: string }>;
    onChange: (field: string, value: string | number | null) => void;
}

const difficultyLevels = [
    {
        level: 1,
        label: 'Pemula',
        color: 'from-green-400 to-emerald-500',
        description: 'Cocok untuk yang baru memulai',
    },
    {
        level: 2,
        label: 'Menengah',
        color: 'from-blue-400 to-cyan-500',
        description: 'Butuh pemahaman dasar',
    },
    {
        level: 3,
        label: 'Mahir',
        color: 'from-yellow-400 to-amber-500',
        description: 'Tantangan lebih kompleks',
    },
    {
        level: 4,
        label: 'Expert',
        color: 'from-orange-400 to-red-500',
        description: 'Untuk yang berpengalaman',
    },
    {
        level: 5,
        label: 'Master',
        color: 'from-red-500 to-pink-600',
        description: 'Tingkat tertinggi',
    },
];

export function Step1BasicInfo({
    data,
    errors,
    classrooms,
    missions,
    onChange,
}: Step1BasicInfoProps) {
    const isMobile = useIsMobile();

    // Transform data for SearchableDropdown
    const classroomOptions = classrooms.map((c) => ({
        id: c.id,
        label: c.name,
        icon: '🏫',
    }));

    const missionOptions = missions.map((m) => ({
        id: m.id,
        label: m.title,
        icon: '🎯',
    }));

    // Handler functions
    const handleClassroomChange = (value: number | null) => {
        onChange('classroom_id', value);
    };

    const handleTitleChange = (value: string) => {
        onChange('title', value);
    };

    const handleDescriptionChange = (value: string) => {
        onChange('description', value);
    };

    const handleDifficultyChange = (level: number) => {
        onChange('difficulty_level', level);
    };

    const handlePrerequisiteChange = (value: number | null) => {
        onChange('prerequisite_mission_id', value);
    };

    const handleStartedAtChange = (value: string | null) => {
        onChange('started_at', value);
    };

    const handleFinishedAtChange = (value: string | null) => {
        onChange('finished_at', value);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <BasicInfoHeader isMobile={isMobile} />

            {/* Main Content - Two Column Layout on Desktop */}
            <div className="gap-6">
                {/* Left Column - Form Fields (2/3 width) */}
                <div className="space-y-6 lg:col-span-2">
                    <div
                        className={cn(
                            'space-y-6 rounded-2xl border border-slate-200 bg-white shadow-lg',
                            isMobile ? 'p-4' : 'p-6',
                        )}
                    >
                        <BasicInfoFormFields
                            data={data}
                            errors={errors}
                            classroomOptions={classroomOptions}
                            missionOptions={missionOptions}
                            difficultyLevels={difficultyLevels}
                            onClassroomChange={handleClassroomChange}
                            onTitleChange={handleTitleChange}
                            onDescriptionChange={handleDescriptionChange}
                            onDifficultyChange={handleDifficultyChange}
                            onPrerequisiteChange={handlePrerequisiteChange}
                            onStartedAtChange={handleStartedAtChange}
                            onFinishedAtChange={handleFinishedAtChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
