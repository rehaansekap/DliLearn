<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\MissionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/mission/{slug}', [MissionController::class, 'show'])->name('mission.show');
    Route::post('/mission/{slug}/reflection', [MissionController::class, 'submitReflection'])->name('mission.reflection');
    Route::post('/mission/{slug}/update-role', [MissionController::class, 'updateRole'])->name('mission.update-role');
    Route::post('/mission/{slug}/complete-step-2', [MissionController::class, 'completeStep2'])->name('mission.complete-step-2');
    Route::post('/mission/{slug}/save-phase-3', [MissionController::class, 'savePhase3'])->name('mission.save-phase-3');
});

require __DIR__ . '/settings.php';
