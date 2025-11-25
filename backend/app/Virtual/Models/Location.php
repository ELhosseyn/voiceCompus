<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="Location",
 *     description="Location model",
 *     @OA\Xml(
 *         name="Location"
 *     )
 * )
 */
class Location
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID of the location",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $id;

    /**
     * @OA\Property(
     *     title="Name (Arabic)",
     *     description="Name of the location in Arabic",
     *     example="مختبر الحاسوب"
     * )
     *
     * @var string
     */
    private $name_ar;

    /**
     * @OA\Property(
     *     title="Name (French)",
     *     description="Name of the location in French",
     *     example="Laboratoire Informatique"
     * )
     *
     * @var string
     */
    private $name_fr;

    /**
     * @OA\Property(
     *     title="Department ID",
     *     description="ID of the department this location belongs to",
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
     *     description="Department that this location belongs to"
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
