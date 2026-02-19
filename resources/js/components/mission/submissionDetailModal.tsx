import { cn } from '@/lib/utils';
import { FormEvent, useState } from 'react';

interface Feedback {
    id: number;
    user_name: string;
    group_name: string;
    message: string;
    created_at: string;
}

interface SubmissionDetailModalProps {
    isOpen: boolean;
    groupName: string;
    groupCode?: string;
    groupMembers?: Array<{ name: string; role: string }>;
    filePath: string;
    codeAnswer: string;
    feedbacks?: Feedback[];
    amILeader: boolean;
    onClose: () => void;
    onSubmitFeedback: (message: string) => void;
}

export function SubmissionDetailModal({
    isOpen,
    groupName,
    groupCode,
    groupMembers = [],
    filePath,
    codeAnswer,
    feedbacks = [],
    amILeader,
    onClose,
    onSubmitFeedback,
}: SubmissionDetailModalProps) {
    const [feedbackMessage, setFeedbackMessage] = useState('');

    if (!isOpen) return null;

    const resolveFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (feedbackMessage.trim().length >= 5) {
            onSubmitFeedback(feedbackMessage);
            setFeedbackMessage('');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {groupName}
                                </h3>
                                <p className="text-sm text-indigo-100">
                                    Detail Karya
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
                <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Group Info */}
                        <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                            <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                                <span>👥</span>
                                <span>Informasi Kelompok</span>
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Nama Kelompok:
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {groupName}
                                    </span>
                                </div>
                                {groupCode && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">
                                            Kode Kelompok:
                                        </span>
                                        <span className="font-mono text-sm font-bold text-indigo-600">
                                            {groupCode}
                                        </span>
                                    </div>
                                )}
                                {groupMembers.length > 0 && (
                                    <div className="mt-3 border-t border-indigo-200 pt-3">
                                        <p className="mb-2 text-sm font-medium text-slate-700">
                                            Anggota Kelompok:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {groupMembers.map((member, idx) => (
                                                <div
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs shadow-sm"
                                                >
                                                    <span className="font-medium text-slate-700">
                                                        {member.name}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        •
                                                    </span>
                                                    <span className="text-indigo-600">
                                                        {member.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* LKPD Submission Preview */}
                        <div>
                            <h4 className="mb-3 font-bold text-slate-800">
                                📊 LKPD
                            </h4>
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                {/\.(jpg|jpeg|png|gif)$/i.test(
                                    filePath || '',
                                ) ? (
                                    <img
                                        src={
                                            resolveFileUrl(filePath) ||
                                            undefined
                                        }
                                        alt="LKPD Submission"
                                        className="w-full"
                                    />
                                ) : /\.(pdf)$/i.test(filePath || '') ? (
                                    <div className="h-[480px] w-full">
                                        <object
                                            data={
                                                resolveFileUrl(filePath) ||
                                                undefined
                                            }
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        >
                                            <div className="p-6 text-center">
                                                <p className="mb-2 text-slate-700">
                                                    Tidak dapat menampilkan PDF.
                                                    Klik tautan di bawah untuk
                                                    mengunduh / membuka di tab
                                                    baru.
                                                </p>
                                                <a
                                                    href={
                                                        resolveFileUrl(
                                                            filePath,
                                                        ) || '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white"
                                                >
                                                    Buka PDF
                                                </a>
                                            </div>
                                        </object>
                                    </div>
                                ) : (
                                    <div className="bg-slate-100 p-4 text-center text-slate-600">
                                        <span className="text-4xl">📄</span>
                                        <p className="mt-2">File: {filePath}</p>
                                        <a
                                            href={
                                                resolveFileUrl(filePath) || '#'
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block text-sm text-indigo-600"
                                        >
                                            Buka file
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Source Code */}
                        <div>
                            <h4 className="mb-3 font-bold text-slate-800">
                                💻 Source Code
                            </h4>
                            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                                <pre className="overflow-x-auto p-6 text-sm text-green-400">
                                    {codeAnswer}
                                </pre>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div>
                            <h4 className="mb-3 font-bold text-slate-800">
                                💬 Feedback ({feedbacks?.length || 0})
                            </h4>

                            {/* Feedback List */}
                            <div className="mb-4 space-y-3">
                                {feedbacks?.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                                                {feedback.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {feedback.user_name} (
                                                    {feedback.group_name})
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(
                                                        feedback.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm break-words whitespace-pre-wrap text-slate-700">
                                            {feedback.message}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Feedback Form */}
                            {amILeader ? (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-3"
                                >
                                    <textarea
                                        value={feedbackMessage}
                                        onChange={(e) =>
                                            setFeedbackMessage(e.target.value)
                                        }
                                        placeholder="Berikan feedback konstruktif... (Min: 5 karakter)"
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={feedbackMessage.length < 5}
                                        className={cn(
                                            'w-full rounded-xl px-4 py-3 font-bold text-white transition-all duration-200',
                                            feedbackMessage.length < 5
                                                ? 'cursor-not-allowed bg-slate-300'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
                                        )}
                                    >
                                        📤 Kirim Feedback
                                    </button>
                                </form>
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                                    Hanya ketua kelompok yang dapat memberikan
                                    feedback.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
