import { AlertTriangle } from 'lucide-react';

interface ResourcesWarningCardProps {
    title: string;
    message: string;
}

export function ResourcesWarningCard({
    title,
    message,
}: ResourcesWarningCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
            <div className="border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-white" />
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
            </div>
            <div className="p-4">
                <p className="text-sm text-amber-900">{message}</p>
            </div>
        </div>
    );
}
