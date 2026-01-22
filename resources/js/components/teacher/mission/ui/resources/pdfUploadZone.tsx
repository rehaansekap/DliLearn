import { cn } from '@/lib/utils';
import { FileText, Upload, X } from 'lucide-react';

interface PdfUploadZoneProps {
    file: File | string | null;
    isDragging: boolean;
    error?: string;
    inputId?: string;
    onFileSelect: (file: File) => void;
    onRemoveFile: () => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function PdfUploadZone({
    file,
    isDragging,
    error,
    inputId = 'pdf-upload',
    onFileSelect,
    onRemoveFile,
    onDragOver,
    onDragLeave,
    onDrop,
}: PdfUploadZoneProps) {
    const fileName =
        file instanceof File
            ? file.name
            : typeof file === 'string'
              ? file.split('/').pop()
              : null;

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    if (file) {
        return (
            <div className="overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-green-900">
                                {fileName}
                            </p>
                            <p className="text-sm text-green-700">
                                ✓ File siap diupload
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemoveFile}
                        className="group flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-all hover:bg-red-500 hover:text-white"
                        aria-label="Hapus file"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
                'group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300',
                isDragging
                    ? 'scale-[1.02] border-cyan-500 bg-cyan-100'
                    : 'border-indigo-200 bg-indigo-50/50 hover:border-cyan-400 hover:bg-cyan-50',
                error && 'border-red-300 bg-red-50',
            )}
        >
            <input
                id={inputId}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Upload PDF"
            />
            <div className="pointer-events-none space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 transition-transform duration-300 group-hover:scale-110">
                    <Upload
                        className={cn(
                            'h-10 w-10 transition-colors',
                            isDragging ? 'text-cyan-600' : 'text-indigo-500',
                        )}
                    />
                </div>
                <div>
                    <p className="mb-2 font-bold text-slate-800">
                        {isDragging
                            ? '📂 Lepaskan file di sini'
                            : '☁️ Klik atau geser file PDF ke sini'}
                    </p>
                    <p className="text-sm text-slate-600">
                        Format: <strong>PDF</strong> • Maksimal:{' '}
                        <strong>50MB</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
