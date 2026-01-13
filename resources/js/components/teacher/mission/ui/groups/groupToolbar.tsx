import { cn } from '@/lib/utils';
import { Plus, RotateCcw, Shuffle } from 'lucide-react';

interface GroupToolbarProps {
    groupCount: number;
    onGroupCountChange: (count: number) => void;
    onShuffle: () => void;
    onReset: () => void;
    onAddGroup: () => void;
    hasGroups: boolean;
    isMobile?: boolean;
}

export function GroupToolbar({
    groupCount,
    onGroupCountChange,
    onShuffle,
    onReset,
    onAddGroup,
    hasGroups,
    isMobile = false,
}: GroupToolbarProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3',
                isMobile ? 'flex-col' : 'flex-row flex-wrap',
            )}
        >
            {/* Group Count Input */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="group-count"
                    className="text-sm font-semibold text-slate-700"
                >
                    Jumlah Kelompok:
                </label>
                <input
                    id="group-count"
                    type="number"
                    min="1"
                    max="20"
                    value={groupCount}
                    onChange={(e) =>
                        onGroupCountChange(
                            Math.max(
                                1,
                                Math.min(20, parseInt(e.target.value, 10) || 1),
                            ),
                        )
                    }
                    className={cn(
                        'rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-center font-bold text-slate-800 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none',
                        isMobile ? 'w-20' : 'w-16',
                    )}
                />
            </div>

            {/* Shuffle Button */}
            <button
                type="button"
                onClick={onShuffle}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
            >
                <Shuffle className="h-4 w-4" />
                <span>Acak Otomatis</span>
            </button>

            {/* Reset Button */}
            {hasGroups && (
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-50 hover:shadow-md"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Kelompok</span>
                </button>
            )}

            {/* Add Group Button */}
            <button
                type="button"
                onClick={onAddGroup}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-50 hover:shadow-md"
            >
                <Plus className="h-4 w-4" />
                <span>Tambah Kelompok</span>
            </button>
        </div>
    );
}
