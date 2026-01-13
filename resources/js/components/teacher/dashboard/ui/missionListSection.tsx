import { EmptyMissionState } from './emptyMissionState';
import { MissionGrid } from './missionGrid';
import { MissionListHeader } from './missionListHeader';
import { Pagination } from './pagination';

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

interface MissionListSectionProps {
    missions: Mission[];
    paginatedMissions: Mission[];
    filteredMissions: Mission[];
    classrooms: Array<{ id: number; name: string }>;
    searchQuery: string;
    selectedClassroomId: number | null;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    missionCounts: Record<number, number>;
    onSearchChange: (value: string) => void;
    onClassroomChange: (id: number | null) => void;
    onPageChange: (page: number) => void;
    onDeleteMission: (mission: {
        id: number;
        title: string;
        slug: string;
    }) => void;
}

export function MissionListSection({
    missions,
    paginatedMissions,
    filteredMissions,
    classrooms,
    searchQuery,
    selectedClassroomId,
    currentPage,
    totalPages,
    itemsPerPage,
    missionCounts,
    onSearchChange,
    onClassroomChange,
    onPageChange,
    onDeleteMission,
}: MissionListSectionProps) {
    const subtitle = selectedClassroomId
        ? `Menampilkan misi untuk ${classrooms.find((c) => c.id === selectedClassroomId)?.name}`
        : 'Kelola misi pembelajaran untuk setiap kelas';

    return (
        <div>
            <MissionListHeader
                title="🎯 Daftar Misi"
                subtitle={subtitle}
                searchQuery={searchQuery}
                selectedClassroomId={selectedClassroomId}
                classrooms={classrooms}
                missionCounts={missionCounts}
                totalMissions={missions.length}
                onSearchChange={onSearchChange}
                onClassroomChange={onClassroomChange}
            />

            {paginatedMissions.length > 0 ? (
                <>
                    <MissionGrid
                        missions={paginatedMissions}
                        onDelete={onDeleteMission}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredMissions.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
                </>
            ) : missions.length === 0 ? (
                <EmptyMissionState type="no-missions" />
            ) : (
                <EmptyMissionState type="no-results" />
            )}
        </div>
    );
}
