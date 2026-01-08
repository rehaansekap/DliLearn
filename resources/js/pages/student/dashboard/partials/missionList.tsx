import { MissionCardItem } from './missionCardItem';

interface Mission {
    id: number;
    title: string;
    description: string;
    level: number;
    slug: string;
    status: string;
}

interface MissionListProps {
    missions: Mission[];
}

export function MissionList({ missions }: MissionListProps) {
    if (!missions || missions.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-slate-700">
                        Belum Ada Misi Tersedia
                    </h3>
                    <p className="text-slate-500">
                        Misi petualangan baru akan segera hadir! <br />
                        Tetap semangat dan siap untuk tantangan berikutnya 🚀
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
                        🎯 Misi Petualanganmu
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Pilih misi dan mulai petualangan coding-mu!
                    </p>
                </div>
                <div className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 sm:flex">
                    <span className="text-xl">📊</span>
                    <span className="text-sm font-bold text-indigo-700">
                        {missions.length} Misi
                    </span>
                </div>
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {missions.map((mission) => (
                    <MissionCardItem key={mission.id} mission={mission} />
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center">
                <span className="mb-3 inline-block text-5xl">🏆</span>
                <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Selesaikan Semua Misi!
                </h3>
                <p className="text-sm text-slate-600">
                    Kumpulkan XP, naik level, dan jadilah Master Coder! 💪
                </p>
            </div>
        </div>
    );
}
