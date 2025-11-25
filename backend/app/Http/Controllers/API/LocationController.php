<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $locations = Location::with('department')->get();
            return LocationResource::collection($locations);
        } catch (\Exception $e) {
            Log::error('Failed to fetch locations: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch locations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Transaction is useful here if you need to perform multiple related operations
            // For a single create operation, it's optional but provides rollback capability
            $location = DB::transaction(function () use ($request) {
                $location = Location::create($request->all());
                
                // If you had additional operations that need to be atomic with the creation:
                // - Logging to audit table
                // - Creating related records
                // - Updating counters
                // They would go here
                
                return $location;
            });
            
            return response()->json([
                'message' => 'Location created successfully',
                'location' => new LocationResource($location->load('department'))
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Failed to create location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create location',
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
            $location = Location::with('department')->findOrFail($id);
            return response()->json([
                'location' => new LocationResource($location)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Location not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $location = DB::transaction(function () use ($request, $id) {
                $location = Location::findOrFail($id);
                $location->update($request->all());
                
                // Additional operations that should be atomic with the update:
                // - Audit logging
                // - Cache invalidation
                // - Related record updates
                
                return $location;
            });
            
            return response()->json([
                'message' => 'Location updated successfully',
                'location' => new LocationResource($location->load('department'))
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Location not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update location',
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
            $result = DB::transaction(function () use ($id) {
                $location = Location::findOrFail($id);
                
                // This check and delete SHOULD be in a transaction
                // to prevent race conditions where a report could be created
                // between the check and the delete
                if ($location->reports()->count() > 0) {
                    throw new \Exception('Cannot delete location with related reports', 409);
                }
                
                $location->delete();
                
                return true;
            });
            
            return response()->json([
                'message' => 'Location deleted successfully'
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Location not found'
            ], 404);
        } catch (\Exception $e) {
            // Check if this is our custom conflict exception
            if ($e->getCode() === 409) {
                return response()->json([
                    'message' => $e->getMessage()
                ], 409);
            }
            
            Log::error('Failed to delete location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Alternative approach for simple operations without transactions
    // Use this if you don't need the extra atomicity guarantees

    /**
     * Simple store without transaction (for comparison)
     */
    public function storeSimple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255',
            'name_fr' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Single Eloquent operation - already atomic at database level
            $location = Location::create($request->all());
            
            return response()->json([
                'message' => 'Location created successfully',
                'location' => new LocationResource($location->load('department'))
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Failed to create location: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create location',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}