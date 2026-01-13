import {
    FormField,
    FormHint,
    InputError,
    InputLabel,
    TextAreaInput,
    TextInput,
} from '@/components/teacher/mission/ui/form';
import { VideoPreview } from './videoPreview';

interface ScenarioFormFieldsProps {
    videoUrl: string;
    caseNarrative: string;
    errors: {
        video_url?: string;
        case_narrative?: string;
    };
    onVideoUrlChange: (value: string) => void;
    onCaseNarrativeChange: (value: string) => void;
}

export function ScenarioFormFields({
    videoUrl,
    caseNarrative,
    errors,
    onVideoUrlChange,
    onCaseNarrativeChange,
}: ScenarioFormFieldsProps) {
    return (
        <>
            {/* Video URL Field */}
            <FormField>
                <InputLabel
                    value="URL Video Orientasi (YouTube)"
                    icon="🎬"
                    required
                    htmlFor="video-url-input"
                />
                <TextInput
                    id="video-url-input"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    isError={!!errors.video_url}
                />
                <InputError message={errors.video_url} />
                <FormHint>
                    Video pengantar untuk menjelaskan konteks masalah kepada
                    siswa
                </FormHint>
            </FormField>

            {/* Video Preview */}
            <VideoPreview videoUrl={videoUrl} />

            {/* Case Narrative Field */}
            <FormField>
                <InputLabel
                    value="Narasi Kasus (Problem Statement)"
                    icon="📖"
                    required
                    htmlFor="case-narrative-input"
                />
                <TextAreaInput
                    id="case-narrative-input"
                    value={caseNarrative}
                    onChange={(e) => onCaseNarrativeChange(e.target.value)}
                    placeholder="Contoh: Mall Grand Indonesia mengubah sistem tarif parkirnya. 1 jam pertama Rp5.000, jam berikutnya Rp3.000 flat per jam. Bantu mereka membuat sistem perhitungan otomatis!"
                    rows={10}
                    isError={!!errors.case_narrative}
                    className="font-mono text-sm"
                />
                <InputError message={errors.case_narrative} />
                <FormHint>
                    {caseNarrative.length}/1000 karakter • Deskripsikan masalah
                    yang harus diselesaikan siswa
                </FormHint>
            </FormField>
        </>
    );
}
