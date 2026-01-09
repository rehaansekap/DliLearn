import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { ClassroomCard } from './partials/classroomCard';
import { StatsCard } from './partials/statsCard';
import { WelcomeBanner } from './partials/welcomeBanner';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
    join_code: string | null;
    students_count: number;
    created_at: string;
}

interface Stats {
    totalClasses: number;
    totalStudents: number;
    activeMissions: number;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    classrooms: Classroom[];
    stats: Stats;
}

export default function Dashboard({ auth, classrooms, stats }: DashboardProps) {
    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Dashboard Guru
                    </h2>
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Kelola kelas dan pantau progress siswa
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Guru" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Welcome Banner */}
                    <WelcomeBanner user={auth.user} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <StatsCard
                            title="Total Kelas"
                            value={stats.totalClasses}
                            icon="🏫"
                            color="indigo"
                            subtitle="Kelas yang Anda ajar"
                        />
                        <StatsCard
                            title="Total Siswa"
                            value={stats.totalStudents}
                            icon="👨‍🎓"
                            color="emerald"
                            subtitle="Di semua kelas Anda"
                        />
                        <StatsCard
                            title="Misi Aktif"
                            value={stats.activeMissions}
                            icon="🎯"
                            color="amber"
                            subtitle="Sedang berlangsung"
                        />
                    </div>

                    {/* Classroom Section */}
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">
                                    🏫 Daftar Kelas
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Kelola kelas dan siswa Anda
                                </p>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
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
                                <span>Tambah Kelas</span>
                            </button>
                        </div>

                        {classrooms.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {classrooms.map((classroom) => (
                                    <ClassroomCard
                                        key={classroom.id}
                                        classroom={classroom}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-4xl">🏫</span>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                                        Belum Ada Kelas
                                    </h4>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Mulai dengan membuat kelas pertama Anda
                                    </p>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700"
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
                                        <span>Buat Kelas Baru</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                        <h4 className="mb-4 text-lg font-bold text-slate-800">
                            ⚡ Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                                <span className="text-2xl">📝</span>
                                <span className="text-xs font-medium text-slate-600">
                                    Buat Misi
                                </span>
                            </button>
                            <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                                <span className="text-2xl">👥</span>
                                <span className="text-xs font-medium text-slate-600">
                                    Kelola Grup
                                </span>
                            </button>
                            <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                                <span className="text-2xl">📊</span>
                                <span className="text-xs font-medium text-slate-600">
                                    Lihat Nilai
                                </span>
                            </button>
                            <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                                <span className="text-2xl">📈</span>
                                <span className="text-xs font-medium text-slate-600">
                                    Laporan
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
