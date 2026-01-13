import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
    TextInput,
} from '@/components/teacher/mission/ui/form';
import { PdfUploadZone } from './pdfUploadZone';

interface ResourcesFormFieldsProps {
    materialPdf: File | string | null;
    collabUrl: string;
    errors: {
        material_pdf?: string;
        collab_url?: string;
    };
    isDragging: boolean;
    onFileSelect: (file: File) => void;
    onRemoveFile: () => void;
    onCollabUrlChange: (value: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ResourcesFormFields({
    materialPdf,
    collabUrl,
    errors,
    isDragging,
    onFileSelect,
    onRemoveFile,
    onCollabUrlChange,
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
                    value={collabUrl}
                    onChange={(e) => onCollabUrlChange(e.target.value)}
                    placeholder="https://www.figma.com/board/..."
                    isError={!!errors.collab_url}
                />
                <InputError message={errors.collab_url} />
                <FormHint>
                    Link workspace kolaboratif untuk siswa bekerja bersama di
                    Tahap 2: Organisasi Tim
                </FormHint>
            </FormField>
        </>
    );
}
