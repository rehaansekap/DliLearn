<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $missions = Mission::all()->map(function ($mission) {
            return [
                'id' => $mission->id,
                'title' => $mission->title,
                'description' => $mission->description,
                'level' => $mission->difficulty_level,
                'slug' => $mission->slug,
                'status' => 'unlocked'
            ];
        });

        return Inertia::render('student/dashboard', [
            'missions' => $missions,
            'userXp' => $user->xp,
            'userLevel' => $user->level,
        ]);
    }
}
