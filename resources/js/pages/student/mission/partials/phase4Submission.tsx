import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface Phase4SubmissionProps {
    amILeader: boolean;
    groupHasSubmitted: boolean;
    onSubmit: (file: File, finalCode: string) => void;
    isSubmitting: boolean;
    onRefresh?: () => void;
}

export default function Phase4Submission({
    amILeader,
    groupHasSubmitted,
    onSubmit,
    isSubmitting,
    onRefresh,
}: Phase4SubmissionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [finalCode, setFinalCode] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedFile && finalCode.length >= 10) {
            onSubmit(selectedFile, finalCode);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!amILeader) {
        return (
            <div className="h-fullspace-y-6 px-2 sm:px-0">
                {/* Info untuk Anggota */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg sm:rounded-2xl">
                    <div className="p-8 text-center sm:p-12">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 sm:mb-6 sm:h-24 sm:w-24">
                            <span className="text-4xl sm:text-5xl">⏳</span>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-800 sm:mb-3 sm:text-2xl">
                            Menunggu Ketua Kelompok
                        </h3>
                        <p className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
                            Ketua kelompok sedang menyiapkan submission final.
                            Pastikan kalian sudah koordinasi terkait flowchart
                            dan source code yang akan dikumpulkan.
                        </p>

                        <div className="mt-6">
                            <div className="inline-flex w-full items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 sm:w-auto sm:rounded-2xl sm:px-6 sm:py-4">
                                <span className="text-xl">💡</span>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-teal-900">
                                        Tips:
                                    </p>
                                    <p className="text-sm text-teal-700">
                                        Gunakan waktu ini untuk review kembali
                                        hasil kerja tim
                                    </p>
                                </div>
                            </div>
                            {onRefresh && (
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={onRefresh}
                                        className="mx-auto w-full max-w-xs rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-bold text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
                                    >
                                        🔄 Periksa Status Submission
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (groupHasSubmitted) {
        return (
            <div className="space-y-6 px-2 sm:px-0">
                <div className="flex justify-center">
                    <div className="w-full max-w-xl px-2 sm:px-0">
                        <div className="overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg sm:rounded-2xl">
                            <div className="p-8 text-center sm:p-12">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg sm:mb-6 sm:h-24 sm:w-24">
                                    <span className="text-4xl sm:text-5xl">
                                        ✅
                                    </span>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-800 sm:mb-3 sm:text-2xl">
                                    Tugas Berhasil Dikumpulkan!
                                </h3>
                                <p className="mx-auto max-w-md text-sm text-slate-600 sm:text-base">
                                    Selamat! Kelompok kalian sudah berhasil
                                    submit tugas akhir. Lanjut ke tahap evaluasi
                                    untuk melihat hasil karya teman-teman.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full space-y-6 px-2 sm:px-0">
            {/* Header Section */}
            <div className="overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4 shadow-lg sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-xl shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                        🎨
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-black text-slate-800 sm:mb-2 sm:text-2xl">
                            Penyajian Hasil Karya
                        </h3>
                        <p className="text-sm text-slate-600 sm:text-base">
                            Upload flowchart dan source code final kelompokmu.
                            Pastikan semua sudah dicek dan disetujui seluruh
                            anggota tim!
                        </p>
                    </div>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:rounded-2xl">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">📊</span>
                        <div>
                            <h3 className="text-base font-bold text-white sm:text-lg">
                                Upload Flowchart
                            </h3>
                            <p className="text-xs text-indigo-100 sm:text-sm">
                                Format: PDF, JPG, PNG (Max: 10MB)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Drag & Drop Zone */}
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
                            aria-label="Upload flowchart file"
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {selectedFile ? (
                            <div className="space-y-4">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg sm:h-20 sm:w-20">
                                    <span className="text-3xl sm:text-4xl">
                                        📄
                                    </span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
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
                                    <span className="text-3xl sm:text-4xl">
                                        ☁️
                                    </span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800">
                                        {isDragging
                                            ? 'Drop file di sini'
                                            : 'Drag & Drop atau Klik untuk Upload'}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        PDF, JPG, PNG (Max: 10MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Source Code Section */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:rounded-2xl">
                <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">💻</span>
                        <div>
                            <h3 className="text-base font-bold text-white sm:text-lg">
                                Source Code Final
                            </h3>
                            <p className="text-xs text-cyan-100 sm:text-sm">
                                Paste kode final kelompokmu (Min: 10 karakter)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <textarea
                        value={finalCode}
                        onChange={(e) => setFinalCode(e.target.value)}
                        placeholder="// Paste source code final di sini...&#10;function calculateParkingFee(hours) {&#10;  // Your code here&#10;}"
                        rows={8}
                        className={cn(
                            'w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none',
                            finalCode.length >= 10 &&
                                'border-green-300 bg-green-50/50',
                        )}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs">
                        <span
                            className={cn(
                                'font-medium',
                                finalCode.length < 10
                                    ? 'text-slate-500'
                                    : 'text-green-600',
                            )}
                        >
                            {finalCode.length >= 10 ? '✓ ' : ''}
                            {finalCode.length} karakter
                        </span>
                        {finalCode.length < 10 && (
                            <span className="text-amber-600">
                                Minimal 10 karakter
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center px-2">
                <button
                    onClick={handleSubmit}
                    disabled={
                        !selectedFile || finalCode.length < 10 || isSubmitting
                    }
                    className={cn(
                        'group relative w-full max-w-md overflow-hidden rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 sm:w-auto sm:max-w-none sm:rounded-2xl',
                        !selectedFile || finalCode.length < 10 || isSubmitting
                            ? 'cursor-not-allowed bg-slate-300'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:scale-[1.02] hover:from-rose-700 hover:to-pink-700 hover:shadow-xl active:scale-[0.98]',
                    )}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z"
                                    />
                                </svg>
                                <span>Mengirim...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl">🚀</span>
                                <span>Submit Tugas Final</span>
                            </>
                        )}
                    </span>
                </button>
            </div>

            {/* Warning */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-xl sm:text-2xl">⚠️</span>
                    <div>
                        <h4 className="mb-1 text-sm font-bold text-red-900 sm:text-base">
                            Perhatian!
                        </h4>
                        <p className="text-sm text-red-800">
                            Pastikan semua anggota tim sudah menyetujui file dan
                            kode yang akan disubmit. Submission tidak bisa
                            diubah setelah dikirim.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
