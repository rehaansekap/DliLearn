import { MissionCard } from '@/components/teacher/dashboard/missionCard';

interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
    classroom_name: string;
    classroom_id: number;
    total_groups: number;
    completed_groups: number;
    needs_review: number;
    started_at: string | null;
    finished_at: string | null;
}

interface MissionGridProps {
    missions: Mission[];
}

export function MissionGrid({ missions }: MissionGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
            ))}
        </div>
    );
}
