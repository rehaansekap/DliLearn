import { ArrowRight } from 'lucide-react';

interface TipItem {
    text: string;
}

interface BasicInfoTipsCardProps {
    title?: string;
    tips: TipItem[];
}

export function BasicInfoTipsCard({
    title = 'Membuat Judul & Deskripsi Efektif:',
    tips,
}: BasicInfoTipsCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
            <div className="border-b border-blue-200 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <h3 className="font-bold text-white">Tips Efektif</h3>
                </div>
            </div>
            <div className="space-y-3 p-4">
                <h4 className="font-semibold text-blue-900">{title}</h4>
                <ul className="space-y-2">
                    {tips.map((tip, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-blue-800"
                        >
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                            <span>{tip.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
