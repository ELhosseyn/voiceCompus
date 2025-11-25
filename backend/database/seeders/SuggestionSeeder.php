<?php

namespace Database\Seeders;

use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuggestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suggestions = [
            // CS Student suggestions
            [
                'title' => 'Extended Lab Hours',
                'description' => 'It would be beneficial to have the computer lab open for longer hours, especially during exam periods. Many students need access to specialized software that is only available in the lab.',
                'status' => 'pending',
                'user_id' => 7, // CS Student 1
                'department_id' => 1, // CS Department
            ],
            [
                'title' => 'Programming Workshops',
                'description' => 'I suggest organizing weekly programming workshops where students can collaborate on projects and learn from each other. This would enhance our practical skills.',
                'status' => 'in_progress',
                'user_id' => 8, // CS Student 2
                'department_id' => 1, // CS Department
            ],
            
            // Civil Engineering Student suggestion
            [
                'title' => 'Field Trips to Construction Sites',
                'description' => 'Regular field trips to active construction sites would provide valuable real-world experience and context for our theoretical learning.',
                'status' => 'implemented',
                'user_id' => 9, // Civil Student 1
                'department_id' => 2, // Civil Engineering Department
            ],
            
            // Electrical Engineering Student suggestion
            [
                'title' => 'Electronics Club',
                'description' => 'Starting an electronics club would allow students to work on personal projects and share knowledge outside of regular class time.',
                'status' => 'pending',
                'user_id' => 10, // Electrical Student 1
                'department_id' => 3, // Electrical Engineering Department
            ],
            
            // Mechanical Engineering Student suggestion
            [
                'title' => 'CAD Software Update',
                'description' => 'The CAD software in the mechanical lab is outdated. Updating to the latest version would help students learn industry-standard tools.',
                'status' => 'in_progress',
                'user_id' => 11, // Mechanical Student 1
                'department_id' => 4, // Mechanical Engineering Department
            ],
            
            // Business Student suggestion
            [
                'title' => 'Guest Speakers from Industry',
                'description' => 'Regular guest speakers from various industries would provide valuable insights and networking opportunities for business students.',
                'status' => 'pending',
                'user_id' => 12, // Business Student 1
                'department_id' => 5, // Business Department
            ],
            
            // Anonymous user suggestion
            [
                'title' => 'Improved Campus WiFi',
                'description' => 'The WiFi coverage on campus has many dead spots. Improving coverage would enhance the learning experience for all students.',
                'status' => 'pending',
                'user_id' => 13, // Anonymous User
                'department_id' => 1, // Assigned to CS Department for technical implementation
            ],
        ];

        foreach ($suggestions as $suggestion) {
            $suggestionModel = Suggestion::create($suggestion);
            
            // Add some votes to suggestions
            if ($suggestion['title'] === 'Extended Lab Hours') {
                // Add votes from multiple users
                $suggestionModel->votes()->attach([8, 9, 10]); // CS Student 2, Civil Student 1, Electrical Student 1
            } elseif ($suggestion['title'] === 'Improved Campus WiFi') {
                // This is a popular suggestion
                $suggestionModel->votes()->attach([7, 8, 9, 10, 11, 12]); // All students
            } elseif ($suggestion['title'] === 'Guest Speakers from Industry') {
                // A few votes
                $suggestionModel->votes()->attach([7, 11]); // CS Student 1, Mechanical Student 1
            }
        }
    }
}
