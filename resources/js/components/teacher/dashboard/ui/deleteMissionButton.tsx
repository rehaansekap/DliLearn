import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface DeleteMissionButtonProps {
    onClick: () => void;
    className?: string;
}

export function DeleteMissionButton({
    onClick,
    className,
}: DeleteMissionButtonProps) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className={cn(
                'rounded-xl border-2 border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50',
                className,
            )}
            title="Hapus misi"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
