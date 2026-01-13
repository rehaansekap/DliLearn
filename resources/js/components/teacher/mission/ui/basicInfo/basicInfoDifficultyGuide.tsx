interface DifficultyGuideItem {
    level: number;
    label: string;
    description: string;
    examples: string[];
}

interface BasicInfoDifficultyGuideProps {
    levels: DifficultyGuideItem[];
}

export function BasicInfoDifficultyGuide({
    levels,
}: BasicInfoDifficultyGuideProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
            <div className="border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="font-bold text-white">
                        Panduan Tingkat Kesulitan
                    </h3>
                </div>
            </div>
            <div className="space-y-3 p-4">
                {levels.map((level) => (
                    <div
                        key={level.level}
                        className="rounded-lg border border-purple-200 bg-white/50 p-3"
                    >
                        <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-900">
                                Level {level.level}: {level.label}
                            </span>
                        </div>
                        <p className="mb-2 text-xs text-purple-700">
                            {level.description}
                        </p>
                        <div className="space-y-1">
                            {level.examples.map((example, idx) => (
                                <p
                                    key={idx}
                                    className="text-xs text-purple-600 italic"
                                >
                                    • {example}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
