import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Teacher {
    id: number;
    name: string;
}

interface ClassroomFiltersProps {
    currentTeacherId: string;
    currentAcademicYear: string;
    currentSearch: string;
    teachers: Teacher[];
    academicYears: string[];
}

export function ClassroomFilters({
    currentTeacherId,
    currentAcademicYear,
    currentSearch,
    teachers,
    academicYears,
}: ClassroomFiltersProps) {
    const [search, setSearch] = useState(currentSearch ?? '');
    const [teacherId, setTeacherId] = useState(currentTeacherId ?? 'all');
    const [academicYear, setAcademicYear] = useState(
        currentAcademicYear ?? 'all',
    );

    // Dropdown states for teacher (searchable)
    const [isTeacherOpen, setIsTeacherOpen] = useState(false);
    const [teacherQuery, setTeacherQuery] = useState('');
    const teacherRef = useRef<HTMLDivElement>(null);
    const teacherSearchRef = useRef<HTMLInputElement>(null);

    const [isYearOpen, setIsYearOpen] = useState(false);
    const yearRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                yearRef.current &&
                !yearRef.current.contains(e.target as Node)
            ) {
                setIsYearOpen(false);
            }
        }
        if (isYearOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isYearOpen]);

    // Auto-filter when search / teacherId / academicYear change
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/classrooms',
                {
                    teacher_id: teacherId,
                    academic_year: academicYear,
                    search: search ?? '',
                },
                {
                    preserveState: true,
                    replace: true,
                    only: ['classrooms'],
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, teacherId, academicYear]);

    // Click outside to close teacher dropdown
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                teacherRef.current &&
                !teacherRef.current.contains(e.target as Node)
            ) {
                setIsTeacherOpen(false);
                setTeacherQuery('');
            }
        }
        if (isTeacherOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setTimeout(() => teacherSearchRef.current?.focus(), 50);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isTeacherOpen]);

    const handleReset = () => {
        setSearch('');
        setTeacherId('all');
        setAcademicYear('all');
        router.get(
            '/admin/classrooms',
            {},
            { preserveState: true, replace: true },
        );
    };

    const filteredTeachers = useMemo(() => {
        if (!teacherQuery.trim()) return teachers;
        const q = teacherQuery.toLowerCase();
        return teachers.filter((t) => t.name.toLowerCase().includes(q));
    }, [teacherQuery, teachers]);

    const selectedTeacher = teachers.find(
        (t) => String(t.id) === String(teacherId),
    );
    const hasActiveFilters =
        search !== '' || teacherId !== 'all' || academicYear !== 'all';

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">
                        🔍 Filter Kelas
                    </h3>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                            title="Reset semua filter"
                        >
                            <X className="h-3 w-3" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
                <a
                    href="/admin/classrooms/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah Kelas</span>
                </a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Cari Kelas
                    </label>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama kelas atau kode gabung..."
                            className="h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                title="Hapus pencarian"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                        Filter aktif: {hasActiveFilters ? '' : 'Tidak ada'}
                    </div>
                </div>

                {/* Teacher Dropdown */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Guru Pengajar
                    </label>
                    <div className="relative" ref={teacherRef}>
                        <button
                            type="button"
                            onClick={() => setIsTeacherOpen((v) => !v)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                    <span className="text-lg">👩‍🏫</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {selectedTeacher
                                        ? selectedTeacher.name
                                        : 'Semua Guru'}
                                </p>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-slate-400 transition-transform duration-200',
                                    isTeacherOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {isTeacherOpen && (
                            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-200 p-3">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={teacherSearchRef}
                                            type="text"
                                            value={teacherQuery}
                                            onChange={(e) =>
                                                setTeacherQuery(e.target.value)
                                            }
                                            placeholder="Cari guru..."
                                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="max-h-64 overflow-y-auto">
                                    <button
                                        onClick={() => {
                                            setTeacherId('all');
                                            setIsTeacherOpen(false);
                                            setTeacherQuery('');
                                        }}
                                        className={cn(
                                            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                            teacherId === 'all'
                                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                                                : 'hover:bg-slate-50',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-lg text-sm',
                                                teacherId === 'all'
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                                                    : 'bg-slate-100',
                                            )}
                                        >
                                            ✨
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={cn(
                                                    'truncate text-sm font-bold',
                                                    teacherId === 'all'
                                                        ? 'text-indigo-700'
                                                        : 'text-slate-700',
                                                )}
                                            >
                                                Semua Guru
                                            </p>
                                        </div>
                                    </button>

                                    {filteredTeachers.length === 0 ? (
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
                                    ) : (
                                        filteredTeachers.map((t) => {
                                            const isSelected =
                                                String(teacherId) ===
                                                String(t.id);
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setTeacherId(
                                                            String(t.id),
                                                        );
                                                        setIsTeacherOpen(false);
                                                        setTeacherQuery('');
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
                                                                : 'bg-slate-300 text-slate-700',
                                                        )}
                                                    >
                                                        {t.name.charAt(0)}
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
                                                            {t.name}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                                                            <svg
                                                                className="h-4 w-4 text-white"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
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
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Academic Year Dropdown (simple, consistent style) */}
                <div>
                    <label
                        htmlFor="academic-year-filter"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Tahun Ajaran
                    </label>
                    <div className="relative" ref={yearRef}>
                        <button
                            type="button"
                            onClick={() => setIsYearOpen((v) => !v)}
                            aria-expanded={isYearOpen}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                    <span className="text-lg">📅</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {academicYear === 'all'
                                        ? 'Semua Tahun'
                                        : academicYear}
                                </p>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-slate-400 transition-transform duration-200',
                                    isYearOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {isYearOpen && (
                            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                                <div className="max-h-64 overflow-y-auto">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAcademicYear('all');
                                            setIsYearOpen(false);
                                        }}
                                        className={cn(
                                            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                            academicYear === 'all'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'hover:bg-slate-50',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-lg text-sm',
                                                academicYear === 'all'
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                                                    : 'bg-slate-100',
                                            )}
                                        >
                                            ✨
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={cn(
                                                    'truncate text-sm font-bold',
                                                    academicYear === 'all'
                                                        ? 'text-indigo-700'
                                                        : 'text-slate-700',
                                                )}
                                            >
                                                Semua Tahun
                                            </p>
                                        </div>
                                        {academicYear === 'all' && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                                                <svg
                                                    className="h-4 w-4 text-white"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
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

                                    {academicYears.length === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                <Search className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">
                                                Tidak ada tahun
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Tambahkan tahun ajaran terlebih
                                                dahulu
                                            </p>
                                        </div>
                                    ) : (
                                        academicYears.map((y) => {
                                            const isSelected =
                                                academicYear === y;
                                            return (
                                                <button
                                                    key={y}
                                                    type="button"
                                                    onClick={() => {
                                                        setAcademicYear(y);
                                                        setIsYearOpen(false);
                                                    }}
                                                    className={cn(
                                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                                        isSelected
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'hover:bg-slate-50',
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex h-10 w-10 items-center justify-center rounded-lg text-sm',
                                                            isSelected
                                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                                                                : 'bg-slate-100',
                                                        )}
                                                    >
                                                        <span className="text-sm">
                                                            📅
                                                        </span>
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
                                                            {y}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                                                            <svg
                                                                className="h-4 w-4 text-white"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
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
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
