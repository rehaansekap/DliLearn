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
        Schema::create('group_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('mission_id')->constrained('missions')->onDelete('cascade');

            // 0=Belum, 1=Orientasi, 2=Organisasi, 3=Penyelidikan, 4=Submit, 5=Selesai
            $table->integer('current_step')->default(0);
            $table->enum('status', ['locked', 'in_progress', 'completed'])->default('locked');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_progress');
    }
};
