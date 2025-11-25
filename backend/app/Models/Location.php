<?php
// app/Models/Location.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['name_ar', 'name_fr', 'department_id'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}