import {
    ScenarioFormFields,
    ScenarioHeader,
    ScenarioSidebar,
} from '@/components/teacher/mission/ui/scenario';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Step2ScenarioProps {
    data: {
        video_url: string;
        case_narrative: string;
    };
    errors: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

export function Step2Scenario({ data, errors, onChange }: Step2ScenarioProps) {
    const isMobile = useIsMobile();

    const handleVideoUrlChange = (value: string) => {
        onChange('video_url', value);
    };

    const handleCaseNarrativeChange = (value: string) => {
        onChange('case_narrative', value);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <ScenarioHeader isMobile={isMobile} />

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
                        <ScenarioFormFields
                            videoUrl={data.video_url}
                            caseNarrative={data.case_narrative}
                            errors={errors}
                            onVideoUrlChange={handleVideoUrlChange}
                            onCaseNarrativeChange={handleCaseNarrativeChange}
                        />
                    </div>
                </div>

                {/* Right Column - Tips Sidebar (1/3 width) */}
                <div className="lg:col-span-1">
                    <ScenarioSidebar />
                </div>
            </div>
        </div>
    );
}
