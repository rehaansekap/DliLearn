<?php

namespace App\Services\Mission;

use App\Models\BestGroupVote;
use Illuminate\Support\Facades\DB;

class VoteService
{
    public function hasVoted(int $groupId, int $missionId): bool
    {
        return BestGroupVote::where('voter_group_id', $groupId)
            ->where('mission_id', $missionId)
            ->exists();
    }

    public function getGroupVote(int $groupId, int $missionId): ?int
    {
        $vote = BestGroupVote::where('voter_group_id', $groupId)
            ->where('mission_id', $missionId)
            ->first();

        return $vote?->voted_group_id;
    }

    public function submitVote(int $missionId, int $voterGroupId, int $votedGroupId, int $voterUserId): void
    {
        if ($voterGroupId === $votedGroupId) {
            throw new \Exception('Tidak dapat memilih kelompok sendiri');
        }

        BestGroupVote::updateOrCreate(
            [
                'mission_id' => $missionId,
                'voter_group_id' => $voterGroupId,
            ],
            [
                'voted_group_id' => $votedGroupId,
                'voter_user_id' => $voterUserId,
            ]
        );
    }
    public function getVotableGroups(int $missionId, int $excludeGroupId)
    {
        return DB::table('submissions')
            ->join('groups', 'submissions.group_id', '=', 'groups.id')
            ->where('submissions.mission_id', $missionId)
            ->where('submissions.is_final', true)
            ->where('groups.id', '!=', $excludeGroupId)
            ->select('groups.id', 'groups.name', 'groups.group_code')
            ->distinct()
            ->get();
    }
    public function getVoteResults(int $missionId)
    {
        return DB::table('best_group_votes')
            ->join('groups', 'best_group_votes.voted_group_id', '=', 'groups.id')
            ->where('best_group_votes.mission_id', $missionId)
            ->select(
                'groups.id as group_id',
                'groups.name as group_name',
                'groups.group_code',
                DB::raw('COUNT(best_group_votes.id) as vote_count')
            )
            ->groupBy('groups.id', 'groups.name', 'groups.group_code')
            ->orderByDesc('vote_count')
            ->get();
    }
}
