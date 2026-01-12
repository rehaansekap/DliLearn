<?php

namespace App\Services\Mission;

use Illuminate\Support\Facades\DB;

class GroupService
{
    /**
     * Get group member data for a user
     */
    public function getUserGroupMember(int $userId)
    {
        return DB::table('group_members')->where('user_id', $userId)->first();
    }

    /**
     * Get all members of a group
     */
    public function getGroupMembers(int $groupId)
    {
        return DB::table('group_members')
            ->join('users', 'group_members.user_id', '=', 'users.id')
            ->where('group_members.group_id', $groupId)
            ->select('users.id as user_id', 'users.name', 'group_members.role', 'users.username', 'users.avatar')
            ->get();
    }

    /**
     * Check if user is a group leader
     */
    public function isUserLeader(int $userId): bool
    {
        $role = DB::table('group_members')
            ->where('user_id', $userId)
            ->value('role');

        return $role === 'Leader';
    }

    /**
     * Get member role by user ID
     */
    public function getMemberRole(int $userId): ?string
    {
        return DB::table('group_members')
            ->where('user_id', $userId)
            ->value('role');
    }

    /**
     * Update member role
     */
    public function updateMemberRole(int $userId, string $newRole): void
    {
        DB::table('group_members')
            ->where('user_id', $userId)
            ->update(['role' => $newRole]);
    }
}
