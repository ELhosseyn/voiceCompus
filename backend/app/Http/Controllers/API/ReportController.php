<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Build query based on user role
            $query = Report::with(['user', 'category', 'location']);
            
            // Regular users can only see their own reports
            if (!in_array($user->role, ['admin', 'department_head'])) {
                $query->where('user_id', $user->id);
            }
            
            $reports = $query->get();
            
            return ReportResource::collection($reports);
        } catch (\Exception $e) {
            Log::error('Failed to fetch reports: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Fixed validation rule: 'nalstring' -> 'required|string'
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $report = new Report($request->all());
            $report->user_id = Auth::id();
            $report->status = 'pending';
            $report->save();
            
            return response()->json([
                'message' => 'Report created successfully',
                'report' => new ReportResource($report->load(['user', 'category', 'location']))
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Failed to create report: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $report = Report::with(['user', 'category', 'location'])->findOrFail($id);
            
            // Authorization check
            if (!$this->canAccessReport($report)) {
                return response()->json([
                    'message' => 'Unauthorized to view this report'
                ], 403);
            }
            
            return response()->json([
                'report' => new ReportResource($report)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch report: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $report = Report::findOrFail($id);
            
            // Authorization check
            if (!$this->canAccessReport($report)) {
                return response()->json([
                    'message' => 'Unauthorized to update this report'
                ], 403);
            }
            
            // Get validation rules based on user role
            $validationRules = $this->getValidationRules();
            $validator = Validator::make($request->all(), $validationRules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            
            // Determine which fields can be updated based on role
            if (in_array($user->role, ['admin', 'department_head'])) {
                $report->update($request->all());
            } else {
                // Regular users can only update title and description
                $report->update($request->only(['title', 'description']));
            }
            
            return response()->json([
                'message' => 'Report updated successfully',
                'report' => new ReportResource($report->load(['user', 'category', 'location']))
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update report: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $report = Report::findOrFail($id);
            
            // Authorization check - only admin and report owner can delete
            $user = Auth::user();
            if ($user->role !== 'admin' && $report->user_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized to delete this report'
                ], 403);
            }
            
            $report->delete();
            
            return response()->json([
                'message' => 'Report deleted successfully'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete report: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if the current user can access the given report
     */
    private function canAccessReport(Report $report): bool
    {
        $user = Auth::user();
        
        return in_array($user->role, ['admin', 'department_head']) || 
               $report->user_id === $user->id;
    }

    /**
     * Get validation rules based on user role
     */
    private function getValidationRules(): array
    {
        $user = Auth::user();
        
        if (in_array($user->role, ['admin', 'department_head'])) {
            return [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'status' => 'sometimes|required|in:pending,in_progress,resolved,rejected',
                'category_id' => 'sometimes|required|exists:categories,id',
                'location_id' => 'sometimes|required|exists:locations,id',
            ];
        }
        
        // Regular users can only update title and description
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ];
    }

    // Alternative methods removed since transactions are no longer used

    /**
     * Update report status (admin/department head only)
     * Simple version without transactions
     */
    public function updateStatus(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,resolved,rejected',
            'comment' => 'sometimes|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            if (!in_array($user->role, ['admin', 'department_head'])) {
                return response()->json([
                    'message' => 'Unauthorized to update report status'
                ], 403);
            }

            $report = Report::findOrFail($id);
            
            $report->update([
                'status' => $request->status,
                'updated_by' => $user->id,
                'updated_at' => now()
            ]);
            
            return response()->json([
                'message' => 'Report status updated successfully',
                'report' => new ReportResource($report->load(['user', 'category', 'location']))
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Report not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update report status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update report status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}