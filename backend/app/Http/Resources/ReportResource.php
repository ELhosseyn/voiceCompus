<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'user' => $this->when($this->relationLoaded('user'), function () {
                return new UserResource($this->user);
            }),
            'category_id' => $this->category_id,
            'category' => $this->when($this->relationLoaded('category'), function () {
                return new CategoryResource($this->category);
            }),
            'location_id' => $this->location_id,
            'location' => $this->when($this->relationLoaded('location'), function () {
                return new LocationResource($this->location);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
