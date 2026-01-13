import { CheckCircle2, FileText } from 'lucide-react';

interface FileBadgeProps {
    fileName: string | null;
}

export function FileBadge({ fileName }: FileBadgeProps) {
    if (!fileName) {
        return (
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
                <span>❌</span>
                <span>Tidak ada materi</span>
            </span>
        );
    }

    return (
        <div className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
            <FileText className="h-5 w-5 text-green-600" />
            <span>{fileName}</span>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
    );
}
