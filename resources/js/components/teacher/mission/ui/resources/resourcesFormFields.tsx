import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
} from '@/components/teacher/mission/ui/form';
import { PdfUploadZone } from './pdfUploadZone';

interface ResourcesFormFieldsProps {
    materialPdf: File | string | null;
    errors: {
        material_pdf?: string;
    };
    isDragging: boolean;
    onFileSelect: (file: File) => void;
    onRemoveFile: () => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ResourcesFormFields({
    materialPdf,
    errors,
    isDragging,
    onFileSelect,
    onRemoveFile,
    onDragOver,
    onDragLeave,
    onDrop,
}: ResourcesFormFieldsProps) {
    return (
        <>
            {/* PDF Upload Field */}
            <FormField>
                <InputLabel
                    value="Materi Misi (PDF)"
                    icon="📄"
                    required
                    htmlFor="pdf-upload"
                />
                <PdfUploadZone
                    file={materialPdf}
                    isDragging={isDragging}
                    error={errors.material_pdf}
                    onFileSelect={onFileSelect}
                    onRemoveFile={onRemoveFile}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                />
                <InputError message={errors.material_pdf} />
                <FormHint>
                    Materi PDF akan dipelajari siswa di Tahap 3: Creative Lab
                </FormHint>
            </FormField>
        </>
    );
}
