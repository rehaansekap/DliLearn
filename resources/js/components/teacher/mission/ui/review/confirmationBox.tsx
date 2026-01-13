import { CheckCircle2 } from 'lucide-react';

export function ConfirmationBox() {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
            <div className="flex items-start gap-4 p-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-3xl shadow-md">
                    ✅
                </div>
                <div className="flex-1">
                    <h4 className="mb-2 text-lg font-bold text-emerald-900">
                        Siap untuk Disimpan!
                    </h4>
                    <p className="mb-3 text-sm leading-relaxed text-emerald-800">
                        Pastikan semua informasi sudah benar. Klik tombol
                        <strong> "Simpan Misi"</strong> di bawah untuk menyimpan
                        ke database. Anda masih bisa mengedit misi setelah
                        disimpan.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <ChecklistBadge>Info Dasar</ChecklistBadge>
                        <ChecklistBadge>Skenario PBL</ChecklistBadge>
                        <ChecklistBadge>Sumber Daya</ChecklistBadge>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChecklistBadge({ children }: { children: string }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            {children}
        </span>
    );
}
