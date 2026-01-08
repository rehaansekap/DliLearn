import { KeyboardEvent, useState } from 'react';

interface VideoPlayerProps {
    videoUrl?: string | null;
    title?: string;
}

export function VideoPlayer({
    videoUrl,
    title = 'Briefing Video',
}: VideoPlayerProps) {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePlayKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVideoPlaying(true);
        }
    };

    const getYouTubeId = (url?: string | null) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);

    return (
        <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl sm:rounded-2xl sm:p-8">
            <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50 sm:h-14 sm:w-14">
                    <span className="text-xl sm:text-2xl">🎬</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-300">
                        Tonton untuk memahami misi ini
                    </p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                {videoId ? (
                    <div className="relative aspect-video">
                        <iframe
                            title={title}
                            src={`https://www.youtube.com/embed/${videoId}${
                                isVideoPlaying ? '?autoplay=1' : ''
                            }`}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {!isVideoPlaying && (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={handlePlay}
                                onKeyDown={handlePlayKey}
                                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm"
                                aria-label={`Play ${title}`}
                            >
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                        <svg
                                            className="h-10 w-10 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-bold text-white">
                                        Klik untuk memutar
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex aspect-video items-center justify-center bg-slate-700">
                        <p className="text-slate-400">Video tidak tersedia</p>
                    </div>
                )}
            </div>
        </div>
    );
}
