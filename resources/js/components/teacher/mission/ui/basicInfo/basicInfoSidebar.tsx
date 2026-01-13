import { BasicInfoDifficultyGuide } from './basicInfoDifficultyGuide';
import { BasicInfoTipsCard } from './basicInfoTipsCard';
import { BasicInfoWarningCard } from './basicInfoWarningCard';

const BASIC_INFO_TIPS = [
    { text: 'Gunakan judul yang jelas dan mencerminkan tujuan pembelajaran' },
    { text: 'Deskripsi singkat namun informatif (maks 500 karakter)' },
    { text: 'Pilih tingkat kesulitan sesuai dengan kemampuan siswa' },
    { text: 'Atur jadwal yang realistis untuk penyelesaian misi' },
];

const DIFFICULTY_GUIDE = [
    {
        level: 1,
        label: 'Pemula',
        description: 'Untuk siswa yang baru belajar konsep dasar',
        examples: [
            'Variable & tipe data',
            'Input/output sederhana',
            'Operasi aritmatika dasar',
        ],
    },
    {
        level: 2,
        label: 'Menengah',
        description: 'Membutuhkan pemahaman struktur kontrol',
        examples: [
            'Kondisional (if-else)',
            'Perulangan (for, while)',
            'Array sederhana',
        ],
    },
    {
        level: 3,
        label: 'Mahir',
        description: 'Menggunakan konsep yang lebih kompleks',
        examples: ['Fungsi & prosedur', 'Array 2D', 'String manipulation'],
    },
    {
        level: 4,
        label: 'Expert',
        description: 'Untuk siswa yang sudah berpengalaman',
        examples: ['Rekursi', 'Sorting & searching', 'File handling'],
    },
    {
        level: 5,
        label: 'Master',
        description: 'Tantangan tingkat tertinggi',
        examples: [
            'Algoritma kompleks',
            'Struktur data lanjutan',
            'Dynamic programming',
        ],
    },
];

export function BasicInfoSidebar() {
    return (
        <div className="sticky top-6 space-y-4">
            {/* Tips Card */}
            <BasicInfoTipsCard
                title="Membuat Judul & Deskripsi Efektif:"
                tips={BASIC_INFO_TIPS}
            />

            {/* Difficulty Guide */}
            <BasicInfoDifficultyGuide levels={DIFFICULTY_GUIDE} />

            {/* Warning Card */}
            <BasicInfoWarningCard
                title="Catatan Penting"
                message="Pilih kelas dan tingkat kesulitan dengan cermat. Informasi ini akan mempengaruhi pengalaman belajar siswa dan tidak bisa diubah setelah misi dimulai oleh siswa."
            />
        </div>
    );
}
