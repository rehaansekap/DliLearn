import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { ErrorSummary } from './errorSummary';

interface FormNavigationButtonsProps {
    currentStep: number;
    totalSteps: number;
    errors: Record<string, string>;
    processing: boolean;
    isSubmitting: boolean;
    onBack: () => void;
    onNext: () => void;
    isEdit?: boolean;
}

export function FormNavigationButtons({
    currentStep,
    totalSteps,
    errors,
    processing,
    isSubmitting,
    onBack,
    onNext,
    isEdit = false,
}: FormNavigationButtonsProps) {
    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    return (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                disabled={isFirstStep}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Kembali</span>
            </button>

            {/* Right Side: Error Summary + Action Button */}
            <div className="flex items-center gap-3">
                {/* Error Summary */}
                <ErrorSummary errors={errors} />

                {/* Next or Submit Button */}
                {!isLastStep ? (
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span>Lanjutkan</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        data-intent="submit-mission"
                        disabled={processing || isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing || isSubmitting ? (
                            <>
                                <LoadingSpinner />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>
                                    {isEdit ? 'Perbarui Misi' : 'Simpan Misi'}
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// Loading Spinner Component
function LoadingSpinner() {
    return (
        <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
