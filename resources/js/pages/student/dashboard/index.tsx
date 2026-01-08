import StudentLayout from '@/layouts/student-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { MissionList } from './partials/missionList';
import { StatsOverview } from './partials/statsOverview';
import { WelcomeBanner } from './partials/welcomeBanner';

interface Mission {
    id: number;
    title: string;
    description: string;
    level: number;
    slug: string;
    status: string;
    locked: boolean;
    prerequisite?: {
        id: number;
        title: string;
        slug: string;
    } | null;
    started_at?: string | null;
    finished_at?: string | null;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    missions: Mission[];
    userXp: number;
    userLevel: number;
}

export default function Dashboard({
    auth,
    missions,
    userXp,
    userLevel,
}: DashboardProps) {
    return (
        <StudentLayout
            user={auth.user}
            showBackButton={false}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                            Dashboard Petualangan
                        </h2>
                        <p className="text-xs text-slate-600 sm:text-sm">
                            Kelola misi dan pantau progress belajarmu
                        </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                            🎯 Student
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Petualangan" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Welcome Banner */}
                        <WelcomeBanner user={auth.user} />

                        {/* Stats Overview */}
                        <StatsOverview level={userLevel} xp={userXp} />

                        {/* Mission List */}
                        <MissionList missions={missions} />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
