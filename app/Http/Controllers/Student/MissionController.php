<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Submission;
use App\Models\Reflection;
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

        if ($groupMember) {
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

            $currentUserRole = $groupMember->role;
        } else {
            $progress = null;
            $currentStep = 1;
            $myGroupMembers = collect();
            $currentUserRole = null;
        }

        $myReflection = Reflection::where('user_id', $user->id)
            ->where('mission_id', $mission->id)
            ->value('content');

        return Inertia::render('student/mission/show', [
            'mission' => $mission,
            'currentStep' => $currentStep,
            'unlockedStep' => $currentStep,
            'groupMembers' => $myGroupMembers,
            'currentUserRole' => $currentUserRole,
            'lkpdUrl' => asset('assets/template_lkpd.pdf'),
            'reflection' => $myReflection,
        ]);
    }
    public function submitReflection(Request $request, $slug)
    {
        $request->validate(['reflection' => 'required|string|min:10']);
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        DB::transaction(function () use ($request, $mission, $groupMember, $user) {
            Reflection::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'mission_id' => $mission->id,
                ],
                [
                    'content' => $request->reflection,
                ]
            );

            if ($groupMember) {
                $progress = DB::table('group_progress')
                    ->where('group_id', $groupMember->group_id)
                    ->where('mission_id', $mission->id)
                    ->first();

                if (!$progress) {
                    DB::table('group_progress')->insert([
                        'group_id' => $groupMember->group_id,
                        'mission_id' => $mission->id,
                        'current_step' => 2,
                        'status' => 'in_progress',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } elseif ($progress->current_step < 2) {
                    DB::table('group_progress')
                        ->where('id', $progress->id)
                        ->update(['current_step' => 2, 'updated_at' => now()]);
                }
            }
        });

        session()->flash('group_exists', (bool) $groupMember);

        if ($groupMember) {
            return redirect()->back()->with('success', 'Refleksi tersimpan! Tahap 2 terbuka.');
        }

        return redirect()->back()->with('success', 'Refleksi tersimpan! Menunggu pembentukan kelompok oleh Guru.');
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

    public function savePhase3(Request $request, $slug)
    {
        $request->validate([
            'code_attempt' => 'required|string',
            'language' => 'required|string|in:javascript,python,php',
        ]);

        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        if (!$groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok!');
        }

        DB::transaction(function () use ($request, $mission, $groupMember) {
            Submission::updateOrCreate(
                [
                    'group_id' => $groupMember->group_id,
                    'mission_id' => $mission->id
                ],
                [
                    'code_answer' => $request->code_attempt,
                ]
            );

            DB::table('group_progress')
                ->where('group_id', $groupMember->group_id)
                ->where('mission_id', $mission->id)
                ->where('current_step', 3)
                ->update(['current_step' => 4]);
        });

        return redirect()->back()->with('success', 'Eksperimen selesai! Lanjut ke tahap berikutnya.');
    }

    public function submitPhase4(Request $request, $slug)
    {
        $mission = Mission::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        $groupMember = DB::table('group_members')->where('user_id', $user->id)->first();

        if (!$groupMember) {
            return redirect()->route('dashboard')->with('error', 'Anda belum memiliki kelompok!');
        }

        if ($groupMember->role !== 'Ketua') {
            abort(403, 'Hanya Ketua Kelompok yang dapat mengumpulkan tugas akhir!');
        }

        $request->validate([
            'file_flowchart' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'code_final' => 'required|string|min:10',
        ]);

        DB::transaction(function () use ($request, $mission, $groupMember) {

            $filePath = null;
            if ($request->hasFile('file_flowchart')) {
                $file = $request->file('file_flowchart');
                $fileName = time() . '_' . $groupMember->group_id . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('submissions', $fileName, 'public');
            }

            Submission::updateOrCreate(
                [
                    'group_id' => $groupMember->group_id,
                    'mission_id' => $mission->id,
                ],
                [
                    'file_path' => $filePath,
                    'code_answer' => $request->code_final,
                    'is_final' => true,
                    'submitted_at' => now(),
                ]
            );

            DB::table('group_progress')
                ->where('group_id', $groupMember->group_id)
                ->where('mission_id', $mission->id)
                ->where('current_step', 4)
                ->update([
                    'current_step' => 5,
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);
        });

        return redirect()->back()->with('success', 'Tugas akhir berhasil dikumpulkan! Misi selesai.');
    }
}
