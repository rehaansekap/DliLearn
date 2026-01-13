import { CollaborationToolsCard } from './collaborationToolsCard';
import { ResourcesTipsCard } from './resourcesTipsCard';
import { ResourcesWarningCard } from './resourcesWarningCard';

const MATERIAL_TIPS = [
    { text: 'Gunakan contoh kasus nyata yang relevan' },
    { text: 'Sertakan diagram / flowchart untuk logika' },
    { text: 'Berikan pseudocode sebagai panduan' },
    { text: 'Hindari terlalu banyak teks, fokus visual' },
];

const COLLABORATION_TOOLS = [
    { name: 'FigJam', description: 'Whiteboard kolaboratif', icon: '🎨' },
    { name: 'Miro', description: 'Visual collaboration', icon: '📋' },
    { name: 'Google Jamboard', description: 'Gratis & mudah', icon: '📝' },
];

export function ResourcesSidebar() {
    return (
        <div className="sticky top-6 space-y-4">
            {/* Tips Card */}
            <ResourcesTipsCard
                title="Format Materi Efektif:"
                tips={MATERIAL_TIPS}
            />

            {/* Collaboration Tools Card */}
            <CollaborationToolsCard tools={COLLABORATION_TOOLS} />

            {/* Warning Card */}
            <ResourcesWarningCard
                title="Catatan Penting"
                message="Pastikan link kolaborasi dapat diakses oleh semua anggota tim. Siswa akan menggunakan link ini untuk berdiskusi dan merancang solusi bersama di Tahap 2."
            />
        </div>
    );
}
