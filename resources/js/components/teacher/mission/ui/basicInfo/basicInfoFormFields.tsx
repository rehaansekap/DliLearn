import { DifficultyLevelSelector } from '@/components/teacher/mission/ui/difficultyLevelSelector';
import {
    DateTimeInput,
    FormField,
    FormHint,
    InputError,
    InputLabel,
    TextAreaInput,
    TextInput,
} from '@/components/teacher/mission/ui/form';
import { SearchableDropdown } from '@/components/teacher/mission/ui/searchableDropdown';
import { Calendar } from 'lucide-react';

interface DifficultyLevel {
    level: number;
    label: string;
    color: string;
    description: string;
}

interface DropdownOption {
    id: number;
    label: string;
    icon: string;
}

interface BasicInfoFormFieldsProps {
    data: {
        classroom_id: number | null;
        title: string;
        description: string;
        difficulty_level: number;
        prerequisite_mission_id?: number | null;
        started_at?: string | null;
        finished_at?: string | null;
    };
    errors: Record<string, string>;
    classroomOptions: DropdownOption[];
    missionOptions: DropdownOption[];
    difficultyLevels: DifficultyLevel[];
    onClassroomChange: (value: number | null) => void;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDifficultyChange: (level: number) => void;
    onPrerequisiteChange: (value: number | null) => void;
    onStartedAtChange: (value: string | null) => void;
    onFinishedAtChange: (value: string | null) => void;
}

export function BasicInfoFormFields({
    data,
    errors,
    classroomOptions,
    missionOptions,
    difficultyLevels,
    onClassroomChange,
    onTitleChange,
    onDescriptionChange,
    onDifficultyChange,
    onPrerequisiteChange,
    onStartedAtChange,
    onFinishedAtChange,
}: BasicInfoFormFieldsProps) {
    return (
        <>
            {/* Classroom Selection */}
            <FormField>
                <InputLabel
                    value="Pilih Kelas"
                    icon="🏫"
                    required
                    htmlFor="classroom-select"
                />
                <SearchableDropdown
                    value={data.classroom_id}
                    options={classroomOptions}
                    placeholder="Pilih kelas untuk misi ini..."
                    noResultsText="Tidak ada kelas ditemukan"
                    onChange={onClassroomChange}
                    isError={!!errors.classroom_id}
                />
                <InputError message={errors.classroom_id} />
            </FormField>

            {/* Title */}
            <FormField>
                <InputLabel
                    value="Judul Misi"
                    icon="🎯"
                    required
                    htmlFor="title-input"
                />
                <TextInput
                    id="title-input"
                    type="text"
                    value={data.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Contoh: Misi 1: Sistem Parkir Otomatis"
                    isError={!!errors.title}
                />
                <InputError message={errors.title} />
                <FormHint>Buat judul yang menarik dan deskriptif</FormHint>
            </FormField>

            {/* Description */}
            <FormField>
                <InputLabel
                    value="Deskripsi Singkat"
                    icon="📋"
                    required
                    htmlFor="description-input"
                />
                <TextAreaInput
                    id="description-input"
                    value={data.description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Jelaskan secara singkat apa yang akan dipelajari siswa dalam misi ini..."
                    rows={4}
                    isError={!!errors.description}
                />
                <InputError message={errors.description} />
                <FormHint>{data.description.length}/5000 karakter</FormHint>
            </FormField>

            {/* Difficulty Level */}
            <FormField>
                <InputLabel value="Tingkat Kesulitan" icon="⭐" required />
                <DifficultyLevelSelector
                    value={data.difficulty_level}
                    levels={difficultyLevels}
                    onChange={onDifficultyChange}
                />
                <InputError message={errors.difficulty_level} />
            </FormField>

            {/* Prerequisite Mission */}
            <FormField>
                <InputLabel
                    value="Misi Prasyarat (Opsional)"
                    icon="🔗"
                    htmlFor="prerequisite-select"
                />
                <SearchableDropdown
                    value={data.prerequisite_mission_id ?? null}
                    options={missionOptions}
                    placeholder="Tidak ada prasyarat"
                    noResultsText="Tidak ada misi ditemukan"
                    emptyOption={{
                        label: 'Tidak Ada Prasyarat',
                        icon: '⭕',
                    }}
                    onChange={onPrerequisiteChange}
                    isError={!!errors.prerequisite_mission_id}
                />
                <InputError message={errors.prerequisite_mission_id} />
                <FormHint>
                    Siswa harus menyelesaikan misi ini terlebih dahulu sebelum
                    mengakses misi yang sedang dibuat.
                </FormHint>
            </FormField>

            {/* Start / Finish DateTime */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Started At */}
                <FormField>
                    <InputLabel
                        value="Tanggal Mulai (Opsional)"
                        htmlFor="started-at-input"
                    >
                        <Calendar className="h-4 w-4 text-green-600" />
                    </InputLabel>
                    <DateTimeInput
                        id="started-at-input"
                        value={data.started_at ?? ''}
                        onChange={(e) =>
                            onStartedAtChange(e.target.value || null)
                        }
                        isError={!!errors.started_at}
                        className="hover:border-green-300 focus:border-green-500 focus:ring-green-100"
                    />
                    <InputError message={errors.started_at} />
                    <FormHint>
                        Misi akan aktif pada tanggal & waktu ini
                    </FormHint>
                </FormField>

                {/* Finished At */}
                <FormField>
                    <InputLabel
                        value="Tanggal Selesai (Opsional)"
                        htmlFor="finished-at-input"
                    >
                        <Calendar className="h-4 w-4 text-red-600" />
                    </InputLabel>
                    <DateTimeInput
                        id="finished-at-input"
                        value={data.finished_at ?? ''}
                        onChange={(e) =>
                            onFinishedAtChange(e.target.value || null)
                        }
                        isError={!!errors.finished_at}
                        className="hover:border-red-300 focus:border-red-500 focus:ring-red-100"
                    />
                    <InputError message={errors.finished_at} />
                    <FormHint>
                        Misi akan ditutup pada tanggal & waktu ini
                    </FormHint>
                </FormField>
            </div>
        </>
    );
}
