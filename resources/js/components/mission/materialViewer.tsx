import { useState } from 'react';

interface MaterialViewerProps {
    materialUrl?: string | null;
    title?: string;
}

export function MaterialViewer({
    materialUrl,
    title = 'Bahan Bacaan Siswa',
}: MaterialViewerProps) {
    const [showViewer, setShowViewer] = useState(false);

    const resolveFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const fileUrl = resolveFileUrl(materialUrl);

    return (
        <div className="overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-violet-200 bg-gradient-to-r from-violet-400 to-purple-400 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 text-white">
                    {/* <span className="text-xl sm:text-2xl">📚</span> */}
                    <h3 className="text-base font-bold sm:text-lg">{title}</h3>
                </div>
                <button
                    type="button"
                    onClick={() => setShowViewer((s) => !s)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:py-2 sm:text-sm"
                    aria-expanded={showViewer}
                >
                    {showViewer ? 'Tutup' : 'Buka'} Viewer
                </button>
            </div>

            <div
                className={`overflow-hidden px-6 transition-[max-height,opacity] duration-300 ${
                    showViewer
                        ? 'max-h-[800px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!showViewer}
            >
                <div className="p-6">
                    {(() => {
                        if (!fileUrl) {
                            return (
                                <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                    <p className="mb-2 font-semibold text-slate-800">
                                        PDF tidak tersedia
                                    </p>
                                    <p className="text-sm">
                                        Tidak ada materi PDF yang diunggah untuk
                                        misi ini. Hubungi Guru jika ini
                                        seharusnya tersedia.
                                    </p>
                                </div>
                            );
                        }

                        if (/\.(jpe?g|png|gif)$/i.test(fileUrl)) {
                            return (
                                <div className="h-[480px] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                                    <img
                                        src={fileUrl}
                                        alt="Materi"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            );
                        }

                        if (/\.(pdf)$/i.test(fileUrl)) {
                            return (
                                <div className="h-[480px] w-full overflow-hidden rounded-md border border-slate-200 bg-white">
                                    <object
                                        data={fileUrl}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                    >
                                        <div className="p-6 text-center">
                                            <p className="mb-2 text-slate-700">
                                                PDF tidak dapat ditampilkan di
                                                browser — kemungkinan file rusak
                                                atau tidak bisa diakses.
                                            </p>
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-md bg-indigo-600 px-4 py-2 text-white"
                                            >
                                                Buka PDF di Tab Baru
                                            </a>
                                        </div>
                                    </object>
                                </div>
                            );
                        }

                        return (
                            <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-700">
                                <p className="mb-2 font-semibold text-slate-800">
                                    File tidak dikenali
                                </p>
                                <p className="text-sm">
                                    Tipe file tidak didukung untuk pratinjau.{' '}
                                    <a
                                        className="text-indigo-600"
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Buka file
                                    </a>
                                </p>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
