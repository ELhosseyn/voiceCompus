<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name_ar' => 'قسم علوم الحاسوب',
                'name_fr' => 'Département d\'Informatique',
            ],
            [
                'name_ar' => 'قسم الهندسة المدنية',
                'name_fr' => 'Département de Génie Civil',
            ],
            [
                'name_ar' => 'قسم الهندسة الكهربائية',
                'name_fr' => 'Département de Génie Électrique',
            ],
            [
                'name_ar' => 'قسم الهندسة الميكانيكية',
                'name_fr' => 'Département de Génie Mécanique',
            ],
            [
                'name_ar' => 'قسم العلوم الإدارية',
                'name_fr' => 'Département des Sciences de Gestion',
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
