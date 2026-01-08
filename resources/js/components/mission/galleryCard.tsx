import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface GalleryCardProps {
    groupName: string;
    submittedAt: string;
    filePath: string;
    codeAnswer: string;
    likesCount: number;
    isLikedByMe: boolean;
    amILeader: boolean;
    onLike: () => void;
    onViewDetail: () => void;
}

export function GalleryCard({
    groupName,
    submittedAt,
    filePath,
    codeAnswer,
    likesCount,
    isLikedByMe,
    // amILeader,
    onLike,
    onViewDetail,
}: GalleryCardProps) {
    const isMobile = useIsMobile();
    const resolveFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 hover:shadow-2xl sm:rounded-2xl',
            )}
        >
            {/* Preview Image/Code */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {filePath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                        src={resolveFileUrl(filePath) || undefined}
                        alt={`Karya ${groupName}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-6">
                        <div className="rounded-lg bg-slate-800 p-4 font-mono text-xs text-green-400">
                            <pre className="line-clamp-6">
                                {codeAnswer.substring(0, 150)}...
                            </pre>
                        </div>
                    </div>
                )}

                {/* Overlay on Hover */}
                {!isMobile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <button
                            onClick={onViewDetail}
                            className="rounded-xl bg-white px-6 py-3 font-bold text-slate-800 shadow-lg transition-transform hover:scale-110"
                        >
                            👁️ Lihat Detail
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile CTA */}
            <div className="p-3 sm:p-4 md:hidden">
                <button
                    type="button"
                    onClick={onViewDetail}
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow transition-colors hover:bg-slate-100"
                >
                    👁️ Lihat Detail
                </button>
            </div>

            {/* Card Info */}
            <div className="p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md">
                        <span className="font-bold">
                            {(groupName || '?').charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 sm:text-base">
                            {groupName}
                        </h4>
                        <p className="text-xs text-slate-500">
                            {new Date(submittedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Like Button */}
                <button
                    type="button"
                    onClick={onLike}
                    aria-label="Like submission"
                    className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 font-bold transition-all duration-200',
                        isLikedByMe
                            ? 'border-2 border-pink-400 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 hover:border-neutral-100'
                            : 'border-2 border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:bg-red-50',
                    )}
                >
                    <span className="text-xl" aria-hidden>
                        {isLikedByMe ? '🤍' : '❤️'}
                    </span>
                    <span>{likesCount} Likes</span>
                </button>
            </div>
        </div>
    );
}
