import { cn } from '@/lib/utils';

interface BasicInfoHeaderProps {
    isMobile: boolean;
}

export function BasicInfoHeader({ isMobile }: BasicInfoHeaderProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50',
                isMobile ? 'p-4' : 'p-6',
            )}
        >
            {isMobile && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    📝
                </div>
            )}
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        'hidden items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg sm:flex',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    📝
                </div>
                <div>
                    <h2
                        className={cn(
                            'font-bold text-slate-800',
                            isMobile ? 'text-lg' : 'text-xl',
                        )}
                    >
                        Informasi Dasar Misi
                    </h2>
                    <p
                        className={cn(
                            'text-slate-600',
                            isMobile ? 'text-xs' : 'text-sm',
                        )}
                    >
                        Tentukan judul, deskripsi, dan tingkat kesulitan misi
                    </p>
                </div>
            </div>
        </div>
    );
}
