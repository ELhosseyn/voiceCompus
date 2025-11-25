<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // Computer Science Department (ID: 1)
            [
                'name_ar' => 'قاعة المحاضرات 1',
                'name_fr' => 'Salle de Conférence 1',
                'department_id' => 1,
            ],
            [
                'name_ar' => 'مختبر الحاسوب',
                'name_fr' => 'Laboratoire Informatique',
                'department_id' => 1,
            ],
            [
                'name_ar' => 'قاعة الدراسة 101',
                'name_fr' => 'Salle d\'Étude 101',
                'department_id' => 1,
            ],
            
            // Civil Engineering Department (ID: 2)
            [
                'name_ar' => 'مختبر المواد',
                'name_fr' => 'Laboratoire des Matériaux',
                'department_id' => 2,
            ],
            [
                'name_ar' => 'قاعة الرسم الهندسي',
                'name_fr' => 'Salle de Dessin Technique',
                'department_id' => 2,
            ],
            
            // Electrical Engineering Department (ID: 3)
            [
                'name_ar' => 'مختبر الإلكترونيات',
                'name_fr' => 'Laboratoire d\'Électronique',
                'department_id' => 3,
            ],
            [
                'name_ar' => 'ورشة الكهرباء',
                'name_fr' => 'Atelier d\'Électricité',
                'department_id' => 3,
            ],
            
            // Mechanical Engineering Department (ID: 4)
            [
                'name_ar' => 'ورشة الميكانيكا',
                'name_fr' => 'Atelier de Mécanique',
                'department_id' => 4,
            ],
            [
                'name_ar' => 'مختبر الحرارة',
                'name_fr' => 'Laboratoire Thermique',
                'department_id' => 4,
            ],
            
            // Business Administration Department (ID: 5)
            [
                'name_ar' => 'قاعة المؤتمرات',
                'name_fr' => 'Salle de Conférence',
                'department_id' => 5,
            ],
            [
                'name_ar' => 'مركز الأعمال',
                'name_fr' => 'Centre d\'Affaires',
                'department_id' => 5,
            ],
            
            // Common Areas
            [
                'name_ar' => 'المكتبة',
                'name_fr' => 'Bibliothèque',
                'department_id' => 1, // Assigned to CS department for management
            ],
            [
                'name_ar' => 'الكافتيريا',
                'name_fr' => 'Cafétéria',
                'department_id' => 5, // Assigned to Business department for management
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
