import { Link } from '@inertiajs/react';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
    join_code: string | null;
    students_count: number;
    created_at: string;
}

interface ClassroomCardProps {
    classroom: Classroom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-xl">
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-6">
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%)] bg-[length:60px_60px]" />
                </div>

                <div className="relative z-10">
                    <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white">
                        {classroom.name}
                    </h3>
                    <p className="text-sm text-indigo-100">
                        Tahun Ajaran {classroom.academic_year}
                    </p>
                </div>

                {/* Student Count Badge */}
                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                        <span className="text-sm">👨‍🎓</span>
                        <span className="text-xs font-semibold text-white">
                            {classroom.students_count} Siswa
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Join Code */}
                {classroom.join_code && (
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Kode Gabung
                            </p>
                            <p className="font-mono text-lg font-bold tracking-wider text-indigo-600">
                                {classroom.join_code}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    classroom.join_code || '',
                                );
                            }}
                            className="rounded-lg bg-indigo-100 p-2 text-indigo-600 transition hover:bg-indigo-200"
                            title="Salin kode"
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
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        href={`/teacher/class/${classroom.id}`}
                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                    >
                        Masuk Kelas
                    </Link>
                    <button
                        type="button"
                        className="rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                        title="Lihat opsi kelas"
                        aria-label="Lihat opsi kelas"
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
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
