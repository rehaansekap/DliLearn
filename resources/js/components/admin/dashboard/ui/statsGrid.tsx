import { StatsCard } from '@/components/admin/dashboard/statsCard';

interface Stats {
    totalStudents: number;
    totalTeachers: number;
    totalClassrooms: number;
    totalMissions: number;
}

interface StatsGridProps {
    stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <StatsCard
                title="Total Siswa"
                value={stats.totalStudents}
                icon="👨‍🎓"
                color="blue"
            />
            <StatsCard
                title="Total Guru"
                value={stats.totalTeachers}
                icon="👨‍🏫"
                color="emerald"
            />
            <StatsCard
                title="Total Kelas"
                value={stats.totalClassrooms}
                icon="🏫"
                color="amber"
            />
            <StatsCard
                title="Total Misi"
                value={stats.totalMissions}
                icon="🎯"
                color="slate"
            />
        </div>
    );
}
