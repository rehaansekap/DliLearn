import { cn } from '@/lib/utils';
import { ExternalLink, Link2 } from 'lucide-react';

interface CollabUrlInputProps {
    value: string | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    isMobile?: boolean;
}

export function CollabUrlInput({
    value,
    onChange,
    placeholder = 'https://miro.com/app/board/...',
    isMobile = false,
}: CollabUrlInputProps) {
    return (
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <label
                className={cn(
                    'mb-2 flex items-center gap-2 font-semibold text-slate-700',
                    isMobile ? 'text-xs' : 'text-sm',
                )}
            >
                <Link2 className="h-4 w-4 text-indigo-600" />
                <span>Link Kolaborasi</span>
            </label>
            <div className="relative">
                <input
                    type="url"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        'w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 pr-10 text-slate-700 transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                        isMobile ? 'text-xs' : 'text-sm',
                    )}
                />
                {value && (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                        title="Buka link di tab baru"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>
            {value && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Link tersimpan
                </p>
            )}
        </div>
    );
}
