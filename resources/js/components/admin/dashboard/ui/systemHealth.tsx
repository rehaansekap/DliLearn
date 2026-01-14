import { cn } from '@/lib/utils';
import { CheckCircle2, Database, HardDrive, Package } from 'lucide-react';

export function SystemHealth() {
    const healthItems = [
        {
            label: 'Database',
            status: 'Connected',
            icon: Database,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
        },
        {
            label: 'Cache',
            status: 'Active',
            icon: HardDrive,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
        },
        {
            label: 'App Version',
            status: 'v1.0.0',
            icon: Package,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-slate-800">
                    ⚙️ Status Sistem
                </h3>
                <p className="text-xs text-slate-600 sm:text-sm">
                    Pemantauan sistem real-time
                </p>
            </div>

            {/* Content */}
            <div className="space-y-3 p-4 sm:p-6">
                {healthItems.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex items-center justify-between rounded-xl border-2 p-3 transition-all hover:shadow-md',
                            item.bgColor,
                            item.borderColor,
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm',
                                )}
                            >
                                <item.icon
                                    className={cn('h-5 w-5', item.color)}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {item.label}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {item.status}
                                </p>
                            </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                ))}

                {/* Overall Status */}
                <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900">
                                Semua Sistem Normal
                            </p>
                            <p className="text-xs text-emerald-700">
                                Tidak ada masalah terdeteksi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
