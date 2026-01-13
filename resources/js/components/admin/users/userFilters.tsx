import { router } from '@inertiajs/react';
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface UserFiltersProps {
    currentRole: string;
    currentSearch: string;
}

const roles = [
    { value: 'all', label: 'Semua Role' },
    { value: 'student', label: 'Siswa' },
    { value: 'teacher', label: 'Guru' },
    { value: 'admin', label: 'Admin' },
];

export function UserFilters({ currentRole, currentSearch }: UserFiltersProps) {
    const [search, setSearch] = useState(currentSearch);
    const [role, setRole] = useState(currentRole);

    const handleFilter = () => {
        router.get(
            '/admin/users',
            { role, search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setRole('all');
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                    🔍 Filter User
                </h3>
                <a
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700"
                >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah User</span>
                </a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Cari User
                    </label>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama, email, atau username..."
                            className="w-full rounded-xl border border-slate-300 py-2 pr-4 pl-10 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFilter();
                            }}
                        />
                    </div>
                </div>

                {/* Role Filter */}
                <div>
                    <label
                        htmlFor="user-role-filter"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Filter Role
                    </label>
                    <select
                        id="user-role-filter"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    >
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
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
