import { cn } from '@/lib/utils';

interface ScenarioHeaderProps {
    isMobile: boolean;
}

export function ScenarioHeader({ isMobile }: ScenarioHeaderProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
                isMobile ? 'p-4' : 'p-6',
            )}
        >
            {isMobile && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    🎬
                </div>
            )}
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        'hidden items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg sm:flex',
                        isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                    )}
                >
                    🎬
                </div>
                <div>
                    <h2
                        className={cn(
                            'font-bold text-slate-800',
                            isMobile ? 'text-lg' : 'text-xl',
                        )}
                    >
                        Skenario & Narasi Kasus (Tahap 1 PBL)
                    </h2>
                    <p
                        className={cn(
                            'text-slate-600',
                            isMobile ? 'text-xs' : 'text-sm',
                        )}
                    >
                        Berikan konteks masalah yang akan diselesaikan siswa
                    </p>
                </div>
            </div>
        </div>
    );
}
