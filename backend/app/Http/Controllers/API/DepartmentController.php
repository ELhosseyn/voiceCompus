<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * 
     * @OA\Get(
     *     path="/departments",
     *     summary="Get all departments",
     *     description="Returns a list of all departments",
     *     operationId="getDepartments",
     *     tags={"Departments"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Department")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to fetch departments"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $departments = Department::all();
            return DepartmentResource::collection($departments);
        } catch (\Exception $e) {
            Log::error('Failed to fetch departments: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch departments',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/departments",
     *     summary="Create a new department",
     *     description="Creates a new department and returns it",
     *     operationId="storeDepartment",
     *     tags={"Departments"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name_ar","name_fr"},
     *             @OA\Property(property="name_ar", type="string", example="قسم علوم الحاسوب"),
     *             @OA\Property(property="name_fr", type="string", example="Département d'Informatique")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Department created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department created successfully"),
     *             @OA\Property(property="department", ref="#/components/schemas/Department")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to create department"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255|unique:departments,name_ar',
            'name_fr' => 'required|string|max:255|unique:departments,name_fr',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $department = Department::create($request->only(['name_ar', 'name_fr']));
            
            return response()->json([
                'message' => 'Department created successfully',
                'department' => new DepartmentResource($department)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create department', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to create department',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Get(
     *     path="/departments/{id}",
     *     summary="Get a specific department",
     *     description="Returns a specific department by ID",
     *     operationId="getDepartment",
     *     tags={"Departments"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of department to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="department", ref="#/components/schemas/Department")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Department not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to fetch department"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function show(string $id)
    {
        try {
            $department = Department::findOrFail($id);
            return response()->json([
                'department' => new DepartmentResource($department)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Department not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch department', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch department',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Put(
     *     path="/departments/{id}",
     *     summary="Update a department",
     *     description="Updates an existing department and returns it",
     *     operationId="updateDepartment",
     *     tags={"Departments"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of department to update",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name_ar","name_fr"},
     *             @OA\Property(property="name_ar", type="string", example="قسم علوم الحاسوب"),
     *             @OA\Property(property="name_fr", type="string", example="Département d'Informatique")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Department updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department updated successfully"),
     *             @OA\Property(property="department", ref="#/components/schemas/Department")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Department not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to update department"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255|unique:departments,name_ar,' . $id,
            'name_fr' => 'required|string|max:255|unique:departments,name_fr,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $department = Department::find($id);
            $department->update($request->only(['name_ar', 'name_fr']));
            
            return response()->json([
                'message' => 'Department updated successfully',
                'department' => new DepartmentResource($department)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Department not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update department', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to update department',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Delete(
     *     path="/departments/{id}",
     *     summary="Delete a department",
     *     description="Deletes a department if it has no related records",
     *     operationId="deleteDepartment",
     *     tags={"Departments"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of department to delete",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Department deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Department not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Department not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Conflict - Cannot delete department with related records",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cannot delete department with related records")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Failed to delete department"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function destroy(string $id)
    {
        try {
            $department = Department::findOrFail($id);
            
            // Check if department has related records
            if ($department->users()->exists() || 
                $department->locations()->exists() || 
                $department->reports()->exists() || 
                $department->suggestions()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete department with related records'
                ], 409);
            }
            
            $department->delete();
            
            return response()->json([
                'message' => 'Department deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Department not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete department', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to delete department',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}