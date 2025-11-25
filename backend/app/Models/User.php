<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_anonymous',
        'department_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_anonymous' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function suggestions()
    {
        return $this->hasMany(Suggestion::class);
    }

    public function votedSuggestions()
    {
        return $this->belongsToMany(Suggestion::class, 'suggestion_votes', 'user_id', 'suggestion_id');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isDepartmentAdmin()
    {
        return $this->role === 'department_admin';
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }
}