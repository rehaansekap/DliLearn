import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: string) => void;
}

export function InputModal({ isOpen, onClose, onSubmit }: InputModalProps) {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    };

    const handleSkip = () => {
        onSubmit('');
        setInputValue('');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⌨️</span>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Input untuk Program
                                </h3>
                                <p className="text-sm text-blue-100">
                                    Masukkan input jika program membutuhkannya
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Info Box */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">💡</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Tips Input:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-xs text-blue-700">
                                        <li>
                                            • Jika program butuh{' '}
                                            <code className="rounded bg-blue-100 px-1 font-mono">
                                                cin
                                            </code>
                                            , masukkan input di sini
                                        </li>
                                        <li>
                                            • Setiap baris = 1 input (tekan
                                            Enter untuk baris baru)
                                        </li>
                                        <li>
                                            • Kosongkan jika tidak butuh input
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Input Field */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                📝 Masukkan Input (stdin):
                            </label>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Contoh:&#10;5&#10;10&#10;15"
                                rows={6}
                                className={cn(
                                    'w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-700 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none',
                                )}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                {inputValue.length} karakter •{' '}
                                {inputValue.split('\n').length} baris
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50"
                            >
                                Jalankan Tanpa Input
                            </button>
                            <button
                                type="submit"
                                className={cn(
                                    'flex-1 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all duration-200',
                                    'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl active:scale-[0.98]',
                                )}
                            >
                                ▶️ Run dengan Input Ini
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
