<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users');

            // Critical Thinking Score
            $table->integer('score_clarification')->default(0);
            $table->integer('score_assessment')->default(0);
            $table->integer('score_strategy')->default(0);
            $table->integer('score_conclusion')->default(0);

            // Deep Learning Score
            $table->integer('score_collaboration')->default(0);
            $table->text('teacher_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
