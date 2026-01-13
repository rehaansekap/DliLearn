interface ScenarioExampleCardProps {
    title?: string;
    example: string;
    note?: string;
}

export function ScenarioExampleCard({
    title = 'Narasi Kasus Efektif:',
    example,
    note,
}: ScenarioExampleCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
            <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h3 className="font-bold text-white">Contoh Bagus</h3>
                </div>
            </div>
            <div className="p-4">
                <p className="mb-2 text-xs font-semibold text-indigo-900">
                    {title}
                </p>
                <div className="rounded-lg bg-white p-3 text-xs text-slate-700">
                    <p className="italic">{example}</p>
                </div>
                {note && <p className="mt-2 text-xs text-indigo-700">{note}</p>}
            </div>
        </div>
    );
}
