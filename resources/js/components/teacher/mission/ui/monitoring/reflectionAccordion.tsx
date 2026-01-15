import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Reflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: 'initial' | 'final';
    group_name?: string;
}

interface ReflectionAccordionProps {
    reflections: Reflection[];
}

export function ReflectionAccordion({ reflections }: ReflectionAccordionProps) {
    const [expandedSection, setExpandedSection] = useState<
        'initial' | 'final' | null
    >('initial');

    const initialReflections = reflections
        .filter((r) => r.type === 'initial')
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );

    const finalReflections = reflections
        .filter((r) => r.type === 'final')
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );

    const toggleSection = (section: 'initial' | 'final') => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const renderReflectionList = (
        items: Reflection[],
        type: 'initial' | 'final',
    ) => {
        if (items.length === 0) {
            return (
                <div className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Belum ada refleksi{' '}
                        {type === 'initial' ? 'awal' : 'akhir'}
                    </p>
                </div>
            );
        }

        return (
            <div className="max-h-[400px] space-y-3 overflow-y-auto p-4">
                {items.map((reflection, index) => (
                    <div
                        key={`${reflection.user_id}-${reflection.type}-${index}`}
                        className={cn(
                            'rounded-xl border p-3 transition-all hover:shadow-md',
                            type === 'initial'
                                ? 'border-green-200 bg-green-50'
                                : 'border-blue-200 bg-blue-50',
                        )}
                    >
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full font-bold text-white shadow-sm',
                                        type === 'initial'
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
                                            type === 'initial'
                                                ? 'text-green-900'
                                                : 'text-blue-900',
                                        )}
                                    >
                                        {reflection.user_name}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs',
                                            type === 'initial'
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
                        </div>
                        <p
                            className={cn(
                                'text-sm',
                                type === 'initial'
                                    ? 'text-green-800'
                                    : 'text-blue-800',
                            )}
                        >
                            {reflection.content}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    if (reflections.length === 0) {
        return (
            <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg">
                <div className="border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">
                            💬 Refleksi Siswa
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">
                            💬 Refleksi Siswa
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                        {reflections.length} total refleksi
                    </p>
                </div>
            </div>

            {/* Accordion Items */}
            <div>
                {/* Initial Reflections Accordion */}
                <div className="border-b border-slate-200">
                    <button
                        onClick={() => toggleSection('initial')}
                        className="flex w-full items-center justify-between bg-green-50 px-4 py-3 transition-colors hover:bg-green-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md">
                                <span className="text-lg font-bold">
                                    {initialReflections.length}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-green-900">
                                    Refleksi Awal
                                </p>
                                <p className="text-xs text-green-600">
                                    Pemikiran awal siswa tentang masalah
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                'h-5 w-5 text-green-700 transition-transform',
                                expandedSection === 'initial' && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedSection === 'initial' && (
                        <div className="bg-white">
                            {renderReflectionList(
                                initialReflections,
                                'initial',
                            )}
                        </div>
                    )}
                </div>

                {/* Final Reflections Accordion */}
                <div>
                    <button
                        onClick={() => toggleSection('final')}
                        className="flex w-full items-center justify-between bg-blue-50 px-4 py-3 transition-colors hover:bg-blue-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
                                <span className="text-lg font-bold">
                                    {finalReflections.length}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-blue-900">
                                    Refleksi Akhir
                                </p>
                                <p className="text-xs text-blue-600">
                                    Pembelajaran & kesimpulan siswa
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                'h-5 w-5 text-blue-700 transition-transform',
                                expandedSection === 'final' && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedSection === 'final' && (
                        <div className="bg-white">
                            {renderReflectionList(finalReflections, 'final')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
