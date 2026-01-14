import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    avatar: string | null;
    xp: number;
    level: number;
    created_at: string;
}

interface UserTableProps {
    users: User[];
    onDelete: (user: User) => void;
}

const roleColors = {
    student: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    teacher: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
};

const roleLabels = {
    student: 'Siswa',
    teacher: 'Guru',
    admin: 'Admin',
};

export function UserTable({ users, onDelete }: UserTableProps) {
    if (users.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    <span className="text-4xl">👥</span>
                </div>
                <h4 className="mb-2 text-lg font-bold text-slate-700">
                    Tidak Ada User
                </h4>
                <p className="text-sm text-slate-500">
                    Belum ada user yang ditemukan dengan filter ini
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                            👥 Daftar User
                        </h3>
                        <p className="text-xs text-slate-600 sm:text-sm">
                            Kelola semua user sistem
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left sm:px-6">
                                User
                            </th>
                            <th className="hidden px-4 py-3 text-left sm:table-cell sm:px-6">
                                Username
                            </th>
                            <th className="hidden px-4 py-3 text-left md:table-cell md:px-6">
                                Email
                            </th>
                            <th className="px-4 py-3 text-center sm:px-6">
                                Role
                            </th>
                            <th className="hidden px-4 py-3 text-center sm:table-cell sm:px-6">
                                Level
                            </th>
                            <th className="px-4 py-3 text-right sm:px-6">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="transition hover:bg-slate-50"
                            >
                                <td className="px-4 py-3 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-md">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-500 sm:hidden">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden px-4 py-3 text-sm text-slate-600 sm:table-cell sm:px-6">
                                    @{user.username}
                                </td>
                                <td className="hidden px-4 py-3 text-sm text-slate-600 md:table-cell md:px-6">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3 text-center sm:px-6">
                                    <span
                                        className={cn(
                                            'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                                            roleColors[user.role],
                                        )}
                                    >
                                        {roleLabels[user.role]}
                                    </span>
                                </td>
                                <td className="hidden px-4 py-3 text-center text-sm font-medium text-slate-700 sm:table-cell sm:px-6">
                                    <span className="inline-flex items-center gap-1">
                                        <span className="text-base">⭐</span>
                                        {user.level}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right sm:px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
