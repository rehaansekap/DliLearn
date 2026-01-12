import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check, Save, X } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface Attendance {
    student_id: number;
    is_present: boolean;
}

interface TabAttendanceProps {
    students: Student[];
    missionId: number;
    initialAttendance?: Attendance[];
    classroom?: { id: number; name: string; join_code?: string | null };
}

export function TabAttendance({
    students,
    missionId,
    initialAttendance = [],
    classroom,
}: TabAttendanceProps) {
    const isMobile = useIsMobile();

    const [attendance, setAttendance] = useState<Record<number, boolean>>(
        () => {
            const initial: Record<number, boolean> = {};
            initialAttendance.forEach((att) => {
                initial[att.student_id] = att.is_present;
            });
            return initial;
        },
    );

    // mark all convenience for mobile
    const markAllPresent = () => {
        const all: Record<number, boolean> = {};
        students.forEach((s) => {
            all[s.id] = true;
        });
        setAttendance(all);
    };
    const clearAll = () => {
        setAttendance({});
    };

    const [isSaving, setIsSaving] = useState(false);

    const toggleAttendance = (studentId: number) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    const handleSave = () => {
        const data = Object.entries(attendance).map(
            ([studentId, isPresent]) => ({
                student_id: Number(studentId),
                is_present: isPresent,
            }),
        );

        setIsSaving(true);
        router.post(
            `/teacher/mission/${missionId}/attendance`,
            { attendance: data },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    router.reload();
                },
                onError: (errors) => {
                    console.error('attendance errors', errors);
                    setIsSaving(false);
                },
            },
        );
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;

    return (
        <div className={cn('space-y-6', isMobile && 'pb-24')}>
            {/* Header Card */}
            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6">
                <div
                    className={cn(
                        'flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center',
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-xl shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                            ✅
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                                Presensi Kehadiran
                            </h2>
                            <p className="text-xs text-slate-600 sm:text-sm">
                                Tandai siswa yang hadir dalam sesi ini
                            </p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'text-center',
                            isMobile ? 'mt-3 w-full' : '',
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center justify-center gap-4',
                                isMobile ? 'flex-col' : '',
                            )}
                        >
                            <div>
                                <p className="text-2xl font-black text-green-700 sm:text-3xl">
                                    {presentCount}
                                </p>
                                <p className="text-xs text-green-600 sm:text-sm">
                                    dari {students.length} siswa
                                </p>
                            </div>

                            {/* Mobile quick actions - grid penuh agar mudah disentuh */}
                            {isMobile && students.length > 0 && (
                                <div className="mt-2 grid w-full max-w-xs grid-cols-2 gap-2">
                                    <button
                                        onClick={markAllPresent}
                                        className="w-full rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs font-semibold text-indigo-700"
                                    >
                                        Tandai Semua Hadir
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="w-full rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                                    >
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-800">
                        📋 Daftar Siswa
                    </h3>
                    <p className="text-sm text-slate-500">
                        Klik tombol untuk mengubah status kehadiran
                    </p>
                </div>

                {students.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-slate-700">
                            Belum Ada Siswa
                        </h4>
                        <p className="mb-4 text-sm text-slate-500">
                            Belum ada siswa terdaftar di kelas ini. Bagikan kode
                            gabung agar siswa dapat masuk.
                        </p>
                        {classroom?.join_code && (
                            <div className="flex items-center justify-center gap-2">
                                <input
                                    readOnly
                                    value={classroom.join_code}
                                    title="Kode Gabung Kelas"
                                    placeholder="Kode Gabung Kelas"
                                    aria-label="Kode gabung kelas"
                                    className="color-slate-800 w-40 rounded-lg border bg-slate-100 px-3 py-2 text-center text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            classroom.join_code || '',
                                        )
                                    }
                                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                                >
                                    Salin Kode Kelas
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {students.map((student) => {
                            const isPresent = attendance[student.id] || false;
                            return (
                                <div
                                    key={student.id}
                                    className={cn(
                                        'px-6 py-4 transition hover:bg-slate-50',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex items-start justify-between gap-4',
                                            isMobile
                                                ? 'flex-col'
                                                : 'flex-row items-center',
                                        )}
                                    >
                                        {/* Student Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-md">
                                                <span className="text-sm font-bold">
                                                    {student.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {student.name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    @{student.username}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Toggle Button */}
                                        <div
                                            className={cn(
                                                isMobile ? 'mt-3 w-full' : '',
                                            )}
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleAttendance(student.id)
                                                }
                                                className={cn(
                                                    'flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-md transition-all',
                                                    isMobile ? 'w-full' : '',
                                                    isPresent
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                                        : 'border-2 border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50',
                                                )}
                                                aria-pressed={isPresent}
                                                aria-label={`${student.name} hadir ${isPresent ? 'ya' : 'tidak'}`}
                                            >
                                                {isPresent ? (
                                                    <>
                                                        <Check className="h-4 w-4" />
                                                        <span>Hadir</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-4 w-4" />
                                                        <span>Absen</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer for desktop */}
                <div className="hidden rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-4 sm:block">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || students.length === 0}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {isSaving ? (
                            <>
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>Simpan Kehadiran</span>
                            </>
                        )}
                    </button>
                </div>
                {/* Sticky mobile save bar */}
                {isMobile && students.length > 0 && (
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/80 px-4 py-3 backdrop-blur-sm sm:hidden">
                        <div className="mx-auto max-w-3xl">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    'w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50',
                                )}
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Kehadiran'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
