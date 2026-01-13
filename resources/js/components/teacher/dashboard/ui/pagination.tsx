import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <p className="text-sm text-slate-600">
                Menampilkan{' '}
                <span className="font-bold text-slate-800">
                    {totalItems === 0 ? 0 : startIndex + 1} – {endIndex}
                </span>{' '}
                dari{' '}
                <span className="font-bold text-slate-800">{totalItems}</span>{' '}
                misi
            </p>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="text-sm">←</span>
                    <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers (Desktop) */}
                <div className="hidden items-center gap-1 sm:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    'rounded-md px-3 py-1 text-sm font-medium transition',
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50',
                                )}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                {/* Mobile Page Indicator */}
                <div className="px-2 text-sm text-slate-500 sm:hidden">
                    {currentPage} / {totalPages}
                </div>

                {/* Next Button */}
                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="text-sm">→</span>
                </button>
            </div>
        </div>
    );
}
