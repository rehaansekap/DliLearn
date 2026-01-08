import { FileUploadZone } from '@/components/mission/fileUploadZone';
import { MissionButton } from '@/components/mission/ui/missionButton';
import { MissionCard } from '@/components/mission/ui/missionCard';
import { MissionPageTitle } from '@/components/mission/ui/missionPageTitle';
import { StatusCard } from '@/components/mission/ui/statusCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

    const handleSubmit = () => {
        if (selectedFile && finalCode.length >= 10) {
            onSubmit(selectedFile, finalCode);
        }
    };

    // Non-Leader View
    if (!amILeader) {
        return (
            <div className="space-y-6 px-2 sm:px-0">
                <StatusCard
                    type="waiting"
                    icon="⏳"
                    title="Menunggu Ketua Kelompok"
                    description="Ketua kelompok sedang menyiapkan submission final. Pastikan kalian sudah koordinasi terkait flowchart dan source code yang akan dikumpulkan."
                >
                    <div className="inline-flex w-full items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 sm:w-auto sm:rounded-2xl sm:px-6 sm:py-4">
                        <span className="text-xl">💡</span>
                        <div className="text-left">
                            <p className="text-sm font-bold text-teal-900">
                                Tips:
                            </p>
                            <p className="text-sm text-teal-700">
                                Gunakan waktu ini untuk review kembali hasil
                                kerja tim
                            </p>
                        </div>
                    </div>
                    {onRefresh && (
                        <div className="mt-4">
                            <MissionButton
                                onClick={onRefresh}
                                variant="success"
                                icon="🔄"
                            >
                                Periksa Status Submission
                            </MissionButton>
                        </div>
                    )}
                </StatusCard>
            </div>
        );
    }

    // Already Submitted View
    if (groupHasSubmitted) {
        return (
            <div className="space-y-6 px-2 sm:px-0">
                <div className="flex justify-center">
                    <div className="w-full max-w-xl px-2 sm:px-0">
                        <StatusCard
                            type="success"
                            icon="✅"
                            title="Tugas Berhasil Dikumpulkan!"
                            description="Selamat! Kelompok kalian sudah berhasil submit tugas akhir. Lanjut ke tahap evaluasi untuk melihat hasil karya teman-teman."
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Leader Submission Form
    return (
        <div className="h-full space-y-6 px-2 sm:px-0">
            {/* Page Title */}
            <MissionPageTitle
                step={4}
                title="Penyajian Hasil Karya"
                subtitle="Upload flowchart dan source code final kelompokmu"
                icon="🎨"
                color="rose"
            />

            {/* File Upload Section */}
            <MissionCard
                title="Upload Flowchart"
                subtitle="Format: PDF, JPG, PNG (Max: 10MB)"
                icon="📊"
                headerClassName="bg-gradient-to-r from-indigo-500 to-purple-500 border-none"
            >
                <FileUploadZone
                    selectedFile={selectedFile}
                    isDragging={isDragging}
                    acceptedFormats=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={10}
                    onFileSelect={setSelectedFile}
                    onRemoveFile={() => setSelectedFile(null)}
                    onDragStateChange={setIsDragging}
                />
            </MissionCard>

            {/* Source Code Section */}
            <MissionCard
                title="Source Code Final"
                subtitle="Paste kode final kelompokmu (Min: 10 karakter)"
                icon="💻"
                headerClassName="bg-gradient-to-r from-cyan-500 to-blue-500 border-none"
            >
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
            </MissionCard>

            {/* Submit Button */}
            <div className="flex justify-center px-2">
                <MissionButton
                    onClick={handleSubmit}
                    disabled={
                        !selectedFile || finalCode.length < 10 || isSubmitting
                    }
                    isLoading={isSubmitting}
                    variant="danger"
                    size="lg"
                    icon={!isSubmitting ? '🚀' : undefined}
                >
                    {isSubmitting ? 'Mengirim...' : 'Submit Tugas Final'}
                </MissionButton>
            </div>

            {/* Warning */}
            <MissionCard
                className="border-red-200 bg-red-50"
                bodyClassName="p-4 sm:p-6"
            >
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
            </MissionCard>
        </div>
    );
}
