import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
    TextInput,
} from '@/components/teacher/mission/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArrowRight, FileText, Upload, X } from 'lucide-react';
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
    const isMobile = useIsMobile();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Hanya file PDF yang diperbolehkan');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('Ukuran file maksimal 10MB');
                return;
            }
            onChange('material_pdf', file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Hanya file PDF yang diperbolehkan');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('Ukuran file maksimal 10MB');
                return;
            }
            onChange('material_pdf', file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
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
            <div
                className={cn(
                    'rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50',
                    isMobile ? 'p-4' : 'p-6',
                )}
            >
                {isMobile && (
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl shadow-lg',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        📚
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'hidden items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-2xl shadow-lg sm:flex',
                            isMobile ? 'h-10 w-10 text-xl' : 'h-14 w-14',
                        )}
                    >
                        📚
                    </div>
                    <div>
                        <h2
                            className={cn(
                                'font-bold text-slate-800',
                                isMobile ? 'text-lg' : 'text-xl',
                            )}
                        >
                            Materi & Resources (Tahap 3 PBL)
                        </h2>
                        <p
                            className={cn(
                                'text-slate-600',
                                isMobile ? 'text-xs' : 'text-sm',
                            )}
                        >
                            Upload materi pembelajaran dan link kolaborasi tim
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Layout on Desktop */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Form Fields (2/3 width) */}
                <div className="space-y-6 lg:col-span-2">
                    <div
                        className={cn(
                            'space-y-6 rounded-2xl border border-slate-200 bg-white shadow-lg',
                            isMobile ? 'p-4' : 'p-6',
                        )}
                    >
                        {/* PDF Upload Field */}
                        <FormField>
                            <InputLabel
                                value="Materi Misi (PDF)"
                                icon="📄"
                                required
                                htmlFor="pdf-upload"
                            />

                            {!data.material_pdf ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={cn(
                                        'group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300',
                                        isDragging
                                            ? 'scale-[1.02] border-cyan-500 bg-cyan-100'
                                            : 'border-indigo-200 bg-indigo-50/50 hover:border-cyan-400 hover:bg-cyan-50',
                                        errors.material_pdf &&
                                            'border-red-300 bg-red-50',
                                    )}
                                >
                                    <input
                                        id="pdf-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                        aria-label="Upload materi PDF"
                                    />
                                    <div className="pointer-events-none space-y-4">
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 transition-transform duration-300 group-hover:scale-110">
                                            <Upload
                                                className={cn(
                                                    'h-10 w-10 transition-colors',
                                                    isDragging
                                                        ? 'text-cyan-600'
                                                        : 'text-indigo-500',
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
                                                Format: <strong>PDF</strong> •
                                                Maksimal: <strong>10MB</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
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
                                            onClick={handleRemoveFile}
                                            className="group flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-all hover:bg-red-500 hover:text-white"
                                            aria-label="Hapus file"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <InputError message={errors.material_pdf} />
                            <FormHint>
                                Materi PDF akan dipelajari siswa di Tahap 3:
                                Creative Lab
                            </FormHint>
                        </FormField>

                        {/* Collaboration URL Field */}
                        <FormField>
                            <InputLabel
                                value="Link Kolaborasi (FigJam / Miro / Whiteboard)"
                                icon="🔗"
                                required
                                htmlFor="collab-url-input"
                            />
                            <TextInput
                                id="collab-url-input"
                                type="url"
                                value={data.collab_url}
                                onChange={(e) =>
                                    onChange('collab_url', e.target.value)
                                }
                                placeholder="https://www.figma.com/board/..."
                                isError={!!errors.collab_url}
                            />
                            <InputError message={errors.collab_url} />
                            <FormHint>
                                Link workspace kolaboratif untuk siswa bekerja
                                bersama di Tahap 2: Organisasi Tim
                            </FormHint>
                        </FormField>
                    </div>
                </div>

                {/* Right Column - Info Sidebar (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        {/* Tips Card */}
                        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
                            <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">💡</span>
                                    <h3 className="font-bold text-white">
                                        Tips Materi
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-4">
                                <h4 className="font-semibold text-indigo-900">
                                    Format Materi Efektif:
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-indigo-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                                        <span>
                                            Gunakan contoh kasus nyata yang
                                            relevan
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-indigo-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                                        <span>
                                            Sertakan diagram / flowchart untuk
                                            logika
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-indigo-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                                        <span>
                                            Berikan pseudocode sebagai panduan
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-indigo-800">
                                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                                        <span>
                                            Hindari terlalu banyak teks, fokus
                                            visual
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
