<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MissionController extends Controller
{
    public function show($slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        if (!$groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok!');
        }

        $progress = DB::table('group_progress')
            ->where('group_id', $groupMember->group_id)
            ->where('mission_id', $mission->id)
            ->first();

        $currentStep = $progress ? $progress->current_step : 1;

        $myGroupMembers = DB::table('group_members')
            ->join('users', 'group_members.user_id', '=', 'users.id')
            ->where('group_members.group_id', $groupMember->group_id)
            ->select('users.id as user_id', 'users.name', 'group_members.role', 'users.username', 'users.avatar')
            ->get();

        return Inertia::render('student/mission/show', [
            'mission' => $mission,
            'currentStep' => $currentStep,
            'unlockedStep' => $currentStep,
            'groupMembers' => $myGroupMembers,
            'currentUserRole' => $groupMember->role,
            'lkpdUrl' => asset('assets/template_lkpd.pdf'),
        ]);
    }
    public function submitReflection(Request $request, $slug)
    {
        $request->validate(['reflection' => 'required|string|min:10']);
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        DB::transaction(function () use ($request, $mission, $groupMember) {
            Submission::updateOrCreate(
                ['group_id' => $groupMember->group_id, 'mission_id' => $mission->id],
                ['reflection_answer' => $request->reflection]
            );

            $progress = DB::table('group_progress')
                ->where('group_id', $groupMember->group_id)
                ->where('mission_id', $mission->id)
                ->first();

            if (!$progress) {
                DB::table('group_progress')->insert([
                    'group_id' => $groupMember->group_id,
                    'mission_id' => $mission->id,
                    'current_step' => 2,
                    'status' => 'in_progress'
                ]);
            } elseif ($progress->current_step < 2) {
                DB::table('group_progress')->where('id', $progress->id)->update(['current_step' => 2]);
            }
        });

        return redirect()->back()->with('success', 'Refleksi tersimpan! Tahap 2 terbuka.');
    }
    public function updateRole(Request $request, $slug)
    {
        $request->validate([
            'target_user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:Coder,Designer,Notulis,Anggota'
        ]);

        $user = Auth::user();

        $myRole = DB::table('group_members')
            ->where('user_id', $user->id)
            ->value('role');

        if ($myRole !== 'Ketua') {
            abort(403, 'Hanya Ketua Kelompok yang boleh mengubah peran anggota!');
        }

        $targetRole = DB::table('group_members')
            ->where('user_id', $request->target_user_id)
            ->value('role');

        if ($targetRole === 'Ketua') {
            return redirect()->back()->with('error', 'Peran Ketua tidak bisa diubah di sini. Hubungi Guru.');
        }

        DB::table('group_members')
            ->where('user_id', $request->target_user_id)
            ->update(['role' => $request->role]);

        return redirect()->back()->with('success', 'Peran anggota berhasil diperbarui!');
    }

    public function completeStep2(Request $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        DB::table('group_progress')
            ->where('group_id', $groupMember->group_id)
            ->where('mission_id', $mission->id)
            ->where('current_step', 2)
            ->update(['current_step' => 3]);

        return redirect()->back()->with('success', 'Organisasi selesai! Lanjut ke Penyelidikan.');
    }
}
