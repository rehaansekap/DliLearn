import { cn } from '@/lib/utils';

interface ResourcesHeaderProps {
    isMobile: boolean;
}

export function ResourcesHeader({ isMobile }: ResourcesHeaderProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50',
                isMobile ? 'p-4' : 'p-6',
            )}
        >
            {isMobile && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl shadow-lg',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    📚
                </div>
            )}
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        'hidden items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl shadow-lg sm:flex',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    📚
                </div>
                <div>
                    <h2
                        className={cn(
                            'font-bold text-slate-800',
                            isMobile ? 'text-lg' : 'text-xl',
                        )}
                    >
                        Materi & Resources (Tahap 3 PBL)
                    </h2>
                    <p
                        className={cn(
                            'text-slate-600',
                            isMobile ? 'text-xs' : 'text-sm',
                        )}
                    >
                        Upload bahan bacaan siswa dan link kolaborasi tim
                    </p>
                </div>
            </div>
        </div>
    );
}
