import StudentLayout from '@/layouts/student-layout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, missions, userXp, userLevel }) {
    return (
        <StudentLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Misi Pembelajaran
                </h2>
            }
        >
            <Head title="Dashboard Siswa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="mb-1 text-2xl font-bold text-gray-900">
                                    Halo, {auth.user.name}!
                                </h3>
                                <p className="text-gray-600">
                                    Siap memecahkan masalah hari ini?
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                                    Level {userLevel}
                                </span>
                                <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                    {userXp} XP
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {missions.map((mission) => (
                            <div
                                key={mission.id}
                                className="overflow-hidden border border-gray-200 bg-white shadow-sm sm:rounded-lg"
                            >
                                <div className="p-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {mission.title}
                                        </h3>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${
                                                mission.level === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            Level {mission.level}
                                        </span>
                                    </div>
                                    <p className="mb-4 h-12 overflow-hidden text-sm text-gray-600">
                                        {mission.description}
                                    </p>

                                    <div className="mt-4">
                                        <Link
                                            href={`/mission/${mission.slug}`}
                                            className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase ring-gray-300 transition duration-150 ease-in-out hover:bg-gray-700 focus:border-gray-900 focus:ring focus:outline-none active:bg-gray-900 disabled:opacity-25"
                                        >
                                            Mulai Misi
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
