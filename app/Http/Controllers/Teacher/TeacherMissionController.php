<?php
// filepath: app/Http/Controllers/Teacher/TeacherMissionController.php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeacherMissionController extends Controller
{
    public function index($slug)
    {
        $user = Auth::user();
        $mission = Mission::where('slug', $slug)
            ->where('teacher_id', $user->id)
            ->firstOrFail();

        $groups = DB::table('groups')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->leftJoin('submissions', function ($join) use ($mission) {
                $join->on('groups.id', '=', 'submissions.group_id')
                    ->where('submissions.mission_id', '=', $mission->id)
                    ->where('submissions.is_final', '=', true);
            })
            ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
            ->where('group_progress.mission_id', $mission->id)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                'group_progress.current_step',
                'group_progress.status',
                DB::raw('COUNT(DISTINCT group_members.id) as members_count')
            )
            ->leftJoin('group_members', 'groups.id', '=', 'group_members.group_id')
            ->groupBy('groups.id', 'groups.name', 'groups.group_code', 'group_progress.current_step', 'group_progress.status')
            ->get()
            ->map(function ($group) use ($mission) {
                $hasSubmitted = DB::table('submissions')
                    ->where('group_id', $group->group_id)
                    ->where('mission_id', $mission->id)
                    ->where('is_final', true)
                    ->exists();

                $isGraded = DB::table('grades')
                    ->whereIn('submission_id', function ($query) use ($group, $mission) {
                        $query->select('id')
                            ->from('submissions')
                            ->where('group_id', $group->group_id)
                            ->where('mission_id', $mission->id)
                            ->where('is_final', true);
                    })
                    ->exists();

                return [
                    'group_id' => $group->group_id,
                    'group_name' => $group->group_name,
                    'group_code' => $group->group_code,
                    'current_step' => $group->current_step ?? 0,
                    'status' => $group->status ?? 'locked',
                    'members_count' => $group->members_count ?? 0,
                    'has_submitted' => $hasSubmitted,
                    'is_graded' => $isGraded,
                ];
            });

        $totalGroups = $groups->count();
        $completedGroups = $groups->where('status', 'completed')->count();

        $needsReview = $groups->filter(function ($group) {
            return $group['has_submitted'] && !$group['is_graded'];
        })->count();

        return Inertia::render('teacher/mission/index', [
            'mission' => [
                'id' => $mission->id,
                'title' => $mission->title,
                'description' => $mission->description,
                'difficulty_level' => $mission->difficulty_level,
                'slug' => $mission->slug,
            ],
            'groups' => $groups,
            'stats' => [
                'totalGroups' => $totalGroups,
                'completedGroups' => $completedGroups,
                'needsReview' => $needsReview,
            ],
        ]);
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
            // 'prerequisite_mission_id' => ['nullable', 'exists:missions,id'],
            // 'started_at' => ['nullable', 'date'],
            // 'finished_at' => ['nullable', 'date'],
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
