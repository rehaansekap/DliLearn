import StudentLayout from '@/layouts/student-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Show({
    auth,
    mission,
    currentStep,
    unlockedStep,
    groupMembers,
    currentUserRole,
    lkpdUrl,
}) {
    const [activeTab, setActiveTab] = useState(currentStep);
    const collaborationLink = mission.collab_url;

    const { data, setData, post, processing } = useForm({ reflection: '' });
    const isButtonEnabled = data.reflection.length > 10;

    const handleSubmitReflection = (e) => {
        e.preventDefault();
        post(route('mission.reflection', mission.slug), {
            onSuccess: () => setActiveTab(2),
        });
    };

    const handleRoleChange = (userId, newRole) => {
        router.post(
            route('mission.update-role', mission.slug),
            {
                target_user_id: userId,
                role: newRole,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
            },
        );
    };

    const handleCompleteStep2 = () => {
        router.post(
            route('mission.complete-step-2', mission.slug),
            {},
            {
                onSuccess: () => setActiveTab(3),
            },
        );
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const amILeader = currentUserRole === 'Ketua';

    return (
        <StudentLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        {mission.title}
                    </h2>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        Level {mission.difficulty_level}
                    </span>
                </div>
            }
            fullWidth={true}
        >
            <Head title={mission.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="w-full md:w-1/4">
                            <div className="sticky top-4 overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                                <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-700 uppercase">
                                    Langkah Misi
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        {
                                            step: 1,
                                            label: '1. Orientasi Masalah',
                                        },
                                        { step: 2, label: '2. Organisasi Tim' },
                                        { step: 3, label: '3. Penyelidikan' },
                                        {
                                            step: 4,
                                            label: '4. Penyajian Hasil',
                                        },
                                        { step: 5, label: '5. Evaluasi' },
                                    ].map((item) => (
                                        <button
                                            key={item.step}
                                            onClick={() =>
                                                item.step <= unlockedStep &&
                                                setActiveTab(item.step)
                                            }
                                            className={`flex w-full items-center justify-between rounded-md p-3 text-left text-sm font-medium transition-colors ${
                                                activeTab === item.step
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : item.step > unlockedStep
                                                      ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                                                      : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                            disabled={item.step > unlockedStep}
                                        >
                                            {item.label}
                                            {item.step > unlockedStep && (
                                                <span>🔒</span>
                                            )}
                                            {item.step < currentStep &&
                                                item.step !== activeTab && (
                                                    <span>✅</span>
                                                )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-3/4">
                            <div className="min-h-[500px] overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                                {activeTab === 1 && (
                                    <div className="animate-fade-in">
                                        <div className="mb-6 border-b pb-4">
                                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800 uppercase">
                                                Tahap 1
                                            </span>
                                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                                Orientasi Masalah
                                            </h1>
                                        </div>
                                        {mission.video_url && (
                                            <div className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                                                <iframe
                                                    className="h-80 w-full md:h-96"
                                                    src={getEmbedUrl(
                                                        mission.video_url,
                                                    )}
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        )}
                                        <div className="prose mb-8 max-w-none rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-gray-800">
                                            <h3 className="mb-2 text-lg font-bold">
                                                📜 Cerita Kasus
                                            </h3>
                                            <p className="whitespace-pre-line">
                                                {mission.case_narrative}
                                            </p>
                                        </div>
                                        {unlockedStep > 1 ? (
                                            <div className="rounded border border-green-200 bg-green-50 p-4 text-green-800">
                                                ✅ Kamu sudah menyelesaikan
                                                tahap ini. Silakan lanjut ke
                                                Tahap 2.
                                            </div>
                                        ) : (
                                            <form
                                                onSubmit={
                                                    handleSubmitReflection
                                                }
                                                className="mt-8 border-t pt-6"
                                            >
                                                <label className="mb-2 block font-medium text-gray-700">
                                                    Refleksi Awal:
                                                </label>
                                                <textarea
                                                    className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    rows="3"
                                                    value={data.reflection}
                                                    onChange={(e) =>
                                                        setData(
                                                            'reflection',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Apa inti masalahnya?"
                                                ></textarea>
                                                <div className="text-right">
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            !isButtonEnabled ||
                                                            processing
                                                        }
                                                        className={`rounded px-6 py-2 font-bold ${isButtonEnabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500'}`}
                                                    >
                                                        {processing
                                                            ? 'Menyimpan...'
                                                            : 'Selesai & Lanjut →'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {activeTab === 2 && (
                                    <div className="animate-fade-in">
                                        <div className="mb-6 border-b pb-4">
                                            <span className="rounded bg-purple-100 px-2 py-1 text-xs font-bold text-purple-800 uppercase">
                                                Tahap 2
                                            </span>
                                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                                Organisasi & Pembagian Tugas
                                            </h1>
                                            <p className="mt-1 text-gray-500">
                                                {amILeader
                                                    ? 'Sebagai KETUA, tentukan peran anggotamu agar kerja tim efektif.'
                                                    : 'Lihat pembagian tugasmu. Hanya Ketua yang bisa mengubah peran.'}
                                            </p>
                                        </div>

                                        <div className="mb-8 flex items-center justify-between rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-purple-900">
                                                    📄 Lembar Kerja (LKPD)
                                                </h3>
                                                <p className="text-sm text-purple-700">
                                                    Unduh template ini untuk
                                                    mulai bekerja.
                                                </p>
                                            </div>
                                            <a
                                                href={lkpdUrl}
                                                target="_blank"
                                                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-purple-700"
                                            >
                                                <span>⬇️ Download PDF</span>
                                            </a>
                                        </div>

                                        <div className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
                                            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
                                                <h3 className="font-bold text-gray-700">
                                                    Pembagian Peran Anggota
                                                </h3>
                                                {amILeader && (
                                                    <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
                                                        Mode Edit: ON
                                                    </span>
                                                )}
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {groupMembers.map((member) => (
                                                    <div
                                                        key={member.user_id}
                                                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${member.role === 'Ketua' ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 text-indigo-600'}`}
                                                            >
                                                                {member.role ===
                                                                'Ketua'
                                                                    ? '👑'
                                                                    : member.name.charAt(
                                                                          0,
                                                                      )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">
                                                                    {
                                                                        member.name
                                                                    }
                                                                    {member.role ===
                                                                        'Ketua' && (
                                                                        <span className="ml-2 rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                                                                            Ketua
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    @
                                                                    {
                                                                        member.username
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {member.role ===
                                                            'Ketua' ? (
                                                                <div className="rounded border border-transparent bg-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                                                                    Ketua
                                                                    (Tetap)
                                                                </div>
                                                            ) : (
                                                                <select
                                                                    className={`rounded-md border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                        !amILeader
                                                                            ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                                                                            : ''
                                                                    }`}
                                                                    value={
                                                                        member.role ||
                                                                        'Member'
                                                                    }
                                                                    disabled={
                                                                        !amILeader
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleRoleChange(
                                                                            member.user_id,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="Coder">
                                                                        💻 Coder
                                                                    </option>
                                                                    <option value="Designer">
                                                                        🎨
                                                                        Designer
                                                                    </option>
                                                                    <option value="Writer">
                                                                        📝
                                                                        Notulis
                                                                    </option>
                                                                    <option value="Member">
                                                                        👤
                                                                        Anggota
                                                                    </option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                                            <div className="mb-3 rounded-full bg-purple-50 p-4">
                                                <span className="text-4xl">
                                                    🤝
                                                </span>
                                            </div>
                                            <h4 className="mb-1 text-lg font-bold text-gray-800">
                                                Ruang Kolaborasi
                                            </h4>
                                            <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-500">
                                                Klik tombol di bawah untuk masuk
                                                ke papan tulis kolaborasi tim.
                                                <br />
                                                <span className="text-xs text-purple-600 italic">
                                                    Pastikan sudah login atau
                                                    gunakan akses tamu di tab
                                                    baru.
                                                </span>
                                            </p>

                                            {collaborationLink ? (
                                                <a
                                                    href={collaborationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex transform items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
                                                >
                                                    <span>
                                                        🚀 Buka Papan Tulis
                                                    </span>
                                                    <svg
                                                        className="ml-1 h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        ></path>
                                                    </svg>
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        ></path>
                                                    </svg>
                                                    Guru belum menyematkan link
                                                    papan tulis untuk misi ini.
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 text-right">
                                            {currentStep === 2 ? (
                                                <button
                                                    onClick={
                                                        handleCompleteStep2
                                                    }
                                                    className="transform rounded-lg bg-purple-600 px-6 py-2 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-purple-700"
                                                >
                                                    Tim Siap & Lanjut ke Tahap 3
                                                    →
                                                </button>
                                            ) : (
                                                <span className="font-bold text-green-600">
                                                    ✅ Tahap ini sudah selesai.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab > 2 && (
                                    <div className="py-20 text-center">
                                        <h3 className="text-xl font-bold text-gray-400">
                                            Konten Tahap {activeTab} Belum
                                            Dibuat
                                        </h3>
                                        <p className="text-gray-400">
                                            Silakan ikuti panduan selanjutnya.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
