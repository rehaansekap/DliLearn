<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Mission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $classrooms = Classroom::where('teacher_id', $user->id)
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                    'academic_year' => $classroom->academic_year,
                    'join_code' => $classroom->join_code,
                    'students_count' => $classroom->students_count,
                    'created_at' => $classroom->created_at,
                ];
            });

        $totalClasses = $classrooms->count();
        $totalStudents = $classrooms->sum('students_count');
        $activeMissions = Mission::whereNotNull('started_at')
            ->whereNull('finished_at')
            ->count();

        return Inertia::render('teacher/dashboard/index', [
            'classrooms' => $classrooms,
            'stats' => [
                'totalClasses' => $totalClasses,
                'totalStudents' => $totalStudents,
                'activeMissions' => $activeMissions,
            ],
        ]);
    }
}
