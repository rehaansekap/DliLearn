import { cn } from '@/lib/utils';
import { AlertCircle, UserPlus } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface UnassignedListProps {
    students: Student[];
    onAddToGroup: (student: Student) => void;
    isMobile?: boolean;
}

export function UnassignedList({
    students,
    onAddToGroup,
    isMobile = false,
}: UnassignedListProps) {
    if (students.length === 0) {
        return (
            <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                    <span className="text-2xl">✅</span>
                </div>
                <p className="text-sm font-semibold text-green-800">
                    Semua siswa sudah masuk kelompok!
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-4 shadow-lg">
            <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-red-800">
                    Siswa Belum Masuk Kelompok ({students.length})
                </h3>
            </div>
            <div
                className={cn(
                    'flex gap-2 overflow-x-auto pb-2',
                    isMobile ? 'flex-col' : 'flex-row',
                )}
            >
                {students.map((student) => (
                    <div
                        key={student.id}
                        className={cn(
                            'group flex items-center gap-2 rounded-lg border border-red-200 bg-white p-2 shadow-sm transition hover:border-red-400 hover:shadow-md',
                            isMobile ? 'w-full' : 'min-w-[200px]',
                        )}
                    >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white">
                            <span className="text-xs font-bold">
                                {student.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {student.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                @{student.username}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onAddToGroup(student)}
                            className="flex-shrink-0 rounded-lg bg-red-100 p-1.5 text-red-600 transition hover:bg-red-200"
                            title={`Tambahkan ${student.name} ke kelompok`}
                        >
                            <UserPlus className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
