import { StudentCard } from './studentCard';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface StudentGridProps {
    students: Student[];
    attendance: Record<number, boolean>;
    onToggle: (studentId: number) => void;
    isMobile: boolean;
    classroom?: { id: number; name: string; join_code?: string | null };
}

export function StudentGrid({
    students,
    attendance,
    onToggle,
    isMobile,
    classroom,
}: StudentGridProps) {
    // Empty State
    if (students.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    <span className="text-4xl">👥</span>
                </div>
                <h4 className="mb-2 text-lg font-bold text-slate-700">
                    Belum Ada Siswa
                </h4>
                <p className="mb-4 text-sm text-slate-500">
                    Belum ada siswa terdaftar di kelas ini. Bagikan kode gabung
                    agar siswa dapat masuk.
                </p>
                {classroom?.join_code && (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            readOnly
                            value={classroom.join_code}
                            title="Kode Gabung Kelas"
                            placeholder="Kode Gabung Kelas"
                            aria-label="Kode gabung kelas"
                            className="w-40 rounded-lg border bg-slate-100 px-3 py-2 text-center text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    classroom.join_code || '',
                                )
                            }
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700"
                        >
                            Salin Kode
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Student Grid
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    isPresent={attendance[student.id] || false}
                    onToggle={() => onToggle(student.id)}
                    isMobile={isMobile}
                />
            ))}
        </div>
    );
}
