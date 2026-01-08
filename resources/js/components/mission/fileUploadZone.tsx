import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface FileUploadZoneProps {
    selectedFile: File | null;
    isDragging: boolean;
    acceptedFormats: string;
    maxSizeMB: number;
    onFileSelect: (file: File) => void;
    onRemoveFile: () => void;
    onDragStateChange: (isDragging: boolean) => void;
}

export function FileUploadZone({
    selectedFile,
    isDragging,
    acceptedFormats,
    maxSizeMB,
    onFileSelect,
    onRemoveFile,
    onDragStateChange,
}: FileUploadZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        onDragStateChange(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        onDragStateChange(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onDragStateChange(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            onFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            onFileSelect(files[0]);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                'group relative cursor-pointer overflow-hidden rounded-xl border-4 border-dashed p-8 text-center transition-all duration-300 sm:rounded-2xl sm:border-4 sm:p-12',
                isDragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50',
            )}
        >
            <input
                aria-label="Upload file"
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileInputChange}
                className="hidden"
            />

            {selectedFile ? (
                <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg sm:h-20 sm:w-20">
                        <span className="text-3xl sm:text-4xl">📄</span>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-800">
                            {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFile();
                        }}
                        className="mx-auto inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                    >
                        <span>🗑️</span>
                        <span>Hapus File</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                        <span className="text-3xl sm:text-4xl">☁️</span>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-800">
                            {isDragging
                                ? 'Drop file di sini'
                                : 'Drag & Drop atau Klik untuk Upload'}
                        </p>
                        <p className="text-sm text-slate-500">
                            {acceptedFormats.replace(/\./g, '').toUpperCase()}{' '}
                            (Max: {maxSizeMB}MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
