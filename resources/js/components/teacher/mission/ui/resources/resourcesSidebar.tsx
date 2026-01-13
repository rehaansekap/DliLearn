import { ResourcesTipsCard } from './resourcesTipsCard';

const MATERIAL_TIPS = [
    { text: 'Gunakan contoh kasus nyata yang relevan' },
    { text: 'Sertakan diagram / flowchart untuk logika' },
    { text: 'Berikan pseudocode sebagai panduan' },
    { text: 'Hindari terlalu banyak teks, fokus visual' },
];

export function ResourcesSidebar() {
    return (
        <div className="sticky top-6 space-y-4">
            {/* Tips Card */}
            <ResourcesTipsCard
                title="Format Materi Efektif:"
                tips={MATERIAL_TIPS}
            />
        </div>
    );
}
