import { StatsGrid } from '@/components/admin/dashboard/ui/statsGrid';
import { SystemHealth } from '@/components/admin/dashboard/ui/systemHealth';
import { UserOverviewTable } from '@/components/admin/dashboard/ui/userOverviewTable';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';

interface Stats {
    totalStudents: number;
    totalTeachers: number;
    totalClassrooms: number;
    totalMissions: number;
}

interface LatestUser {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    avatar: string | null;
    created_at: string;
}

interface AdminDashboardProps {
    auth: {
        user: User;
    };
    stats: Stats;
    latestUsers: LatestUser[];
}

export default function AdminDashboard({
    auth,
    stats,
    latestUsers,
}: AdminDashboardProps) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Admin Dashboard
                    </h2>
                    <p className="text-xs text-slate-500">
                        Kelola seluruh sistem DliLearn
                    </p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Welcome Banner - Sesuai dengan Teacher Dashboard */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 shadow-2xl sm:p-10">
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="mb-1 text-sm font-medium text-indigo-200">
                                    Selamat datang kembali,
                                </p>
                                <h1 className="mb-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                                    {auth.user.name}! 👋
                                </h1>
                                <p className="max-w-lg text-sm text-indigo-100 sm:text-base">
                                    Kelola user, kelas, dan misi pembelajaran
                                    dengan mudah dari panel admin.
                                </p>
                            </div>

                            {/* Quick Action Button */}
                            <a
                                href="/admin/users"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 sm:px-6"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Kelola User</span>
                            </a>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <StatsGrid stats={stats} />

                    {/* Main Content - Split Layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left: User Overview Table (2/3 width) */}
                        <div className="lg:col-span-2">
                            <UserOverviewTable users={latestUsers} />
                        </div>

                        {/* Right: System Health (1/3 width) */}
                        <div className="lg:col-span-1">
                            <SystemHealth />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
