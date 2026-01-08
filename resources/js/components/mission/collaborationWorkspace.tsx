import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { MissionButton } from './ui/missionButton';
import { MissionCard } from './ui/missionCard';

interface CollaborationWorkspaceProps {
    collaborationLink?: string;
}

export function CollaborationWorkspace({
    collaborationLink,
}: CollaborationWorkspaceProps) {
    const isMobile = useIsMobile();
    const [showCollab, setShowCollab] = useState<boolean>(false);

    const getEmbedUrl = (url?: string) => {
        if (!url) return '';
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();

            if (host.includes('figma.com')) {
                if (url.includes('/embed')) return url;
                return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
                    url,
                )}`;
            }

            if (host.includes('miro.com')) {
                if (url.includes('live-embed') || url.includes('embed'))
                    return url;
                return `https://miro.com/app/live-embed/?${u.searchParams.toString()}`;
            }

            return url;
        } catch {
            return url;
        }
    };

    return (
        <MissionCard
            title="Kolaborasi Tim"
            icon="🔗"
            headerClassName="bg-gradient-to-r from-emerald-400 to-teal-400 border-emerald-200"
            className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
        >
            {!isMobile ? (
                <div className="mb-4 flex justify-between gap-4">
                    <p className="text-slate-700">
                        Gunakan workspace kolaboratif untuk brainstorming dan
                        merencanakan solusi bersama tim
                    </p>
                    <MissionButton
                        onClick={() => setShowCollab((s) => !s)}
                        variant="success"
                        size="sm"
                    >
                        {showCollab ? 'Tutup' : 'Buka'} Workspace
                    </MissionButton>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <p className="text-center text-slate-700">
                            Gunakan workspace kolaboratif untuk brainstorming
                            dan merencanakan solusi bersama tim
                        </p>
                    </div>
                    <div className="mb-4">
                        <MissionButton
                            onClick={() => setShowCollab((s) => !s)}
                            variant="success"
                            size="sm"
                            className="mx-auto flex items-center align-middle"
                        >
                            {showCollab ? 'Tutup' : 'Buka'} Workspace
                        </MissionButton>
                    </div>
                </>
            )}

            <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                    showCollab
                        ? 'max-h-[720px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                {collaborationLink ? (
                    (() => {
                        const embedUrl = getEmbedUrl(collaborationLink);
                        if (embedUrl) {
                            return (
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={embedUrl}
                                            title="FigJam / Miro Workspace"
                                            className="h-full w-full"
                                            frameBorder="0"
                                            allow="clipboard-read clipboard-write; fullscreen"
                                        />
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                <p className="mb-2 font-semibold text-slate-800">
                                    Link kolaborasi tidak dikenali
                                </p>
                                <p className="text-sm">
                                    Pastikan guru memasukkan link FigJam/Miro
                                    yang benar.
                                </p>
                            </div>
                        );
                    })()
                ) : (
                    <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                        <p className="mb-2 font-semibold text-slate-800">
                            Link FigJam belum dimasukkan
                        </p>
                        <p className="text-sm">
                            Guru belum menambahkan link kolaborasi.
                        </p>
                    </div>
                )}
            </div>

            {collaborationLink && getEmbedUrl(collaborationLink) && (
                <div className="mt-4 flex justify-center">
                    <a
                        href={collaborationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MissionButton icon="🚀" size="lg">
                            Buka FigJam/Miro Workspace
                        </MissionButton>
                    </a>
                </div>
            )}
        </MissionCard>
    );
}
