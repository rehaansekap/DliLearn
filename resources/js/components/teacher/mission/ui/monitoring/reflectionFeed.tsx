import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';

interface Reflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: 'initial' | 'final';
    group_name?: string;
}

interface ReflectionFeedProps {
    reflections: Reflection[];
}

export function ReflectionFeed({ reflections }: ReflectionFeedProps) {
    const sortedReflections = [...reflections].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const latestReflections = sortedReflections.slice(0, 10);

    if (latestReflections.length === 0) {
        return (
            <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg">
                <div className="border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">
                            💬 Refleksi Terbaru
                        </h3>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Belum ada refleksi dari siswa
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800">
                        💬 Refleksi Terbaru
                    </h3>
                </div>
                <p className="text-xs text-slate-500">
                    {latestReflections.length} refleksi terbaru
                </p>
            </div>

            {/* Scrollable Feed */}
            <div className="max-h-96 space-y-3 overflow-y-auto p-4">
                {latestReflections.map((reflection, index) => (
                    <div
                        key={`${reflection.user_id}-${reflection.type}-${index}`}
                        className={cn(
                            'rounded-xl border p-3 transition-all hover:shadow-md',
                            reflection.type === 'initial'
                                ? 'border-green-200 bg-green-50'
                                : 'border-blue-200 bg-blue-50',
                        )}
                    >
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full font-bold text-white shadow-sm',
                                        reflection.type === 'initial'
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500',
                                    )}
                                >
                                    {reflection.user_name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <p
                                        className={cn(
                                            'text-sm font-bold',
                                            reflection.type === 'initial'
                                                ? 'text-green-900'
                                                : 'text-blue-900',
                                        )}
                                    >
                                        {reflection.user_name}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs',
                                            reflection.type === 'initial'
                                                ? 'text-green-600'
                                                : 'text-blue-600',
                                        )}
                                    >
                                        {reflection.group_name || 'No Group'} •{' '}
                                        {formatDistanceToNow(
                                            new Date(reflection.created_at),
                                            {
                                                addSuffix: true,
                                                locale: id,
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={cn(
                                    'rounded-full px-2 py-0.5 text-xs font-bold',
                                    reflection.type === 'initial'
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-blue-200 text-blue-800',
                                )}
                            >
                                {reflection.type === 'initial'
                                    ? 'Awal'
                                    : 'Akhir'}
                            </span>
                        </div>
                        <p
                            className={cn(
                                'line-clamp-3 text-sm',
                                reflection.type === 'initial'
                                    ? 'text-green-800'
                                    : 'text-blue-800',
                            )}
                        >
                            {reflection.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
