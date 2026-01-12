import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AlertCircle, Calendar, ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    const [isClassroomOpen, setIsClassroomOpen] = useState(false);
    const [classroomQuery, setClassroomQuery] = useState('');
    const classroomDropdownRef = useRef<HTMLDivElement>(null);
    const classroomSearchRef = useRef<HTMLInputElement>(null);

    const [isPrerequisiteOpen, setIsPrerequisiteOpen] = useState(false);
    const [prerequisiteQuery, setPrerequisiteQuery] = useState('');
    const prerequisiteDropdownRef = useRef<HTMLDivElement>(null);
    const prerequisiteSearchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                classroomDropdownRef.current &&
                !classroomDropdownRef.current.contains(event.target as Node)
            ) {
                setIsClassroomOpen(false);
                setClassroomQuery('');
            }
            if (
                prerequisiteDropdownRef.current &&
                !prerequisiteDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPrerequisiteOpen(false);
                setPrerequisiteQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isClassroomOpen) {
            setTimeout(() => classroomSearchRef.current?.focus(), 100);
        }
    }, [isClassroomOpen]);

    useEffect(() => {
        if (isPrerequisiteOpen) {
            setTimeout(() => prerequisiteSearchRef.current?.focus(), 100);
        }
    }, [isPrerequisiteOpen]);

    const selectedClassroom = classrooms.find(
        (c) => c.id === data.classroom_id,
    );
    const selectedPrerequisite = missions.find(
        (m) => m.id === data.prerequisite_mission_id,
    );

    const filteredClassrooms = useMemo(() => {
        if (!classroomQuery.trim()) return classrooms;
        const q = classroomQuery.toLowerCase();
        return classrooms.filter((classroom) =>
            classroom.name.toLowerCase().includes(q),
        );
    }, [classrooms, classroomQuery]);

    const filteredMissions = useMemo(() => {
        if (!prerequisiteQuery.trim()) return missions;
        const q = prerequisiteQuery.toLowerCase();
        return missions.filter((mission) =>
            mission.title.toLowerCase().includes(q),
        );
    }, [missions, prerequisiteQuery]);

    const handleDateChange = (field: string, value: string | null) => {
        onChange(field, value);
    };

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
                {/* Classroom Selection (styled like dashboard dropdown) */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <span>🏫</span>
                        <span>Pilih Kelas</span>
                        <span className="text-red-500">*</span>
                    </label>

                    <div className="relative" ref={classroomDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsClassroomOpen(!isClassroomOpen)}
                            className={cn(
                                'group flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:shadow-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
                                errors.classroom_id
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-slate-200 bg-white',
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                    <span className="text-lg">🏫</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-700">
                                        {selectedClassroom
                                            ? selectedClassroom.name
                                            : '-- Pilih Kelas --'}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
                                    isClassroomOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {isClassroomOpen && (
                            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                                {/* Search Input */}
                                <div className="border-b border-slate-200 p-3">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={classroomSearchRef}
                                            type="text"
                                            value={classroomQuery}
                                            onChange={(e) =>
                                                setClassroomQuery(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Cari kelas..."
                                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Classroom Options */}
                                <div className="max-h-64 overflow-y-auto">
                                    {filteredClassrooms.length > 0 ? (
                                        filteredClassrooms.map((classroom) => {
                                            const isSelected =
                                                data.classroom_id ===
                                                classroom.id;
                                            return (
                                                <button
                                                    key={classroom.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onChange(
                                                            'classroom_id',
                                                            classroom.id,
                                                        );
                                                        setIsClassroomOpen(
                                                            false,
                                                        );
                                                        setClassroomQuery('');
                                                    }}
                                                    className={cn(
                                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                                        isSelected
                                                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                                                            : 'hover:bg-slate-50',
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white',
                                                            isSelected
                                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                                                : 'bg-gradient-to-br from-slate-300 to-slate-400',
                                                        )}
                                                    >
                                                        {classroom.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={cn(
                                                                'truncate text-sm font-bold',
                                                                isSelected
                                                                    ? 'text-indigo-700'
                                                                    : 'text-slate-700',
                                                            )}
                                                        >
                                                            {classroom.name}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                                                            <svg
                                                                className="h-4 w-4 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                <Search className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">
                                                Tidak ditemukan
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Coba kata kunci lain
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.classroom_id && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.classroom_id}
                        </p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label
                        htmlFor="title-input"
                        className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                    >
                        <span>🎯</span>
                        <span>Judul Misi</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title-input"
                        type="text"
                        value={data.title}
                        onChange={(e) => onChange('title', e.target.value)}
                        placeholder="Contoh: Misi 1: Sistem Parkir Otomatis"
                        className={cn(
                            'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none',
                            errors.title
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.title && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.title}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Buat judul yang menarik dan deskriptif
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description-input"
                        className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                    >
                        <span>📋</span>
                        <span>Deskripsi Singkat</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description-input"
                        value={data.description}
                        onChange={(e) =>
                            onChange('description', e.target.value)
                        }
                        placeholder="Jelaskan secara singkat apa yang akan dipelajari siswa dalam misi ini..."
                        rows={4}
                        className={cn(
                            'w-full resize-none rounded-xl border-2 px-4 py-3 text-slate-700 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none',
                            errors.description
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.description && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.description}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        {data.description.length}/500 karakter
                    </p>
                </div>

                {/* Difficulty Level */}
                <div>
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <span>⭐</span>
                        <span>Tingkat Kesulitan</span>
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                        {difficultyLevels.map((item) => (
                            <button
                                key={item.level}
                                type="button"
                                onClick={() =>
                                    onChange('difficulty_level', item.level)
                                }
                                className={cn(
                                    'group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all duration-300',
                                    data.difficulty_level === item.level
                                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md',
                                )}
                            >
                                <div
                                    className={cn(
                                        'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white',
                                        item.color,
                                    )}
                                >
                                    {item.level}
                                </div>
                                <p
                                    className={cn(
                                        'text-sm font-bold',
                                        data.difficulty_level === item.level
                                            ? 'text-indigo-700'
                                            : 'text-slate-700',
                                    )}
                                >
                                    {item.label}
                                </p>
                                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                                    {item.description}
                                </p>
                                {data.difficulty_level === item.level && (
                                    <div className="absolute top-2 right-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                                            ✓
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    {errors.difficulty_level && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.difficulty_level}
                        </p>
                    )}
                </div>

                {/* Prerequisite Mission */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <span>🔗</span>
                        <span>Prerequisite Mission (Opsional)</span>
                        {/* <span className="text-red-500">*</span> */}
                    </label>

                    <div className="relative" ref={prerequisiteDropdownRef}>
                        <button
                            type="button"
                            onClick={() =>
                                setIsPrerequisiteOpen(!isPrerequisiteOpen)
                            }
                            className={cn(
                                'group flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:shadow-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
                                errors.prerequisite_mission_id
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-slate-200 bg-white',
                            )}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                                    <span className="text-lg">🔗</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-700">
                                        {selectedPrerequisite
                                            ? selectedPrerequisite.title
                                            : '-- Tidak ada / Pilih Misi --'}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
                                    isPrerequisiteOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {isPrerequisiteOpen && (
                            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                                {/* Search Input */}
                                <div className="border-b border-slate-200 p-3">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={prerequisiteSearchRef}
                                            type="text"
                                            value={prerequisiteQuery}
                                            onChange={(e) =>
                                                setPrerequisiteQuery(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Cari misi..."
                                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* "Tidak Ada" Option */}
                                {!prerequisiteQuery && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(
                                                    'prerequisite_mission_id',
                                                    null,
                                                );
                                                setIsPrerequisiteOpen(false);
                                                setPrerequisiteQuery('');
                                            }}
                                            className={cn(
                                                'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                                !data.prerequisite_mission_id
                                                    ? 'bg-gradient-to-r from-slate-50 to-slate-100'
                                                    : 'hover:bg-slate-50',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 items-center justify-center rounded-lg',
                                                    !data.prerequisite_mission_id
                                                        ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                                                        : 'bg-gradient-to-br from-slate-200 to-slate-300',
                                                )}
                                            >
                                                <span className="text-lg">
                                                    🚫
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={cn(
                                                        'text-sm font-bold',
                                                        !data.prerequisite_mission_id
                                                            ? 'text-slate-700'
                                                            : 'text-slate-600',
                                                    )}
                                                >
                                                    Tidak ada
                                                </p>
                                            </div>
                                            {!data.prerequisite_mission_id && (
                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-500">
                                                    <svg
                                                        className="h-4 w-4 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                        <div className="h-px bg-slate-200" />
                                    </>
                                )}

                                {/* Mission Options */}
                                <div className="max-h-64 overflow-y-auto">
                                    {filteredMissions.length > 0 ? (
                                        filteredMissions.map((mission) => {
                                            const isSelected =
                                                data.prerequisite_mission_id ===
                                                mission.id;
                                            return (
                                                <button
                                                    key={mission.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onChange(
                                                            'prerequisite_mission_id',
                                                            mission.id,
                                                        );
                                                        setIsPrerequisiteOpen(
                                                            false,
                                                        );
                                                        setPrerequisiteQuery(
                                                            '',
                                                        );
                                                    }}
                                                    className={cn(
                                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                                        isSelected
                                                            ? 'bg-gradient-to-r from-purple-50 to-pink-50'
                                                            : 'hover:bg-slate-50',
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white',
                                                            isSelected
                                                                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                                : 'bg-gradient-to-br from-slate-300 to-slate-400',
                                                        )}
                                                    >
                                                        🎯
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={cn(
                                                                'truncate text-sm font-bold',
                                                                isSelected
                                                                    ? 'text-purple-700'
                                                                    : 'text-slate-700',
                                                            )}
                                                        >
                                                            {mission.title}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                                                            <svg
                                                                className="h-4 w-4 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                <Search className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">
                                                Tidak ditemukan
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Coba kata kunci lain
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.prerequisite_mission_id && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.prerequisite_mission_id}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Siswa harus menyelesaikan misi ini terlebih dahulu
                        sebelum mengakses misi yang sedang dibuat.
                    </p>
                </div>

                {/* Start / Finish DateTime */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Started At */}
                    <div>
                        <label
                            htmlFor="started-at-input"
                            className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                        >
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>Tanggal Mulai (Opsional)</span>
                            {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="relative">
                            <input
                                id="started-at-input"
                                type="datetime-local"
                                value={data.started_at ?? ''}
                                onChange={(e) =>
                                    handleDateChange(
                                        'started_at',
                                        e.target.value || null,
                                    )
                                }
                                className={cn(
                                    'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all hover:border-green-300 hover:shadow-md focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none',
                                    errors.started_at
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-slate-200 bg-white',
                                )}
                            />
                            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                        </div>
                        {errors.started_at && (
                            <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                {errors.started_at}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                            Misi akan aktif pada tanggal & waktu ini
                        </p>
                    </div>

                    {/* Finished At */}
                    <div>
                        <label
                            htmlFor="finished-at-input"
                            className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                        >
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span>Tanggal Selesai (Opsional)</span>
                            {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="relative">
                            <input
                                id="finished-at-input"
                                type="datetime-local"
                                value={data.finished_at ?? ''}
                                onChange={(e) =>
                                    handleDateChange(
                                        'finished_at',
                                        e.target.value || null,
                                    )
                                }
                                className={cn(
                                    'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all hover:border-red-300 hover:shadow-md focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none',
                                    errors.finished_at
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-slate-200 bg-white',
                                )}
                            />
                            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-rose-100">
                                    <Calendar className="h-4 w-4 text-red-600" />
                                </div>
                            </div>
                        </div>
                        {errors.finished_at && (
                            <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                {errors.finished_at}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                            Misi akan ditutup pada tanggal & waktu ini
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
