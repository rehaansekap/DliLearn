import { cn } from '@/lib/utils';
import { BarChart3, FileText, Settings } from 'lucide-react';

interface MissionTabsProps {
    activeTab: 'overview' | 'submissions' | 'settings';
    onTabChange: (tab: 'overview' | 'submissions' | 'settings') => void;
}

interface TabItem {
    id: 'overview' | 'submissions' | 'settings';
    label: string;
    icon: React.ReactNode;
}

const tabs: TabItem[] = [
    {
        id: 'overview',
        label: 'Overview',
        icon: <BarChart3 className="h-4 w-4" />,
    },
    {
        id: 'submissions',
        label: 'Submissions',
        icon: <FileText className="h-4 w-4" />,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Settings className="h-4 w-4" />,
    },
];

export function MissionTabs({ activeTab, onTabChange }: MissionTabsProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-slate-600 hover:bg-slate-100',
                        )}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
