import { cn } from '@/lib/utils';
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
    const [showCollab, setShowCollab] = useState<boolean>(false);
    const alreadyPastStep2 =
        typeof groupCurrentStep === 'number' && groupCurrentStep > 2;

    const handleRoleSelect = (userId: number, newRole: string) => {
        onRoleChange(userId, newRole);
        setEditingUserId(null);
    };

    const getEmbedUrl = (url?: string) => {
        if (!url) return '';
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();

            if (host.includes('figma.com')) {
                if (url.includes('/embed')) return url;
                return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
                    url,
                )}`;
            }

            if (host.includes('miro.com')) {
                if (url.includes('live-embed') || url.includes('embed'))
                    return url;
                return `https://miro.com/app/live-embed/?${u.searchParams.toString()}`;
            }

            return url;
        } catch {
            return url;
        }
    };

    return (
        <div className="space-y-4 px-2 sm:space-y-8 sm:px-0">
            {/* Header Section */}
            <div className="overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 shadow sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xl shadow sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                        👥
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-black text-slate-800 sm:mb-2 sm:text-2xl">
                            Organisasi Tim
                        </h3>
                        <p className="text-sm text-slate-600 sm:text-base">
                            Koordinasikan peran setiap anggota untuk
                            memaksimalkan kolaborasi tim. Ketua kelompok bisa
                            mengatur peran semua anggota.
                        </p>
                    </div>
                </div>
            </div>

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
                {groupMembers.map((member) => {
                    const isLeader = member.role === 'Ketua';
                    const isEditing = editingUserId === member.user_id;

                    return (
                        <div
                            key={member.user_id}
                            className={cn(
                                'group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:shadow-xl',
                                isLeader
                                    ? 'border-yellow-300 ring-2 ring-yellow-200'
                                    : 'border-slate-200 hover:border-indigo-300',
                            )}
                        >
                            {/* Leader Crown */}
                            {isLeader && (
                                <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-lg shadow-lg">
                                    👑
                                </div>
                            )}

                            <div className="p-6">
                                {/* Avatar */}
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
                                                ROLE_COLORS[member.role] ||
                                                    'from-slate-400 to-slate-500',
                                            )}
                                        >
                                            <span className="text-base sm:text-lg">
                                                {ROLE_ICONS[member.role] ||
                                                    '👤'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Info */}
                                <div className="text-center">
                                    <h4 className="mb-1 text-lg font-bold text-slate-800">
                                        {member.name}
                                    </h4>
                                    <p className="mb-2 text-sm text-slate-500">
                                        @{member.username}
                                    </p>

                                    {/* Role Display/Edit */}
                                    {isEditing && amILeader ? (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs font-medium text-slate-600">
                                                Pilih Peran:
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {AVAILABLE_ROLES.map((role) => (
                                                    <button
                                                        key={role}
                                                        onClick={() =>
                                                            handleRoleSelect(
                                                                member.user_id,
                                                                role,
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-indigo-400 hover:bg-indigo-50"
                                                    >
                                                        <span>
                                                            {ROLE_ICONS[role]}
                                                        </span>
                                                        <span>{role}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setEditingUserId(null)
                                                }
                                                className="mt-2 w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-md',
                                                    `bg-gradient-to-r ${ROLE_COLORS[member.role] || ROLE_COLORS.Anggota}`,
                                                )}
                                            >
                                                {ROLE_ICONS[member.role] ||
                                                    '👤'}{' '}
                                                {member.role}
                                            </span>

                                            {amILeader && !isLeader && (
                                                <button
                                                    onClick={() =>
                                                        setEditingUserId(
                                                            member.user_id,
                                                        )
                                                    }
                                                    className="mt-3 w-full rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 transition-all hover:bg-indigo-100"
                                                >
                                                    ✏️ Ubah Peran
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Kolaborasi Tim */}
            <div className="mt-4 overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow sm:mt-8 sm:rounded-2xl">
                <div className="flex flex-col items-start justify-between gap-2 border-b border-emerald-200 bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-xl sm:text-2xl">🔗</span>
                        <h3 className="text-base font-bold sm:text-lg">
                            Kolaborasi Tim
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCollab((s) => !s)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 sm:text-sm"
                        aria-expanded={showCollab}
                    >
                        {showCollab ? 'Tutup' : 'Buka'} Workspace
                    </button>
                </div>

                <div
                    className={`overflow-hidden px-6 transition-[max-height,opacity] duration-300 ${
                        showCollab
                            ? 'max-h-[720px] opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                    aria-hidden={!showCollab}
                >
                    <div className="p-6">
                        <p className="mb-4 text-slate-700">
                            Gunakan workspace kolaboratif untuk brainstorming
                            dan merencanakan solusi bersama tim:
                        </p>

                        {/* Collaboration Link / Fallbacks */}
                        {collaborationLink ? (
                            (() => {
                                const embedUrl = getEmbedUrl(collaborationLink);
                                if (embedUrl) {
                                    return (
                                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                            <div className="aspect-video w-full">
                                                <iframe
                                                    src={embedUrl}
                                                    title="FigJam / Miro Workspace"
                                                    className="h-full w-full"
                                                    frameBorder="0"
                                                    allow="clipboard-read clipboard-write; fullscreen; accelerometer; gyroscope; picture-in-picture; geolocation; camera; microphone"
                                                />
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                        <p className="mb-2 font-semibold text-slate-800">
                                            Link kolaborasi tidak dikenali atau
                                            rusak
                                        </p>
                                        <p className="text-sm">
                                            Pastikan guru memasukkan link
                                            FigJam/Miro yang benar.
                                        </p>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                <p className="mb-2 font-semibold text-slate-800">
                                    Link FigJam belum dimasukkan
                                </p>
                                <p className="text-sm">
                                    Guru belum menambahkan link kolaborasi untuk
                                    misi ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - keep big button always visible (if link exists) */}
                {collaborationLink && getEmbedUrl(collaborationLink) && (
                    <div className="flex justify-center px-6 pt-4 pb-6">
                        <a
                            href={collaborationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl active:scale-[0.98]"
                        >
                            <span className="text-xl">🚀</span>
                            <span>Buka FigJam/Miro Workspace</span>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                )}
            </div>

            {/* Complete Button */}
            {amILeader && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={onCompleteStep}
                        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98] sm:w-auto sm:px-8 sm:py-4"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-xl">✅</span>
                            <span>
                                Selesai Atur Tim, Lanjut ke Creative Lab
                            </span>
                            <svg
                                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </span>
                        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </button>
                </div>
            )}

            {!amILeader &&
                (alreadyPastStep2 ? (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={onNext}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98]"
                        >
                            ▶️ Lanjutkan ke Creative Lab
                        </button>
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
