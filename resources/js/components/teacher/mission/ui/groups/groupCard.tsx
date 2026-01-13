import { Trash2 } from 'lucide-react';
import { MemberItem } from './memberItem';

interface GroupMember {
    id: number;
    name: string;
    username: string;
    role: 'Leader' | 'Problem Analyzer' | 'Algorithm Designer' | 'Presenter';
}

interface Group {
    group_id: number;
    group_name: string;
    group_code: string;
    members: GroupMember[];
}

interface GroupCardProps {
    group: Group;
    availableRoles: Array<{
        value: string;
        label: string;
        color: string;
    }>;
    onGroupNameChange: (groupId: number, newName: string) => void;
    onRemoveGroup: (groupId: number) => void;
    onRoleChange: (groupId: number, studentId: number, role: string) => void;
    onRemoveMember: (groupId: number, studentId: number) => void;
}

export function GroupCard({
    group,
    availableRoles,
    onGroupNameChange,
    onRemoveGroup,
    onRoleChange,
    onRemoveMember,
}: GroupCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                <div className="flex-1">
                    <input
                        type="text"
                        value={group.group_name}
                        onChange={(e) =>
                            onGroupNameChange(group.group_id, e.target.value)
                        }
                        className="w-full border-none bg-transparent font-bold text-white placeholder-white/60 focus:ring-0 focus:outline-none"
                        placeholder="Nama Kelompok"
                    />
                    <p className="text-xs text-indigo-100">
                        {group.group_code}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onRemoveGroup(group.group_id)}
                    className="ml-2 rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30"
                    title="Hapus Kelompok"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Members List */}
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
                        <MemberItem
                            key={member.id}
                            member={member}
                            groupId={group.group_id}
                            availableRoles={availableRoles}
                            onRoleChange={onRoleChange}
                            onRemove={onRemoveMember}
                        />
                    ))
                )}
            </div>

            {/* Footer Stats */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
                <p className="text-xs text-slate-600">
                    <span className="font-bold">{group.members.length}</span>{' '}
                    anggota
                </p>
            </div>
        </div>
    );
}
