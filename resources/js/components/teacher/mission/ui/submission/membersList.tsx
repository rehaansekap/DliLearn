import { cn } from '@/lib/utils';

interface GroupMember {
    id: number;
    name: string;
    avatar?: string | null;
}

interface MembersListProps {
    members: GroupMember[];
    isMobile?: boolean;
}

export function MembersList({ members, isMobile = false }: MembersListProps) {
    if (members.length === 0) {
        return null;
    }

    return (
        <div>
            <h4
                className={cn(
                    'mb-2 font-bold text-slate-700',
                    isMobile ? 'text-xs' : 'text-sm',
                )}
            >
                👥 Anggota Kelompok
            </h4>
            <div className={cn('flex flex-wrap', isMobile ? 'gap-2' : 'gap-3')}>
                {members.map((member) => (
                    <div
                        key={member.id}
                        className={cn(
                            'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50',
                            isMobile ? 'px-2 py-1' : 'px-3 py-2',
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white',
                                isMobile
                                    ? 'h-6 w-6 text-[10px]'
                                    : 'h-8 w-8 text-xs',
                            )}
                        >
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span
                            className={cn(
                                'font-medium text-slate-700',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            {member.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
