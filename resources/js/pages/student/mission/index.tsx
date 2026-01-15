import { MissionHeader } from '@/components/mission/missionHeader';
import StudentLayout from '@/layouts/student-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
    voteData = null,
    collaborationLink: collaborationLinkProp = null,
}) {
    const [activeTab, setActiveTab] = useState(currentStep);
    const collaborationLink =
        collaborationLinkProp ?? mission.collab_url ?? null;

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

    const [terminalOutput, setTerminalOutput] = useState('');
    const [hasRunCode, setHasRunCode] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [isSubmittingPhase4, setIsSubmittingPhase4] = useState(false);

    const amILeader = currentUserRole === 'Leader';

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
            backUrl="/dashboard"
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        {mission.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                        {mission.description}
                    </p>
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
                                            mission={mission}
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
                                            missionSlug={mission.slug}
                                            gallerySubmissions={
                                                gallerySubmissions
                                            }
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
                                                currentUserRole === 'Leader'
                                            }
                                            unreviewedSubmissions={
                                                unreviewedSubmissions
                                            }
                                            voteData={voteData}
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
