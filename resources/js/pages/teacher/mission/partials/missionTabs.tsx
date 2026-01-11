import { cn } from '@/lib/utils';
import { BarChart3, ClipboardCheck, Users } from 'lucide-react';

interface MissionTabsProps {
    activeTab: 'attendance' | 'groups' | 'monitoring';
    onTabChange: (tab: 'attendance' | 'groups' | 'monitoring') => void;
}

interface TabItem {
    id: 'attendance' | 'groups' | 'monitoring';
    label: string;
    icon: React.ReactNode;
    description: string;
}

const tabs: TabItem[] = [
    {
        id: 'attendance',
        label: 'Kehadiran',
        icon: <ClipboardCheck className="h-4 w-4" />,
        description: 'Presensi siswa',
    },
    {
        id: 'groups',
        label: 'Kelompok',
        icon: <Users className="h-4 w-4" />,
        description: 'Atur pembagian tim',
    },
    {
        id: 'monitoring',
        label: 'Monitoring',
        icon: <BarChart3 className="h-4 w-4" />,
        description: 'Progress & refleksi',
    },
];

export function MissionTabs({ activeTab, onTabChange }: MissionTabsProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                'flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 sm:flex-row sm:justify-center sm:gap-2',
                                isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-slate-600 hover:bg-slate-100',
                            )}
                        >
                            {tab.icon}
                            <div className="flex flex-col items-center sm:items-start">
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                                <span className="text-[10px] sm:hidden">
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
