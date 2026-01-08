import { MissionHeader } from '@/components/mission/missionHeader';
import StudentLayout from '@/layouts/student-layout';
import { logout } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import MissionSidebar from './partials/missionSidebar';
import Phase1Orientation from './partials/phase1Orientation';
import Phase2Organization from './partials/phase2Organization';
import Phase3CreativeLab from './partials/phase3CreativeLab';
import Phase4Submission from './partials/phase4Submission';
import Phase5Evaluation from './partials/phase5Evaluation';

export default function Show({
    auth,
    mission,
    currentStep,
    unlockedStep,
    groupMembers,
    currentUserRole,
    groupHasSubmitted = false,
    initialReflection = '',
    finalReflection: initialFinalReflection = '',
    gallerySubmissions,
    groupStatus,
    unreviewedSubmissions = [],
}) {
    const [activeTab, setActiveTab] = useState(currentStep);

    const userSubmittedInitial = Boolean(
        initialReflection && initialReflection.length > 0,
    );
    const initialGroupExists = Array.isArray(groupMembers)
        ? groupMembers.length > 0
        : false;
    const initialReflectionLocked = userSubmittedInitial && !initialGroupExists;

    const [groupMissingNotice, setGroupMissingNotice] = useState<string | null>(
        initialReflectionLocked
            ? 'Refleksi tersimpan. Guru belum membuat kelompok untuk misi ini — tunggu pemberitahuan atau hubungi Guru.'
            : null,
    );
    const [reflectionLocked, setReflectionLocked] = useState<boolean>(
        initialReflectionLocked,
    );

    // State Phase 3 - Creative Lab
    const [terminalOutput, setTerminalOutput] = useState('');
    const [hasRunCode, setHasRunCode] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // State Phase 4 - Submission
    const [isSubmittingPhase4, setIsSubmittingPhase4] = useState(false);

    // Dropdown State
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // Helper variables
    const amILeader = currentUserRole === 'Ketua';
    const collaborationLink = mission.collab_url;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                setShowProfileDropdown(false);
            }
        }
        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    // Phase 1 Handler
    const handleSubmitReflection = (reflection: string) => {
        router.post(
            route('mission.reflection', mission.slug),
            { reflection },
            {
                onSuccess: async () => {
                    const localGroupExists = Array.isArray(groupMembers)
                        ? groupMembers.length > 0
                        : false;

                    if (localGroupExists) {
                        setActiveTab(2);
                        setGroupMissingNotice(null);
                        return;
                    }

                    const SwalModule = await import('sweetalert2');
                    await import('sweetalert2/dist/sweetalert2.min.css');
                    const Swal = SwalModule.default;

                    await Swal.fire({
                        icon: 'info',
                        title: 'Refleksi tersimpan',
                        text: 'Guru belum membuat kelompok untuk misi ini — tunggu pemberitahuan atau hubungi Guru.',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rounded-xl',
                            title: 'font-bold',
                            confirmButton:
                                'bg-gradient-to-r from-indigo-600 to-purple-600',
                        },
                    });

                    setGroupMissingNotice(
                        'Refleksi tersimpan. Guru belum membuat kelompok untuk misi ini — tunggu pemberitahuan atau hubungi Guru.',
                    );
                    setReflectionLocked(true);
                },
            },
        );
    };

    const refreshGroupStatus = () => {
        router.get(
            route('mission.show', mission.slug),
            {},
            {
                preserveState: true,
                only: ['groupMembers', 'currentStep', 'unlockedStep'],
                onSuccess: async (page) => {
                    const gm = page.props?.groupMembers ?? [];
                    const localGroupExists = Array.isArray(gm)
                        ? gm.length > 0
                        : false;

                    if (localGroupExists) {
                        setReflectionLocked(false);
                        setGroupMissingNotice(null);
                        setActiveTab(2);
                        const m = await import('sweetalert2');
                        await import('sweetalert2/dist/sweetalert2.min.css');
                        m.default.fire({
                            icon: 'success',
                            title: 'Kelompok dibuat',
                            text: 'Sekarang kamu dapat melanjutkan ke langkah berikutnya.',
                            timer: 1400,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-xl' },
                        });
                    } else {
                        const m = await import('sweetalert2');
                        await import('sweetalert2/dist/sweetalert2.min.css');
                        m.default.fire({
                            icon: 'info',
                            title: 'Belum ada kelompok',
                            text: 'Coba lagi nanti.',
                            timer: 1200,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-xl' },
                        });
                    }
                },
            },
        );
    };

    // Phase 2 Handlers
    const handleRoleChange = (userId: number, newRole: string) => {
        router.post(
            route('mission.update-role', mission.slug),
            {
                target_user_id: userId,
                role: newRole,
            },
            {
                preserveScroll: true,
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

    // Phase 3 Handlers
    const handleRunCode = (code: string, language: string) => {
        setIsRunning(true);
        setTerminalOutput('> Running code...\n');

        setTimeout(() => {
            setTerminalOutput(
                `> Code executed successfully!\n> Language: ${language}\n> Output:\nHello World!`,
            );
            setHasRunCode(true);
            setIsRunning(false);
        }, 1500);
    };

    const handleSavePhase3 = (code: string, language: string) => {
        router.post(
            route('mission.save-phase-3', mission.slug),
            {
                code_attempt: code,
                language: language,
            },
            {
                onSuccess: () => {
                    setActiveTab(4);
                },
            },
        );
    };

    // Phase 4 Handler
    const handleSubmitPhase4 = (file: File, finalCode: string) => {
        setIsSubmittingPhase4(true);

        const formData = new FormData();
        formData.append('file_flowchart', file);
        formData.append('code_final', finalCode);

        router.post(route('mission.submit-phase-4', mission.slug), formData, {
            forceFormData: true,
            onSuccess: () => {
                setActiveTab(5);
                setIsSubmittingPhase4(false);
            },
            onError: () => {
                setIsSubmittingPhase4(false);
            },
        });
    };

    const refreshPhase4Status = () => {
        router.get(
            route('mission.show', mission.slug),
            {},
            {
                preserveState: true,
                onSuccess: async (page) => {
                    const submitted = page.props?.groupHasSubmitted ?? false;
                    if (submitted) {
                        setActiveTab(5);
                        const SwalModule = await import('sweetalert2');
                        await import('sweetalert2/dist/sweetalert2.min.css');
                        const Swal = SwalModule.default;
                        await Swal.fire({
                            icon: 'success',
                            title: 'Sudah Dikumpulkan!',
                            text: 'Ketua kelompok sudah mengumpulkan tugas akhir. Kamu bisa lanjut ke tahap evaluasi.',
                            timer: 1800,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-xl' },
                        });
                    } else {
                        const SwalModule = await import('sweetalert2');
                        await import('sweetalert2/dist/sweetalert2.min.css');
                        const Swal = SwalModule.default;
                        await Swal.fire({
                            icon: 'info',
                            title: 'Belum Dikumpulkan!',
                            text: 'Tunggu hingga ketua mengumpulkan tugas akhir untuk melanjutkan ke tahap evaluasi.',
                            timer: 1800,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-xl' },
                        });
                    }
                },
            },
        );
    };

    // Phase 5 Handler
    const handleSubmitFinalReflection = (reflection: string) => {
        router.post(
            route('mission.finish', mission.slug),
            { final_reflection: reflection },
            {
                onSuccess: () => {
                    router.visit(route('dashboard'));
                },
            },
        );
    };

    return (
        <StudentLayout
            user={auth.user}
            header={
                <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
                    <div className="flex flex-row items-center justify-between gap-2">
                        {/* Tombol Kembali + Judul */}
                        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 sm:h-10 sm:w-10"
                                aria-label="Kembali"
                            >
                                <svg
                                    className="h-5 w-5 text-slate-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold text-slate-800 sm:text-2xl">
                                    {mission.title}
                                </h2>
                                <p className="truncate text-xs text-slate-600 sm:text-sm">
                                    {mission.description}
                                </p>
                            </div>
                        </div>
                        {/* Avatar + Dropdown */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-full px-1 py-1 transition hover:bg-slate-100 sm:gap-2 sm:px-2"
                                onClick={() =>
                                    setShowProfileDropdown((v) => !v)
                                }
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md sm:h-10 sm:w-10">
                                    <span className="font-bold">
                                        {(auth.user.name || '?').charAt(0)}
                                    </span>
                                </div>
                                <span className="xs:block hidden max-w-[80px] truncate font-semibold text-slate-700 sm:block sm:max-w-[120px]">
                                    {auth.user.name}
                                </span>
                                <svg
                                    className="ml-1 h-4 w-4 text-slate-500"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            {showProfileDropdown && (
                                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                                    <div className="truncate px-4 py-2 text-sm font-semibold text-slate-700">
                                        {auth.user.name}
                                    </div>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
            fullWidth={true}
        >
            <Head title={mission.title} />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="relative py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Mission Header Card */}
                    <MissionHeader
                        title={mission.title}
                        description={mission.description}
                        level={mission.difficulty_level}
                        role={currentUserRole || 'Belum Ada'}
                    />

                    {/* Main Content Grid */}
                    <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Sidebar */}
                        <MissionSidebar
                            activeTab={activeTab}
                            unlockedStep={unlockedStep}
                            onTabChange={setActiveTab}
                            hasSubmittedInitial={userSubmittedInitial}
                            groupStatus={groupStatus}
                        />

                        {/* Content Area */}
                        <div className="w-full lg:w-3/4">
                            <div className="min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                <div className="p-8">
                                    {/* Phase Content */}
                                    {activeTab === 1 && (
                                        <Phase1Orientation
                                            mission={mission}
                                            initialReflection={
                                                initialReflection
                                            }
                                            onReflectionSubmit={
                                                handleSubmitReflection
                                            }
                                            processing={false}
                                            groupMissingNotice={
                                                groupMissingNotice
                                            }
                                            isLocked={reflectionLocked}
                                            onRefresh={refreshGroupStatus}
                                            submittedPreviously={
                                                userSubmittedInitial
                                            }
                                            onNext={() => setActiveTab(2)}
                                        />
                                    )}

                                    {activeTab === 2 && (
                                        <Phase2Organization
                                            groupMembers={groupMembers}
                                            currentUserRole={currentUserRole}
                                            collaborationLink={
                                                collaborationLink
                                            }
                                            amILeader={amILeader}
                                            onRoleChange={handleRoleChange}
                                            onCompleteStep={handleCompleteStep2}
                                            groupCurrentStep={currentStep}
                                            onNext={() => setActiveTab(3)}
                                        />
                                    )}

                                    {activeTab === 3 && (
                                        <Phase3CreativeLab
                                            mission={mission}
                                            onSaveCode={handleSavePhase3}
                                            onRunCode={handleRunCode}
                                            isRunning={isRunning}
                                            terminalOutput={terminalOutput}
                                            hasRunCode={hasRunCode}
                                        />
                                    )}

                                    {activeTab === 4 && (
                                        <Phase4Submission
                                            amILeader={amILeader}
                                            groupHasSubmitted={
                                                groupHasSubmitted
                                            }
                                            onSubmit={handleSubmitPhase4}
                                            isSubmitting={isSubmittingPhase4}
                                            onRefresh={
                                                !amILeader
                                                    ? refreshPhase4Status
                                                    : undefined
                                            }
                                        />
                                    )}

                                    {activeTab === 5 && (
                                        <Phase5Evaluation
                                            gallerySubmissions={
                                                gallerySubmissions
                                            }
                                            currentUserId={auth.user.id}
                                            missionSlug={mission.slug}
                                            onSubmitFinalReflection={
                                                handleSubmitFinalReflection
                                            }
                                            initialFinalReflection={
                                                initialFinalReflection
                                            }
                                            submittedPreviously={Boolean(
                                                initialFinalReflection &&
                                                    initialFinalReflection.length >
                                                        0,
                                            )}
                                            groupStatus={groupStatus}
                                            onNext={() =>
                                                router.visit(route('dashboard'))
                                            }
                                            amILeader={
                                                currentUserRole === 'Ketua'
                                            }
                                            unreviewedSubmissions={
                                                unreviewedSubmissions
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
