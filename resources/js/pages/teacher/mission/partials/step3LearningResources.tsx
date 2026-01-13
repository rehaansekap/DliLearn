import {
    ResourcesFormFields,
    ResourcesHeader,
    ResourcesSidebar,
} from '@/components/teacher/mission/ui/resources';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Step3LearningResourcesProps {
    data: {
        material_pdf: File | string | null;
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

    const handleFileSelect = (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Hanya file PDF yang diperbolehkan');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal 10MB');
            return;
        }
        onChange('material_pdf', file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <ResourcesHeader isMobile={isMobile} />

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
                        <ResourcesFormFields
                            materialPdf={data.material_pdf}
                            errors={errors}
                            isDragging={isDragging}
                            onFileSelect={handleFileSelect}
                            onRemoveFile={handleRemoveFile}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </div>
                </div>

                {/* Right Column - Tips Sidebar (1/3 width) */}
                <div className="lg:col-span-1">
                    <ResourcesSidebar />
                </div>
            </div>
        </div>
    );
}
