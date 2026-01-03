import StudentLayout from '@/layouts/student-layout';
import { Head, router, useForm } from '@inertiajs/react';
import Editor from '@monaco-editor/react';
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
    reflection,
}) {
    const [activeTab, setActiveTab] = useState(currentStep);
    const collaborationLink = mission.collab_url;
    const [groupMissingNotice, setGroupMissingNotice] = useState<string | null>(
        null,
    );

    const { data, setData, post, processing } = useForm({
        reflection: reflection || '',
    });
    const isButtonEnabled = data.reflection.length > 10;

    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeValue, setCodeValue] = useState(
        '// Tulis kode eksperimenmu di sini\nconsole.log("Hello World!");',
    );

    const [terminalOutput, setTerminalOutput] = useState('');
    const [hasRunCode, setHasRunCode] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [finalCode, setFinalCode] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmittingPhase4, setIsSubmittingPhase4] = useState(false);

    const handleSubmitPhase4 = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || finalCode.trim().length < 10) {
            alert('Pastikan file dan source code telah diisi dengan lengkap!');
            return;
        }

        setIsSubmittingPhase4(true);

        const formData = new FormData();
        formData.append('file_flowchart', selectedFile);
        formData.append('code_final', finalCode);

        router.post(route('mission.submit-phase-4', mission.slug), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmittingPhase4(false);
                setActiveTab(5);
            },
            onError: (errors) => {
                setIsSubmittingPhase4(false);
                console.error('Error submitting:', errors);
            },
        });
    };

    const handleRefreshStatus = () => {
        router.reload({ only: ['currentStep', 'unlockedStep'] });
    };

    const handleSubmitReflection = (e) => {
        e.preventDefault();
        post(route('mission.reflection', mission.slug), {
            onSuccess: (page) => {
                const groupExists = page.props?.flash?.group_exists ?? false;
                if (groupExists) {
                    setActiveTab(2);
                } else {
                    setGroupMissingNotice(
                        'Refleksi tersimpan. Guru belum membuat kelompok untuk misi ini — tunggu pemberitahuan atau hubungi Guru.',
                    );
                }
            },
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

    function parseStackForLocation(stack?: string) {
        if (!stack) return null;
        const m = stack.match(/:(\d+):(\d+)/);
        if (m) {
            return { line: parseInt(m[1], 10), column: parseInt(m[2], 10) };
        }
        return null;
    }

    const computeStackOffset = (): number => {
        try {
            new Function('throw new Error("__OFFSET__")')();
        } catch (e: unknown) {
            const loc = parseStackForLocation(e?.stack);

            return loc ? Math.max(0, loc.line - 1) : 0;
        }
        return 0;
    };

    const handleRunCode = () => {
        setIsRunning(true);
        setTerminalOutput('');

        setTimeout(() => {
            if (codeLanguage === 'javascript') {
                const logs: string[] = [];
                const originalLog = console.log;

                console.log = (...args: unknown[]) => {
                    logs.push(
                        args
                            .map((arg) =>
                                typeof arg === 'object'
                                    ? JSON.stringify(arg, null, 2)
                                    : String(arg),
                            )
                            .join(' '),
                    );
                };

                const baselineOffset = computeStackOffset();

                try {
                    new Function(codeValue)();
                    setTerminalOutput(
                        logs.length > 0
                            ? logs.join('\n')
                            : '✓ Code executed successfully (no output)',
                    );
                } catch (error: unknown) {
                    const loc = parseStackForLocation(error?.stack);
                    let output = `❌ ${error?.name || 'Error'}: ${error?.message || String(error)}`;

                    if (loc) {
                        // map reported line to editor line by subtracting baseline offset
                        const mappedLine = Math.max(
                            1,
                            loc.line - baselineOffset,
                        );
                        output += `\n→ Line ${mappedLine}${loc.column ? `, Column ${loc.column}` : ''}`;
                    }

                    if (error?.stack) {
                        // include short stack for debugging
                        output += `\n\nStack:\n${error.stack}`;
                    }

                    setTerminalOutput(output);
                } finally {
                    console.log = originalLog;
                }
            } else if (codeLanguage === 'python') {
                const lines = codeValue
                    .split('\n')
                    .filter((line) => line.trim().startsWith('print('));
                if (lines.length > 0) {
                    const outputs = lines.map((line) => {
                        const match = line.match(/print\((.*?)\)/);
                        if (match) return match[1].replace(/['"]/g, '');
                        return 'Hello from Python!';
                    });
                    setTerminalOutput(
                        `Python 3.11.0\n>>> Executing script...\n${outputs.join('\n')}\n>>> Execution completed.`,
                    );
                } else {
                    setTerminalOutput(
                        'Python 3.11.0\n>>> Executing script...\n✓ Code executed successfully\n>>> No syntax errors detected.',
                    );
                }
            } else if (codeLanguage === 'php') {
                const lines = codeValue
                    .split('\n')
                    .filter((line) => line.includes('echo'));
                if (lines.length > 0) {
                    const outputs = lines.map((line) => {
                        const match = line.match(/echo\s+["'](.*?)["']/);
                        if (match) return match[1];
                        return 'Hello from PHP!';
                    });
                    setTerminalOutput(`PHP 8.2.0\n${outputs.join('\n')}`);
                } else {
                    setTerminalOutput(
                        'PHP 8.2.0\n✓ Script executed successfully\nNo output to display.',
                    );
                }
            }

            setHasRunCode(true);
            setIsRunning(false);
        }, 200);
    };

    const handleSavePhase3 = () => {
        router.post(
            route('mission.save-phase-3', mission.slug),
            {
                code_attempt: codeValue,
                language: codeLanguage,
            },
            {
                onSuccess: () => setActiveTab(4),
            },
        );
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
                <div className="mx-auto max-w-2/3 sm:px-6 lg:px-8">
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
                                        {!groupMissingNotice ? null : (
                                            <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                                                {groupMissingNotice}
                                            </div>
                                        )}

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
                                                    rows={3}
                                                    value={data.reflection}
                                                    onChange={(e) =>
                                                        setData(
                                                            'reflection',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Apa inti masalahnya?"
                                                />
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

                                {activeTab === 3 && (
                                    <div className="animate-fade-in h-full">
                                        <div className="mb-6 border-b pb-4">
                                            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-800 uppercase">
                                                Tahap 3
                                            </span>
                                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                                Creative Lab - Penyelidikan &
                                                Eksperimen
                                            </h1>
                                            <p className="mt-1 text-gray-500">
                                                Pelajari materi dan eksperimen
                                                dengan kode. Tidak ada jawaban
                                                benar atau salah, yang penting
                                                mencoba!
                                            </p>
                                        </div>

                                        <div className="flex h-[700px] gap-4">
                                            <div className="flex w-1/2 flex-col overflow-hidden rounded-lg border shadow-sm">
                                                <div className="border-b bg-gray-100 px-4 py-2">
                                                    <h3 className="flex items-center gap-2 font-bold text-gray-700">
                                                        📚 Materi Pembelajaran
                                                    </h3>
                                                </div>
                                                <div className="flex-1 overflow-auto bg-gray-50">
                                                    {mission.material_pdf ? (
                                                        <iframe
                                                            src={
                                                                mission.material_pdf
                                                            }
                                                            className="h-full w-full border-0"
                                                            title="Materi PDF"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-gray-400">
                                                            <div className="text-center">
                                                                <svg
                                                                    className="mx-auto mb-2 h-12 w-12"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    ></path>
                                                                </svg>
                                                                <p>
                                                                    Materi PDF
                                                                    belum
                                                                    tersedia
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border shadow-sm">
                                                {/* Editor Header */}
                                                <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                                                    <h3 className="flex items-center gap-2 font-bold text-white">
                                                        💻 Code Editor
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-white">
                                                            Bahasa:
                                                        </label>
                                                        <select
                                                            value={codeLanguage}
                                                            onChange={(e) => {
                                                                setCodeLanguage(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setHasRunCode(
                                                                    false,
                                                                );
                                                                if (
                                                                    e.target
                                                                        .value ===
                                                                    'javascript'
                                                                ) {
                                                                    setCodeValue(
                                                                        '// Tulis kode JavaScript\nconsole.log("Hello World!");',
                                                                    );
                                                                } else if (
                                                                    e.target
                                                                        .value ===
                                                                    'python'
                                                                ) {
                                                                    setCodeValue(
                                                                        '# Tulis kode Python\nprint("Hello World!")',
                                                                    );
                                                                } else {
                                                                    setCodeValue(
                                                                        '<?php\n// Tulis kode PHP\necho "Hello World!";\n?>',
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                                                        >
                                                            <option value="javascript">
                                                                JavaScript
                                                            </option>
                                                            <option value="python">
                                                                Python
                                                            </option>
                                                            <option value="php">
                                                                PHP
                                                            </option>
                                                        </select>
                                                        <button
                                                            onClick={
                                                                handleRunCode
                                                            }
                                                            disabled={isRunning}
                                                            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm font-bold text-white hover:bg-green-700 disabled:bg-gray-500"
                                                        >
                                                            {isRunning
                                                                ? 'Running...'
                                                                : '▶️ Run Code'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Editor (mengisi ruang yang tersisa) */}
                                                <div className="min-h-0 flex-1">
                                                    <Editor
                                                        height="100%"
                                                        language={codeLanguage}
                                                        value={codeValue}
                                                        onChange={(value) =>
                                                            setCodeValue(
                                                                value || '',
                                                            )
                                                        }
                                                        theme="vs-dark"
                                                        options={{
                                                            fontSize: 14,
                                                            minimap: {
                                                                enabled: false,
                                                            },
                                                            scrollBeyondLastLine: false,
                                                            lineNumbers: 'on',
                                                            roundedSelection: false,
                                                            automaticLayout: true,
                                                        }}
                                                    />
                                                </div>

                                                {/* Terminal (tinggi tetap) */}
                                                <div className="h-40 overflow-auto border-t border-gray-600 bg-black font-mono text-sm text-green-400">
                                                    <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-900 px-4 py-1 text-xs text-gray-400">
                                                        <span>
                                                            🖥️ Terminal Output
                                                        </span>
                                                        {hasRunCode && (
                                                            <span className="text-green-400">
                                                                ● Ready
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-4 whitespace-pre-wrap">
                                                        {terminalOutput ||
                                                            'Klik "Run Code" untuk melihat output...'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <p className="text-sm text-gray-500">
                                                {hasRunCode ? (
                                                    <span className="font-medium text-green-600">
                                                        ✓ Kamu sudah mencoba
                                                        kode! Sekarang bisa
                                                        lanjut.
                                                    </span>
                                                ) : (
                                                    <span className="font-medium text-orange-600">
                                                        ⚠️ Jalankan kode minimal
                                                        1x sebelum melanjutkan.
                                                    </span>
                                                )}
                                            </p>
                                            <button
                                                onClick={handleSavePhase3}
                                                disabled={
                                                    !hasRunCode || processing
                                                }
                                                className={`transform rounded-lg px-6 py-2 font-bold shadow-lg transition-all ${
                                                    hasRunCode && !processing
                                                        ? 'bg-green-600 text-white hover:scale-105 hover:bg-green-700'
                                                        : 'cursor-not-allowed bg-gray-300 text-gray-500'
                                                }`}
                                            >
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Selesai & Lanjut Tahap 4 →'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 4 && (
                                    <div className="animate-fade-in">
                                        <div className="mb-6 border-b pb-4">
                                            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800 uppercase">
                                                Tahap 4
                                            </span>
                                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                                Penyajian Hasil
                                            </h1>
                                            <p className="mt-1 text-gray-500">
                                                {currentUserRole === 'Ketua'
                                                    ? 'Kumpulkan hasil kerja kelompok: flowchart dan source code final.'
                                                    : 'Menunggu Ketua kelompok mengumpulkan tugas akhir.'}
                                            </p>
                                        </div>

                                        {currentUserRole === 'Ketua' ? (
                                            <div className="space-y-6">
                                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-full bg-blue-100 p-2">
                                                            <span className="text-2xl">
                                                                👑
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-blue-900">
                                                                Instruksi untuk
                                                                Ketua
                                                            </h3>
                                                            <p className="text-sm text-blue-700">
                                                                Sebagai ketua
                                                                kelompok, Anda
                                                                bertanggung
                                                                jawab
                                                                mengumpulkan
                                                                hasil akhir tim.
                                                                Pastikan semua
                                                                file sudah
                                                                lengkap sebelum
                                                                submit.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <form
                                                    onSubmit={
                                                        handleSubmitPhase4
                                                    }
                                                    className="space-y-6"
                                                >
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            Upload
                                                            Flowchart/Poster
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) =>
                                                                    setSelectedFile(
                                                                        e.target
                                                                            .files?.[0] ||
                                                                            null,
                                                                    )
                                                                }
                                                                className="block w-full rounded-lg border border-gray-300 text-sm file:mr-4 file:rounded-l-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                                                disabled={
                                                                    isSubmittingPhase4
                                                                }
                                                            />
                                                        </div>
                                                        {selectedFile && (
                                                            <p className="mt-2 text-sm text-green-600">
                                                                ✓ File dipilih:{' '}
                                                                {
                                                                    selectedFile.name
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Format: PDF, JPG,
                                                            JPEG, PNG (Max 10MB)
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            Source Code Final
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            value={finalCode}
                                                            onChange={(e) =>
                                                                setFinalCode(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={12}
                                                            placeholder="Tulis atau paste source code final kelompok di sini..."
                                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                            disabled={
                                                                isSubmittingPhase4
                                                            }
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Minimal 10 karakter
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Siap untuk
                                                                dikumpulkan?
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Pastikan semua
                                                                data sudah benar
                                                                sebelum submit
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                !selectedFile ||
                                                                finalCode.trim()
                                                                    .length <
                                                                    10 ||
                                                                isSubmittingPhase4
                                                            }
                                                            className={`rounded-lg px-6 py-3 font-bold shadow-lg transition-all ${
                                                                !selectedFile ||
                                                                finalCode.trim()
                                                                    .length <
                                                                    10 ||
                                                                isSubmittingPhase4
                                                                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                                                    : 'bg-green-600 text-white hover:scale-105 hover:bg-green-700'
                                                            }`}
                                                        >
                                                            {isSubmittingPhase4
                                                                ? '⏳ Mengirim...'
                                                                : '🚀 Kirim Tugas Akhir'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center">
                                                <div className="rounded-full bg-yellow-50 p-6">
                                                    <span className="text-6xl">
                                                        ⏳
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                                                        Menunggu Ketua
                                                        Mengumpulkan Tugas
                                                    </h3>
                                                    <p className="max-w-md text-gray-600">
                                                        Hanya ketua kelompok
                                                        yang dapat mengumpulkan
                                                        tugas akhir. Pastikan
                                                        koordinasi dengan ketua
                                                        sudah selesai.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={
                                                        handleRefreshStatus
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                                >
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
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                    Refresh Status
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 5 && (
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
