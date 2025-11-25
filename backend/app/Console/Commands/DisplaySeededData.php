<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Department;
use App\Models\Location;
use App\Models\Report;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Console\Command;

class DisplaySeededData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:display-seeded-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Display seeded data from all tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Displaying seeded data from all tables');
        $this->newLine();
        
        // Display Departments
        $this->info('Departments:');
        $departments = Department::all(['id', 'name_ar', 'name_fr']);
        $this->table(['ID', 'Name (Arabic)', 'Name (French)'], $departments->toArray());
        $this->newLine();
        
        // Display Users
        $this->info('Users:');
        $users = User::all(['id', 'name', 'email', 'role', 'department_id', 'is_anonymous']);
        $this->table(['ID', 'Name', 'Email', 'Role', 'Department ID', 'Is Anonymous'], $users->toArray());
        $this->newLine();
        
        // Display Locations
        $this->info('Locations:');
        $locations = Location::all(['id', 'name_ar', 'name_fr', 'department_id']);
        $this->table(['ID', 'Name (Arabic)', 'Name (French)', 'Department ID'], $locations->toArray());
        $this->newLine();
        
        // Display Categories
        $this->info('Categories:');
        $categories = Category::all(['id', 'name_ar', 'name_fr']);
        $this->table(['ID', 'Name (Arabic)', 'Name (French)'], $categories->toArray());
        $this->newLine();
        
        // Display Reports
        $this->info('Reports:');
        $reports = Report::all(['id', 'title', 'user_id', 'category_id', 'location_id', 'status']);
        $this->table(['ID', 'Title', 'User ID', 'Category ID', 'Location ID', 'Status'], $reports->toArray());
        $this->newLine();
        
        // Display Suggestions
        $this->info('Suggestions:');
        $suggestions = Suggestion::all(['id', 'title', 'user_id', 'department_id', 'status']);
        $this->table(['ID', 'Title', 'User ID', 'Department ID', 'Status'], $suggestions->toArray());
        $this->newLine();
        
        // Display Suggestion Votes
        $this->info('Suggestion Votes:');
        $suggestionVotes = [];
        $suggestions = Suggestion::with('votes')->get();
        foreach ($suggestions as $suggestion) {
            $voteCount = $suggestion->votes->count();
            if ($voteCount > 0) {
                $suggestionVotes[] = [
                    'suggestion_id' => $suggestion->id,
                    'suggestion_title' => $suggestion->title,
                    'vote_count' => $voteCount,
                    'voter_ids' => $suggestion->votes->pluck('id')->join(', ')
                ];
            }
        }
        if (count($suggestionVotes) > 0) {
            $this->table(['Suggestion ID', 'Suggestion Title', 'Vote Count', 'Voter IDs'], $suggestionVotes);
        } else {
            $this->info('No suggestion votes found.');
        }
    }
}
