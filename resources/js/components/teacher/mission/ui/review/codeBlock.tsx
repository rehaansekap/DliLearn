import { Code2 } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    filename?: string;
}

export function CodeBlock({
    code,
    filename = 'simulator-config.json',
}: CodeBlockProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-700 shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
                <Code2 className="h-4 w-4 text-green-400" />
                <span className="text-xs font-semibold text-slate-300">
                    {filename}
                </span>
            </div>
            <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-xs text-green-400">
                {code || '{}'}
            </pre>
        </div>
    );
}
