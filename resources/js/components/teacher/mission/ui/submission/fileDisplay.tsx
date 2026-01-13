import { cn } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';

interface FileDisplayProps {
    filePath: string | null;
    isMobile?: boolean;
}

export function FileDisplay({ filePath, isMobile = false }: FileDisplayProps) {
    if (!filePath) {
        return (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Tidak ada file</p>
            </div>
        );
    }

    const isPdf = filePath.endsWith('.pdf');
    const fileUrl = `/storage/${filePath}`;

    return (
        <div>
            <h4
                className={cn(
                    'mb-3 font-bold text-slate-700',
                    isMobile ? 'text-xs' : 'text-sm',
                )}
            >
                📊 Flowchart / Dokumen
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {isPdf ? (
                    <div className="flex items-center gap-3 p-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-700">
                                PDF Document
                            </p>
                            <p className="text-xs text-slate-500">
                                {filePath.split('/').pop()}
                            </p>
                        </div>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            <Download className="h-4 w-4" />
                            <span>Unduh</span>
                        </a>
                    </div>
                ) : (
                    <img
                        src={fileUrl}
                        alt="Flowchart"
                        className="w-full"
                        loading="lazy"
                    />
                )}
            </div>
        </div>
    );
}
