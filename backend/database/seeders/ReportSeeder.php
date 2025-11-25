<?php

namespace Database\Seeders;

use App\Models\Report;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = [
            // CS Student reports
            [
                'title' => 'Computer Lab Equipment Issue',
                'description' => 'Several computers in the lab are not functioning properly. Monitors display blue screens and keyboards are unresponsive.',
                'status' => 'pending',
                'user_id' => 7, // CS Student 1
                'category_id' => 1, // Technical Problem
                'location_id' => 2, // Computer Lab
            ],
            [
                'title' => 'Projector Not Working',
                'description' => 'The projector in Lecture Hall 1 is not displaying properly. The image is very dim and difficult to see.',
                'status' => 'in_progress',
                'user_id' => 8, // CS Student 2
                'category_id' => 1, // Technical Problem
                'location_id' => 1, // Lecture Hall 1
            ],
            
            // Civil Engineering Student report
            [
                'title' => 'Broken Chair',
                'description' => 'There are three broken chairs in the Materials Lab that need to be replaced. They pose a safety risk.',
                'status' => 'resolved',
                'user_id' => 9, // Civil Student 1
                'category_id' => 5, // Furniture Problem
                'location_id' => 4, // Materials Lab
            ],
            
            // Electrical Engineering Student report
            [
                'title' => 'Poor Lighting',
                'description' => 'The lighting in the Electronics Lab is insufficient, making it difficult to work on small components.',
                'status' => 'pending',
                'user_id' => 10, // Electrical Student 1
                'category_id' => 6, // Lighting Problem
                'location_id' => 6, // Electronics Lab
            ],
            
            // Mechanical Engineering Student report
            [
                'title' => 'Air Conditioning Issue',
                'description' => 'The air conditioning in the Mechanical Workshop is not working properly. The room gets very hot during practical sessions.',
                'status' => 'in_progress',
                'user_id' => 11, // Mechanical Student 1
                'category_id' => 7, // Air Conditioning Problem
                'location_id' => 8, // Mechanical Workshop
            ],
            
            // Business Student report
            [
                'title' => 'Cleanliness Issue in Conference Room',
                'description' => 'The conference room has not been cleaned properly for several days. There is trash and dust accumulating.',
                'status' => 'pending',
                'user_id' => 12, // Business Student 1
                'category_id' => 4, // Cleanliness Problem
                'location_id' => 10, // Conference Room
            ],
            
            // Anonymous user report
            [
                'title' => 'Security Concern in Library',
                'description' => 'I noticed that the emergency exit in the library is blocked by furniture. This seems like a safety hazard.',
                'status' => 'pending',
                'user_id' => 13, // Anonymous User
                'category_id' => 3, // Security Problem
                'location_id' => 12, // Library
            ],
        ];

        foreach ($reports as $report) {
            Report::create($report);
        }
    }
}
