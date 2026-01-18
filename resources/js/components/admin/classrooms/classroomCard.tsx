import { Link } from '@inertiajs/react';
import { Edit2, Trash2, Users, UserPlus } from 'lucide-react';

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
    join_code: string;
    teacher_name: string;
    teacher_avatar: string | null;
    students_count: number;
    created_at: string;
}

interface ClassroomCardProps {
    classroom: Classroom;
    onDelete: (classroom: Classroom) => void;
}

export function ClassroomCard({ classroom, onDelete }: ClassroomCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:scale-[1.02] hover:border-indigo-300 hover:shadow-xl">
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
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
                        <Users className="h-4 w-4 text-white" />
                        <span className="text-xs font-semibold text-white">
                            {classroom.students_count}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Join Code */}
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

                {/* Teacher Info */}
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                        {classroom.teacher_name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">
                            Guru Pengajar
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                            {classroom.teacher_name}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href={`/admin/classrooms/${classroom.id}/students`}
                        className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        title="Kelola Siswa"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Kelola Siswa</span>
                    </Link>
                    <Link
                        href={`/admin/classrooms/${classroom.id}/edit`}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                        title="Edit Kelas"
                    >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(classroom)}
                    className="mt-2 w-full rounded-lg bg-red-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-600"
                    aria-label="Hapus kelas"
                    title="Hapus kelas"
                >
                    <Trash2 className="mx-auto h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline">Hapus Kelas</span>
                </button>
            </div>
        </div>
    );
}
