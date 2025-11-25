<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call seeders in the correct order to respect foreign key constraints
        $this->call([
            // First seed departments (no foreign key dependencies)
            DepartmentSeeder::class,
            
            // Then seed users (depends on departments)
            UserSeeder::class,
            
            // Then seed locations (depends on departments)
            LocationSeeder::class,
            
            // Then seed categories (no foreign key dependencies)
            CategorySeeder::class,
            
            // Then seed reports (depends on users, categories, and locations)
            ReportSeeder::class,
            
            // Finally seed suggestions (depends on users and departments)
            SuggestionSeeder::class,
        ]);
    }
}
