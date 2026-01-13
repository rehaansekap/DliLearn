import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);

    const computePosition = () => {
        const el = btnRef.current;
        if (!el) return setDropdownPos(null);
        const rect = el.getBoundingClientRect();
        const width = Math.max(160, rect.width);
        let left = rect.left;
        const rightOverflow = rect.left + width > window.innerWidth - 8;
        if (rightOverflow) {
            left = Math.max(8, window.innerWidth - width - 8);
        }
        setDropdownPos({ top: rect.bottom, left, width });
    };

    useEffect(() => {
        if (!showRoleDropdown) return;
        rafRef.current = window.requestAnimationFrame(() => {
            if (!showRoleDropdown) return;
            computePosition();
        });

        const onWin = () => computePosition();
        window.addEventListener('resize', onWin, { passive: true });
        window.addEventListener('scroll', onWin, { passive: true });
        return () => {
            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            window.removeEventListener('resize', onWin);
            window.removeEventListener('scroll', onWin);
        };
    }, [showRoleDropdown]);

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
                    ref={btnRef}
                    type="button"
                    onClick={() => setShowRoleDropdown((s) => !s)}
                    className={cn(
                        'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-white transition',
                        currentRole?.color || 'bg-slate-500',
                    )}
                    aria-expanded={showRoleDropdown}
                >
                    <span>{currentRole?.label}</span>
                    <ChevronDown className="h-3 w-3" />
                </button>

                {showRoleDropdown &&
                    dropdownPos &&
                    createPortal(
                        <>
                            <div
                                className="fixed inset-0 z-[1000]"
                                onClick={() => setShowRoleDropdown(false)}
                            />
                            <div
                                className="z-[1001] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                                style={{
                                    position: 'fixed',
                                    top: `${dropdownPos.top}px`,
                                    left: `${dropdownPos.left}px`,
                                    width: `${dropdownPos.width}px`,
                                }}
                                role="menu"
                            >
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
                        </>,
                        document.body,
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
