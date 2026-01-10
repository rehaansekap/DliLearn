import { cn } from '@/lib/utils';
import {
    AlertCircle,
    FileText,
    Link as LinkIcon,
    Upload,
    X,
} from 'lucide-react';
import { ChangeEvent, useState } from 'react';

interface Step3LearningResourcesProps {
    data: {
        material_pdf: File | string | null;
        collab_url: string;
        simulator_config: string;
    };
    errors: Record<string, string>;
    onChange: (field: string, value: File | string | null) => void;
}

export function Step3LearningResources({
    data,
    errors,
    onChange,
}: Step3LearningResourcesProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange('material_pdf', file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf') {
            onChange('material_pdf', file);
        }
    };

    const handleRemoveFile = () => {
        onChange('material_pdf', null);
    };

    const fileName =
        data.material_pdf instanceof File
            ? data.material_pdf.name
            : typeof data.material_pdf === 'string'
              ? data.material_pdf.split('/').pop()
              : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl shadow-lg">
                        📚
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Materi & Resources (Tahap 3 PBL)
                        </h2>
                        <p className="text-sm text-slate-600">
                            Upload materi pembelajaran dan konfigurasi simulator
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                {/* PDF Upload */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <FileText className="h-5 w-5 text-red-500" />
                        <span>Materi Pembelajaran (PDF)</span>
                        <span className="text-red-500">*</span>
                    </label>

                    {!data.material_pdf ? (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={cn(
                                'relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all',
                                isDragging
                                    ? 'border-cyan-500 bg-cyan-50'
                                    : 'border-slate-300 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50/50',
                                errors.material_pdf &&
                                    'border-red-300 bg-red-50',
                            )}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                title="Upload materi PDF"
                                aria-label="Upload materi PDF"
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                            <div className="pointer-events-none">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                                    <Upload className="h-8 w-8 text-slate-500" />
                                </div>
                                <p className="mb-2 font-medium text-slate-700">
                                    Klik atau drag file PDF ke sini
                                </p>
                                <p className="text-sm text-slate-500">
                                    Maksimal 10MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-900">
                                            {fileName}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            ✓ File siap diupload
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    aria-label="Hapus file"
                                    title="Hapus file"
                                    className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {errors.material_pdf && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.material_pdf}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Upload materi PDF yang akan dipelajari siswa di tahap
                        Creative Lab
                    </p>
                </div>

                {/* Collaboration URL */}
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <LinkIcon className="h-5 w-5 text-blue-500" />
                        <span>Link Kolaborasi (FigJam/Miro/Whiteboard)</span>

                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        value={data.collab_url}
                        onChange={(e) => onChange('collab_url', e.target.value)}
                        placeholder="https://www.figma.com/board/..."
                        className={cn(
                            'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none',
                            errors.collab_url
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.collab_url && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.collab_url}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Link workspace kolaboratif untuk siswa bekerja bersama
                    </p>
                </div>

                {/* Simulator Config */}
                {/* <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        <span>⚙️</span>
                        <span>Konfigurasi Simulator Koding (JSON)</span>
                    </label>
                    <textarea
                        value={data.simulator_config}
                        onChange={(e) =>
                            onChange('simulator_config', e.target.value)
                        }
                        placeholder='{"type": "logic", "answer": 8000, "hint": "Gunakan if-else untuk menghitung tarif"}'
                        rows={6}
                        className={cn(
                            'w-full resize-none rounded-xl border-2 px-4 py-3 font-mono text-sm text-slate-700 transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none',
                            errors.simulator_config
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200 bg-white',
                        )}
                    />
                    {errors.simulator_config && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.simulator_config}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Format JSON untuk validasi otomatis kode siswa
                        (opsional)
                    </p>
                </div> */}

                {/* Info Box */}
                {/* <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl shadow">
                            ℹ️
                        </div>
                        <div>
                            <h4 className="mb-2 font-bold text-amber-900">
                                Contoh Konfigurasi Simulator:
                            </h4>
                            <pre className="overflow-x-auto rounded-lg bg-white p-3 text-xs text-slate-700">
                                {`{
                                    "type": "logic",
                                    "answer": 8000,
                                    "test_cases": [
                                        {"input": 1, "output": 5000},
                                        {"input": 3, "output": 11000}
                                    ]
                                }`}
                            </pre>
                            <p className="mt-2 text-sm text-amber-800">
                                Sistem akan menggunakan config ini untuk
                                memberikan feedback otomatis kepada siswa
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
