import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
    level: number;
    label: string;
}

const difficultyColors: Record<
    number,
    { bg: string; text: string; border: string }
> = {
    1: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-300',
    },
    2: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-300',
    },
    3: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
    },
    4: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-300',
    },
    5: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
};

export function DifficultyBadge({ level, label }: DifficultyBadgeProps) {
    const colors = difficultyColors[level] || difficultyColors[1];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1 text-sm font-bold shadow-sm',
                colors.bg,
                colors.text,
                colors.border,
            )}
        >
            <span>⭐</span>
            <span>
                Level {level} - {label}
            </span>
        </span>
    );
}
