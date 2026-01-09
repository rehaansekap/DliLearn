import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface TeacherLayoutProps {
    user: User;
    header?: React.ReactNode;
}

interface NavItem {
    name: string;
    href: string;
    icon: string;
    routeName: string;
}

const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/teacher/dashboard',
        icon: '📊',
        routeName: 'teacher.dashboard',
    },
    {
        name: 'Bank Misi',
        href: '/teacher/missions',
        icon: '🎯',
        routeName: 'teacher.missions',
    },
    {
        name: 'Pengaturan',
        href: '/teacher/settings',
        icon: '⚙️',
        routeName: 'teacher.settings',
    },
];

export default function TeacherLayout({
    user,
    header,
    children,
}: PropsWithChildren<TeacherLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const { url } = usePage();

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
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    const isActiveRoute = (href: string) => {
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                    <Link
                        href="/teacher/dashboard"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                            <span className="text-xl font-bold text-white">
                                D
                            </span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">
                                DliLearn
                            </h1>
                            <p className="text-xs text-slate-500">
                                Teacher Portal
                            </p>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                        aria-label="Close sidebar"
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                isActiveRoute(item.href)
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                            {isActiveRoute(item.href) && (
                                <div className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                            <span className="font-bold">
                                {(user.name || '?').charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 truncate">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {user.name}
                            </p>
                            <p className="text-xs text-slate-500">Guru</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                            title="Open sidebar menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* Header Content */}
                        <div className="flex-1 lg:ml-0">{header}</div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() =>
                                    setShowProfileDropdown((v) => !v)
                                }
                                className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                                    <span className="text-sm font-bold">
                                        {(user.name || '?').charAt(0)}
                                    </span>
                                </div>
                                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                                    {user.name}
                                </span>
                                <svg
                                    className="h-4 w-4 text-slate-400"
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
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                                    <div className="border-b border-slate-100 px-4 py-2">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/teacher/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                    >
                                        <span>⚙️</span>
                                        <span>Pengaturan</span>
                                    </Link>
                                    <div className="my-1 border-t border-slate-100" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
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
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </div>
    );
}
