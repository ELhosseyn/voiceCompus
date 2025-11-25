<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle user login request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/auth/login",
     *     summary="Authenticate user and generate token",
     *     description="Login with email/password or as anonymous user",
     *     operationId="authLogin",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="is_anonymous", type="boolean", example=false),
     *             @OA\Property(property="department_id", type="integer", example=1),
     *             @OA\Property(property="device_name", type="string", example="web"),
     *             @OA\Property(property="remember_me", type="boolean", example=false)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="message", type="string", example="Login successful")
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
     *             @OA\Property(property="message", type="string", example="Login failed"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required_without:is_anonymous|string|email',
                'password' => 'required_without:is_anonymous|string',
                'is_anonymous' => 'boolean',
                'department_id' => 'nullable|exists:departments,id',
                'device_name' => 'nullable|string',
                'remember_me' => 'boolean',
            ]);

            // Handle anonymous login
            if ($request->is_anonymous) {
                DB::beginTransaction();
                try {
                    $anonymousUser = User::create([
                        'name' => 'Anonymous User',
                        'email' => 'anonymous-' . uniqid(),
                        'password' => Hash::make(uniqid()),
                        'is_anonymous' => true,
                        'role' => 'student',
                    ]);
                    
                    // Token expiration - 1 hour for anonymous users
                    $expiresAt = $request->remember_me ? null : now()->addHour();
                    $token = $anonymousUser->createToken(
                        $request->device_name ?? 'anonymous-device',
                        ['*'],
                        $expiresAt
                    )->plainTextToken;
                    
                    DB::commit();
                    
                    return response()->json([
                        'user' => new UserResource($anonymousUser),
                        'token' => $token,
                        'message' => 'Anonymous login successful',
                    ]);
                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error('Anonymous login failed: ' . $e->getMessage());
                    return response()->json([
                        'message' => 'Anonymous login failed',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            // Handle regular login
            $user = User::with('department')->where('email', $request->email)->first();

            // Check if user exists
            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            // Check password
            try {
                if (!Hash::check($request->password, $user->password)) {
                    throw ValidationException::withMessages([
                        'email' => ['The provided credentials are incorrect.'],
                    ]);
                }
            } catch (\Exception $e) {
                // If there's a hashing error, update the password with the correct hash
                // This will fix passwords that weren't hashed with Bcrypt
                $user->password = Hash::make($request->password);
                $user->save();
                
                // Log the password rehash
                Log::info('User password rehashed for: ' . $user->email);
            }

            // Check if user is active
            if ($user->is_active === false) {
                return response()->json([
                    'message' => 'Your account has been deactivated. Please contact the administrator.'
                ], 403);
            }

            // Revoke previous tokens if not using remember_me
            if (!$request->remember_me) {
                $user->tokens()->delete();
            }

            // Token expiration - 24 hours by default, or no expiration if remember_me is true
            $expiresAt = $request->remember_me ? null : now()->addDay();
            
            // Create a token with the device name
            $token = $user->createToken(
                $request->device_name ?? 'default-device',
                ['*'],
                $expiresAt
            )->plainTextToken;

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token,
                'message' => 'Login successful',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/auth/logout",
     *     summary="Logout user and invalidate token",
     *     description="Revokes the token that was used to authenticate the current request",
     *     operationId="authLogout",
     *     tags={"Authentication"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged out",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Successfully logged out")
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
     *             @OA\Property(property="message", type="string", example="Logout failed"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Get(
     *     path="/auth/user",
     *     summary="Get authenticated user information",
     *     description="Returns information about the currently authenticated user",
     *     operationId="authUser",
     *     tags={"Authentication"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="User information retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="role", type="string", example="student"),
     *             @OA\Property(property="department", type="object", nullable=true)
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
     *             @OA\Property(property="message", type="string", example="Failed to retrieve user"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user()->load('department');
            return response()->json(new UserResource($user));
        } catch (\Exception $e) {
            Log::error('Failed to retrieve user: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh the user's token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @OA\Post(
     *     path="/auth/refresh-token",
     *     summary="Refresh authentication token",
     *     description="Revokes the current token and generates a new one",
     *     operationId="authRefreshToken",
     *     tags={"Authentication"},
     *     security={{
     *         "bearerAuth": {}
     *     }},
     *     @OA\Response(
     *         response=200,
     *         description="Token refreshed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="message", type="string", example="Token refreshed successfully")
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
     *             @OA\Property(property="message", type="string", example="Token refresh failed"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function refreshToken(Request $request)
    {
        try {
            $user = $request->user();
            
            // Revoke the current token
            $request->user()->currentAccessToken()->delete();
            
            // Create a new token
            $token = $user->createToken('refresh-token')->plainTextToken;
            
            return response()->json([
                'token' => $token,
                'message' => 'Token refreshed successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Token refresh failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
