import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ChevronDown, Save, Shuffle, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar?: string | null;
}

interface GroupMember extends Student {
    role: 'Ketua' | 'Programmer' | 'Designer' | 'Notulis' | 'Anggota';
}

interface Group {
    group_id: number;
    group_name: string;
    group_code: string;
    members: GroupMember[];
}

interface TabGroupManagementProps {
    students: Student[];
    groups: Group[];
    missionId: number;
}

const AVAILABLE_ROLES = [
    { value: 'Ketua', label: 'Ketua', color: 'bg-indigo-500' },
    { value: 'Programmer', label: 'Programmer', color: 'bg-blue-500' },
    { value: 'Designer', label: 'Designer', color: 'bg-pink-500' },
    { value: 'Notulis', label: 'Notulis', color: 'bg-green-500' },
    { value: 'Anggota', label: 'Anggota', color: 'bg-slate-500' },
] as const;

export function TabGroupManagement({
    students,
    groups: initialGroups,
    missionId,
}: TabGroupManagementProps) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isSaving, setIsSaving] = useState(false);
    const [isRandomizing, setIsRandomizing] = useState(false);

    // Get unassigned students
    const assignedStudentIds = groups.flatMap((g) =>
        g.members.map((m) => m.id),
    );
    const unassignedStudents = students.filter(
        (s) => !assignedStudentIds.includes(s.id),
    );

    // Handle role change
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
                    members: group.members.map((member) =>
                        member.id === studentId
                            ? {
                                  ...member,
                                  role: newRole as GroupMember['role'],
                              }
                            : member,
                    ),
                };
            }),
        );
    };

    // Remove student from group
    const handleRemoveFromGroup = (groupId: number, studentId: number) => {
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

    // Add student to group
    const handleAddToGroup = (student: Student, groupId: number) => {
        setGroups((prev) =>
            prev.map((group) => {
                if (group.group_id !== groupId) return group;
                return {
                    ...group,
                    members: [
                        ...group.members,
                        { ...student, role: 'Anggota' },
                    ],
                };
            }),
        );
    };

    // Randomize groups
    const handleRandomize = () => {
        setIsRandomizing(true);

        // Shuffle all students
        const allStudents = [...students];
        for (let i = allStudents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allStudents[i], allStudents[j]] = [allStudents[j], allStudents[i]];
        }

        // Distribute evenly
        const groupCount = groups.length || 4;
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
                members: groupMembers.map((s, idx) => ({
                    ...s,
                    role: idx === 0 ? 'Ketua' : 'Anggota',
                })),
            });
        }

        setGroups(newGroups);
        setIsRandomizing(false);
    };

    // Save changes
    const handleSave = () => {
        setIsSaving(true);

        const payload = groups.map((group) => ({
            group_id: group.group_id,
            group_name: group.group_name,
            group_code: group.group_code,
            members: group.members.map((m) => ({
                user_id: m.id,
                role: m.role,
            })),
        }));

        router.post(
            `/teacher/mission/${missionId}/update-groups`,
            { groups: payload },
            {
                onSuccess: () => {
                    setIsSaving(false);
                },
                onError: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg">
                            👥
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Manajemen Kelompok
                            </h2>
                            <p className="text-sm text-slate-600">
                                Atur pembagian kelompok dan role setiap anggota
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRandomize}
                            disabled={isRandomizing}
                            className="inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                        >
                            <Shuffle className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Acak Kelompok
                            </span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-purple-700"
                        >
                            <Save className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Left: Unassigned Students */}
                <div className="h-full lg:col-span-1">
                    <div className="h-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <h3 className="text-sm font-bold text-slate-800">
                                📋 Siswa Belum Terkelompok
                            </h3>
                            <p className="text-xs text-slate-500">
                                {unassignedStudents.length} siswa
                            </p>
                        </div>
                        <div className="h-full max-h-[600px] space-y-2 p-4">
                            {unassignedStudents.length === 0 ? (
                                <div className="rounded-t-2xl border-2 border-dashed border-slate-200 p-6 text-center">
                                    <span className="mb-2 block text-3xl">
                                        ✅
                                    </span>
                                    <p className="text-sm text-slate-500">
                                        Semua siswa sudah terkelompok
                                    </p>
                                </div>
                            ) : (
                                unassignedStudents.map((student) => (
                                    <StudentCard
                                        key={student.id}
                                        student={student}
                                        groups={groups}
                                        onAddToGroup={handleAddToGroup}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Groups Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {groups.map((group) => (
                            <GroupCard
                                key={group.group_id}
                                group={group}
                                onRoleChange={handleRoleChange}
                                onRemoveMember={handleRemoveFromGroup}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Student Card Component (Unassigned)
function StudentCard({
    student,
    groups,
    onAddToGroup,
}: {
    student: Student;
    groups: Group[];
    onAddToGroup: (student: Student, groupId: number) => void;
}) {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-indigo-300 hover:bg-indigo-50">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md">
                    <span className="text-sm font-bold">
                        {student.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                        {student.name}
                    </p>
                    <p className="text-xs text-slate-500">
                        @{student.username}
                    </p>
                </div>
            </div>

            {/* Add Button */}
            <div className="relative mt-2">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                    <UserPlus className="h-3 w-3" />
                    <span>Tambah ke Kelompok</span>
                </button>

                {showDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                            {groups.map((group) => (
                                <button
                                    key={group.group_id}
                                    onClick={() => {
                                        onAddToGroup(student, group.group_id);
                                        setShowDropdown(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-slate-50"
                                >
                                    <span className="font-bold text-slate-700">
                                        {group.group_name}
                                    </span>
                                    <span className="text-slate-500">
                                        ({group.members.length} anggota)
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Group Card Component
function GroupCard({
    group,
    onRoleChange,
    onRemoveMember,
}: {
    group: Group;
    onRoleChange: (groupId: number, studentId: number, role: string) => void;
    onRemoveMember: (groupId: number, studentId: number) => void;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="rounded-t-2xl border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                <h4 className="font-bold text-white">{group.group_name}</h4>
                <p className="text-xs text-indigo-100">{group.group_code}</p>
            </div>

            <div className="space-y-2 p-4">
                {group.members.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                        <span className="mb-2 block text-3xl">👤</span>
                        <p className="text-sm text-slate-500">
                            Belum ada anggota
                        </p>
                    </div>
                ) : (
                    group.members.map((member) => (
                        <MemberRow
                            key={member.id}
                            member={member}
                            groupId={group.group_id}
                            onRoleChange={onRoleChange}
                            onRemove={onRemoveMember}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Member Row Component
function MemberRow({
    member,
    groupId,
    onRoleChange,
    onRemove,
}: {
    member: GroupMember;
    groupId: number;
    onRoleChange: (groupId: number, studentId: number, role: string) => void;
    onRemove: (groupId: number, studentId: number) => void;
}) {
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    const currentRole = AVAILABLE_ROLES.find((r) => r.value === member.role);

    return (
        <div className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 transition hover:border-indigo-200 hover:bg-indigo-50">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-sm">
                <span className="text-xs font-bold">
                    {member.name.charAt(0).toUpperCase()}
                </span>
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                    {member.name}
                </p>
            </div>

            {/* Role Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className={cn(
                        'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-white transition',
                        currentRole?.color || 'bg-slate-500',
                    )}
                >
                    <span>{currentRole?.label}</span>
                    <ChevronDown className="h-3 w-3" />
                </button>

                {showRoleDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowRoleDropdown(false)}
                        />
                        <div className="absolute top-full right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                            {AVAILABLE_ROLES.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => {
                                        onRoleChange(
                                            groupId,
                                            member.id,
                                            role.value,
                                        );
                                        setShowRoleDropdown(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-slate-50"
                                >
                                    <div
                                        className={cn(
                                            'h-3 w-3 rounded-full',
                                            role.color,
                                        )}
                                    />
                                    <span className="font-medium text-slate-700">
                                        {role.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Remove Button */}
            <button
                type="button"
                onClick={() => onRemove(groupId, member.id)}
                aria-label={`Hapus ${member.name}`}
                title={`Hapus ${member.name}`}
                className="rounded-lg bg-red-100 p-1 text-red-600 transition sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:hover:bg-red-200"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
