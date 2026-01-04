<?php

namespace App\Services\Mission;

use App\Models\User;

class RewardService
{
    /**
     * Award XP to user and update level
     */
    public function awardUserXp(int $userId, int $xpAmount): void
    {
        User::where('id', $userId)->increment('xp', $xpAmount);

        $freshUser = User::find($userId);
        $newLevel = floor($freshUser->xp / 300) + 1;

        if ($newLevel > $freshUser->level) {
            $freshUser->update(['level' => $newLevel]);
        }
    }
}
