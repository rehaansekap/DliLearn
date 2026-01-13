import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface EditMissionHeaderProps {
    missionTitle: string;
    backUrl: string;
    isMobile: boolean;
}

export function EditMissionHeader({
    missionTitle,
    backUrl,
    isMobile,
}: EditMissionHeaderProps) {
    return (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {isMobile && (
                    <div className="flex items-center gap-3">
                        <Link
                            href={backUrl}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/70 backdrop-blur-sm transition hover:bg-orange-500/90"
                        >
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                            ✏️
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex">
                        <Link
                            href={backUrl}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/70 backdrop-blur-sm transition hover:bg-orange-500/90"
                        >
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                    </div>
                    <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg sm:flex sm:h-16 sm:w-16 sm:text-3xl">
                        ✏️
                    </div>
                    <div>
                        <h1
                            className={cn(
                                'font-black text-slate-800',
                                isMobile ? 'text-xl' : 'text-3xl',
                            )}
                        >
                            Edit Misi: {missionTitle}
                        </h1>
                        <p
                            className={cn(
                                'mt-1 text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Perbarui informasi misi pembelajaran Anda
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
