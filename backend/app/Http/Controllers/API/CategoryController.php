<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * 
     * @OA\Get(
     *     path="/categories",
     *     summary="Get all categories",
     *     description="Returns a list of all categories",
     *     operationId="getCategories",
     *     tags={"Categories"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Category")
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
     *             @OA\Property(property="message", type="string", example="Failed to fetch categories"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $categories = Category::all();
            return CategoryResource::collection($categories);
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch categories',
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
     *     path="/categories",
     *     summary="Create a new category",
     *     description="Creates a new category and returns it",
     *     operationId="storeCategory",
     *     tags={"Categories"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name_ar","name_fr"},
     *             @OA\Property(property="name_ar", type="string", example="صيانة"),
     *             @OA\Property(property="name_fr", type="string", example="Maintenance")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category created successfully"),
     *             @OA\Property(property="category", ref="#/components/schemas/Category")
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
     *             @OA\Property(property="message", type="string", example="Failed to create category"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255|unique:categories,name_ar',
            'name_fr' => 'required|string|max:255|unique:categories,name_fr',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::create($request->only(['name_ar', 'name_fr']));
            
            return response()->json([
                'message' => 'Category created successfully',
                'category' => new CategoryResource($category)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create category', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to create category',
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
     *     path="/categories/{id}",
     *     summary="Get a specific category",
     *     description="Returns a specific category by ID",
     *     operationId="getCategory",
     *     tags={"Categories"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="category", ref="#/components/schemas/Category")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function show(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            return response()->json([
                'category' => new CategoryResource($category)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch category', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch category',
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
     *     path="/categories/{id}",
     *     summary="Update a category",
     *     description="Updates an existing category",
     *     operationId="updateCategory",
     *     tags={"Categories"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name_ar","name_fr"},
     *             @OA\Property(property="name_ar", type="string", example="صيانة محدثة"),
     *             @OA\Property(property="name_fr", type="string", example="Maintenance Updated")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category updated successfully"),
     *             @OA\Property(property="category", ref="#/components/schemas/Category")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name_ar' => 'required|string|max:255|unique:categories,name_ar,' . $id,
            'name_fr' => 'required|string|max:255|unique:categories,name_fr,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::findOrFail($id);
            $category->update($request->only(['name_ar', 'name_fr']));
            
            return response()->json([
                'message' => 'Category updated successfully',
                'category' => new CategoryResource($category)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to update category',
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
     *     path="/categories/{id}",
     *     summary="Delete a category",
     *     description="Deletes a category if it has no related reports",
     *     operationId="deleteCategory",
     *     tags={"Categories"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found"
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Category has related reports",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cannot delete category with related reports")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            
            // Check if category has related records
            if ($category->reports()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete category with related reports'
                ], 409);
            }
            
            $category->delete();
            
            return response()->json([
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete category', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}