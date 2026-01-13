import {
    AttendanceHeader,
    AttendanceStats,
    SaveButton,
    StudentGrid,
} from '@/components/teacher/mission/ui/attendance';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
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
    const [isSaving, setIsSaving] = useState(false);

    // Initialize attendance state
    const [attendance, setAttendance] = useState<Record<number, boolean>>(
        () => {
            const initial: Record<number, boolean> = {};
            initialAttendance.forEach((att) => {
                initial[att.student_id] = att.is_present;
            });
            return initial;
        },
    );

    // Handlers
    const handleToggle = (studentId: number) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    const handleMarkAllPresent = () => {
        const all: Record<number, boolean> = {};
        students.forEach((s) => {
            all[s.id] = true;
        });
        setAttendance(all);
    };

    const handleClearAll = () => {
        const all: Record<number, boolean> = {};
        students.forEach((s) => {
            all[s.id] = false;
        });
        setAttendance(all);
    };

    const handleSave = async () => {
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
                onSuccess: async () => {
                    setIsSaving(false);
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'success',
                        title: 'Kehadiran Disimpan',
                        text: 'Kehadiran berhasil disimpan.',
                        timer: 1400,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-xl' },
                    });
                    router.reload();
                },
                onError: async (errors) => {
                    console.error('attendance errors', errors);
                    setIsSaving(false);
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'error',
                        title: 'Gagal Menyimpan',
                        text: 'Gagal menyimpan kehadiran. Coba lagi.',
                        customClass: { popup: 'rounded-xl' },
                    });
                },
            },
        );
    };

    // Calculate stats
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = students.length - presentCount;

    return (
        <div className={cn('space-y-6', isMobile && 'pb-24')}>
            {/* Header */}
            <AttendanceHeader
                title="Presensi Kehadiran"
                subtitle="Tandai siswa yang hadir dalam sesi ini"
                totalStudents={students.length}
                onMarkAllPresent={handleMarkAllPresent}
                onClearAll={handleClearAll}
                isMobile={isMobile}
            />

            {/* Statistics */}
            {students.length > 0 && (
                <AttendanceStats
                    totalStudents={students.length}
                    presentCount={presentCount}
                    absentCount={absentCount}
                />
            )}

            {/* Student Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                        📋 Daftar Siswa
                    </h3>
                    <p className="text-sm text-slate-500">
                        Klik card untuk mengubah status kehadiran
                    </p>
                </div>

                <StudentGrid
                    students={students}
                    attendance={attendance}
                    onToggle={handleToggle}
                    isMobile={isMobile}
                    classroom={classroom}
                />

                {/* Save Button - Desktop */}
                {students.length > 0 && (
                    <SaveButton
                        isSaving={isSaving}
                        disabled={students.length === 0}
                        onClick={handleSave}
                        isMobile={false}
                        isSticky={false}
                    />
                )}
            </div>

            {/* Save Button - Mobile Sticky */}
            {students.length > 0 && (
                <SaveButton
                    isSaving={isSaving}
                    disabled={students.length === 0}
                    onClick={handleSave}
                    isMobile={true}
                    isSticky={true}
                />
            )}
        </div>
    );
}
