<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="User",
 *     description="User model",
 *     @OA\Xml(
 *         name="User"
 *     )
 * )
 */
class User
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID of the user",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $id;

    /**
     * @OA\Property(
     *     title="Name",
     *     description="Name of the user",
     *     example="John Doe"
     * )
     *
     * @var string
     */
    private $name;

    /**
     * @OA\Property(
     *     title="Email",
     *     description="Email address of the user",
     *     format="email",
     *     example="john@example.com"
     * )
     *
     * @var string
     */
    private $email;

    /**
     * @OA\Property(
     *     title="Role",
     *     description="Role of the user",
     *     enum={"student", "department_admin", "admin"},
     *     example="student"
     * )
     *
     * @var string
     */
    private $role;

    /**
     * @OA\Property(
     *     title="Is Anonymous",
     *     description="Whether the user is anonymous",
     *     example=false
     * )
     *
     * @var boolean
     */
    private $is_anonymous;

    /**
     * @OA\Property(
     *     title="Department ID",
     *     description="ID of the department this user belongs to",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $department_id;

    /**
     * @OA\Property(
     *     title="Department",
     *     description="Department that this user belongs to"
     * )
     *
     * @var \App\Virtual\Models\Department
     */
    private $department;

    /**
     * @OA\Property(
     *     title="Created at",
     *     description="Creation date",
     *     example="2025-05-20T12:00:00.000000Z",
     *     format="datetime",
     *     type="string"
     * )
     *
     * @var \DateTime
     */
    private $created_at;

    /**
     * @OA\Property(
     *     title="Updated at",
     *     description="Last update date",
     *     example="2025-05-20T12:00:00.000000Z",
     *     format="datetime",
     *     type="string"
     * )
     *
     * @var \DateTime
     */
    private $updated_at;
}
