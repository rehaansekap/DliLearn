import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface EmptyMissionStateProps {
    type: 'no-missions' | 'no-results';
}

export function EmptyMissionState({ type }: EmptyMissionStateProps) {
    if (type === 'no-missions') {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-4xl">🎯</span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-slate-700">
                        Belum Ada Misi
                    </h4>
                    <p className="mb-4 text-sm text-slate-500">
                        Mulai dengan membuat misi pertama untuk kelas Anda
                    </p>
                    <Link
                        href="/teacher/mission/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Buat Misi Baru</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-3xl">🔍</span>
                </div>
                <h4 className="mb-2 text-lg font-bold text-slate-700">
                    Tidak Ditemukan
                </h4>
                <p className="text-sm text-slate-500">
                    Tidak ada misi yang cocok dengan filter yang dipilih
                </p>
            </div>
        </div>
    );
}
