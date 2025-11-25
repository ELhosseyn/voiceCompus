<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="Report",
 *     description="Report model",
 *     @OA\Xml(
 *         name="Report"
 *     )
 * )
 */
class Report
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID of the report",
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
     *     description="Title of the report",
     *     example="Computer Lab Equipment Issue"
     * )
     *
     * @var string
     */
    private $title;

    /**
     * @OA\Property(
     *     title="Description",
     *     description="Detailed description of the report",
     *     example="Several computers in the lab are not functioning properly and need maintenance."
     * )
     *
     * @var string
     */
    private $description;

    /**
     * @OA\Property(
     *     title="Status",
     *     description="Current status of the report",
     *     enum={"pending", "in_progress", "resolved", "rejected"},
     *     example="pending"
     * )
     *
     * @var string
     */
    private $status;

    /**
     * @OA\Property(
     *     title="User ID",
     *     description="ID of the user who created the report",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $user_id;

    /**
     * @OA\Property(
     *     title="Category ID",
     *     description="ID of the category this report belongs to",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $category_id;

    /**
     * @OA\Property(
     *     title="Location ID",
     *     description="ID of the location this report is about",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $location_id;

    /**
     * @OA\Property(
     *     title="User",
     *     description="User who created the report"
     * )
     *
     * @var \App\Virtual\Models\User
     */
    private $user;

    /**
     * @OA\Property(
     *     title="Category",
     *     description="Category of the report"
     * )
     *
     * @var \App\Virtual\Models\Category
     */
    private $category;

    /**
     * @OA\Property(
     *     title="Location",
     *     description="Location associated with the report"
     * )
     *
     * @var \App\Virtual\Models\Location
     */
    private $location;

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
