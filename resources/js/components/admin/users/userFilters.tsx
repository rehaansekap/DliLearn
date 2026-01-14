import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface UserFiltersProps {
    currentRole: string;
    currentSearch: string;
}

const roles = [
    { value: 'all', label: 'Semua Role', icon: '👥' },
    { value: 'student', label: 'Siswa', icon: '👨‍🎓' },
    { value: 'teacher', label: 'Guru', icon: '👨‍🏫' },
    { value: 'admin', label: 'Admin', icon: '👑' },
];

export function UserFilters({ currentRole, currentSearch }: UserFiltersProps) {
    const [search, setSearch] = useState(currentSearch);
    const [role, setRole] = useState(currentRole);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownQuery, setDropdownQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-filter when search or role changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                '/admin/users',
                { role, search },
                {
                    preserveState: true,
                    replace: true,
                    only: ['users'],
                },
            );
        }, 300); // Debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [search, role]);

    // Handle click outside dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
                setDropdownQuery('');
            }
        }
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleReset = () => {
        setSearch('');
        setRole('all');
    };

    const handleRoleSelect = (value: string) => {
        setRole(value);
        setIsDropdownOpen(false);
        setDropdownQuery('');
    };

    const selectedRole = roles.find((r) => r.value === role);
    const hasActiveFilters = search !== '' || role !== 'all';

    const filteredRoles = useMemo(() => {
        if (!dropdownQuery.trim()) return roles;
        const q = dropdownQuery.toLowerCase();
        return roles.filter((r) => r.label.toLowerCase().includes(q));
    }, [dropdownQuery]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">
                        🔍 Filter User
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
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah User</span>
                </a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="user-search"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Cari User
                    </label>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="user-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama, email, atau username..."
                            className="h-14 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 pr-4 pl-10 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
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
                </div>

                {/* Role Filter Custom Dropdown */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Filter Role
                    </label>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                    <span className="text-lg">
                                        {selectedRole?.icon}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {selectedRole?.label}
                                </p>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-slate-400 transition-transform duration-200',
                                    isDropdownOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xl">
                                {/* Search Input */}
                                <div className="border-b border-slate-200 p-3">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={dropdownQuery}
                                            onChange={(e) =>
                                                setDropdownQuery(e.target.value)
                                            }
                                            placeholder="Cari role..."
                                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Role Options */}
                                <div className="max-h-64 overflow-y-auto">
                                    {filteredRoles.length > 0 ? (
                                        filteredRoles.map((r) => {
                                            const isSelected = role === r.value;
                                            return (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() =>
                                                        handleRoleSelect(
                                                            r.value,
                                                        )
                                                    }
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
                                                        <span className="text-lg">
                                                            {r.icon}
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
                                                            {r.label}
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
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">
                        Filter aktif:
                    </span>
                    {search && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            🔍 "{search}"
                        </span>
                    )}
                    {role !== 'all' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                            {roles.find((r) => r.value === role)?.icon}{' '}
                            {roles.find((r) => r.value === role)?.label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
