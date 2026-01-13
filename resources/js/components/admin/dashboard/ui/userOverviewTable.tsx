import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface LatestUser {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    avatar: string | null;
    created_at: string;
}

interface UserOverviewTableProps {
    users: LatestUser[];
}

const roleColors = {
    student: 'bg-blue-100 text-blue-700 border-blue-200',
    teacher: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const roleLabels = {
    student: 'Siswa',
    teacher: 'Guru',
};

export function UserOverviewTable({ users }: UserOverviewTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 sm:p-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                        👥 User Terbaru
                    </h3>
                    <p className="text-xs text-slate-600 sm:text-sm">
                        5 user terakhir yang mendaftar
                    </p>
                </div>
                <Link
                    href="/admin/users"
                    className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700 sm:px-4 sm:text-sm"
                >
                    Kelola User
                </Link>
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
                                Email
                            </th>
                            <th className="px-4 py-3 text-center sm:px-6">
                                Role
                            </th>
                            <th className="hidden px-4 py-3 text-right sm:table-cell sm:px-6">
                                Bergabung
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-sm text-slate-500"
                                >
                                    Belum ada user terdaftar
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 sm:px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-sm font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-500 sm:hidden">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 text-sm text-slate-600 sm:table-cell sm:px-6">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-center sm:px-6">
                                        <span
                                            className={cn(
                                                'inline-flex rounded-full border px-2 py-1 text-xs font-semibold',
                                                roleColors[user.role],
                                            )}
                                        >
                                            {roleLabels[user.role]}
                                        </span>
                                    </td>
                                    <td className="hidden px-4 py-3 text-right text-sm text-slate-600 sm:table-cell sm:px-6">
                                        {user.created_at}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
