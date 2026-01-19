<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Grade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'admin',
            'avatar' => 'admin_male.png',
        ]);

        $guru1 = User::create([
            'name' => 'Pak Budi Santoso',
            'username' => 'guru1',
            'email' => 'budi@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'teacher',
        ]);

        $guru2 = User::create([
            'name' => 'Bu Siti Aminah',
            'username' => 'guru2',
            'email' => 'siti@sekolah.id',
            'password' => Hash::make('123123123'),
            'role' => 'teacher',
        ]);

        $students = [];

        for ($i = 1; $i <= 20; $i++) {

            $student = User::create([
                'name' => fake()->name(),
                'username' => "siswa$i",
                'email' => "siswa$i@sekolah.id",
                'password' => Hash::make('123123123'),
                'role' => 'student',
                'xp' => rand(0, 0),
                'level' => rand(1, 1),
            ]);

            $students[] = $student;
        }
    }
}
