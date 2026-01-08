import { CollaborationWorkspace } from '@/components/mission/collaborationWorkspace';
import { TeamMemberCard } from '@/components/mission/teamMemberCard';
import { MissionButton } from '@/components/mission/ui/missionButton';
import { MissionPageTitle } from '@/components/mission/ui/missionPageTitle';
import { useState } from 'react';

interface GroupMember {
    user_id: number;
    name: string;
    username: string;
    role: string;
    avatar?: string;
}

interface Phase2OrganizationProps {
    groupMembers: GroupMember[];
    currentUserRole: string;
    collaborationLink?: string;
    amILeader: boolean;
    onRoleChange: (userId: number, newRole: string) => void;
    onCompleteStep: () => void;
    groupCurrentStep?: number;
    onNext?: () => void;
}

const AVAILABLE_ROLES = ['Coder', 'Designer', 'Notulis', 'Anggota'];

const ROLE_ICONS = {
    Ketua: '👑',
    Coder: '💻',
    Designer: '🎨',
    Notulis: '📝',
    Anggota: '👤',
};

const ROLE_COLORS = {
    Ketua: 'from-yellow-400 to-amber-500',
    Coder: 'from-blue-400 to-cyan-500',
    Designer: 'from-pink-400 to-rose-500',
    Notulis: 'from-green-400 to-emerald-500',
    Anggota: 'from-slate-400 to-slate-500',
};

export default function Phase2Organization({
    groupMembers,
    currentUserRole,
    collaborationLink,
    amILeader,
    onRoleChange,
    onCompleteStep,
    groupCurrentStep,
    onNext,
}: Phase2OrganizationProps) {
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const alreadyPastStep2 =
        typeof groupCurrentStep === 'number' && groupCurrentStep > 2;

    const handleRoleSelect = (userId: number, newRole: string) => {
        onRoleChange(userId, newRole);
        setEditingUserId(null);
    };

    return (
        <div className="space-y-4 px-2 sm:space-y-8 sm:px-0">
            {/* Page Title */}
            <MissionPageTitle
                step={2}
                title="Organisasi Tim"
                subtitle="Koordinasikan peran setiap anggota untuk memaksimalkan kolaborasi tim"
                icon="👥"
                color="purple"
            />

            {/* Your Role Badge */}
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-indigo-200 bg-white px-4 py-3 shadow-lg sm:px-6 sm:py-4">
                    <span className="text-xl sm:text-2xl">
                        {ROLE_ICONS[currentUserRole] || '👤'}
                    </span>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                            Peranmu
                        </p>
                        <p className="text-lg font-bold text-indigo-600 sm:text-xl">
                            {currentUserRole || 'Belum Ada'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {groupMembers.map((member) => (
                    <TeamMemberCard
                        key={member.user_id}
                        member={member}
                        isEditing={editingUserId === member.user_id}
                        amILeader={amILeader}
                        availableRoles={AVAILABLE_ROLES}
                        roleIcons={ROLE_ICONS}
                        roleColors={ROLE_COLORS}
                        onStartEdit={setEditingUserId}
                        onCancelEdit={() => setEditingUserId(null)}
                        onRoleSelect={handleRoleSelect}
                    />
                ))}
            </div>

            {/* Collaboration Workspace */}
            <CollaborationWorkspace collaborationLink={collaborationLink} />

            {/* Action Buttons */}
            {amILeader && (
                <div className="flex justify-center">
                    <MissionButton onClick={onCompleteStep} icon="✅" size="lg">
                        Selesai Atur Tim, Lanjut ke Creative Lab
                    </MissionButton>
                </div>
            )}

            {!amILeader &&
                (alreadyPastStep2 ? (
                    <div className="flex justify-center">
                        <MissionButton onClick={onNext} icon="▶️" size="lg">
                            Lanjutkan ke Creative Lab
                        </MissionButton>
                    </div>
                ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                        <p className="text-sm text-amber-800">
                            ⏳ Menunggu Ketua Kelompok menyelesaikan pengaturan
                            tim
                        </p>
                    </div>
                ))}
        </div>
    );
}
