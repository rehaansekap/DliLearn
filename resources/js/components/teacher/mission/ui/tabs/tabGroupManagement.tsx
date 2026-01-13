import {
    AddStudentModal,
    GroupCard,
    GroupStats,
    GroupToolbar,
    SaveButton,
    UnassignedList,
} from '@/components/teacher/mission/ui/groups';
import { useIsMobile } from '@/hooks/use-mobile';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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

interface TabGroupManagementProps {
    students: Student[];
    groups: Group[];
    missionId: number;
}

const AVAILABLE_ROLES = [
    { value: 'Leader', label: 'Leader', color: 'bg-indigo-500' },
    {
        value: 'Algorithm Designer',
        label: 'Algorithm Designer',
        color: 'bg-blue-500',
    },
    {
        value: 'Problem Analyzer',
        label: 'Problem Analyzer',
        color: 'bg-pink-500',
    },
    { value: 'Presenter', label: 'Presenter', color: 'bg-green-500' },
] as const;

export function TabGroupManagement({
    students,
    groups: initialGroups,
    missionId,
}: TabGroupManagementProps) {
    const isMobile = useIsMobile();
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isSaving, setIsSaving] = useState(false);
    const [groupCount, setGroupCount] = useState(4);
    const [showAddModal, setShowAddModal] = useState(false);

    // Calculate unassigned students
    const assignedStudentIds = groups.flatMap((g) =>
        g.members.map((m) => m.id),
    );
    const unassignedStudents = students.filter(
        (s) => !assignedStudentIds.includes(s.id),
    );

    const handleShuffle = () => {
        const allStudents = [...students];
        for (let i = allStudents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allStudents[i], allStudents[j]] = [allStudents[j], allStudents[i]];
        }

        const membersPerGroup = Math.ceil(allStudents.length / groupCount);
        const newGroups: Group[] = [];

        for (let i = 0; i < groupCount; i++) {
            const start = i * membersPerGroup;
            const end = start + membersPerGroup;
            const groupMembers = allStudents.slice(start, end);

            newGroups.push({
                group_id: groups[i]?.group_id || Date.now() + i,
                group_name: groups[i]?.group_name || `Kelompok ${i + 1}`,
                group_code: groups[i]?.group_code || `GRP-${i + 1}`,
                collab_url: groups[i]?.collab_url || null,
                members: groupMembers.map((s, idx) => ({
                    ...s,
                    role: idx === 0 ? 'Leader' : 'Presenter',
                })),
            });
        }

        setGroups(newGroups);
    };

    const handleReset = () => {
        setGroups([]);
    };

    const handleAddGroup = () => {
        const newGroup: Group = {
            group_id: Date.now(),
            group_name: `Kelompok ${groups.length + 1}`,
            group_code: `GRP-${groups.length + 1}`,
            members: [],
        };
        setGroups([...groups, newGroup]);
    };

    const handleGroupNameChange = (groupId: number, newName: string) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.group_id === groupId ? { ...g, group_name: newName } : g,
            ),
        );
    };

    const handleCollabUrlChange = (groupId: number, newUrl: string) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.group_id === groupId ? { ...g, collab_url: newUrl } : g,
            ),
        );
    };

    const handleRemoveGroup = (groupId: number) => {
        setGroups((prev) => prev.filter((g) => g.group_id !== groupId));
    };

    const handleRoleChange = (
        groupId: number,
        studentId: number,
        newRole: string,
    ) => {
        setGroups((prev) =>
            prev.map((group) => {
                if (group.group_id !== groupId) return group;
                return {
                    ...group,
                    members: group.members.map((m) =>
                        m.id === studentId
                            ? { ...m, role: newRole as GroupMember['role'] }
                            : m,
                    ),
                };
            }),
        );
    };

    const handleRemoveMember = (groupId: number, studentId: number) => {
        setGroups((prev) =>
            prev.map((group) => {
                if (group.group_id !== groupId) return group;
                return {
                    ...group,
                    members: group.members.filter((m) => m.id !== studentId),
                };
            }),
        );
    };

    const handleAddStudentToGroup = (studentId: number, groupId: number) => {
        const student = students.find((s) => s.id === studentId);
        if (!student) return;

        setGroups((prev) =>
            prev.map((group) => {
                if (group.group_id !== groupId) return group;
                return {
                    ...group,
                    members: [
                        ...group.members,
                        { ...student, role: 'Presenter' },
                    ],
                };
            }),
        );
    };

    const handleSave = async () => {
        setIsSaving(true);

        const payload = groups.map((group) => ({
            group_id: group.group_id,
            group_name: group.group_name,
            group_code: group.group_code,
            collab_url: group.collab_url || null,
            members: group.members.map((m) => ({
                user_id: m.id,
                role: m.role,
            })),
        }));

        router.post(
            `/teacher/mission/${missionId}/update-groups`,
            { groups: payload },
            {
                onSuccess: async () => {
                    setIsSaving(false);
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'success',
                        title: 'Kelompok Diperbarui',
                        text: 'Perubahan kelompok berhasil disimpan.',
                        timer: 1400,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-xl' },
                    });
                },
                onError: async (errors) => {
                    console.error('update-groups errors', errors);
                    setIsSaving(false);
                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    await SwalModule.default.fire({
                        icon: 'error',
                        title: 'Gagal Memperbarui',
                        text: 'Gagal memperbarui kelompok. Coba lagi.',
                        customClass: { popup: 'rounded-xl' },
                    });
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                        👥
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                            Manajemen Kelompok
                        </h2>
                        <p className="text-xs text-slate-600 sm:text-sm">
                            Atur pembagian kelompok dan role setiap anggota
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <GroupStats
                totalStudents={students.length}
                assignedCount={assignedStudentIds.length}
                unassignedCount={unassignedStudents.length}
                totalGroups={groups.length}
            />

            {/* Toolbar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <GroupToolbar
                    groupCount={groupCount}
                    onGroupCountChange={setGroupCount}
                    onShuffle={handleShuffle}
                    onReset={handleReset}
                    onAddGroup={handleAddGroup}
                    hasGroups={groups.length > 0}
                    isMobile={isMobile}
                />
            </div>

            {/* Unassigned Students */}
            {unassignedStudents.length > 0 && (
                <UnassignedList
                    students={unassignedStudents}
                    onAddToGroup={() => setShowAddModal(true)}
                    isMobile={isMobile}
                />
            )}

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/30 p-12">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-200">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-800">
                            Belum Ada Kelompok
                        </h3>
                        <p className="mb-4 text-sm text-slate-600">
                            Gunakan tombol "Acak Otomatis" atau "Tambah
                            Kelompok" untuk memulai
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                        <GroupCard
                            key={group.group_id}
                            group={group}
                            availableRoles={AVAILABLE_ROLES}
                            onGroupNameChange={handleGroupNameChange}
                            onCollabUrlChange={handleCollabUrlChange}
                            onRemoveGroup={handleRemoveGroup}
                            onRoleChange={handleRoleChange}
                            onRemoveMember={handleRemoveMember}
                        />
                    ))}
                </div>
            )}

            {/* Save Button */}
            {groups.length > 0 && (
                <SaveButton
                    isSaving={isSaving}
                    disabled={groups.length === 0}
                    onClick={handleSave}
                    isMobile={isMobile}
                />
            )}

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                unassignedStudents={unassignedStudents}
                groups={groups.map((g) => ({
                    group_id: g.group_id,
                    group_name: g.group_name,
                }))}
                onAddStudent={handleAddStudentToGroup}
            />
        </div>
    );
}
