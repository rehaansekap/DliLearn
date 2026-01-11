import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';

interface GroupMember {
    id: number;
    name: string;
    avatar?: string | null;
}

interface Submission {
    group_id: number;
    group_name: string;
    group_code: string | null;
    members: GroupMember[];
    file_path: string | null;
    code_answer: string | null;
    submitted_at: string | null;
}

interface SubmissionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission | null;
}

export function SubmissionDetailModal({
    isOpen,
    onClose,
    submission,
}: SubmissionDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'code' | 'grade'>('code');

    if (!isOpen || !submission) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {submission.group_name}
                        </h3>
                        <p className="text-sm text-indigo-100">
                            {submission.group_code || 'No Code'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close submission detail modal"
                        title="Close"
                        className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            'flex-1 px-6 py-3 text-sm font-semibold transition',
                            activeTab === 'code'
                                ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-100',
                        )}
                    >
                        📄 Submission
                    </button>
                    <button
                        onClick={() => setActiveTab('grade')}
                        className={cn(
                            'flex-1 px-6 py-3 text-sm font-semibold transition',
                            activeTab === 'grade'
                                ? 'border-b-2 border-indigo-500 bg-white text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-100',
                        )}
                    >
                        ⭐ Penilaian
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
                    {activeTab === 'code' && (
                        <div className="space-y-6">
                            {/* Members */}
                            <div>
                                <h4 className="mb-3 text-sm font-bold text-slate-700">
                                    👥 Anggota Kelompok
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {submission.members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
                                                {member.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                {member.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flowchart/File */}
                            {submission.file_path && (
                                <div>
                                    <h4 className="mb-3 text-sm font-bold text-slate-700">
                                        📊 Flowchart / Dokumen
                                    </h4>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                        {submission.file_path.endsWith(
                                            '.pdf',
                                        ) ? (
                                            <div className="flex items-center gap-3 p-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500 text-white">
                                                    <span className="text-xl">
                                                        📄
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-700">
                                                        PDF Document
                                                    </p>
                                                    <a
                                                        href={`/storage/${submission.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-indigo-600 hover:underline"
                                                    >
                                                        Buka di Tab Baru →
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={`/storage/${submission.file_path}`}
                                                alt="Flowchart"
                                                className="w-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Code Answer */}
                            {submission.code_answer && (
                                <div>
                                    <h4 className="mb-3 text-sm font-bold text-slate-700">
                                        💻 Source Code
                                    </h4>
                                    <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-900">
                                        <div className="border-b border-slate-700 bg-slate-800 px-4 py-2">
                                            <span className="text-xs font-medium text-slate-300">
                                                Code
                                            </span>
                                        </div>
                                        <pre className="overflow-x-auto p-4 text-sm text-green-400">
                                            {submission.code_answer}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Submission Date */}
                            {submission.submitted_at && (
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-600">
                                        <span className="font-semibold">
                                            Dikumpulkan pada:
                                        </span>{' '}
                                        {new Date(
                                            submission.submitted_at,
                                        ).toLocaleString('id-ID', {
                                            dateStyle: 'long',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'grade' && (
                        <div className="space-y-6">
                            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-200">
                                    <span className="text-3xl">🚧</span>
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-amber-900">
                                    Fitur Penilaian Segera Hadir
                                </h4>
                                <p className="text-sm text-amber-700">
                                    Anda akan bisa memberikan nilai dan feedback
                                    detail di sini.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-3 font-semibold text-white transition hover:from-slate-700 hover:to-slate-800"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
