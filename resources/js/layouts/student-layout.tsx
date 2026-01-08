import { logout } from '@/routes';
import type { User } from '@/types';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface StudentLayoutProps {
    user: User;
    header?: React.ReactNode;
    fullWidth?: boolean;
    showBackButton?: boolean;
    backUrl?: string;
}

export default function StudentLayout({
    user,
    header,
    children,
    fullWidth = false,
    showBackButton = false,
    backUrl = '/dashboard',
}: PropsWithChildren<StudentLayoutProps>) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                setShowProfileDropdown(false);
            }
        }
        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Page Header */}
            <header className="sticky top-0 z-10 bg-white shadow">
                <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
                    <div className="flex flex-row items-center justify-between gap-2">
                        {/* Left Section: Back Button + Header Content */}
                        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                            {showBackButton && (
                                <Link
                                    href={backUrl}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 sm:h-10 sm:w-10"
                                    aria-label="Kembali"
                                >
                                    <svg
                                        className="h-5 w-5 text-slate-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </Link>
                            )}
                            <div className="min-w-0 flex-1">{header}</div>
                        </div>

                        {/* Right Section: Profile Dropdown */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-full px-1 py-1 transition hover:bg-slate-100 sm:gap-2 sm:px-2"
                                onClick={() =>
                                    setShowProfileDropdown((v) => !v)
                                }
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md sm:h-10 sm:w-10">
                                    <span className="font-bold">
                                        {(user.name || '?').charAt(0)}
                                    </span>
                                </div>
                                <span className="hidden max-w-[80px] truncate text-sm font-semibold text-slate-700 sm:block sm:max-w-[120px]">
                                    {user.name}
                                </span>
                                <svg
                                    className="ml-1 h-4 w-4 text-slate-500"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {showProfileDropdown && (
                                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                                    <div className="truncate px-4 py-2 text-sm font-semibold text-slate-700">
                                        {user.name}
                                    </div>
                                    <div className="mx-2 my-1 border-t border-slate-200" />
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={fullWidth ? 'w-full' : ''}>{children}</main>
        </div>
    );
}
