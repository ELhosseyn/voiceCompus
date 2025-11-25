<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name_ar' => 'مشكلة تقنية',
                'name_fr' => 'Problème Technique',
            ],
            [
                'name_ar' => 'مشكلة بنية تحتية',
                'name_fr' => 'Problème d\'Infrastructure',
            ],
            [
                'name_ar' => 'مشكلة أمنية',
                'name_fr' => 'Problème de Sécurité',
            ],
            [
                'name_ar' => 'مشكلة نظافة',
                'name_fr' => 'Problème de Propreté',
            ],
            [
                'name_ar' => 'مشكلة أثاث',
                'name_fr' => 'Problème de Mobilier',
            ],
            [
                'name_ar' => 'مشكلة إضاءة',
                'name_fr' => 'Problème d\'Éclairage',
            ],
            [
                'name_ar' => 'مشكلة تكييف',
                'name_fr' => 'Problème de Climatisation',
            ],
            [
                'name_ar' => 'أخرى',
                'name_fr' => 'Autre',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
