export function EmptyGalleryState() {
    return (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:rounded-2xl sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                <span className="text-3xl">📭</span>
            </div>
            <h4 className="mb-2 text-lg font-bold text-slate-700">
                Belum Ada Karya
            </h4>
            <p className="text-sm text-slate-500">
                Jadilah yang pertama menyelesaikan misi ini!
            </p>
        </div>
    );
}
