import { router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

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
    const [search, setSearch] = useState(currentSearch);
    const [teacherId, setTeacherId] = useState(currentTeacherId);
    const [academicYear, setAcademicYear] = useState(currentAcademicYear);

    const handleFilter = () => {
        router.get(
            '/admin/classrooms',
            {
                teacher_id: teacherId,
                academic_year: academicYear,
                search,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

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

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                    🔍 Filter Kelas
                </h3>
                <a
                    href="/admin/classrooms/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah Kelas</span>
                </a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search Input */}
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
                            className="w-full rounded-xl border border-slate-300 py-2 pr-4 pl-10 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFilter();
                            }}
                        />
                    </div>
                </div>

                {/* Teacher Filter */}
                <div>
                    <label
                        htmlFor="teacher-filter"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Guru Pengajar
                    </label>
                    <select
                        id="teacher-filter"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    >
                        <option value="all">Semua Guru</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Academic Year Filter */}
                <div>
                    <label
                        htmlFor="academic-year-filter"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Tahun Ajaran
                    </label>
                    <select
                        id="academic-year-filter"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                        aria-label="Tahun Ajaran"
                    >
                        <option value="all">Semua Tahun</option>
                        {academicYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={handleFilter}
                    className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    Terapkan Filter
                </button>
                <button
                    onClick={handleReset}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
