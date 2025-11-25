<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_anonymous' => false,
        ]);
        
        // Create department head users
        $departmentHeads = [
            [
                'name' => 'CS Department Head',
                'email' => 'cs_head@example.com',
                'department_id' => 1,
            ],
            [
                'name' => 'Civil Department Head',
                'email' => 'civil_head@example.com',
                'department_id' => 2,
            ],
            [
                'name' => 'Electrical Department Head',
                'email' => 'electrical_head@example.com',
                'department_id' => 3,
            ],
            [
                'name' => 'Mechanical Department Head',
                'email' => 'mechanical_head@example.com',
                'department_id' => 4,
            ],
            [
                'name' => 'Business Department Head',
                'email' => 'business_head@example.com',
                'department_id' => 5,
            ],
        ];
        
        foreach ($departmentHeads as $head) {
            User::create([
                'name' => $head['name'],
                'email' => $head['email'],
                'password' => Hash::make('password'),
                'role' => 'department_head',
                'is_anonymous' => false,
                'department_id' => $head['department_id'],
            ]);
        }
        
        // Create regular users (students)
        $students = [
            [
                'name' => 'CS Student 1',
                'email' => 'cs_student1@example.com',
                'department_id' => 1,
            ],
            [
                'name' => 'CS Student 2',
                'email' => 'cs_student2@example.com',
                'department_id' => 1,
            ],
            [
                'name' => 'Civil Student 1',
                'email' => 'civil_student1@example.com',
                'department_id' => 2,
            ],
            [
                'name' => 'Electrical Student 1',
                'email' => 'electrical_student1@example.com',
                'department_id' => 3,
            ],
            [
                'name' => 'Mechanical Student 1',
                'email' => 'mechanical_student1@example.com',
                'department_id' => 4,
            ],
            [
                'name' => 'Business Student 1',
                'email' => 'business_student1@example.com',
                'department_id' => 5,
            ],
        ];
        
        foreach ($students as $student) {
            User::create([
                'name' => $student['name'],
                'email' => $student['email'],
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_anonymous' => false,
                'department_id' => $student['department_id'],
            ]);
        }
        
        // Create an anonymous user
        User::create([
            'name' => 'Anonymous User',
            'email' => 'anonymous@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'is_anonymous' => true,
        ]);
    }
}
