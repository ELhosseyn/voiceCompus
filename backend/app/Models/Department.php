<?php
// app/Models/Department.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name_ar', 'name_fr'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function suggestions()
    {
        return $this->hasMany(Suggestion::class);
    }
}