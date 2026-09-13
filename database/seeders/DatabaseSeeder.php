<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $exportLines = [];
        $defaultPassword = '123123123';

        // 1. Seed Admin
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make($defaultPassword),
            'role' => 'admin',
            'avatar' => 'admin_male.png',
        ]);

        $exportLines[] = '=== Admin ===';
        $exportLines[] = 'Name     : Admin';
        $exportLines[] = 'Username : admin';
        $exportLines[] = 'Email    : admin@sekolah.id';
        $exportLines[] = "Password : {$defaultPassword}";
        $exportLines[] = '';

        // 2. Seed Teachers
        $teachers = [
            [
                'name' => 'Pak Budi Santoso',
                'username' => 'guru1',
                'email' => 'guru1@sekolah.id',
                'password' => $defaultPassword,
            ],
            [
                'name' => 'Bu Siti Aminah',
                'username' => 'guru2',
                'email' => 'guru2@sekolah.id',
                'password' => $defaultPassword,
            ],
        ];

        $exportLines[] = '=== Teachers ===';
        foreach ($teachers as $teacher) {
            User::create([
                'name' => $teacher['name'],
                'username' => $teacher['username'],
                'email' => $teacher['email'],
                'password' => Hash::make($teacher['password']),
                'role' => 'teacher',
            ]);

            $exportLines[] = "Name     : {$teacher['name']}";
            $exportLines[] = "Username : {$teacher['username']}";
            $exportLines[] = "Email    : {$teacher['email']}";
            $exportLines[] = "Password : {$teacher['password']}";
            $exportLines[] = '';
        }

        // 3. Seed Students (siswa1 - siswa31)
        $exportLines[] = '=== Students (Siswa 1 - 31) ===';
        for ($i = 1; $i <= 31; $i++) {
            $name = "Siswa {$i}";
            $username = "siswa{$i}";
            $email = "siswa{$i}@sekolah.id";

            User::create([
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'password' => Hash::make($defaultPassword),
                'role' => 'student',
                'xp' => 0,
                'level' => 1,
            ]);

            $exportLines[] = "Name     : {$name}";
            $exportLines[] = "Username : {$username}";
            $exportLines[] = "Email    : {$email}";
            $exportLines[] = "Password : {$defaultPassword}";
            $exportLines[] = '';
        }

        file_put_contents(database_path('seeded-users.txt'), implode(PHP_EOL, $exportLines));
    }
}
