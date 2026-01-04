<?php

namespace App\Services\Mission;

use Illuminate\Support\Facades\DB;

class FeedbackService
{
    /**
     * Store feedback for a submission
     */
    public function storeFeedback(int $submissionId, int $userId, string $message): void
    {
        DB::table('feedbacks')->insert([
            'submission_id' => $submissionId,
            'user_id' => $userId,
            'message' => $message,
            'type' => 'peer_review',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Get feedbacks for a submission
     */
    public function getFeedbacks(int $submissionId)
    {
        return DB::table('feedbacks')
            ->join('users', 'feedbacks.user_id', '=', 'users.id')
            ->where('feedbacks.submission_id', $submissionId)
            ->select('feedbacks.*', 'users.name as user_name', 'users.avatar')
            ->orderBy('feedbacks.created_at', 'desc')
            ->get();
    }
}
