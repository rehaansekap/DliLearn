import { ReactNode } from 'react';

interface CompletionStatusCardProps {
    type: 'completed' | 'waiting';
    icon: string;
    title: string;
    description: string;
    reflection?: string;
    children?: ReactNode;
}

export function CompletionStatusCard({
    type,
    icon,
    title,
    description,
    reflection,
    children,
}: CompletionStatusCardProps) {
    const bgColor =
        type === 'completed'
            ? 'from-green-50 to-emerald-50 border-green-200'
            : 'from-yellow-50 to-orange-50 border-yellow-200';

    const iconBg =
        type === 'completed'
            ? 'from-green-400 to-emerald-500'
            : 'from-yellow-400 to-orange-400';

    return (
        <div
            className={`overflow-hidden rounded-xl border bg-gradient-to-br shadow-lg sm:rounded-2xl ${bgColor}`}
        >
            <div className="p-8 text-center sm:p-12">
                <div
                    className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ${iconBg}`}
                >
                    <span className="text-5xl">{icon}</span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-800 sm:text-2xl">
                    {title}
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-slate-700 sm:text-base">
                    {description}
                </p>

                {reflection && (
                    <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm sm:p-6">
                        <pre className="text-sm whitespace-pre-wrap text-slate-800">
                            {reflection && reflection.length > 0
                                ? reflection
                                : 'Refleksi akhir belum tersedia.'}
                        </pre>
                    </div>
                )}

                {children && <div className="mt-6">{children}</div>}
            </div>
        </div>
    );
}
