import { cn } from '@/lib/utils';
import { Code2 } from 'lucide-react';

interface CodeViewerProps {
    code: string | null;
    isMobile?: boolean;
}

export function CodeViewer({ code, isMobile = false }: CodeViewerProps) {
    if (!code) {
        return (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <Code2 className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Tidak ada kode</p>
            </div>
        );
    }

    return (
        <div>
            <h4
                className={cn(
                    'mb-3 font-bold text-slate-700',
                    isMobile ? 'text-xs' : 'text-sm',
                )}
            >
                💻 Source Code
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-900">
                <div className="border-b border-slate-700 bg-slate-800 px-4 py-2">
                    <span className="text-xs font-medium text-slate-300">
                        Code
                    </span>
                </div>
                <pre className="overflow-x-auto p-4 text-sm text-green-400">
                    {code}
                </pre>
            </div>
        </div>
    );
}
