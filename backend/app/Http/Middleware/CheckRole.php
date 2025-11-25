<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // If no roles are specified, just proceed
        if (empty($roles)) {
            return $next($request);
        }

        // Check if user has any of the required roles
        foreach ($roles as $role) {
            // Check for admin role
            if ($role === 'admin' && $request->user()->isAdmin()) {
                return $next($request);
            }

            // Check for department_admin role
            if ($role === 'department_admin' && $request->user()->isDepartmentAdmin()) {
                return $next($request);
            }

            // Check for student role
            if ($role === 'student' && $request->user()->isStudent()) {
                return $next($request);
            }

            // Check for any role (including anonymous)
            if ($role === 'any') {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Unauthorized. You do not have the required role to access this resource.'], 403);
    }
}
