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
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 p-8 shadow-2xl sm:p-12">
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
                        </div>

                        <div className="relative z-10">
                            <h1 className="mb-2 text-3xl font-black text-white sm:text-4xl">
                                Halo, {auth.user.name}! 👋
                            </h1>
                            <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
                                Selamat datang di panel admin. Kelola user,
                                kelas, dan misi dengan mudah.
                            </p>
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
