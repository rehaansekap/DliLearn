import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SubmissionHeaderProps {
    groupName: string;
    groupCode: string | null;
    submittedAt: string | null;
    hasSubmission: boolean;
    onClose: () => void;
    isMobile?: boolean;
}

export function SubmissionHeader({
    groupName,
    groupCode,
    submittedAt,
    hasSubmission,
    onClose,
    isMobile = false,
}: SubmissionHeaderProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500',
                isMobile ? 'p-4' : 'p-6',
            )}
        >
            <div>
                <h3
                    className={cn(
                        'font-bold text-white',
                        isMobile ? 'text-lg' : 'text-xl',
                    )}
                >
                    {groupName}
                </h3>
                <p
                    className={cn(
                        'text-indigo-100',
                        isMobile ? 'text-xs' : 'text-sm',
                    )}
                >
                    {groupCode || 'No Code'}
                </p>
                {!hasSubmission ? (
                    <div
                        className={cn(
                            'mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 font-semibold text-white/90',
                            isMobile
                                ? 'px-2 py-0.5 text-[10px]'
                                : 'px-3 py-1 text-xs',
                        )}
                    >
                        <span>⌛</span>
                        <span>Belum Dikumpulkan</span>
                    </div>
                ) : (
                    submittedAt && (
                        <p
                            className={cn(
                                'mt-1 text-indigo-200',
                                isMobile ? 'text-[10px]' : 'text-xs',
                            )}
                        >
                            Dikumpulkan:{' '}
                            {new Date(submittedAt).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}
                        </p>
                    )
                )}
            </div>
            <button
                onClick={onClose}
                title="Tutup"
                aria-label="Tutup"
                className={cn(
                    'rounded-full bg-white/20 text-white transition hover:bg-white/30',
                    isMobile ? 'p-1.5' : 'p-2',
                )}
            >
                <X className={cn(isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                <span className="sr-only">Tutup</span>
            </button>
        </div>
    );
}
