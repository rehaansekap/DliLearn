import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    username: string;
}

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    unassignedStudents: Student[];
    groups: Array<{ group_id: number; group_name: string }>;
    onAddStudent: (studentId: number, groupId: number) => void;
}

export function AddStudentModal({
    isOpen,
    onClose,
    unassignedStudents,
    groups,
    onAddStudent,
}: AddStudentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h3 className="text-xl font-bold text-slate-800">
                        Tambahkan Siswa ke Kelompok
                    </h3>
                    <button
                        onClick={onClose}
                        title="Tutup"
                        aria-label="Tutup modal"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[500px] overflow-y-auto p-6">
                    {unassignedStudents.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center">
                            <span className="mb-2 block text-4xl">✅</span>
                            <p className="text-slate-600">
                                Semua siswa sudah masuk kelompok
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {unassignedStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white">
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
                                    <div className="grid grid-cols-2 gap-2">
                                        {groups.map((group) => (
                                            <button
                                                key={group.group_id}
                                                onClick={() => {
                                                    onAddStudent(
                                                        student.id,
                                                        group.group_id,
                                                    );
                                                    onClose();
                                                }}
                                                className={cn(
                                                    'rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50',
                                                )}
                                            >
                                                {group.group_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
