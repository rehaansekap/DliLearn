<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Mission\SavePhase3Request;
use App\Http\Requests\Student\Mission\StoreReflectionRequest;
use App\Http\Requests\Student\Mission\SubmitFeedbackRequest;
use App\Http\Requests\Student\Mission\SubmitFinalReflectionRequest;
use App\Http\Requests\Student\Mission\SubmitPhase4Request;
use App\Http\Requests\Student\Mission\UpdateRoleRequest;
use App\Models\Mission;
use App\Models\Submission;
use App\Services\Mission\FeedbackService;
use App\Services\Mission\GroupService;
use App\Services\Mission\ProgressService;
use App\Services\Mission\ReflectionService;
use App\Services\Mission\RewardService;
use App\Services\Mission\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MissionController extends Controller
{
    public function __construct(
        protected GroupService $groupService,
        protected ProgressService $progressService,
        protected ReflectionService $reflectionService,
        protected SubmissionService $submissionService,
        protected FeedbackService $feedbackService,
        protected RewardService $rewardService,
    ) {}

    public function show($slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $myReflection = $this->reflectionService->getUserReflection($user->id, $mission->id);
        $initialReflection = $this->reflectionService->getUserReflection($user->id, $mission->id, 'initial');
        $finalReflection = $this->reflectionService->getUserReflection($user->id, $mission->id, 'final');
        $gallerySubmissions = $this->submissionService->getGallerySubmissions($mission->id, $user->id);
        if ($initialReflection) {
            $groupMember = $this->groupService->getUserGroupMember($user->id);
        } else {
            $groupMember = null;
        }

        if ($groupMember) {
            $progress = $this->progressService->getGroupProgress($groupMember->group_id, $mission->id);
            $currentStep = $progress ? $progress->current_step : 1;
            $myGroupMembers = $this->groupService->getGroupMembers($groupMember->group_id);
            $currentUserRole = $groupMember->role;
        } else {
            $currentStep = 1;
            $myGroupMembers = collect();
            $currentUserRole = null;
        }

        $groupHasSubmitted = false;
        if ($groupMember) {
            $groupStatus = $progress ? $progress->status : null;
        } else {
            $groupStatus = null;
        }

        if ($groupMember) {
            $groupHasSubmitted = Submission::where('group_id', $groupMember->group_id)
                ->where('mission_id', $mission->id)
                ->where('is_final', true)
                ->exists();
        }

        $allSubmissions = $this->submissionService->getGallerySubmissions($mission->id, $user->id);

        $myGroupCode = null;
        if ($groupMember) {
            $myGroup = DB::table('groups')->where('id', $groupMember->group_id)->first();
            $myGroupCode = $myGroup ? $myGroup->group_code : null;
        }

        $unreviewedSubmissions = [];
        if ($groupMember && $groupMember->role === 'Ketua') {
            foreach ($allSubmissions as $submission) {
                if ($submission['group_code'] === $myGroupCode) continue;
                $hasFeedback = DB::table('feedbacks')
                    ->where('submission_id', $submission['id'])
                    ->where('user_id', $user->id)
                    ->exists();
                if (!$hasFeedback) {
                    $unreviewedSubmissions[] = [
                        'id' => $submission['id'],
                        'group_name' => $submission['group_name'],
                        'group_code' => $submission['group_code'],
                    ];
                }
            }
        }

        return Inertia::render('student/mission/index', [
            'mission' => $mission,
            'currentStep' => $currentStep,
            'unlockedStep' => $currentStep,
            'groupMembers' => $myGroupMembers,
            'currentUserRole' => $currentUserRole,
            'lkpdUrl' => asset('assets/template_lkpd.pdf'),
            'reflection' => $myReflection,
            'initialReflection' => $initialReflection,
            'finalReflection' => $finalReflection,
            'gallerySubmissions' => $gallerySubmissions,
            'groupHasSubmitted' => $groupHasSubmitted,
            'groupStatus' => $groupStatus,
            'unreviewedSubmissions' => $unreviewedSubmissions,
        ]);
    }

    public function submitReflection(StoreReflectionRequest $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        DB::transaction(function () use ($request, $mission, $groupMember, $user) {
            $this->reflectionService->saveReflection($user->id, $mission->id, $request->validated()['reflection']);

            if ($groupMember) {
                $this->progressService->updateGroupProgress($groupMember->group_id, $mission->id, 2);
            }
        });

        session()->flash('group_exists', (bool) $groupMember);

        if ($groupMember) {
            return redirect()->back()->with('success', 'Refleksi tersimpan! Tahap 2 terbuka.');
        }

        return redirect()->back()->with('success', 'Refleksi tersimpan! Menunggu pembentukan kelompok oleh Guru.');
    }

    public function updateRole(UpdateRoleRequest $request, $slug)
    {
        $user = Auth::user();

        if (!$this->groupService->isUserLeader($user->id)) {
            abort(403, 'Hanya Ketua Kelompok yang boleh mengubah peran anggota!');
        }

        $validated = $request->validated();
        $targetRole = $this->groupService->getMemberRole($validated['target_user_id']);

        if ($targetRole === 'Ketua') {
            return redirect()->back()->with('error', 'Peran Ketua tidak bisa diubah di sini. Hubungi Guru.');
        }

        $this->groupService->updateMemberRole($validated['target_user_id'], $validated['role']);

        return redirect()->back()->with('success', 'Peran anggota berhasil diperbarui!');
    }

    public function completeStep2(Request $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        $this->progressService->advanceGroupStep($groupMember->group_id, $mission->id, 2, 3);

        return redirect()->back()->with('success', 'Organisasi selesai! Lanjut ke Penyelidikan.');
    }

    public function savePhase3(SavePhase3Request $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        if (!$groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok!');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $mission, $groupMember) {
            $this->submissionService->saveCodeAttempt($groupMember->group_id, $mission->id, $validated['code_attempt']);
            $this->progressService->advanceGroupStep($groupMember->group_id, $mission->id, 3, 4);
        });

        return redirect()->back()->with('success', 'Eksperimen selesai! Lanjut ke tahap berikutnya.');
    }

    public function submitPhase4(SubmitPhase4Request $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        if (!$groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok!');
        }

        if ($groupMember->role !== 'Ketua') {
            abort(403, 'Hanya Ketua Kelompok yang dapat mengumpulkan tugas akhir!');
        }

        $existing = Submission::where('group_id', $groupMember->group_id)
            ->where('mission_id', $mission->id)
            ->where('is_final', true)
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Tugas akhir sudah dikumpulkan oleh kelompok ini. Ketua tidak dapat mengirim ulang.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated, $mission, $groupMember) {
            $filePath = $this->submissionService->handleFileUpload($request, $groupMember->group_id);

            $this->submissionService->saveFinalSubmission(
                $groupMember->group_id,
                $mission->id,
                $filePath,
                $validated['code_final']
            );

            $this->progressService->completeGroupMission($groupMember->group_id, $mission->id);
        });

        return redirect()->back()->with('success', 'Tugas akhir berhasil dikumpulkan! Misi selesai.');
    }

    public function toggleLike(Request $request, $submissionId)
    {
        $user = Auth::user();
        $submission = Submission::findOrFail($submissionId);
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        if (!$groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        if (!$this->progressService->canInteractWithGallery($groupMember->group_id, $submission->mission_id)) {
            return redirect()->back()->with('error', 'Anda harus menyelesaikan semua tahap untuk memberikan like!');
        }

        $message = $this->submissionService->toggleSubmissionLike($submissionId, $user->id);

        return redirect()->back()->with('success', $message);
    }

    public function submitFeedback(SubmitFeedbackRequest $request, $submissionId)
    {
        $user = Auth::user();
        $submission = Submission::findOrFail($submissionId);
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        if (!$groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        if (!$this->progressService->canInteractWithGallery($groupMember->group_id, $submission->mission_id)) {
            return redirect()->back()->with('error', 'Anda harus menyelesaikan semua tahap untuk memberikan feedback!');
        }

        $validated = $request->validated();

        $this->feedbackService->storeFeedback($submissionId, $user->id, $validated['message']);

        return redirect()->back()->with('success', 'Feedback berhasil dikirim!');
    }

    public function getFeedbacks($submissionId)
    {
        $feedbacks = $this->feedbackService->getFeedbacks($submissionId);

        return response()->json($feedbacks);
    }

    public function submitFinalReflection(SubmitFinalReflectionRequest $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = $this->groupService->getUserGroupMember($user->id);

        if (!$groupMember) {
            return redirect()->back()->with('error', 'Anda belum memiliki kelompok!');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $mission, $groupMember, $user) {
            $this->reflectionService->saveFinalReflection($user->id, $mission->id, $validated['final_reflection']);

            $groupMembers = $this->groupService->getGroupMembers($groupMember->group_id);
            $memberIds = $groupMembers->pluck('user_id')->toArray();

            $submittedCount = \App\Models\Reflection::whereIn('user_id', $memberIds)
                ->where('mission_id', $mission->id)
                ->where('type', 'final')
                ->count();

            if ($submittedCount === count($memberIds)) {
                $this->progressService->markGroupMissionCompleted($groupMember->group_id, $mission->id);
                foreach ($memberIds as $memberId) {
                    $this->rewardService->awardUserXp($memberId, 100);
                }
            }
        });

        return redirect()->route('dashboard')->with('success', 'Selamat! Misi berhasil diselesaikan. +100 XP!');
    }
}
