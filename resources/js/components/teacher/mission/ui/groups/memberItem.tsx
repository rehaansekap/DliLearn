import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface GroupMember {
    id: number;
    name: string;
    username: string;
    role: 'Leader' | 'Problem Analyzer' | 'Algorithm Designer' | 'Presenter';
}

interface MemberItemProps {
    member: GroupMember;
    groupId: number;
    availableRoles: Array<{
        value: string;
        label: string;
        color: string;
    }>;
    onRoleChange: (groupId: number, studentId: number, role: string) => void;
    onRemove: (groupId: number, studentId: number) => void;
}

export function MemberItem({
    member,
    groupId,
    availableRoles,
    onRoleChange,
    onRemove,
}: MemberItemProps) {
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const currentRole = availableRoles.find((r) => r.value === member.role);

    return (
        <div className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 transition hover:border-indigo-300 hover:bg-indigo-50">
            {/* Avatar */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-sm">
                <span className="text-xs font-bold">
                    {member.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Name */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                    {member.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                    @{member.username}
                </p>
            </div>

            {/* Role Dropdown */}
            <div className="relative">
                <button
                    type="button"
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
                        <div className="absolute top-full right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                            {availableRoles.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
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
                className="rounded-lg bg-red-100 p-1 text-red-600 transition hover:bg-red-200"
                title={`Hapus ${member.name}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
