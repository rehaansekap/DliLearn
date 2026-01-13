import { StatsCard } from '@/components/teacher/dashboard/statsCard';

interface Stats {
    totalMissions: number;
    totalStudents: number;
    activeMissions: number;
    pendingReview: number;
}

interface StatsGridProps {
    stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <StatsCard
                title="Total Misi"
                value={stats.totalMissions}
                icon="🎯"
                color="indigo"
            />
            <StatsCard
                title="Total Siswa"
                value={stats.totalStudents}
                icon="👨‍🎓"
                color="emerald"
            />
            <StatsCard
                title="Misi Aktif"
                value={stats.activeMissions}
                icon="⚡"
                color="amber"
            />
            <StatsCard
                title="Perlu Review"
                value={stats.pendingReview}
                icon="📝"
                color="rose"
            />
        </div>
    );
}
