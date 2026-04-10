import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
} from '@/components/teacher/mission/ui/form';
import { PdfUploadZone } from './pdfUploadZone';

interface ResourcesFormFieldsProps {
    materialPdf: File | string | null;
    lkpdPdf: File | string | null;
    errors: {
        material_pdf?: string;
        lkpd_pdf?: string;
    };
    isDragging: boolean;
    isDraggingLkpd: boolean;
    onFileSelect: (file: File, type: 'material' | 'lkpd') => void;
    onRemoveFile: () => void;
    onRemoveFileLkpd: () => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOverLkpd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeaveLkpd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDropLkpd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ResourcesFormFields({
    materialPdf,
    lkpdPdf,
    errors,
    isDragging,
    isDraggingLkpd,
    onFileSelect,
    onRemoveFile,
    onRemoveFileLkpd,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragOverLkpd,
    onDragLeaveLkpd,
    onDropLkpd,
}: ResourcesFormFieldsProps) {
    return (
        <>
            {/* Materi PDF Upload Field */}
            <FormField>
                <InputLabel
                    value="Bahan Bacaan Siswa (PDF)"
                    icon="📄"
                    required
                    htmlFor="pdf-upload"
                />
                <PdfUploadZone
                    file={materialPdf}
                    isDragging={isDragging}
                    error={errors.material_pdf}
                    onFileSelect={(file) => onFileSelect(file, 'material')}
                    onRemoveFile={onRemoveFile}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    inputId="pdf-upload"
                />
                <InputError message={errors.material_pdf} />
                <FormHint>
                    Materi PDF akan dipelajari siswa di Tahap 3: Creative Lab
                </FormHint>
            </FormField>

            {/* LKPD PDF Upload Field */}
            <FormField>
                <InputLabel
                    value="Lembar Kerja Peserta Didik - LKPD (PDF)"
                    icon="📋"
                    htmlFor="lkpd-upload"
                />
                <PdfUploadZone
                    file={lkpdPdf}
                    isDragging={isDraggingLkpd}
                    error={errors.lkpd_pdf}
                    onFileSelect={(file) => onFileSelect(file, 'lkpd')}
                    onRemoveFile={onRemoveFileLkpd}
                    onDragOver={onDragOverLkpd}
                    onDragLeave={onDragLeaveLkpd}
                    onDrop={onDropLkpd}
                    inputId="lkpd-upload"
                />
                <InputError message={errors.lkpd_pdf} />
                <FormHint>
                    LKPD akan membantu siswa dalam mengorganisasi dan
                    mengerjakan tugas kelompok
                </FormHint>
            </FormField>
        </>
    );
}
