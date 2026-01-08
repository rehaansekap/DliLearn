import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
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
    const isMobile = useIsMobile();
    const itemsPerPage = isMobile ? 2 : 3;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(missions.length / itemsPerPage));

    if (currentPage > totalPages) {
        setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = missions.slice(startIndex, startIndex + itemsPerPage);

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
                {pageItems.map((mission) => (
                    <MissionCardItem key={mission.id} mission={mission} />
                ))}
            </div>

            {/* Pagination (matching Phase5Evaluation styles) */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Menampilkan{' '}
                    <span className="font-bold text-slate-800">
                        {missions.length === 0 ? 0 : startIndex + 1} –{' '}
                        {Math.min(startIndex + itemsPerPage, missions.length)}
                    </span>{' '}
                    dari{' '}
                    <span className="font-bold text-slate-800">
                        {missions.length}
                    </span>{' '}
                    misi
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="text-sm">←</span>
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    {!isMobile ? (
                        <div className="flex items-center gap-2 rounded-lg border border-indigo-50 bg-white/60 p-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                                        currentPage === i + 1
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-2 text-sm text-slate-500">
                            {/* compact mobile */}
                        </div>
                    )}

                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <span className="text-sm">→</span>
                    </button>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 rounded-2xl border-2 border-indigo-200 bg-white p-8 text-center">
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
