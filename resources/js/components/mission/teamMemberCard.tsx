import { cn } from '@/lib/utils';
import { MissionButton } from './ui/missionButton';

interface TeamMember {
    user_id: number;
    name: string;
    username: string;
    role: string;
    avatar?: string;
}

interface TeamMemberCardProps {
    member: TeamMember;
    isEditing: boolean;
    amILeader: boolean;
    availableRoles: string[];
    roleIcons: Record<string, string>;
    roleColors: Record<string, string>;
    onStartEdit: (userId: number) => void;
    onCancelEdit: () => void;
    onRoleSelect: (userId: number, role: string) => void;
}

export function TeamMemberCard({
    member,
    isEditing,
    amILeader,
    availableRoles,
    roleIcons,
    roleColors,
    onStartEdit,
    onCancelEdit,
    onRoleSelect,
}: TeamMemberCardProps) {
    const isLeader = member.role === 'Leader';

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:shadow-xl',
                isLeader
                    ? 'border-yellow-300 ring-2 ring-yellow-200'
                    : 'border-slate-200 hover:border-indigo-300',
            )}
        >
            {isLeader && (
                <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-lg shadow-lg">
                    👑
                </div>
            )}

            <div className="p-6">
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md sm:h-15 sm:w-15">
                            <span className="text-lg font-bold sm:text-xl">
                                {(member.name || '?').charAt(0)}
                            </span>
                        </div>
                        <div
                            className={cn(
                                'text-md absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br shadow-lg sm:h-7 sm:w-7',
                                roleColors[member.role] ||
                                    'from-slate-400 to-slate-500',
                            )}
                        >
                            <span className="text-base sm:text-lg">
                                {roleIcons[member.role] || '👤'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h4 className="mb-1 text-lg font-bold text-slate-800">
                        {member.name}
                    </h4>
                    <p className="mb-2 text-sm text-slate-500">
                        @{member.username}
                    </p>

                    {isEditing && amILeader ? (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium text-slate-600">
                                Pilih Peran:
                            </p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {availableRoles.map((role) => {
                                    const displayRole = role
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (c) =>
                                            c.toUpperCase(),
                                        );

                                    return (
                                        <button
                                            key={role}
                                            onClick={() =>
                                                onRoleSelect(
                                                    member.user_id,
                                                    role,
                                                )
                                            }
                                            title={displayRole}
                                            aria-label={`Pilih peran ${displayRole}`}
                                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium break-words text-slate-700 transition-all hover:border-indigo-400 hover:bg-indigo-50 sm:text-sm"
                                        >
                                            <span className="text-sm">
                                                {roleIcons[role] || '👤'}
                                            </span>
                                            <span className="whitespace-normal">
                                                {displayRole}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <MissionButton
                                onClick={onCancelEdit}
                                variant="outline"
                                size="sm"
                                fullWidth
                            >
                                Batal
                            </MissionButton>
                        </div>
                    ) : (
                        <>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-md',
                                    `bg-gradient-to-r ${roleColors[member.role] || roleColors.Presenter}`,
                                )}
                            >
                                {roleIcons[member.role] || '👤'} {member.role}
                            </span>

                            {amILeader && !isLeader && (
                                <div className="mt-3">
                                    <MissionButton
                                        onClick={() =>
                                            onStartEdit(member.user_id)
                                        }
                                        variant="secondary"
                                        size="sm"
                                        icon="✏️"
                                        fullWidth
                                    >
                                        Ubah Peran
                                    </MissionButton>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
