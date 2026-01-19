import { ResourcesTipsCard } from './resourcesTipsCard';
import { ResourcesWarningCard } from './resourcesWarningCard';

const MATERIAL_TIPS = [
    { text: 'Gunakan contoh kasus nyata yang relevan' },
    { text: 'Sertakan diagram / flowchart untuk logika' },
    { text: 'Berikan pseudocode sebagai panduan' },
    { text: 'Hindari terlalu banyak teks, fokus visual' },
];

const LKPD_TIPS = [
    { text: 'LKPD harus terstruktur dengan jelas' },
    { text: 'Sertakan langkah-langkah pengerjaan' },
    { text: 'Tambahkan ruang untuk jawaban siswa' },
    { text: 'Gunakan bahasa yang mudah dipahami' },
];

export function ResourcesSidebar() {
    return (
        <div className="sticky top-6 space-y-4">
            {/* Tips Card - Materi */}
            <ResourcesTipsCard
                title="Format Materi Efektif:"
                tips={MATERIAL_TIPS}
            />

            {/* Tips Card - LKPD */}
            <ResourcesTipsCard title="Tips Membuat LKPD:" tips={LKPD_TIPS} />

            {/* Warning Card */}
            <ResourcesWarningCard
                title="Catatan Penting"
                message="Pastikan file PDF dapat dibuka dengan baik. File yang corrupt tidak akan bisa ditampilkan kepada siswa."
            />
        </div>
    );
}
