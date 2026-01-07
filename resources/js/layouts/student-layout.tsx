import { useIsMobile } from '@/hooks/use-mobile';
import type { User } from '@/types';
import { PropsWithChildren } from 'react';

interface StudentLayoutProps {
    user: User;
    header?: React.ReactNode;
    fullWidth?: boolean;
}

export default function StudentLayout({
    header,
    children,
    fullWidth = false,
}: PropsWithChildren<StudentLayoutProps>) {
    const isMobile = useIsMobile();
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Page Header */}
            {header && (
                <header className="sticky top-0 z-10 bg-white shadow">
                    {isMobile ? (
                        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
                            {header}
                        </div>
                    ) : (
                        header
                    )}
                </header>
            )}
            {/* Main Content */}
            <main className={fullWidth ? 'w-full' : ''}>{children}</main>
        </div>
    );
}
