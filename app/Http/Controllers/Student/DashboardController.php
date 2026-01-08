<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Services\Mission\MissionLockService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected MissionLockService $lockService
    ) {}

    public function index()
    {
        $user = Auth::user();

        $missions = Mission::orderBy('difficulty_level')
            ->orderBy('id')
            ->get()
            ->map(function ($mission) use ($user) {
                $lockStatus = $this->lockService->getMissionStatus($mission, $user);

                return [
                    'id' => $mission->id,
                    'title' => $mission->title,
                    'description' => $mission->description,
                    'level' => $mission->difficulty_level,
                    'slug' => $mission->slug,
                    'status' => $lockStatus['status'],
                    'locked' => $lockStatus['locked'],
                    'prerequisite' => $lockStatus['prerequisite'],
                    'started_at' => $mission->started_at,
                    'finished_at' => $mission->finished_at,
                ];
            });

        return Inertia::render('student/dashboard/index', [
            'missions' => $missions,
            'userXp' => $user->xp,
            'userLevel' => $user->level,
        ]);
    }
}
