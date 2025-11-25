<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="Department",
 *     description="Department model",
 *     @OA\Xml(
 *         name="Department"
 *     )
 * )
 */
class Department
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID of the department",
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
     *     description="Name of the department in Arabic",
     *     example="قسم علوم الحاسوب"
     * )
     *
     * @var string
     */
    private $name_ar;

    /**
     * @OA\Property(
     *     title="Name (French)",
     *     description="Name of the department in French",
     *     example="Département d'Informatique"
     * )
     *
     * @var string
     */
    private $name_fr;

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
