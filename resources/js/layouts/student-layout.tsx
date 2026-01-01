import { PropsWithChildren } from 'react';

interface StudentLayoutProps {
    user: any;
    header?: React.ReactNode;
    fullWidth?: boolean;
}

export default function StudentLayout({
    user,
    header,
    fullWidth = false,
    children,
}: PropsWithChildren<StudentLayoutProps>) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">DliLearn</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700">{user.name}</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className={fullWidth ? 'w-full' : ''}>{children}</main>
        </div>
    );
}
