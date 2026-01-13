import {
    BackgroundPattern,
    MissionDetailHeader,
    MissionStats,
    MissionTabs,
    PageContainer,
} from '@/components/teacher/mission/ui/detail';
import {
    SubmissionDetailModal,
    TabAttendance,
    TabGroupManagement,
    TabMonitoring,
} from '@/components/teacher/mission/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import TeacherLayout from '@/layouts/teacher-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty_level: number;
    slug: string;
}

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface GroupMember extends Student {
    role: 'Leader' | 'Problem Analyzer' | 'Algorithm Designer' | 'Presenter';
}

interface Group {
    group_id: number;
    group_name: string;
    group_code: string;
    members: GroupMember[];
    collab_url?: string | null;
}

interface Reflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: 'initial' | 'final';
}

interface Feedback {
    id: number;
    user_name: string;
    group_name: string;
    message: string;
    created_at: string;
}

interface Grade {
    score: number;
    teacher_notes: string | null;
}

interface GroupMonitoring extends Group {
    step1_status: 'locked' | 'in_progress' | 'completed';
    step2_status: 'locked' | 'in_progress' | 'completed';
    step3_status: 'locked' | 'in_progress' | 'completed';
    step4_status: 'locked' | 'in_progress' | 'completed';
    step5_status: 'locked' | 'in_progress' | 'completed';
    current_step: number;
    reflections: Reflection[];
    file_path?: string | null;
    code_answer?: string | null;
    submitted_at?: string | null;
    submission_id?: number | null;
    likes_count?: number;
    feedbacks?: Feedback[];
    grade?: Grade | null;
}

interface Stats {
    totalGroups: number;
    completedGroups: number;
    inProgressGroups: number;
    notStartedGroups: number;
}

interface VoteResult {
    group_id: number;
    group_name: string;
    group_code: string | null;
    vote_count: number;
}

interface ShowProps {
    auth: {
        user: User;
    };
    mission: Mission;
    students: Student[];
    groups: Group[];
    groupsMonitoring: GroupMonitoring[];
    voteResults: VoteResult[];
    stats: Stats;
    initialAttendance?: { student_id: number; is_present: boolean }[];
    allReflections?: Reflection[];
    classroom?: { id: number; name: string; join_code?: string | null };
}

export default function Show({
    auth,
    mission,
    students,
    groups,
    groupsMonitoring,
    voteResults,
    stats,
    initialAttendance = [],
    allReflections = [],
    classroom,
}: ShowProps) {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<
        'attendance' | 'groups' | 'monitoring'
    >('attendance');
    const [selectedSubmission, setSelectedSubmission] =
        useState<GroupMonitoring | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewSubmission = (groupId: number) => {
        const group = groupsMonitoring.find((g) => g.group_id === groupId);
        if (group) {
            setSelectedSubmission(group);
            setShowModal(true);
        }
    };

    return (
        <TeacherLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Manajemen Kelas & Monitoring
                    </h2>
                    <p className="text-xs text-slate-500">
                        Kelola kehadiran, kelompok, dan pantau progress siswa
                    </p>
                </div>
            }
        >
            <Head title={`Kelola: ${mission.title}`} />

            {/* Background Pattern */}
            <BackgroundPattern />

            <PageContainer>
                {/* Mission Header */}
                <MissionDetailHeader mission={mission} isMobile={isMobile} />

                {/* Statistics */}
                <MissionStats
                    totalGroups={stats.totalGroups}
                    completedGroups={stats.completedGroups}
                    inProgressGroups={stats.inProgressGroups}
                    notStartedGroups={stats.notStartedGroups}
                />

                {/* Tab Navigation */}
                <MissionTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <div>
                    {activeTab === 'attendance' && (
                        <TabAttendance
                            students={students}
                            missionId={mission.id}
                            initialAttendance={initialAttendance}
                            classroom={classroom}
                        />
                    )}

                    {activeTab === 'groups' && (
                        <TabGroupManagement
                            students={students}
                            groups={groups}
                            missionId={mission.id}
                        />
                    )}

                    {activeTab === 'monitoring' && (
                        <TabMonitoring
                            groups={groupsMonitoring}
                            voteResults={voteResults}
                            allReflections={allReflections}
                            onViewSubmission={handleViewSubmission}
                        />
                    )}
                </div>
            </PageContainer>

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedSubmission(null);
                    }}
                    submission={{
                        group_id: selectedSubmission.group_id,
                        group_name: selectedSubmission.group_name,
                        group_code: selectedSubmission.group_code,
                        members: selectedSubmission.members,
                        file_path: selectedSubmission.file_path || null,
                        code_answer: selectedSubmission.code_answer || null,
                        submitted_at: selectedSubmission.submitted_at || null,
                        submission_id: selectedSubmission.submission_id || null,
                        likes_count: selectedSubmission.likes_count,
                        feedbacks: selectedSubmission.feedbacks || [],
                        grade: selectedSubmission.grade || null,
                    }}
                />
            )}
        </TeacherLayout>
    );
}
