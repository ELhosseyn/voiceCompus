<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\SuggestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/login', [LoginController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [LoginController::class, 'logout']);
        Route::get('/user', [LoginController::class, 'user']);
        Route::post('/refresh-token', [LoginController::class, 'refreshToken']);
    });
    
    // Department routes - Admin only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('departments', DepartmentController::class);
    });
    
    // Location routes
    Route::middleware('role:admin,department_admin')->group(function () {
        Route::apiResource('locations', LocationController::class);
    });
    Route::get('/locations', [LocationController::class, 'index']); // All authenticated users can view
    
    // Category routes
    Route::middleware('role:admin,department_admin')->group(function () {
        Route::apiResource('categories', CategoryController::class);
    });
    Route::get('/categories', [CategoryController::class, 'index']); // All authenticated users can view
    
    // Report routes
    Route::middleware('role:admin,department_admin,student')->group(function () {
        Route::apiResource('reports', ReportController::class);
    });
    
    // Suggestion routes
    Route::middleware('role:admin,department_admin,student')->group(function () {
        Route::apiResource('suggestions', SuggestionController::class);
        Route::post('/suggestions/{id}/vote', [SuggestionController::class, 'vote']);
        Route::delete('/suggestions/{id}/vote', [SuggestionController::class, 'unvote']);
    });
});
