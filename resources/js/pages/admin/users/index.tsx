import { UserFilters } from '@/components/admin/users/userFilters';
import { UserStats } from '@/components/admin/users/userStats';
import { UserTable } from '@/components/admin/users/userTable';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';

interface UserData {
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

interface PaginatedUsers {
    data: UserData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UsersIndexProps {
    auth: { user: User };
    users: PaginatedUsers;
    stats: {
        totalUsers: number;
        totalStudents: number;
        totalTeachers: number;
        totalAdmins: number;
    };
    filters: {
        role: string;
        search: string;
    };
}

export default function UsersIndex({
    auth,
    users,
    stats,
    filters,
}: UsersIndexProps) {
    // const [deleteUser, setDeleteUser] = useState<UserData | null>(null);

    const handleDelete = async (user: UserData) => {
        const SwalModule = await import('sweetalert2');
        await import('sweetalert2/dist/sweetalert2.min.css');

        const result = await SwalModule.default.fire({
            title: 'Hapus User?',
            html: `Apakah Anda yakin ingin menghapus <strong>${user.name}</strong>?<br/><small class="text-slate-500">Tindakan ini tidak dapat dibatalkan.</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-xl' },
        });

        if (result.isConfirmed) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: async () => {
                    await SwalModule.default.fire({
                        icon: 'success',
                        title: 'Terhapus!',
                        text: 'User berhasil dihapus.',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-xl' },
                    });
                },
            });
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Kelola User
                    </h2>
                    <p className="text-xs text-slate-500">
                        Tambah, edit, dan hapus user sistem
                    </p>
                </div>
            }
        >
            <Head title="Kelola User" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Stats */}
                    <UserStats stats={stats} />

                    {/* Filters */}
                    <UserFilters
                        currentRole={filters.role}
                        currentSearch={filters.search}
                    />

                    {/* User Table */}
                    <UserTable users={users.data} onDelete={handleDelete} />

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-lg">
                            <p className="text-sm text-slate-600">
                                Menampilkan {users.data.length} dari{' '}
                                {users.total} user
                            </p>
                            <div className="flex gap-2">
                                {Array.from(
                                    { length: users.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() =>
                                            router.get(
                                                `/admin/users?page=${page}&role=${filters.role}&search=${filters.search}`,
                                            )
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            page === users.current_page
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
