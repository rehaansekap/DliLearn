import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteMissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    mission: {
        id: number;
        title: string;
        slug: string;
    };
    isMobile?: boolean;
    redirectTo?: string;
}

export function DeleteMissionModal({
    isOpen,
    onClose,
    mission,
    isMobile = false,
    redirectTo = '/teacher/dashboard',
}: DeleteMissionModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const isConfirmValid =
        confirmText.toLowerCase() === mission.title.toLowerCase();

    const handleDelete = () => {
        if (!isConfirmValid) return;
        setIsDeleting(true);
        router.delete(`/teacher/mission/${mission.id}`, {
            onSuccess: async () => {
                setIsDeleting(false);
                onClose();
                const SwalModule = await import('sweetalert2');
                await import('sweetalert2/dist/sweetalert2.min.css');
                await SwalModule.default.fire({
                    icon: 'success',
                    title: 'Misi Berhasil Dihapus!',
                    text: `"${mission.title}" telah dihapus dari sistem.`,
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-xl',
                        title: 'font-bold',
                    },
                });
                router.visit(redirectTo);
            },
            onError: async (errors) => {
                setIsDeleting(false);
                onClose();

                const SwalModule = await import('sweetalert2');
                await import('sweetalert2/dist/sweetalert2.min.css');

                const errorMessage =
                    (errors && (errors.message || errors.error)) ||
                    'Terjadi kesalahan saat menghapus misi. Silakan coba lagi.';

                await SwalModule.default.fire({
                    icon: 'error',
                    title: 'Gagal Menghapus Misi',
                    text: errorMessage,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-xl',
                        title: 'font-bold',
                        confirmButton:
                            'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700',
                    },
                });
            },
        });
    };

    const handleClose = () => {
        if (isDeleting) return;
        setConfirmText('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className={cn(
                    'gap-0 overflow-hidden border-2 border-rose-200 bg-white p-0',
                    isMobile ? 'max-w-[95vw]' : 'max-w-lg',
                )}
            >
                {/* Header with Icon */}
                <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">
                                Hapus Misi Pembelajaran?
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm text-rose-100">
                                Tindakan ini tidak dapat dibatalkan
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-4 p-6">
                    {/* Warning Message */}
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-medium text-amber-900">
                            ⚠️ Data yang akan dihapus:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-amber-800">
                            <li>• Semua kelompok & anggota</li>
                            <li>• Progress & refleksi siswa</li>
                            <li>• Submission & feedback</li>
                            <li>• Nilai & kehadiran</li>
                            <li>• File materi (PDF)</li>
                        </ul>
                    </div>

                    {/* Mission Info */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-medium text-slate-500">
                            Misi yang akan dihapus:
                        </p>
                        <p className="font-bold text-slate-900">
                            {mission.title}
                        </p>
                    </div>

                    {/* Confirmation Input */}
                    <div>
                        <label
                            htmlFor="confirm-delete"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Ketik judul misi untuk konfirmasi:
                        </label>
                        <input
                            id="confirm-delete"
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={mission.title}
                            disabled={isDeleting}
                            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm text-slate-900 transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                        {confirmText && !isConfirmValid && (
                            <p className="mt-1 text-xs text-rose-600">
                                Teks tidak cocok dengan judul misi
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="gap-2 border-t border-slate-200 bg-slate-50 p-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 border-2 border-rose-200 bg-white text-slate-700 hover:bg-rose-100 hover:text-slate-900 sm:flex-none"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isDeleting}
                        className={cn(
                            'flex-1 bg-gradient-to-r from-rose-500 to-red-600 font-semibold text-white shadow-lg transition-all hover:from-rose-600 hover:to-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none',
                        )}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Misi
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
