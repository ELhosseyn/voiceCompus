<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SuggestionResource;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SuggestionController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     * 
     * @OA\Get(
     *     path="/suggestions",
     *     summary="Get all suggestions",
     *     description="Returns a list of suggestions based on user role. Admins and department heads see all suggestions, while regular users only see their own suggestions.",
     *     operationId="getSuggestions",
     *     tags={"Suggestions"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Suggestion")
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
     *             @OA\Property(property="message", type="string", example="Failed to fetch suggestions"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            $query = Suggestion::with(['user', 'department']);
            
            // Regular users can only see their own suggestions
            if (!in_array($user->role, ['admin', 'department_head'])) {
                $query->where('user_id', $user->id);
            }
            
            $suggestions = $query->get();
            
            return SuggestionResource::collection($suggestions);
        } catch (\Exception $e) {
            Log::error('Failed to fetch suggestions: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch suggestions',
                'error' => $e->getMessage()
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
     *     path="/suggestions",
     *     summary="Create a new suggestion",
     *     description="Creates a new suggestion and returns it",
     *     operationId="storeSuggestion",
     *     tags={"Suggestions"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "description", "department_id"},
     *             @OA\Property(property="title", type="string", example="Extended Lab Hours"),
     *             @OA\Property(property="description", type="string", example="It would be beneficial to have the computer lab open for longer hours during exam periods."),
     *             @OA\Property(property="department_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Suggestion created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Suggestion created successfully"),
     *             @OA\Property(property="suggestion", ref="#/components/schemas/Suggestion")
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
     *             @OA\Property(property="message", type="string", example="Failed to create suggestion"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $suggestion = Suggestion::create([
                'title' => $request->title,
                'description' => $request->description,
                'department_id' => $request->department_id,
                'user_id' => Auth::id(),
                'status' => 'pending'
            ]);
            
            $suggestion->load(['user', 'department']);
            
            return response()->json([
                'message' => 'Suggestion created successfully',
                'suggestion' => new SuggestionResource($suggestion)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        try {
            $suggestion = Suggestion::with(['user', 'department'])->findOrFail($id);
            $user = Auth::user();
            
            // Check authorization
            if (!$this->canViewSuggestion($user, $suggestion)) {
                return response()->json([
                    'message' => 'Unauthorized to view this suggestion'
                ], 403);
            }
            
            return response()->json([
                'suggestion' => new SuggestionResource($suggestion)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Suggestion not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $suggestion = Suggestion::findOrFail($id);
            $user = Auth::user();
            
            // Check authorization
            if (!$this->canUpdateSuggestion($user, $suggestion)) {
                return response()->json([
                    'message' => 'Unauthorized to update this suggestion'
                ], 403);
            }
            
            // Validate based on user role
            $rules = $this->getUpdateValidationRules($user);
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update based on user role
            $allowedFields = $this->getAllowedUpdateFields($user);
            $suggestion->update($request->only($allowedFields));
            
            $suggestion->load(['user', 'department']);
            
            return response()->json([
                'message' => 'Suggestion updated successfully',
                'suggestion' => new SuggestionResource($suggestion)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Suggestion not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        try {
            $suggestion = Suggestion::findOrFail($id);
            $user = Auth::user();
            
            // Check authorization
            if (!$this->canDeleteSuggestion($user, $suggestion)) {
                return response()->json([
                    'message' => 'Unauthorized to delete this suggestion'
                ], 403);
            }
            
            $suggestion->delete();
            
            return response()->json([
                'message' => 'Suggestion deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Suggestion not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Vote for a suggestion.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function vote(string $id)
    {
        try {
            $suggestion = Suggestion::findOrFail($id);
            $user = Auth::user();
            
            // Check if user has already voted
            if ($suggestion->votes()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'message' => 'You have already voted for this suggestion'
                ], 409);
            }
            
            $suggestion->votes()->attach($user->id);
            
            return response()->json([
                'message' => 'Vote recorded successfully',
                'votes_count' => $suggestion->votes()->count()
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Suggestion not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to vote for suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to vote for suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove vote from a suggestion.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function unvote(string $id)
    {
        try {
            $suggestion = Suggestion::findOrFail($id);
            $user = Auth::user();
            
            // Check if user has voted
            if (!$suggestion->votes()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'message' => 'You have not voted for this suggestion'
                ], 409);
            }
            
            $suggestion->votes()->detach($user->id);
            
            return response()->json([
                'message' => 'Vote removed successfully',
                'votes_count' => $suggestion->votes()->count()
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Suggestion not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to remove vote from suggestion: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to remove vote from suggestion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user can view a suggestion.
     */
    private function canViewSuggestion($user, $suggestion): bool
    {
        return in_array($user->role, ['admin', 'department_head']) || $suggestion->user_id === $user->id;
    }

    /**
     * Check if user can update a suggestion.
     */
    private function canUpdateSuggestion($user, $suggestion): bool
    {
        return in_array($user->role, ['admin', 'department_head']) || $suggestion->user_id === $user->id;
    }

    /**
     * Check if user can delete a suggestion.
     */
    private function canDeleteSuggestion($user, $suggestion): bool
    {
        return $user->role === 'admin' || $suggestion->user_id === $user->id;
    }

    /**
     * Get validation rules for update based on user role.
     */
    private function getUpdateValidationRules($user): array
    {
        $baseRules = [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ];

        if (in_array($user->role, ['admin', 'department_head'])) {
            $baseRules['status'] = 'sometimes|required|in:pending,in_progress,implemented,rejected';
            $baseRules['department_id'] = 'sometimes|required|exists:departments,id';
        }

        return $baseRules;
    }

    /**
     * Get allowed fields for update based on user role.
     */
    private function getAllowedUpdateFields($user): array
    {
        $baseFields = ['title', 'description'];

        if (in_array($user->role, ['admin', 'department_head'])) {
            $baseFields = array_merge($baseFields, ['status', 'department_id']);
        }

        return $baseFields;
    }
}