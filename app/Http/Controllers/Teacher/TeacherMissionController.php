<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeacherMissionController extends Controller
{
    public function show($slug)
    {
        $user = Auth::user();

        // Get mission
        $mission = Mission::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();

        // Get classroom
        $classroom = Classroom::find($mission->classroom_id);

        // Get all students in this classroom
        $students = DB::table('classroom_user')
            ->join('users', 'classroom_user.user_id', '=', 'users.id')
            ->where('classroom_user.classroom_id', $mission->classroom_id)
            ->where('users.role', 'student')
            ->select('users.id', 'users.name', 'users.username', 'users.avatar')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'username' => $s->username,
                'avatar' => $s->avatar,
            ])
            ->toArray();

        // Get groups for this mission (for Group Management tab)
        $groups = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('groups.classroom_id', $mission->classroom_id)
            ->where('group_progress.mission_id', $mission->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code'
            )
            ->get()
            ->map(function ($group) {
                // Get members with roles
                $members = DB::table('group_members')
                    ->join('users', 'group_members.user_id', '=', 'users.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->select('users.id', 'users.name', 'users.username', 'users.avatar', 'group_members.role')
                    ->get()
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'name' => $m->name,
                        'username' => $m->username,
                        'avatar' => $m->avatar,
                        'role' => $m->role ?? 'Presenter',
                    ])
                    ->toArray();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'members' => $members,
                ];
            })
            ->toArray();

        // Get groups with full monitoring data (for Monitoring tab)
        $groupsMonitoring = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('groups.classroom_id', $mission->classroom_id)
            ->where('group_progress.mission_id', $mission->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.current_step',
                'group_progress.status'
            )
            ->get()
            ->map(function ($group) use ($mission, $user) {
                // Get group members
                $members = DB::table('group_members')
                    ->join('users', 'group_members.user_id', '=', 'users.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->select('users.id', 'users.name', 'users.avatar', 'group_members.role')
                    ->get()
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'name' => $m->name,
                        'avatar' => $m->avatar,
                        'role' => $m->role ?? 'Presenter',
                    ])
                    ->toArray();

                // Determine step statuses
                $currentStep = $group->current_step ?? 0;

                $step1Status = $currentStep >= 2 ? 'completed' : ($currentStep === 1 ? 'in_progress' : 'locked');
                $step2Status = $currentStep >= 3 ? 'completed' : ($currentStep === 2 ? 'in_progress' : 'locked');
                $step3Status = $currentStep >= 4 ? 'completed' : ($currentStep === 3 ? 'in_progress' : 'locked');
                $step4Status = $currentStep >= 5 ? 'completed' : ($currentStep === 4 ? 'in_progress' : 'locked');
                $step5Status = $currentStep >= 5 && $group->status === 'completed' ? 'completed' : ($currentStep === 5 ? 'in_progress' : 'locked');

                // Get submission data
                $submission = DB::table('submissions')
                    ->where('group_id', $group->group_id)
                    ->where('mission_id', $mission->id)
                    ->where('is_final', true)
                    ->first();

                // Get likes count for this submission
                $likesCount = 0;
                if ($submission) {
                    $likesCount = DB::table('likes')
                        ->where('submission_id', $submission->id)
                        ->count();
                }

                // Get grade from teacher (if exists)
                $grade = null;
                if ($submission) {
                    $gradeRecord = DB::table('grades')
                        ->where('submission_id', $submission->id)
                        ->where('teacher_id', $user->id)
                        ->first();

                    if ($gradeRecord) {
                        $grade = [
                            'score' => $gradeRecord->score,
                            'teacher_notes' => $gradeRecord->teacher_notes,
                        ];
                    }
                }

                // Get feedbacks for this submission
                $feedbacks = [];
                if ($submission) {
                    $feedbacks = DB::table('feedbacks')
                        ->join('users', 'feedbacks.user_id', '=', 'users.id')
                        ->join('group_members', 'users.id', '=', 'group_members.user_id')
                        ->join('groups', 'group_members.group_id', '=', 'groups.id')
                        ->where('feedbacks.submission_id', $submission->id)
                        ->select(
                            'feedbacks.id',
                            'users.name as user_name',
                            'groups.name as group_name',
                            'feedbacks.message',
                            'feedbacks.created_at'
                        )
                        ->orderBy('feedbacks.created_at', 'desc')
                        ->get()
                        ->map(fn($f) => [
                            'id' => $f->id,
                            'user_name' => $f->user_name,
                            'group_name' => $f->group_name,
                            'message' => $f->message,
                            'created_at' => $f->created_at,
                        ])
                        ->toArray();
                }

                // ✅ FIXED: Get reflections only from group members (keep existing per-group logic)
                $reflections = DB::table('reflections')
                    ->join('users', 'reflections.user_id', '=', 'users.id')
                    ->join('group_members', 'users.id', '=', 'group_members.user_id')
                    ->join('groups', 'group_members.group_id', '=', 'groups.id')
                    ->where('group_members.group_id', $group->group_id)
                    ->where('reflections.mission_id', $mission->id)
                    ->select(
                        'reflections.user_id',
                        'users.name as user_name',
                        'groups.name as group_name',
                        'reflections.content',
                        'reflections.created_at',
                        'reflections.type'
                    )
                    ->get()
                    ->map(fn($r) => [
                        'user_id' => $r->user_id,
                        'user_name' => $r->user_name,
                        'group_name' => $r->group_name,
                        'content' => $r->content,
                        'created_at' => $r->created_at,
                        'type' => $r->type ?? 'initial',
                    ])
                    ->toArray();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'members' => $members,
                    'current_step' => $currentStep,
                    'status' => $group->status ?? 'locked',
                    'step1_status' => $step1Status,
                    'step2_status' => $step2Status,
                    'step3_status' => $step3Status,
                    'step4_status' => $step4Status,
                    'step5_status' => $step5Status,
                    'reflections' => $reflections,
                    'file_path' => $submission->file_path ?? null,
                    'code_answer' => $submission->code_answer ?? null,
                    'submitted_at' => $submission->submitted_at ?? null,
                    'submission_id' => $submission->id ?? null,
                    'likes_count' => $likesCount,
                    'feedbacks' => $feedbacks,
                    'grade' => $grade,
                ];
            })
            ->toArray();

        // ✅ NEW: Get ALL reflections from students in this classroom for this mission
        // (including students who don't have groups yet)
        $allReflectionsForMission = DB::table('reflections')
            ->join('users', 'reflections.user_id', '=', 'users.id')
            ->join('classroom_user', 'users.id', '=', 'classroom_user.user_id')
            ->leftJoin('group_members', 'users.id', '=', 'group_members.user_id')
            ->leftJoin('groups', 'group_members.group_id', '=', 'groups.id')
            ->where('classroom_user.classroom_id', $mission->classroom_id)
            ->where('reflections.mission_id', $mission->id)
            ->select(
                'reflections.user_id',
                'users.name as user_name',
                DB::raw('COALESCE(groups.name, "Belum Ada Kelompok") as group_name'),
                'reflections.content',
                'reflections.created_at',
                'reflections.type'
            )
            ->orderBy('reflections.created_at', 'desc')
            ->get()
            ->map(fn($r) => [
                'user_id' => $r->user_id,
                'user_name' => $r->user_name,
                'group_name' => $r->group_name,
                'content' => $r->content,
                'created_at' => $r->created_at,
                'type' => $r->type ?? 'initial',
            ])
            ->toArray();

        // Get vote results (Best Group)
        $voteResults = DB::table('best_group_votes')
            ->select('voted_group_id', DB::raw('count(*) as vote_count'))
            ->where('mission_id', $mission->id)
            ->groupBy('voted_group_id')
            ->orderByDesc('vote_count')
            ->get()
            ->map(function ($vote) {
                $group = DB::table('groups')->where('id', $vote->voted_group_id)->first();
                return [
                    'group_id' => $vote->voted_group_id,
                    'group_name' => $group->name ?? 'Unknown',
                    'group_code' => $group->group_code ?? null,
                    'vote_count' => $vote->vote_count,
                ];
            })
            ->toArray();

        // Calculate statistics
        $totalGroups = count($groupsMonitoring);
        $completedGroups = collect($groupsMonitoring)->where('status', 'completed')->count();
        $inProgressGroups = collect($groupsMonitoring)->where('status', 'in_progress')->count();
        $notStartedGroups = collect($groupsMonitoring)->where('status', 'locked')->count();

        return Inertia::render('teacher/mission/index', [
            'mission' => [
                'id' => $mission->id,
                'title' => $mission->title,
                'description' => $mission->description,
                'difficulty_level' => $mission->difficulty_level,
                'slug' => $mission->slug,
            ],
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'join_code' => $classroom->join_code,
            ],
            'students' => $students,
            'groups' => $groups,
            'groupsMonitoring' => $groupsMonitoring,
            'allReflections' => $allReflectionsForMission,
            'voteResults' => $voteResults,
            'initialAttendance' => DB::table('attendances')
                ->where('mission_id', $mission->id)
                ->select('user_id', 'is_present')
                ->get()
                ->map(fn($a) => ['student_id' => $a->user_id, 'is_present' => (bool) $a->is_present])
                ->toArray(),
            'stats' => [
                'totalGroups' => $totalGroups,
                'completedGroups' => $completedGroups,
                'inProgressGroups' => $inProgressGroups,
                'notStartedGroups' => $notStartedGroups,
            ],
        ]);
    }

    /**
     * Save or update grade for a submission
     */
    public function saveGrade(Request $request, $submissionId)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:0|max:100',
            'teacher_notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        DB::table('grades')->updateOrInsert(
            [
                'submission_id' => $submissionId,
                'teacher_id' => $user->id,
            ],
            [
                'score' => $validated['score'],
                'teacher_notes' => $validated['teacher_notes'] ?? null,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        if ($request->wantsJson()) {
            return response()->json(['ok' => true, 'score' => $validated['score']]);
        }

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }

    public function saveAttendance(Request $request, $missionId)
    {
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:users,id',
            'attendance.*.is_present' => 'required|boolean',
        ]);

        Log::info('saveAttendance payload', ['mission' => $missionId, 'attendance' => $validated]);

        // optional: return JSON for debugging
        if ($request->wantsJson()) {
            return response()->json(['ok' => true, 'received' => $validated]);
        }

        DB::beginTransaction();
        try {
            foreach ($validated['attendance'] as $att) {
                DB::table('attendances')->updateOrInsert(
                    [
                        'mission_id' => $missionId,
                        'user_id' => $att['student_id'],
                    ],
                    [
                        'is_present' => (bool) $att['is_present'],
                        'recorded_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
            DB::commit();

            return redirect()->back()->with('success', 'Kehadiran berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan kehadiran: ' . $e->getMessage());
        }
    }

    public function updateGroups(Request $request, $missionId)
    {
        $validated = $request->validate([
            'groups' => 'required|array',
            'groups.*.group_id' => 'required|integer',
            'groups.*.group_name' => 'required|string',
            'groups.*.group_code' => 'required|string',
            'groups.*.members' => 'required|array',
            'groups.*.members.*.user_id' => 'required|exists:users,id',
            'groups.*.members.*.role' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['groups'] as $groupData) {
                // Update or create group
                $group = DB::table('groups')
                    ->where('id', $groupData['group_id'])
                    ->first();

                if ($group) {
                    // Clear existing members
                    DB::table('group_members')
                        ->where('group_id', $group->id)
                        ->delete();

                    // Insert new members with roles
                    foreach ($groupData['members'] as $member) {
                        DB::table('group_members')->insert([
                            'group_id' => $group->id,
                            'user_id' => $member['user_id'],
                            'role' => $member['role'],
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Kelompok berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui kelompok: ' . $e->getMessage());
        }
    }

    public function create()
    {
        $user = Auth::user();

        $missionsForClassroom = Mission::where('teacher_id', $user->id)
            ->select('classroom_id')
            ->distinct()
            ->get();

        $missionClassroomIds = $missionsForClassroom->pluck('classroom_id')->filter()->unique()->values()->all();

        $classrooms = Classroom::whereIn('id', $missionClassroomIds)
            ->select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $ownMissions = Mission::where('teacher_id', $user->id)
            ->select('id', 'title')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/mission/create', [
            'classrooms' => $classrooms,
            'ownMissions' => $ownMissions,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'classroom_id' => ['required', 'exists:classrooms,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'difficulty_level' => ['required', 'integer', 'between:1,5'],
            'video_url' => ['required', 'url', 'regex:/youtube\.com|youtu\.be/'],
            'case_narrative' => ['required', 'string', 'max:1000'],
            'material_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'collab_url' => ['nullable', 'url'],
            'simulator_config' => ['nullable', 'string'],
        ], [
            'classroom_id.required' => 'Kelas wajib dipilih',
            'title.required' => 'Judul misi wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'description.max' => 'Deskripsi maksimal 500 karakter',
            'difficulty_level.required' => 'Tingkat kesulitan wajib dipilih',
            'video_url.required' => 'URL video wajib diisi',
            'video_url.regex' => 'URL harus dari YouTube',
            'case_narrative.required' => 'Narasi kasus wajib diisi',
            'case_narrative.max' => 'Narasi maksimal 1000 karakter',
            'material_pdf.mimes' => 'File harus berformat PDF',
            'material_pdf.max' => 'Ukuran file maksimal 10MB',
        ]);

        DB::beginTransaction();

        try {
            $pdfPath = null;
            if ($request->hasFile('material_pdf')) {
                $pdfPath = $request->file('material_pdf')->store('materials', 'public');
            }

            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (Mission::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $mission = Mission::create([
                'teacher_id' => $user->id,
                'classroom_id' => $validated['classroom_id'],
                'title' => $validated['title'],
                'slug' => $slug,
                'description' => $validated['description'],
                'difficulty_level' => $validated['difficulty_level'],
                'video_url' => $validated['video_url'],
                'case_narrative' => $validated['case_narrative'],
                'material_pdf' => $pdfPath,
                'collab_url' => $validated['collab_url'] ?? null,
                'simulator_config' => $validated['simulator_config'] ?? null,
                'prerequisite_mission_id' => $validated['prerequisite_mission_id'] ?? null,
                'started_at' => $validated['started_at'] ?? null,
                'finished_at' => $validated['finished_at'] ?? null,
            ]);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil dibuat! 🎉');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan misi: ' . $e->getMessage()]);
        }
    }

    public function edit($slug)
    {
        $user = Auth::user();

        $mission = Mission::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();

        if ($mission->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $missionsForClassroom = Mission::where('teacher_id', $user->id)
            ->select('classroom_id')
            ->distinct()
            ->get();

        $missionClassroomIds = $missionsForClassroom->pluck('classroom_id')->filter()->unique()->values()->all();

        $classrooms = Classroom::whereIn('id', $missionClassroomIds)
            ->select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $ownMissions = Mission::where('teacher_id', $user->id)
            ->select('id', 'title')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/mission/edit', [
            'mission' => [
                'id' => $mission->id,
                'classroom_id' => $mission->classroom_id,
                'title' => $mission->title,
                'description' => $mission->description,
                'difficulty_level' => $mission->difficulty_level,
                'video_url' => $mission->video_url,
                'case_narrative' => $mission->case_narrative,
                'material_pdf' => $mission->material_pdf,
                'collab_url' => $mission->collab_url,
                'simulator_config' => $mission->simulator_config,
                'prerequisite_mission_id' => $mission->prerequisite_mission_id,
                'started_at' => $mission->started_at,
                'finished_at' => $mission->finished_at,
            ],
            'classrooms' => $classrooms,
            'ownMissions' => $ownMissions,
        ]);
    }

    public function update(Request $request, Mission $mission)
    {
        $user = Auth::user();

        if ($mission->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if (is_string($request->input('material_pdf'))) {
            $request->request->remove('material_pdf');
        }

        $validated = $request->validate([
            'classroom_id' => ['required', 'exists:classrooms,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'difficulty_level' => ['required', 'integer', 'between:1,5'],
            'video_url' => ['required', 'url', 'regex:/youtube\.com|youtu\.be/'],
            'case_narrative' => ['required', 'string', 'max:1000'],
            'material_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'collab_url' => ['nullable', 'url'],
            'simulator_config' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            if ($request->hasFile('material_pdf')) {
                if ($mission->material_pdf) {
                    Storage::disk('public')->delete($mission->material_pdf);
                }
                $validated['material_pdf'] = $request->file('material_pdf')->store('materials', 'public');
            } else {
                $validated['material_pdf'] = $mission->material_pdf;
            }

            if ($validated['title'] !== $mission->title) {
                $slug = Str::slug($validated['title']);
                $originalSlug = $slug;
                $counter = 1;
                while (Mission::where('slug', $slug)->where('id', '!=', $mission->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            $mission->update([
                'classroom_id' => $validated['classroom_id'],
                'title' => $validated['title'],
                'slug' => $validated['slug'] ?? $mission->slug,
                'description' => $validated['description'],
                'difficulty_level' => $validated['difficulty_level'],
                'video_url' => $validated['video_url'],
                'case_narrative' => $validated['case_narrative'],
                'material_pdf' => $validated['material_pdf'],
                'collab_url' => $validated['collab_url'] ?? null,
                'simulator_config' => $validated['simulator_config'] ?? null,
                'prerequisite_mission_id' => $validated['prerequisite_mission_id'] ?? null,
                'started_at' => $validated['started_at'] ?? null,
                'finished_at' => $validated['finished_at'] ?? null,
            ]);

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil diperbarui! ✅');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat memperbarui misi: ' . $e->getMessage()]);
        }
    }

    public function destroy(Mission $mission)
    {
        $user = Auth::user();

        if ($mission->teacher_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        DB::beginTransaction();

        try {
            if ($mission->material_pdf) {
                Storage::disk('public')->delete($mission->material_pdf);
            }

            $mission->delete();

            DB::commit();

            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Misi berhasil dihapus! 🗑️');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus misi: ' . $e->getMessage()]);
        }
    }
}
