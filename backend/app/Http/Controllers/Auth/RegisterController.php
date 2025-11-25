<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Register a new user",
     *     description="Creates a new user account and returns authentication token",
     *     operationId="authRegister",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
     *             @OA\Property(property="is_anonymous", type="boolean", example=false),
     *             @OA\Property(property="role", type="string", enum={"student", "department_admin", "admin"}, example="student"),
     *             @OA\Property(property="department_id", type="integer", example=1),
     *             @OA\Property(property="device_name", type="string", example="web")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="message", type="string", example="User registered successfully")
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
     *             @OA\Property(property="message", type="string", example="Registration failed"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'is_anonymous' => ['boolean'],
                'role' => ['nullable', 'string', 'in:student,department_admin,admin'],
                'department_id' => ['nullable', 'exists:departments,id'],
                'device_name' => ['nullable', 'string'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            
            try {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->is_anonymous ? 'anonymous-' . uniqid() : $request->email,
                    'password' => Hash::make($request->password),
                    'is_anonymous' => $request->is_anonymous ?? false,
                    'role' => $request->role ?? 'student',
                    'department_id' => $request->department_id,
                ]);

                // Create token for the new user
                $token = $user->createToken($request->device_name ?? 'default-device')->plainTextToken;
                
                DB::commit();

                return response()->json([
                    'user' => new UserResource($user->load('department')),
                    'token' => $token,
                    'message' => 'User registered successfully',
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('User registration failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Registration failed',
                    'error' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
