<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherMissionController extends Controller
{
    public function show($id)
    {
        $user = Auth::user();

        // Ambil data misi
        $mission = Mission::findOrFail($id);

        // Ambil semua kelompok yang terkait dengan kelas yang diajar guru ini
        // dan memiliki progress untuk misi ini
        $groups = Group::select([
            'groups.id as group_id',
            'groups.name as group_name',
            'groups.group_code',
            'group_progress.current_step',
            'group_progress.status',
        ])
            ->join('classrooms', 'groups.classroom_id', '=', 'classrooms.id')
            ->join('group_progress', 'groups.id', '=', 'group_progress.group_id')
            ->where('classrooms.teacher_id', $user->id)
            ->where('group_progress.mission_id', $mission->id)
            ->withCount('members as members_count')
            ->get()
            ->map(function ($group) use ($mission) {
                // Cek apakah kelompok sudah submit
                $hasSubmitted = DB::table('submissions')
                    ->where('group_id', $group->group_id)
                    ->where('mission_id', $mission->id)
                    ->where('is_final', true)
                    ->exists();

                // Cek apakah sudah dinilai
                $isGraded = false;
                if ($hasSubmitted) {
                    $submissionId = DB::table('submissions')
                        ->where('group_id', $group->group_id)
                        ->where('mission_id', $mission->id)
                        ->where('is_final', true)
                        ->value('id');

                    if ($submissionId) {
                        $isGraded = DB::table('grades')
                            ->where('submission_id', $submissionId)
                            ->exists();
                    }
                }

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

        // Hitung statistik
        $totalGroups = $groups->count();
        $completedGroups = $groups->where('status', 'completed')->count();

        // Perlu review = sudah submit tapi belum dinilai
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
            'groups' => $groups->values(),
            'stats' => [
                'totalGroups' => $totalGroups,
                'completedGroups' => $completedGroups,
                'needsReview' => $needsReview,
            ],
        ]);
    }
}
