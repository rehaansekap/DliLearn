import { cn } from '@/lib/utils';

interface DifficultyLevel {
    level: number;
    label: string;
    color: string;
    description: string;
}

interface DifficultyLevelSelectorProps {
    value: number;
    onChange: (level: number) => void;
    levels: DifficultyLevel[];
}

export function DifficultyLevelSelector({
    value,
    onChange,
    levels,
}: DifficultyLevelSelectorProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {levels.map(({ level, label, color, description }) => (
                <button
                    key={level}
                    type="button"
                    onClick={() => onChange(level)}
                    className={cn(
                        'group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all duration-200',
                        value === level
                            ? 'scale-105 border-transparent shadow-lg ring-2 ring-offset-2'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md',
                    )}
                >
                    <div
                        className={cn(
                            'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200',
                            color,
                            value === level
                                ? 'opacity-100'
                                : 'group-hover:opacity-10',
                        )}
                    />
                    <div className="relative">
                        <div className="mb-2 text-2xl">
                            {'⭐'.repeat(level)}
                        </div>
                        <p
                            className={cn(
                                'mb-1 font-bold transition-colors',
                                value === level
                                    ? 'text-white'
                                    : 'text-slate-700',
                            )}
                        >
                            {label}
                        </p>
                        <p
                            className={cn(
                                'text-xs transition-colors',
                                value === level
                                    ? 'text-white/90'
                                    : 'text-slate-500',
                            )}
                        >
                            {description}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
