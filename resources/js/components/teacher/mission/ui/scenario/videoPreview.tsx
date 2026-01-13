import { Video } from 'lucide-react';
import { useMemo } from 'react';

interface VideoPreviewProps {
    videoUrl: string;
}

function extractYoutubeVideoId(url: string): string | null {
    if (!url) return null;
    const regex =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function VideoPreview({ videoUrl }: VideoPreviewProps) {
    const videoId = useMemo(() => extractYoutubeVideoId(videoUrl), [videoUrl]);

    if (!videoUrl) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
            <div className="flex items-center gap-2 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
                <Video className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">
                    Preview Video
                </span>
            </div>
            <div className="p-2">
                {videoId ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                        />
                    </div>
                ) : (
                    <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white">
                        <div className="text-center">
                            <Video className="mx-auto mb-2 h-12 w-12 text-purple-300" />
                            <p className="text-sm text-slate-500">
                                Video akan muncul di sini
                            </p>
                            <p className="text-xs text-slate-400">
                                Masukkan URL YouTube yang valid
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
