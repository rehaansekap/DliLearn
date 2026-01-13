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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div
                className={cn(
                    'rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50',
                    isMobile ? 'p-4' : 'p-6',
                )}
            >
                {isMobile && (
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        📝
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'hidden items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg sm:flex',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        📝
                    </div>
                    <div>
                        <h2
                            className={cn(
                                'font-bold text-slate-800',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            Informasi Dasar Misi
                        </h2>
                        <p
                            className={cn(
                                'text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Tentukan judul, deskripsi, dan tingkat kesulitan
                            misi
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div
                className={cn(
                    'space-y-6 rounded-2xl border border-slate-200 bg-white shadow-lg',
                    isMobile ? 'p-4' : 'p-6',
                )}
            >
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
                        onChange={(value) => onChange('classroom_id', value)}
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
                        onChange={(e) => onChange('title', e.target.value)}
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
                        onChange={(e) =>
                            onChange('description', e.target.value)
                        }
                        placeholder="Jelaskan secara singkat apa yang akan dipelajari siswa dalam misi ini..."
                        rows={4}
                        isError={!!errors.description}
                    />
                    <InputError message={errors.description} />
                    <FormHint>{data.description.length}/500 karakter</FormHint>
                </FormField>

                {/* Difficulty Level */}
                <FormField>
                    <InputLabel value="Tingkat Kesulitan" icon="⭐" required />
                    <DifficultyLevelSelector
                        value={data.difficulty_level}
                        levels={difficultyLevels}
                        onChange={(level) =>
                            onChange('difficulty_level', level)
                        }
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
                        onChange={(value) =>
                            onChange('prerequisite_mission_id', value)
                        }
                        isError={!!errors.prerequisite_mission_id}
                    />
                    <InputError message={errors.prerequisite_mission_id} />
                    <FormHint>
                        Siswa harus menyelesaikan misi ini terlebih dahulu
                        sebelum mengakses misi yang sedang dibuat.
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
                                onChange('started_at', e.target.value || null)
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
                                onChange('finished_at', e.target.value || null)
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
            </div>
        </div>
    );
}
