interface TerminalProps {
    output: string;
    title?: string;
}

export function Terminal({ output, title = 'Terminal Output' }: TerminalProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
                <span className="text-xl">🖥️</span>
                <span className="text-xs font-medium text-slate-300 sm:text-sm">
                    {title}
                </span>
            </div>
            <div className="p-4 sm:p-6">
                {output ? (
                    <pre className="overflow-x-auto text-xs text-green-400 sm:text-sm">
                        {output}
                    </pre>
                ) : (
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Output akan muncul di sini setelah kamu menjalankan
                        kode...
                    </p>
                )}
            </div>
        </div>
    );
}
