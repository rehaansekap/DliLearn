<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Mission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $classrooms = Classroom::where('teacher_id', $user->id)
            ->select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $missions = Mission::where('teacher_id', $user->id)
            ->with(['classroom:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($mission) {
                $groupStats = DB::table('group_progress')
                    ->join('groups', 'group_progress.group_id', '=', 'groups.id')
                    ->where('group_progress.mission_id', $mission->id)
                    ->where('groups.classroom_id', $mission->classroom_id)
                    ->selectRaw('
                        COUNT(*) as total_groups,
                        SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed_groups
                    ')
                    ->first();

                $needsReview = DB::table('submissions')
                    ->join('groups', 'submissions.group_id', '=', 'groups.id')
                    ->leftJoin('grades', 'submissions.id', '=', 'grades.submission_id')
                    ->where('submissions.mission_id', $mission->id)
                    ->where('groups.classroom_id', $mission->classroom_id)
                    ->where('submissions.is_final', true)
                    ->whereNull('grades.id')
                    ->count();

                return [
                    'id' => $mission->id,
                    'title' => $mission->title,
                    'description' => $mission->description,
                    'difficulty_level' => $mission->difficulty_level,
                    'slug' => $mission->slug,
                    'classroom_id' => $mission->classroom_id,
                    'classroom_name' => $mission->classroom?->name ?? 'N/A',
                    'total_groups' => $groupStats->total_groups ?? 0,
                    'completed_groups' => $groupStats->completed_groups ?? 0,
                    'needs_review' => $needsReview,
                    'started_at' => $mission->started_at,
                    'finished_at' => $mission->finished_at,
                ];
            });

        $missionClassroomIds = $missions->pluck('classroom_id')->filter()->unique()->values()->all();

        $classrooms = Classroom::whereIn('id', $missionClassroomIds)
            ->select('id', 'name', 'academic_year')
            ->orderBy('name')
            ->get();

        $totalStudents = DB::table('classroom_user')
            ->whereIn('classroom_id', $missionClassroomIds)
            ->count();

        $activeMissions = $missions->filter(function ($m) {
            return $m['started_at'] && !$m['finished_at'];
        })->count();

        $pendingReview = $missions->sum('needs_review');

        return Inertia::render('teacher/dashboard/index', [
            'missions' => $missions->values(),
            'classrooms' => $classrooms,
            'stats' => [
                'totalMissions' => $missions->count(),
                'totalStudents' => $totalStudents,
                'activeMissions' => $activeMissions,
                'pendingReview' => $pendingReview,
            ],
        ]);
    }
}
