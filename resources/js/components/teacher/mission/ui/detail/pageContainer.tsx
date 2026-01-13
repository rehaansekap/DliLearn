import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </div>
    );
}
