import { InputError } from '@/components/admin/users/ui/inputError';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Loader2, RefreshCw } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface ClassroomFormData {
    name: string;
    academic_year: string;
    teacher_id: number | string;
    regenerate_code?: boolean;
}

interface ClassroomFormProps {
    initialData?: Partial<ClassroomFormData> & {
        id?: number;
        join_code?: string;
        students_count?: number;
    };
    teachers: Teacher[];
    isEdit?: boolean;
    onSubmit: (data: Record<string, unknown>) => void;
}

export function ClassroomForm({
    initialData,
    teachers,
    isEdit = false,
    onSubmit,
}: ClassroomFormProps) {
    const { data, setData, errors, processing } = useForm<ClassroomFormData>({
        name: initialData?.name || '',
        academic_year: initialData?.academic_year || '',
        teacher_id: initialData?.teacher_id || '',
        regenerate_code: false,
    });

    const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    const selectedTeacher = teachers.find(
        (t) => t.id === Number(data.teacher_id),
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Classroom Name */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Kelas <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: X RPL 1"
                    className={cn(
                        'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                        errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                    )}
                />
                <InputError message={errors.name} />
            </div>

            {/* Academic Year */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tahun Ajaran <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.academic_year}
                    onChange={(e) => setData('academic_year', e.target.value)}
                    placeholder="Contoh: 2024/2025"
                    className={cn(
                        'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                        errors.academic_year
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                    )}
                />
                <InputError message={errors.academic_year} />
                <p className="mt-1 text-xs text-slate-500">
                    Format: YYYY/YYYY (contoh: 2024/2025)
                </p>
            </div>

            {/* Teacher Selection */}
            <div>
                <label
                    htmlFor="teacher_id"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Guru Pengajar <span className="text-red-500">*</span>
                </label>
                <select
                    id="teacher_id"
                    value={data.teacher_id}
                    onChange={(e) => setData('teacher_id', e.target.value)}
                    className={cn(
                        'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                        errors.teacher_id
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                    )}
                >
                    <option value="">Pilih Guru</option>
                    {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.teacher_id} />

                {/* Selected Teacher Info */}
                {selectedTeacher && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                            {selectedTeacher.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-emerald-600">
                                Guru Terpilih
                            </p>
                            <p className="text-sm font-semibold text-emerald-900">
                                {selectedTeacher.name}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Join Code Info (Edit Mode) */}
            {isEdit && initialData?.join_code && (
                <div className="space-y-3">
                    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-semibold text-indigo-900">
                                Kode Gabung Saat Ini
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        initialData.join_code || '',
                                    )
                                }
                                className="rounded-lg bg-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-300"
                            >
                                📋 Salin
                            </button>
                        </div>
                        <p className="font-mono text-2xl font-bold tracking-wider text-indigo-700">
                            {initialData.join_code}
                        </p>
                        {initialData.students_count !== undefined && (
                            <p className="mt-2 text-xs text-indigo-600">
                                👥 {initialData.students_count} siswa
                                menggunakan kode ini
                            </p>
                        )}
                    </div>

                    {/* Regenerate Code Option */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.regenerate_code}
                                onChange={(e) => {
                                    setData(
                                        'regenerate_code',
                                        e.target.checked,
                                    );
                                    setShowRegenerateWarning(e.target.checked);
                                }}
                                className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500/20"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-amber-900">
                                    <RefreshCw className="mr-1 inline h-4 w-4" />
                                    Generate Ulang Kode Gabung
                                </p>
                                <p className="mt-1 text-xs text-amber-700">
                                    Kode lama akan tidak aktif. Siswa harus
                                    menggunakan kode baru untuk bergabung.
                                </p>
                            </div>
                        </label>

                        {showRegenerateWarning && (
                            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-xs font-semibold text-red-800">
                                    ⚠️ Perhatian: Kode lama tidak akan bisa
                                    digunakan lagi!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
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
                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isEdit ? 'Update Kelas' : 'Tambah Kelas'}</span>
                </button>
            </div>
        </form>
    );
}
