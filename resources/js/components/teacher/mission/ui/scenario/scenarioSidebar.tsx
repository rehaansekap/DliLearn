import { ScenarioExampleCard } from './scenarioExampleCard';
import { ScenarioInfoCard } from './scenarioInfoCard';
import { ScenarioTipsCard } from './scenarioTipsCard';

const SCENARIO_TIPS = [
    { text: 'Gunakan konteks yang relevan dengan kehidupan siswa' },
    { text: 'Jelaskan masalah dengan jelas dan spesifik' },
    { text: 'Berikan hint tentang konsep coding yang akan digunakan' },
    { text: 'Buat narasi yang menarik dan memotivasi' },
];

const SCENARIO_EXAMPLE = {
    title: 'Narasi Kasus Efektif:',
    example:
        'Sebuah rumah sakit memiliki 3 ruang tunggu dengan kapasitas berbeda. Sistem antrean saat ini manual dan sering terjadi penumpukan. Buatlah program yang dapat mengatur distribusi pasien secara otomatis berdasarkan kondisi urgensi.',
    note: '✓ Konteks nyata, masalah jelas, ada constraint',
};

export function ScenarioSidebar() {
    return (
        <div className="sticky top-6 space-y-4">
            {/* Tips Card */}
            <ScenarioTipsCard
                title="Membuat Skenario PBL:"
                tips={SCENARIO_TIPS}
            />

            {/* Info Card */}
            <ScenarioInfoCard
                title="Catatan"
                icon="ℹ️"
                description="Video & Narasi adalah dua elemen kunci dalam Tahap 1 PBL (Orientasi Masalah). Pastikan keduanya saling melengkapi untuk memberikan gambaran yang jelas kepada siswa."
            />

            {/* Example Card */}
            <ScenarioExampleCard
                title={SCENARIO_EXAMPLE.title}
                example={SCENARIO_EXAMPLE.example}
                note={SCENARIO_EXAMPLE.note}
            />
        </div>
    );
}
