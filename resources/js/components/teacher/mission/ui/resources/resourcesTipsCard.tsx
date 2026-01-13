import { ArrowRight } from 'lucide-react';

interface TipItem {
    text: string;
}

interface ResourcesTipsCardProps {
    title?: string;
    tips: TipItem[];
}

export function ResourcesTipsCard({
    title = 'Format Materi Efektif:',
    tips,
}: ResourcesTipsCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
            <div className="border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <h3 className="font-bold text-white">Tips Materi</h3>
                </div>
            </div>
            <div className="space-y-3 p-4">
                <h4 className="font-semibold text-indigo-900">{title}</h4>
                <ul className="space-y-2">
                    {tips.map((tip, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-indigo-800"
                        >
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                            <span>{tip.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
