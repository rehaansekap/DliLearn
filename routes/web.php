<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\MissionController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\TeacherMissionController;
use App\Http\Controllers\Admin\AdminDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'student'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/mission/{slug}', [MissionController::class, 'show'])->name('mission.show');
    Route::post('/mission/{slug}/reflection', [MissionController::class, 'submitReflection'])->name('mission.reflection');
    Route::post('/mission/{slug}/update-role', [MissionController::class, 'updateRole'])->name('mission.update-role');
    Route::post('/mission/{slug}/complete-step-2', [MissionController::class, 'completeStep2'])->name('mission.complete-step-2');
    Route::post('/mission/{slug}/save-phase-3', [MissionController::class, 'savePhase3'])->name('mission.save-phase-3');
    Route::post('/mission/{slug}/submit-phase-4', [MissionController::class, 'submitPhase4'])->name('mission.submit-phase-4');
    Route::post('/mission/{slug}/vote', [MissionController::class, 'submitVote'])->name('mission.vote');
    Route::post('/submission/{submissionId}/like', [MissionController::class, 'toggleLike'])->name('mission.like');
    Route::post('/submission/{submissionId}/feedback', [MissionController::class, 'submitFeedback'])->name('mission.feedback');
    Route::get('/submission/{submissionId}/feedbacks', [MissionController::class, 'getFeedbacks'])->name('mission.get-feedbacks');
    Route::post('/mission/{slug}/finish', [MissionController::class, 'submitFinalReflection'])->name('mission.finish');
});

Route::middleware(['auth', 'verified', 'teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
    Route::get('/mission/create', [TeacherMissionController::class, 'create'])->name('missions.create');
    Route::post('/mission', [TeacherMissionController::class, 'store'])->name('missions.store');
    Route::get('/mission/{slug}/edit', [TeacherMissionController::class, 'edit'])->name('missions.edit');
    Route::put('/mission/{mission}', [TeacherMissionController::class, 'update'])->name('missions.update');
    Route::delete('/mission/{mission}', [TeacherMissionController::class, 'destroy'])->name('missions.destroy');
    Route::get('/mission/{slug}', [TeacherMissionController::class, 'show'])->name('mission.show');
    Route::post('/mission/{mission}/attendance', [TeacherMissionController::class, 'saveAttendance'])->name('mission.attendance');
    Route::post('/mission/{mission}/update-groups', [TeacherMissionController::class, 'updateGroups'])->name('mission.update-groups');
    Route::post('/submission/{submission}/grade', [TeacherMissionController::class, 'saveGrade'])->name('submission.grade');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [App\Http\Controllers\Admin\AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [App\Http\Controllers\Admin\AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [App\Http\Controllers\Admin\AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [App\Http\Controllers\Admin\AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\AdminUserController::class, 'destroy'])->name('users.destroy');

    Route::get('/classrooms', [App\Http\Controllers\Admin\AdminClassroomController::class, 'index'])->name('classrooms.index');
    Route::get('/classrooms/create', [App\Http\Controllers\Admin\AdminClassroomController::class, 'create'])->name('classrooms.create');
    Route::post('/classrooms', [App\Http\Controllers\Admin\AdminClassroomController::class, 'store'])->name('classrooms.store');
    Route::get('/classrooms/{classroom}/edit', [App\Http\Controllers\Admin\AdminClassroomController::class, 'edit'])->name('classrooms.edit');
    Route::put('/classrooms/{classroom}', [App\Http\Controllers\Admin\AdminClassroomController::class, 'update'])->name('classrooms.update');
    Route::delete('/classrooms/{classroom}', [App\Http\Controllers\Admin\AdminClassroomController::class, 'destroy'])->name('classrooms.destroy');
});

if (file_exists(__DIR__ . '/auth.php')) {
    require __DIR__ . '/auth.php';
}
require __DIR__ . '/settings.php';
