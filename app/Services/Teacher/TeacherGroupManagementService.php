<?php

namespace App\Services\Teacher;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherGroupManagementService
{
    /**
     * Update groups and their members
     */
    public function updateGroups(int $missionId, array $groupsData): array
    {
        Log::info('Updating groups', ['mission_id' => $missionId, 'groups' => $groupsData]);

        $classroomId = DB::table('missions')->where('id', $missionId)->value('classroom_id');

        $createdMapping = [];

        foreach ($groupsData as $groupData) {
            $originalId = $groupData['group_id'];
            $exists = DB::table('groups')->where('id', $originalId)->exists();

            if ($exists) {
                $groupId = $originalId;
                DB::table('groups')
                    ->where('id', $groupId)
                    ->update([
                        'name' => $groupData['group_name'],
                        'group_code' => $groupData['group_code'],
                        'updated_at' => now(),
                    ]);
            } else {

                $groupId = DB::table('groups')->insertGetId([
                    'name' => $groupData['group_name'],
                    'group_code' => $groupData['group_code'],
                    'classroom_id' => $classroomId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $createdMapping[(string)$originalId] = $groupId;
            }

            DB::table('group_progress')->updateOrInsert(
                ['group_id' => $groupId, 'mission_id' => $missionId],
                [
                    'current_step' => 1,
                    'status' => 'locked',
                    'collab_url' => $groupData['collab_url'] ?? null,
                    'created_at' => now()
                ]
            );

            DB::table('group_members')->where('group_id', $groupId)->delete();

            $inserts = [];
            foreach ($groupData['members'] as $member) {
                $inserts[] = [
                    'group_id' => $groupId,
                    'user_id' => $member['user_id'],
                    'role' => $member['role'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if (!empty($inserts)) {
                DB::table('group_members')->insert($inserts);
            }
        }

        return $createdMapping;
    }

    /**
     * Get group by ID
     */
    public function getGroup(int $groupId): ?object
    {
        return DB::table('groups')
            ->where('id', $groupId)
            ->first();
    }

    /**
     * Get group members
     */
    public function getGroupMembers(int $groupId): array
    {
        return DB::table('group_members')
            ->join('users', 'group_members.user_id', '=', 'users.id')
            ->where('group_members.group_id', $groupId)
            ->select('users.id', 'users.name', 'users.username', 'users.avatar', 'group_members.role')
            ->get()
            ->toArray();
    }

    /**
     * Validate group structure before saving
     */
    public function validateGroupStructure(array $groupsData): array
    {
        $errors = [];

        foreach ($groupsData as $index => $group) {

            $leaders = collect($group['members'])->where('role', 'Leader')->count();

            if ($leaders === 0) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} harus memiliki minimal 1 Leader";
            }

            if ($leaders > 1) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} hanya boleh memiliki 1 Leader";
            }


            if (count($group['members']) < 3) {
                $errors["groups.{$index}"] = "Kelompok {$group['group_name']} harus memiliki minimal 3 anggota";
            }
        }

        return $errors;
    }
}
