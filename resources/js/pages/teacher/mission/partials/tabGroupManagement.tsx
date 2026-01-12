import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    ChevronDown,
    Save,
    Shuffle,
    UserMinus,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
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
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isSaving, setIsSaving] = useState(false);
    const [isRandomizing, setIsRandomizing] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [groupCount, setGroupCount] = useState(4);

    const assignedStudentIds = groups.flatMap((g) =>
        g.members.map((m) => m.id),
    );
    const unassignedStudents = students.filter(
        (s) => !assignedStudentIds.includes(s.id),
    );

    const handleCreateGroups = () => {
        const newGroups: Group[] = [];
        for (let i = 0; i < groupCount; i++) {
            newGroups.push({
                group_id: Date.now() + i,
                group_name: `Kelompok ${i + 1}`,
                group_code: `GRP-${i + 1}`,
                members: [],
            });
        }
        setGroups(newGroups);
        setShowCreateDialog(false);
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

    const handleAddToGroup = (student: Student, groupId: number) => {
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

    const handleRandomize = () => {
        if (groups.length === 0) {
            setShowCreateDialog(true);
            return;
        }
        setIsRandomizing(true);

        const allStudents = [...students];
        for (let i = allStudents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allStudents[i], allStudents[j]] = [allStudents[j], allStudents[i]];
        }

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
                    role: idx === 0 ? 'Leader' : 'Presenter',
                })),
            });
        }

        setGroups(newGroups);
        setIsRandomizing(false);
    };

    const handleSave = () => {
        const extractErrorMessage = (err: unknown): string | null => {
            if (!err) return null;
            if (typeof err === 'string') return err;
            if (Array.isArray(err)) return err.join('; ');
            if (typeof err === 'object') {
                for (const v of Object.values(err)) {
                    if (typeof v === 'string') return v;
                    if (Array.isArray(v) && v.length > 0) return v[0];
                }
            }
            return null;
        };

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
                    const message =
                        extractErrorMessage(errors) ||
                        'Gagal memperbarui kelompok. Coba lagi.';
                    await SwalModule.default.fire({
                        icon: 'error',
                        title: 'Gagal Memperbarui',
                        text: message,
                        customClass: { popup: 'rounded-xl' },
                    });
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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

                    {/* Actions: stacked / full-width on mobile */}
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        {groups.length === 0 ? (
                            <button
                                onClick={() => setShowCreateDialog(true)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-purple-700"
                            >
                                <Users className="h-4 w-4" />
                                <span>Buat Kelompok</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleRandomize}
                                    disabled={isRandomizing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto"
                                >
                                    <Shuffle className="h-4 w-4" />
                                    <span>Acak Kelompok</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-purple-700 sm:w-auto"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>
                                        {isSaving
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Group Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="mb-4 text-xl font-bold text-slate-800">
                            Buat Kelompok Baru
                        </h3>
                        <p className="mb-4 text-sm text-slate-600">
                            Tentukan jumlah kelompok yang ingin dibuat
                        </p>
                        <div className="mb-6">
                            <label
                                htmlFor="group-count"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Jumlah Kelompok
                            </label>
                            <input
                                id="group-count"
                                type="number"
                                min="1"
                                max="20"
                                value={groupCount}
                                onChange={(e) =>
                                    setGroupCount(
                                        Math.max(
                                            1,
                                            Math.min(
                                                20,
                                                parseInt(e.target.value, 10) ||
                                                    1,
                                            ),
                                        ),
                                    )
                                }
                                placeholder="Jumlah kelompok"
                                title="Jumlah Kelompok"
                                aria-label="Jumlah Kelompok"
                                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-2xl font-bold text-slate-800 transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Siswa per kelompok: ~
                                {Math.ceil(students.length / groupCount)} orang
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateDialog(false)}
                                className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCreateGroups}
                                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-purple-700"
                            >
                                Buat Kelompok
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {groups.length === 0 ? (
                /* Empty State */
                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/30 p-12">
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                            <span className="text-5xl">👥</span>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-slate-800">
                            Belum Ada Kelompok
                        </h3>
                        <p className="mb-6 text-sm text-slate-600">
                            Buat kelompok untuk memulai pembagian siswa.
                            <br />
                            Total siswa:{' '}
                            <span className="font-bold">
                                {students.length}
                            </span>{' '}
                            orang
                        </p>
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                        >
                            <Users className="h-5 w-5" />
                            <span>Buat Kelompok Sekarang</span>
                        </button>
                    </div>
                </div>
            ) : (
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
                            <div className="h-full max-h-[600px] space-y-2 overflow-auto p-4">
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
            )}
        </div>
    );
}

function StudentCard({
    student,
    groups,
    onAddToGroup,
}: {
    student: Student;
    groups: Group[];
    onAddToGroup: (student: Student, groupId: number) => void;
}) {
    const [showGroupSelector, setShowGroupSelector] = useState(false);

    return (
        <div className="group rounded-lg border border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:bg-indigo-50">
            <div className="p-3">
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

                {/* Toggle Button */}
                <div className="mt-2">
                    <button
                        onClick={() => setShowGroupSelector(!showGroupSelector)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                        {showGroupSelector ? (
                            <>
                                <UserMinus className="h-3 w-3" />
                                <span>Tutup</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-3 w-3" />
                                <span>Tambah ke Kelompok</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Group Selection Grid */}
            {showGroupSelector && (
                <div className="border-t border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-slate-600">
                        Pilih Kelompok:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {groups.map((group) => (
                            <button
                                key={group.group_id}
                                onClick={() => {
                                    onAddToGroup(student, group.group_id);
                                    setShowGroupSelector(false);
                                }}
                                className="flex items-center justify-between rounded-lg border-2 border-slate-200 bg-slate-50 p-2 text-left text-xs transition hover:border-indigo-400 hover:bg-indigo-50"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                        <span className="text-[10px] font-bold">
                                            {group.group_name.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-700">
                                        {group.group_name}
                                    </span>
                                </div>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                    {group.members.length} anggota
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

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
                className="rounded-lg bg-red-100 p-1 text-red-600 transition sm:opacity-100 lg:opacity-40 lg:group-hover:opacity-100 lg:hover:bg-red-200"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
