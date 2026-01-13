import { Calendar } from 'lucide-react';

interface DateDisplayProps {
    date: string | null;
    type: 'start' | 'end';
}

export function DateDisplay({ date, type }: DateDisplayProps) {
    const isStart = type === 'start';
    const bgColor = isStart ? 'bg-green-50/50' : 'bg-red-50/50';
    const iconColor = isStart ? 'text-green-600' : 'text-red-600';
    const textColor = isStart ? 'text-green-800' : 'text-red-800';

    return (
        <div
            className={`flex items-center gap-2 rounded-lg ${bgColor} px-3 py-2 text-sm`}
        >
            <Calendar className={`h-4 w-4 ${iconColor}`} />
            <span className={textColor}>
                {date
                    ? new Date(date).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                      })
                    : 'Tidak diatur'}
            </span>
        </div>
    );
}
