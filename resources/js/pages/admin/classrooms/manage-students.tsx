import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Loader2, Search, UserPlus, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
}

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
    join_code: string;
}

interface ManageStudentsProps {
    auth: { user: User };
    classroom: Classroom;
    classroomStudents: Student[];
    availableStudents: Student[];
}

export default function ManageStudents({
    auth,
    classroom,
    classroomStudents,
    availableStudents,
}: ManageStudentsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing } = useForm<{
        student_ids: number[];
    }>({
        student_ids: classroomStudents.map((s) => s.id),
    });

    const handleAddStudent = (studentId: number) => {
        if (!data.student_ids.includes(studentId)) {
            setData('student_ids', [...data.student_ids, studentId]);
        }
    };

    const handleRemoveStudent = (studentId: number) => {
        setData(
            'student_ids',
            data.student_ids.filter((id) => id !== studentId),
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/classrooms/${classroom.id}/students`, {
            preserveScroll: true,
            onSuccess: async () => {
                const SwalModule = await import('sweetalert2');
                await import('sweetalert2/dist/sweetalert2.min.css');

                await SwalModule.default.fire({
                    icon: 'success',
                    title: 'Berhasil! ✅',
                    text: 'Daftar siswa berhasil diperbarui.',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-xl' },
                });
            },
        });
    };

    const currentStudents = useMemo(() => {
        const ids = new Set(data.student_ids);
        const combined = [...classroomStudents, ...availableStudents];
        const map = new Map<number, Student>();
        combined.forEach((s) => {
            if (ids.has(s.id)) {
                map.set(s.id, s);
            }
        });
        return Array.from(map.values());
    }, [data.student_ids, classroomStudents, availableStudents]);

    const filteredCurrentStudents = useMemo(() => {
        if (!searchQuery) return currentStudents;
        const q = searchQuery.toLowerCase();
        return currentStudents.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.username.toLowerCase().includes(q),
        );
    }, [currentStudents, searchQuery]);

    const filteredAvailableStudents = useMemo(() => {
        const available = availableStudents.filter(
            (s) => !data.student_ids.includes(s.id),
        );
        if (!searchQuery) return available;
        const q = searchQuery.toLowerCase();
        return available.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.username.toLowerCase().includes(q),
        );
    }, [availableStudents, data.student_ids, searchQuery]);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Kelola Siswa: {classroom.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                        Tambah atau hapus siswa dari kelas
                    </p>
                </div>
            }
        >
            <Head title={`Kelola Siswa - ${classroom.name}`} />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Back Button */}
                    <a
                        href="/admin/classrooms"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Kelas
                    </a>

                    {/* Header Card */}
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                                👥
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">
                                    Kelola Siswa: {classroom.name}
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Tahun Ajaran {classroom.academic_year} •{' '}
                                    {currentStudents.length} siswa terdaftar
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-sm">
                            <p className="text-sm font-medium text-indigo-700">
                                Siswa Terdaftar
                            </p>
                            <p className="text-3xl font-black text-indigo-900">
                                {currentStudents.length}
                            </p>
                        </div>
                        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
                            <p className="text-sm font-medium text-emerald-700">
                                Siswa Tersedia
                            </p>
                            <p className="text-3xl font-black text-emerald-900">
                                {filteredAvailableStudents.length}
                            </p>
                        </div>
                        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
                            <p className="text-sm font-medium text-amber-700">
                                Kode Gabung
                            </p>
                            <p className="font-mono text-xl font-black text-amber-900">
                                {classroom.join_code}
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Current Students */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
                                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        📚 Siswa di Kelas
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {currentStudents.length} siswa terdaftar
                                    </p>
                                </div>

                                {/* Search */}
                                <div className="border-b border-slate-200 p-4">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Cari siswa..."
                                            className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm text-slate-900 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Student List */}
                                <div className="max-h-[500px] overflow-y-auto p-4">
                                    {filteredCurrentStudents.length === 0 ? (
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                                                <span className="text-2xl">
                                                    👤
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700">
                                                Belum ada siswa
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Tambahkan siswa dari daftar di
                                                samping
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredCurrentStudents.map(
                                                (student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-300 hover:bg-indigo-50"
                                                    >
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                                                            {student.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                                {student.name}
                                                            </p>
                                                            <p className="truncate text-xs text-slate-500">
                                                                @
                                                                {
                                                                    student.username
                                                                }
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveStudent(
                                                                    student.id,
                                                                )
                                                            }
                                                            className="flex-shrink-0 rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                                            title="Hapus dari kelas"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Available Students */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
                                <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                                    <h3 className="text-lg font-bold text-slate-800">
                                        ➕ Siswa Tersedia
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Siswa yang belum masuk kelas manapun
                                    </p>
                                </div>

                                {/* Student List */}
                                <div className="max-h-[500px] overflow-y-auto p-4">
                                    {filteredAvailableStudents.length === 0 ? (
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                                                <span className="text-2xl">
                                                    ✅
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700">
                                                Tidak ada siswa tersedia
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Semua siswa sudah masuk kelas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredAvailableStudents.map(
                                                (student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                                                    >
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-sm font-bold text-white">
                                                            {student.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                                {student.name}
                                                            </p>
                                                            <p className="truncate text-xs text-slate-500">
                                                                @
                                                                {
                                                                    student.username
                                                                }
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAddStudent(
                                                                    student.id,
                                                                )
                                                            }
                                                            className="flex-shrink-0 rounded-lg bg-emerald-100 p-2 text-emerald-600 transition hover:bg-emerald-200"
                                                            title="Tambah ke kelas"
                                                        >
                                                            <UserPlus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                            <a
                                href="/admin/classrooms"
                                className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                <Check className="h-4 w-4" />
                                <span>Simpan Perubahan</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
