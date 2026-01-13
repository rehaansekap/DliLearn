import { AlertCircle } from 'lucide-react';

interface ErrorSummaryProps {
    errors: Record<string, string>;
}

export function ErrorSummary({ errors }: ErrorSummaryProps) {
    const errorCount = Object.keys(errors).length;

    if (errorCount === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
                Ada {errorCount} error{errorCount > 1 ? 's' : ''}
            </span>
        </div>
    );
}
