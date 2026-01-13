import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface MissionListHeaderProps {
    title: string;
    subtitle: string;
    onSearchChange: (value: string) => void;
    searchQuery: string;
    selectedClassroomId: number | null;
    classrooms: Array<{ id: number; name: string }>;
    missionCounts: Record<number, number>;
    totalMissions: number;
    onClassroomChange: (id: number | null) => void;
}

export function MissionListHeader({
    title,
    subtitle,
    onSearchChange,
    searchQuery,
    selectedClassroomId,
    classrooms,
    missionCounts,
    totalMissions,
    onClassroomChange,
}: MissionListHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {classrooms.length > 0 && (
                    <ClassroomDropdown
                        classrooms={classrooms}
                        selectedId={selectedClassroomId}
                        onChange={onClassroomChange}
                        missionCounts={missionCounts}
                        totalMissions={totalMissions}
                    />
                )}

                {/* Search Input */}
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Cari misi..."
                />

                {/* Create Mission Button */}
                <Link
                    href="/teacher/mission/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                >
                    <Plus className="h-5 w-5" />
                    <span>Buat Misi</span>
                </Link>
            </div>
        </div>
    );
}

import { ClassroomDropdown } from '@/components/teacher/dashboard/classroomDropdown';

// Search Input Component
interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none sm:w-48"
            />
            <svg
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
}
