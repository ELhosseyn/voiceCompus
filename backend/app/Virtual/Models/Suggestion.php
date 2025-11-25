<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="Suggestion",
 *     description="Suggestion model",
 *     @OA\Xml(
 *         name="Suggestion"
 *     )
 * )
 */
class Suggestion
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID of the suggestion",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $id;

    /**
     * @OA\Property(
     *     title="Title",
     *     description="Title of the suggestion",
     *     example="Extended Lab Hours"
     * )
     *
     * @var string
     */
    private $title;

    /**
     * @OA\Property(
     *     title="Description",
     *     description="Detailed description of the suggestion",
     *     example="It would be beneficial to have the computer lab open for longer hours during exam periods."
     * )
     *
     * @var string
     */
    private $description;

    /**
     * @OA\Property(
     *     title="Status",
     *     description="Current status of the suggestion",
     *     enum={"pending", "approved", "rejected"},
     *     example="pending"
     * )
     *
     * @var string
     */
    private $status;

    /**
     * @OA\Property(
     *     title="User ID",
     *     description="ID of the user who created the suggestion",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $user_id;

    /**
     * @OA\Property(
     *     title="Department ID",
     *     description="ID of the department this suggestion is for",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $department_id;

    /**
     * @OA\Property(
     *     title="User",
     *     description="User who created the suggestion"
     * )
     *
     * @var \App\Virtual\Models\User
     */
    private $user;

    /**
     * @OA\Property(
     *     title="Department",
     *     description="Department associated with the suggestion"
     * )
     *
     * @var \App\Virtual\Models\Department
     */
    private $department;

    /**
     * @OA\Property(
     *     title="Vote Count",
     *     description="Number of votes for this suggestion",
     *     example=5
     * )
     *
     * @var integer
     */
    private $vote_count;

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
