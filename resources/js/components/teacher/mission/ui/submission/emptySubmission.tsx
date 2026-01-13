export function EmptySubmission() {
    return (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                <span className="text-2xl">📭</span>
            </div>
            <h4 className="mb-1 text-lg font-semibold text-slate-800">
                Belum Ada Submission
            </h4>
            <p className="text-sm text-slate-500">
                Ketua kelompok belum mengumpulkan tugas akhir untuk kelompok
                ini.
            </p>
        </div>
    );
}
