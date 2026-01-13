import { cn } from '@/lib/utils';

interface SubmissionTabsProps {
    activeTab: 'code' | 'grade';
    onTabChange: (tab: 'code' | 'grade') => void;
    hasSubmission: boolean;
    isMobile?: boolean;
}

export function SubmissionTabs({
    activeTab,
    onTabChange,
    hasSubmission,
    isMobile = false,
}: SubmissionTabsProps) {
    return (
        <div className="flex border-b border-slate-200 bg-slate-50">
            <button
                onClick={() => onTabChange('code')}
                className={cn(
                    'flex-1 font-semibold transition',
                    isMobile ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm',
                    activeTab === 'code'
                        ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-100',
                )}
            >
                📄 Submission
            </button>
            <button
                onClick={() => onTabChange('grade')}
                disabled={!hasSubmission}
                className={cn(
                    'flex-1 font-semibold transition',
                    isMobile ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm',
                    !hasSubmission
                        ? 'cursor-not-allowed text-slate-400 opacity-60'
                        : activeTab === 'grade'
                          ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                          : 'text-slate-600 hover:bg-slate-100',
                )}
            >
                ⭐ Penilaian
            </button>
        </div>
    );
}
