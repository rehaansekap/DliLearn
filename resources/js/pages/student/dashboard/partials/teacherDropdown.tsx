import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface TeacherDropdownProps {
    teachers: Teacher[];
    selectedId: number | null;
    onChange: (id: number | null) => void;
    missionCounts: Record<number, number>;
    totalMissions: number;
}

export function TeacherDropdown({
    teachers,
    selectedId,
    onChange,
    missionCounts,
    totalMissions,
}: TeacherDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setQuery('');
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Focus search input when dropdown opens
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedTeacher = teachers.find((t) => t.id === selectedId);

    // Filter teachers based on search query
    const filteredTeachers = useMemo(() => {
        if (!query.trim()) return teachers;
        const q = query.toLowerCase();
        return teachers.filter((teacher) =>
            teacher.name.toLowerCase().includes(q),
        );
    }, [teachers, query]);

    const handleSelect = (id: number | null) => {
        onChange(id);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none sm:w-64"
            >
                <div className="flex items-center gap-3">
                    {selectedTeacher ? (
                        selectedTeacher.avatar ? (
                            <img
                                src={`/storage/${selectedTeacher.avatar}`}
                                alt={selectedTeacher.name}
                                className="h-8 w-8 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 font-bold text-white">
                                {selectedTeacher.name.charAt(0)}
                            </div>
                        )
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                            <span className="text-lg">👨‍🏫</span>
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-700">
                            {selectedTeacher
                                ? selectedTeacher.name
                                : 'Semua Guru'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {selectedId
                                ? `${missionCounts[selectedId] || 0} misi`
                                : `${totalMissions} misi`}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl sm:w-72">
                    {/* Search Input */}
                    <div className="border-b border-slate-200 p-3">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari guru..."
                                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* All Teachers Option */}
                    {!query && (
                        <>
                            <button
                                onClick={() => handleSelect(null)}
                                className={cn(
                                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                    selectedId === null
                                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                                        : 'hover:bg-slate-50',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg',
                                        selectedId === null
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                            : 'bg-gradient-to-br from-slate-100 to-slate-200',
                                    )}
                                >
                                    <span className="text-xl">
                                        {selectedId === null ? '✨' : '👨‍🏫'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p
                                        className={cn(
                                            'text-sm font-bold',
                                            selectedId === null
                                                ? 'text-indigo-700'
                                                : 'text-slate-700',
                                        )}
                                    >
                                        Semua Guru
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs',
                                            selectedId === null
                                                ? 'text-indigo-600'
                                                : 'text-slate-500',
                                        )}
                                    >
                                        {totalMissions} misi tersedia
                                    </p>
                                </div>
                                {selectedId === null && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
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

                    {/* Teacher Options */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => {
                                const isSelected = selectedId === teacher.id;
                                return (
                                    <button
                                        key={teacher.id}
                                        onClick={() => handleSelect(teacher.id)}
                                        className={cn(
                                            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                            isSelected
                                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                                                : 'hover:bg-slate-50',
                                        )}
                                    >
                                        {teacher.avatar ? (
                                            <img
                                                src={`/storage/${teacher.avatar}`}
                                                alt={teacher.name}
                                                className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white',
                                                    isSelected
                                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                                        : 'bg-gradient-to-br from-slate-300 to-slate-400',
                                                )}
                                            >
                                                {teacher.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={cn(
                                                    'truncate text-sm font-bold',
                                                    isSelected
                                                        ? 'text-indigo-700'
                                                        : 'text-slate-700',
                                                )}
                                            >
                                                {teacher.name}
                                            </p>
                                            <p
                                                className={cn(
                                                    'text-xs',
                                                    isSelected
                                                        ? 'text-indigo-600'
                                                        : 'text-slate-500',
                                                )}
                                            >
                                                {missionCounts[teacher.id] || 0}{' '}
                                                misi
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
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
    );
}
