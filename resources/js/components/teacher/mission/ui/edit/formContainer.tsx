import { ReactNode } from 'react';

interface FormContainerProps {
    children: ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function FormContainer({ children, onSubmit }: FormContainerProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                {children}
            </div>
        </form>
    );
}
